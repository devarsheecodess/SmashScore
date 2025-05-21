import React, { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Clock, Save, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AddMatchForm = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;
    const [availablePlayers, setAvailablePlayers] = useState([]);

    const [matchType, setMatchType] = useState('singles');
    const [currentStep, setCurrentStep] = useState(1);
    const [contentType, setContentType] = useState(null);

    // Match form states
    const [match, setMatch] = useState({
        type: 'singles',
        player1: '',
        player2: '',
        team1Name: '',
        team2Name: '',
        team1Players: ['', ''],
        team2Players: ['', ''],
        date: '',
        time: '',
        totalPoints: '',
        description: ''
    });

    const fetchPlayers = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/matches/players`);
            const players = response.data.players;
            setAvailablePlayers(players);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    }

    useEffect(() => {
        fetchPlayers();
    }, []);

    const handleSubmitMatch = async (e) => {
        e.preventDefault();
        console.log(match)
        try {
            const response = await axios.post(`${BACKEND_URL}/matches/addMatch`, match);
            if (response.status === 201) {
                alert('Match created successfully!');
                resetForm();
            }
        } catch (error) {
            console.error('Error submitting match:', error);
        }
    };

    const resetForm = () => {
        setContentType(null);
        setMatchType('singles');
        setCurrentStep(1);
        setMatch({
            type: 'singles',
            player1: '',
            player1ID: '',
            player2: '',
            player2ID: '',
            team1Name: '',
            team1Players: ['', ''],
            team1PlayersID: ['', ''],
            team2Name: '',
            team2Players: ['', ''],
            team2PlayersID: ['', ''],
            date: '',
            time: '',
            totalPoints: '',
            description: ''
        });

        window.location.reload();
    };

    const handleMatchChange = (e) => {
        const { name, value } = e.target;
        setMatch(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectPlayer = (player, position) => {
        // For singles
        if (position === 'player1') {
            setMatch(prev => ({ ...prev, player1: player.name, player1ID: player.id }));
        } else if (position === 'player2') {
            setMatch(prev => ({ ...prev, player2: player.name, player2ID: player.id }));
        }
    };

    const handleTeamPlayerChange = (teamNumber, playerIndex, value) => {
        if (teamNumber === 1) {
            const updatedPlayers = [...match.team1Players];
            updatedPlayers[playerIndex] = value;
            setMatch(prev => ({ ...prev, team1Players: updatedPlayers }));
        } else {
            const updatedPlayers = [...match.team2Players];
            updatedPlayers[playerIndex] = value;
            setMatch(prev => ({ ...prev, team2Players: updatedPlayers }));
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={resetForm}
                className="mb-6 flex items-center text-gray-400 hover:text-white"
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to selection
            </button>

            <h2 className="text-2xl font-bold mb-6">Add a New Match</h2>

            <form onSubmit={handleSubmitMatch}>
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-medium mb-4">Match Details</h3>

                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Match Type</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="singles"
                                    checked={match.type === 'singles'}
                                    onChange={handleMatchChange}
                                    className="mr-2 accent-green-500"
                                />
                                <span>Singles</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="doubles"
                                    checked={match.type === 'doubles'}
                                    onChange={handleMatchChange}
                                    className="mr-2 accent-green-500"
                                />
                                <span>Doubles</span>
                            </label>
                        </div>
                    </div>

                    {match.type === 'singles' ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 mb-2">Player 1</label>
                                <input
                                    type="text"
                                    name="player1"
                                    value={match.player1}
                                    onChange={handleMatchChange}
                                    className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter player name"
                                />

                                <div className="mt-4">
                                    <label className="block text-gray-400 mb-2">Or select from available players:</label>
                                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                                        {availablePlayers.map(player => (
                                            <div
                                                key={player.id}
                                                className="flex items-center justify-between bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600"
                                                onClick={() => handleSelectPlayer(player, 'player1')}
                                            >
                                                <div className="flex items-center">
                                                    <img src={player.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                                                    <div>
                                                        <p className="font-medium">{player.name}</p>
                                                        <p className="text-xs text-gray-400">Rank #{player.rank}</p>
                                                    </div>
                                                </div>
                                                <UserPlus size={16} className="text-green-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Player 2</label>
                                <input
                                    type="text"
                                    name="player2"
                                    value={match.player2}
                                    onChange={handleMatchChange}
                                    className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter player name"
                                />

                                <div className="mt-4">
                                    <label className="block text-gray-400 mb-2">Or select from available players:</label>
                                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                                        {availablePlayers.map(player => (
                                            <div
                                                key={player.id}
                                                className="flex items-center justify-between bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600"
                                                onClick={() => handleSelectPlayer(player, 'player2')}
                                            >
                                                <div className="flex items-center">
                                                    <img src={player.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                                                    <div>
                                                        <p className="font-medium">{player.name}</p>
                                                        <p className="text-xs text-gray-400">Rank #{player.rank}</p>
                                                    </div>
                                                </div>
                                                <UserPlus size={16} className="text-green-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Team 1 */}
                                <div>
                                    <label className="block text-gray-400 mb-2">Team 1 Name</label>
                                    <input
                                        type="text"
                                        name="team1Name"
                                        value={match.team1Name}
                                        onChange={handleMatchChange}
                                        className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter team name"
                                    />

                                    <div className="mt-4 space-y-4 max-h-48 overflow-y-auto">
                                        {[0, 1].map((idx) => (
                                            <div key={idx}>
                                                <label className="block text-gray-400 mb-2">Player {idx + 1}</label>
                                                <input
                                                    type="text"
                                                    value={match.team1Players[idx]}
                                                    onChange={(e) => handleTeamPlayerChange(1, idx, e.target.value)}
                                                    className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                                                    placeholder="Enter player name"
                                                />
                                                <div className="space-y-2">
                                                    {availablePlayers.map((player) => (
                                                        <div
                                                            key={player.id}
                                                            className="flex items-center justify-between bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-600"
                                                            onClick={() => {
                                                                const updatedPlayers = [...match.team1Players];
                                                                const updatedPlayersID = [...match.team1PlayersID];
                                                                updatedPlayers[idx] = player.name;
                                                                updatedPlayersID[idx] = player.id;
                                                                setMatch(prev => ({ ...prev, team1Players: updatedPlayers, team1PlayersID: updatedPlayersID }));
                                                            }}
                                                        >
                                                            <div className="flex items-center">
                                                                <img src={player.avatar} alt="" className="w-6 h-6 rounded-full mr-2" />
                                                                <div>
                                                                    <p className="font-medium">{player.name}</p>
                                                                    <p className="text-xs text-gray-400">Rank #{player.rank}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Team 2 */}
                                <div>
                                    <label className="block text-gray-400 mb-2">Team 2 Name</label>
                                    <input
                                        type="text"
                                        name="team2Name"
                                        value={match.team2Name}
                                        onChange={handleMatchChange}
                                        className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter team name"
                                    />

                                    <div className="mt-4 space-y-4 max-h-48 overflow-y-auto">
                                        {[0, 1].map((idx) => (
                                            <div key={idx}>
                                                <label className="block text-gray-400 mb-2">Player {idx + 1}</label>
                                                <input
                                                    type="text"
                                                    value={match.team2Players[idx]}
                                                    onChange={(e) => handleTeamPlayerChange(2, idx, e.target.value)}
                                                    className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                                                    placeholder="Enter player name"
                                                />
                                                <div className="space-y-2">
                                                    {availablePlayers.map((player) => (
                                                        <div
                                                            key={player.id}
                                                            className="flex items-center justify-between bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-600"
                                                            onClick={() => {
                                                                const updatedPlayers = [...match.team2Players];
                                                                const updatedPlayersID = [...match.team2PlayersID];
                                                                updatedPlayers[idx] = player.name;
                                                                updatedPlayersID[idx] = player.id;
                                                                setMatch(prev => ({ ...prev, team2Players: updatedPlayers, team2PlayersID: updatedPlayersID }));
                                                            }}
                                                        >
                                                            <div className="flex items-center">
                                                                <img src={player.avatar} alt="" className="w-6 h-6 rounded-full mr-2" />
                                                                <div>
                                                                    <p className="font-medium">{player.name}</p>
                                                                    <p className="text-xs text-gray-400">Rank #{player.rank}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-medium mb-4">Schedule & Details</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">
                                <Calendar size={16} className="inline mr-2" />
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={match.date}
                                onChange={handleMatchChange}
                                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2">
                                <Clock size={16} className="inline mr-2" />
                                Time
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={match.time}
                                onChange={handleMatchChange}
                                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2">Total Points</label>
                            <input
                                type="number"
                                name="totalPoints"
                                value={match.totalPoints}
                                onChange={handleMatchChange}
                                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="E.g., 100"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-400 mb-2">Description (Optional)</label>
                        <textarea
                            name="description"
                            value={match.description}
                            onChange={handleMatchChange}
                            className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-24"
                            placeholder="Add any additional details about the match"
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center"
                    >
                        <Save size={18} className="mr-2" />
                        Create Match
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddMatchForm
