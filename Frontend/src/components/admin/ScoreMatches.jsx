import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScoreMatches = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;
    // Mock data for matches
    const [matches, setMatches] = useState([]);

    // Selected match for scoring
    const [selectedMatch, setSelectedMatch] = useState(null);

    const fetchMatches = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/matches/upcoming`);
            setMatches(response.data.matches);
        } catch (error) {
            console.error("Error fetching matches:", error);
        }
    }

    useEffect(() => {
        fetchMatches();
    }, []);

    // Scoring state
    const [score, setScore] = useState({
        player1: 0,
        player2: 0
    });

    // Rally history
    const [rallyHistory, setRallyHistory] = useState([]);

    // Server state (1 for player 1, 2 for player 2)
    const [server, setServer] = useState(1);

    // Match in progress
    const [matchInProgress, setMatchInProgress] = useState(false);

    // Match completed
    const [matchCompleted, setMatchCompleted] = useState(false);

    // Handle selecting a match to score
    const handleSelectMatch = (match) => {
        setSelectedMatch(match);
        const savedData = localStorage.getItem(getLocalStorageKey(match.id));

        if (savedData) {
            const parsed = JSON.parse(savedData);
            setScore(parsed.score || { player1: 0, player2: 0 });
            setRallyHistory(parsed.rallyHistory || []);
            setServer(parsed.server || 1);
            setMatchInProgress(parsed.matchInProgress || false);
            setMatchCompleted(parsed.matchCompleted || false);
        } else {
            setScore({ player1: 0, player2: 0 });
            setRallyHistory([]);
            setServer(1);
            setMatchInProgress(false);
            setMatchCompleted(false);
        }
    };

    useEffect(() => {
        if (selectedMatch) {
            const scoringData = {
                score,
                rallyHistory,
                server,
                matchInProgress,
                matchCompleted,
            };
            localStorage.setItem(getLocalStorageKey(selectedMatch.id), JSON.stringify(scoringData));
        }
    }, [score, rallyHistory, server, matchInProgress, matchCompleted, selectedMatch]);

    const getLocalStorageKey = (matchId) => `scoring_data_match_${matchId}`;

    // Start the match
    const handleStartMatch = () => {
        setMatchInProgress(true);
        const matchId = selectedMatch.id;
        const status = "Live"
        const response = axios.post(`${BACKEND_URL}/matches/update-status`, {
            matchId,
            status
        });
    };

    const handleScorePoint = (player) => {
        if (matchCompleted) return;

        // Clone current score to update
        const newScore = { ...score };

        // Increment score for the scoring player
        if (player === 1) {
            newScore.player1 += 1;
        } else {
            newScore.player2 += 1;
        }

        // Update rally history with current rally info
        const rally = {
            id: rallyHistory.length + 1,
            scorer: player,
            server: player,  // Server is the player who won the point
            player1Score: newScore.player1,
            player2Score: newScore.player2
        };

        setRallyHistory([...rallyHistory, rally]);

        // Update score state
        setScore(newScore);

        // Update server logic
        if (selectedMatch.totalPoints === 21) {
            // For 21-point games:
            // Server changes every 2 points except if both players >= 20 (deuce)
            const totalPoints = newScore.player1 + newScore.player2;
            if (newScore.player1 >= 20 && newScore.player2 >= 20) {
                // At deuce (20-20 or more), server changes every point
                setServer(player);
            } else if (totalPoints % 2 === 0) {
                // Otherwise, server changes every 2 points
                setServer(player);
            } else {
                // Server stays the same during the 2-point period
                setServer(prev => prev);
            }
        } else {
            // For 11-point games, server changes every point to the player who scored
            setServer(player);
        }

        // Check if match has completed after this point
        checkMatchCompletion(newScore);
    };

    // Check if match is completed
    const checkMatchCompletion = (currentScore) => {
        const { totalPoints } = selectedMatch;
        const { player1, player2 } = currentScore;

        if (totalPoints === 21) {
            // 21-point game rules
            if ((player1 >= 21 && player1 - player2 >= 2) ||
                (player2 >= 21 && player2 - player1 >= 2) ||
                player1 === 30 || player2 === 30) {
                setMatchCompleted(true);
            }
        } else {
            // 11-point game rules
            if ((player1 >= 11 && player1 - player2 >= 2) ||
                (player2 >= 11 && player2 - player1 >= 2) ||
                player1 === 15 || player2 === 15) {
                setMatchCompleted(true);
            }
        }
    };

    // Undo last rally
    const handleUndoLastRally = () => {
        if (rallyHistory.length === 0) return;

        const newHistory = [...rallyHistory];
        const lastRally = newHistory.pop();

        setRallyHistory(newHistory);

        if (newHistory.length > 0) {
            const previousRally = newHistory[newHistory.length - 1];
            setScore({
                player1: previousRally.player1Score,
                player2: previousRally.player2Score
            });
            setServer(previousRally.server === 1 ? 2 : 1);
        } else {
            setScore({ player1: 0, player2: 0 });
            setServer(1);
        }

        setMatchCompleted(false);
    };

    const handleSubmitResult = async () => {
        if (!selectedMatch) return;

        const matchId = selectedMatch.id;
        const player1Score = score.player1;
        const player2Score = score.player2;
        const winner = player1Score > player2Score ? selectedMatch.player1 : selectedMatch.player2;
        const scoreString = `${player1Score}-${player2Score}`;

        console.log(matchId, scoreString, winner);

        try {
            // POST to backend with match result
            await axios.post(`${BACKEND_URL}/matches/score-singles`, {
                matchId,
                score: scoreString,
                winner,
            });

            // Update local matches state
            const updatedMatches = matches.map(match =>
                match.id === selectedMatch.id
                    ? {
                        ...match,
                        status: "Completed",
                        score: scoreString,
                        winner,
                    }
                    : match
            );

            // Clear localStorage rally data
            localStorage.removeItem(getLocalStorageKey(matchId));

            // Update state
            setMatches(updatedMatches);
            setSelectedMatch(null);
            setScore({ player1: 0, player2: 0 });

            console.log('Match result submitted successfully.');
        } catch (error) {
            console.error('Error submitting match result:', error.response?.data?.message || error.message);
            alert('Failed to submit match result. Please try again.');
        }
    };

    // Return to match list
    const handleReturnToList = () => {
        setSelectedMatch(null);
    };

    // Determine winner message
    const getWinnerMessage = () => {
        if (!matchCompleted) return "";

        const winner = score.player1 > score.player2 ? selectedMatch.player1 : selectedMatch.player2;
        return `${winner} wins the match!`;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Score Matches</h1>

                {!selectedMatch ? (
                    // Match list view
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matches.map(match => {
                            const isCompleted = match.status === "Completed";

                            return (
                                <div
                                    key={match.id}
                                    className={`rounded-lg overflow-hidden shadow-lg transition-colors duration-200 ${isCompleted
                                        ? "bg-gray-700 opacity-60 cursor-not-allowed"
                                        : "bg-gray-800 hover:bg-gray-700 cursor-pointer"
                                        }`}
                                    onClick={() => {
                                        if (!isCompleted) handleSelectMatch(match);
                                    }}
                                >
                                    <div className="p-4 border-b border-gray-700 bg-gray-750 flex justify-between items-center">
                                        <div>
                                            <span className="text-green-400 text-sm">{match.tournament}</span>
                                            <p className="text-xs text-gray-400 mt-1">{match.date.slice(0, 10)} • {match.time}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isCompleted ? "bg-green-700 text-green-300" : "bg-gray-600 text-white"
                                            }`}>
                                            {isCompleted ? "Completed" : "Pending"}
                                        </span>
                                    </div>

                                    <div className="p-4 flex flex-col">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="text-center w-5/12">
                                                <img src={match.player1Avatar} className="h-12 w-12 bg-gray-700 rounded-full mx-auto mb-2" />
                                                <p className="font-semibold">{match.player1}</p>
                                            </div>

                                            <div className="text-center w-2/12">
                                                <span className="text-gray-400 text-sm">VS</span>
                                            </div>

                                            <div className="text-center w-5/12">
                                                <img src={match.player2Avatar} className="h-12 w-12 bg-gray-700 rounded-full mx-auto mb-2" />
                                                <p className="font-semibold">{match.player2}</p>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex justify-between text-sm text-gray-400">
                                            <span>{match.court}</span>
                                            <span>{match.totalPoints} points</span>
                                        </div>

                                        {isCompleted && match.result && (
                                            <div className="mt-4 bg-gray-700 rounded p-2 text-center">
                                                <p className="text-sm">
                                                    Final Score: {match.result.player1Score} - {match.result.player2Score}
                                                </p>
                                                <p className="text-green-400 text-sm font-semibold mt-1">
                                                    Winner: {match.result.winner}
                                                </p>
                                            </div>
                                        )}
                                        {match.winner && (
                                            <p className="text-center text-green-400 font-semibold">
                                                Winner: {match.winner}
                                            </p>
                                        )}
                                        {match.score && (
                                            <p className="text-center text-gray-400">
                                                Score: {match.score}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // Match scoring interface
                    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                        <div className="p-4 border-b border-gray-700 bg-gray-750 flex justify-between items-center">
                            <button
                                onClick={handleReturnToList}
                                className="text-gray-400 hover:text-white flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back
                            </button>
                            <div className="text-center">
                                <h2 className="font-semibold">{selectedMatch.tournament}</h2>
                                <p className="text-xs text-gray-400">{selectedMatch.totalPoints}-point match • {selectedMatch.court}</p>
                            </div>
                            <div className="w-16"></div> {/* For layout balance */}
                        </div>

                        {!matchInProgress ? (
                            // Pre-match screen
                            <div className="p-6 text-center">
                                <div className="flex justify-center items-center my-8">
                                    <div className="text-center w-5/12">
                                        <img src={selectedMatch.player1Avatar} className="h-12 w-12 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold" />
                                        <p className="font-semibold text-lg">{selectedMatch.player1}</p>
                                    </div>

                                    <div className="text-center w-2/12">
                                        <span className="text-gray-400">VS</span>
                                    </div>

                                    <div className="text-center w-5/12">
                                        <img src={selectedMatch.player2Avatar} className="h-12 w-12 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold" />
                                        <p className="font-semibold text-lg">{selectedMatch.player2}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleStartMatch}
                                    className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 w-full md:w-auto"
                                >
                                    Start Match
                                </button>
                            </div>
                        ) : (
                            // Match scoring screen
                            <div className="p-4">
                                {/* Scoreboard */}
                                <div className="flex justify-between items-center mb-6 bg-gray-900 rounded-lg p-4">
                                    <div className={`text-center w-5/12 ${server === 1 ? 'border-b-2 border-green-500 pb-2' : ''}`}>
                                        <p className="font-semibold mb-1">{selectedMatch.player1}</p>
                                        <div className="text-4xl font-bold">{score.player1}</div>
                                        {server === 1 && (
                                            <div className="mt-2 text-xs text-green-400">SERVING</div>
                                        )}
                                    </div>

                                    <div className="text-center w-2/12">
                                        <div className="text-gray-500 text-sm">GOAL</div>
                                        <div className="text-lg font-semibold">{selectedMatch.totalPoints}</div>
                                    </div>

                                    <div className={`text-center w-5/12 ${server === 2 ? 'border-b-2 border-green-500 pb-2' : ''}`}>
                                        <p className="font-semibold mb-1">{selectedMatch.player2}</p>
                                        <div className="text-4xl font-bold">{score.player2}</div>
                                        {server === 2 && (
                                            <div className="mt-2 text-xs text-green-400">SERVING</div>
                                        )}
                                    </div>
                                </div>

                                {matchCompleted ? (
                                    // Match completed view
                                    <div className="text-center mb-6">
                                        <div className="bg-green-500 text-white p-3 rounded-lg mb-4">
                                            <p className="text-lg font-semibold">{getWinnerMessage()}</p>
                                            <p className="text-sm">Final Score: {score.player1} - {score.player2}</p>
                                        </div>

                                        <button
                                            onClick={handleSubmitResult}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 w-full"
                                        >
                                            Submit Result
                                        </button>
                                    </div>
                                ) : (
                                    // Point scoring buttons
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <button
                                            onClick={() => handleScorePoint(1)}
                                            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-4 rounded-md transition-colors duration-200"
                                        >
                                            Point for {selectedMatch.player1}
                                        </button>

                                        <button
                                            onClick={() => handleScorePoint(2)}
                                            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-4 rounded-md transition-colors duration-200"
                                        >
                                            Point for {selectedMatch.player2}
                                        </button>
                                    </div>
                                )}

                                {/* Rally history */}
                                <div className="mt-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold">Rally History</h3>
                                        {rallyHistory.length > 0 && !matchCompleted && (
                                            <button
                                                onClick={handleUndoLastRally}
                                                className="text-red-400 hover:text-red-300 text-sm flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                                </svg>
                                                Undo Last
                                            </button>
                                        )}
                                    </div>

                                    <div className="bg-gray-900 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
                                        {rallyHistory.length === 0 ? (
                                            <p className="text-gray-500 text-center p-4">No rallies yet</p>
                                        ) : (
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-800 text-gray-400">
                                                    <tr>
                                                        <th className="py-2 px-3 text-left w-10">#</th>
                                                        <th className="py-2 px-3 text-left">Server</th>
                                                        <th className="py-2 px-3 text-left">Point To</th>
                                                        <th className="py-2 px-3 text-right">Score</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rallyHistory.map((rally) => (
                                                        <tr key={rally.id} className="border-t border-gray-800">
                                                            <td className="py-2 px-3">{rally.id}</td>
                                                            <td className="py-2 px-3">
                                                                {rally.server === 1 ? selectedMatch.player1 : selectedMatch.player2}
                                                            </td>
                                                            <td className="py-2 px-3">
                                                                <span className={rally.scorer === 1 ? 'text-green-400' : 'text-green-400'}>
                                                                    {rally.scorer === 1 ? selectedMatch.player1 : selectedMatch.player2}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 px-3 text-right">
                                                                {rally.player1Score} - {rally.player2Score}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScoreMatches;