import React, { useEffect, useState } from 'react';
import { Calendar, Trophy, User, CheckSquare, LogOut, Menu, X, Plus, ShieldAlert, Crown } from 'lucide-react';
import axios from 'axios';

// Helper function to get initials from a name
const getInitials = (name) => {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
};

const Home = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const username = localStorage.getItem('username');
    const isAdmin = localStorage.getItem('isAdmin') === "true";
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;

    // State for upcoming matches
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUpcomingMatches = async () => {
        setIsLoading(true);
        try {
            // Using fetch instead of axios
            const response = await fetch(`${BACKEND_URL}/matches/upcoming`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setUpcomingMatches(data.matches);
            setError(null);
        } catch (error) {
            console.error("Error fetching upcoming matches:", error);
            setError("Failed to load upcoming matches. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };


    const [yourMatches, setYourMatches] = useState([])

    const fetchYourMatches = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/matches/myMatches?id=${localStorage.getItem('userID')}`);
            if (response.status === 200) {
                console.log("Your matches fetched successfully:", response.data.matches);
                setYourMatches(response.data.matches);
            } else {
                console.error("Error fetching your matches:", response.statusText);
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchUpcomingMatches();
        fetchYourMatches()
    }, []);

    const handleLogout = () => {
        const cf = confirm("Are you sure you want to logout?");
        if (!cf) return;
        localStorage.clear();
        window.location.href = '/';
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navigateTo = (path) => {
        window.location.href = path;
        if (isMenuOpen) setIsMenuOpen(false);
    };

    // Match card component for better organization
    const MatchCard = ({ match }) => {
        return (
            <div
                className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-green-900/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
                {/* Top decorative accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400"></div>

                <div className="p-4 sm:p-6">
                    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center justify-between">
                        {/* Left side with player/team info */}
                        <div className="flex items-center justify-center sm:justify-start space-x-4">
                            {/* Player/Team 1 */}
                            <div className="flex flex-col items-center">
                                {match.player1Avatar ? (
                                    <img
                                        src={match.player1Avatar}
                                        alt={`${match.player1} avatar`}
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-green-500 shadow-md shadow-green-500/20"
                                    />
                                ) : (
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        {match.type === "singles" ? getInitials(match.player1) : "T1"}
                                    </div>
                                )}
                                <span className="mt-2 text-xs sm:text-sm font-medium text-green-400 text-center line-clamp-1">
                                    {match.type === "singles" ? match.player1.split(" ")[0] : match.team1Name}
                                </span>
                            </div>

                            {/* VS */}
                            <div className="flex flex-col items-center mx-2">
                                <div className="relative">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center">
                                        <span className="text-gray-400 font-bold text-xs sm:text-sm">VS</span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">
                                        {match.pointGoal}
                                    </div>
                                </div>
                            </div>

                            {/* Player/Team 2 */}
                            <div className="flex flex-col items-center">
                                {match.player2Avatar ? (
                                    <img
                                        src={match.player2Avatar}
                                        alt={`${match.player2} avatar`}
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-red-500 shadow-md shadow-red-500/20"
                                    />
                                ) : (
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        {match.type === "singles" ? getInitials(match.player2) : "T2"}
                                    </div>
                                )}
                                <span className="mt-2 text-xs sm:text-sm font-medium text-green-400 text-center line-clamp-1">
                                    {match.type === "singles" ? match.player2.split(" ")[0] : match.team2Name}
                                </span>
                            </div>
                        </div>

                        {/* Match Result - Shown on small screens at center */}
                        <div className="flex justify-center sm:hidden">
                            <span className="text-gray-400 text-sm font-medium">
                                {match.status === "Completed" && (
                                    <div className="text-center">
                                        <p className="text-sm">{match.winner} wins!</p>
                                        <p className="text-green-400 text-center text-lg font-semibold">{match.score}</p>
                                    </div>
                                )}
                                {match.status === "Live" && <div className="text-yellow-400 font-medium">Live now!</div>}
                                {match.status === "Upcoming" && <div className="text-gray-400">Upcoming match</div>}
                            </span>
                        </div>

                        {/* Right side with match details */}
                        <div className="flex flex-col space-y-2 items-center sm:items-end">
                            {/* Match Result - Shown on larger screens */}
                            <div className="hidden sm:block">
                                <span className="text-gray-400 text-sm font-medium">
                                    {match.status === "Completed" && (
                                        <div>
                                            <p>{match.winner} wins the match!</p>
                                            <p className="text-green-400 text-center text-lg font-semibold">{match.score}</p>
                                        </div>
                                    )}
                                    {match.status === "Live" && <div className="text-yellow-400 font-medium">Live now!</div>}
                                    {match.status === "Upcoming" && <div className="text-gray-400">Upcoming match</div>}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-300 text-xs sm:text-sm">
                                        {new Date(match.date).toLocaleDateString(undefined, {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-300 text-xs sm:text-sm">{match.time} IST</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="text-gray-300 text-xs sm:text-sm truncate max-w-xs">Smash Score Turf, Gaunem</span>
                            </div>

                            {/* Status pill */}
                            {(() => {
                                const status = match.status;

                                const statusColors = {
                                    Upcoming: "from-green-500 to-emerald-500",
                                    Live: "from-yellow-400 to-yellow-600",
                                    Completed: "from-gray-600 to-gray-800",
                                };

                                const statusTextColors = {
                                    Upcoming: "text-white",
                                    Live: "text-white",
                                    Completed: "text-gray-300",
                                };

                                const pulse = status === "Live" ? "animate-pulse" : "";

                                return (
                                    <div className={`bg-gradient-to-r ${statusColors[status]} ${statusTextColors[status]} text-xs sm:text-sm font-medium px-3 py-1 rounded-full shadow-md inline-flex items-center space-x-1`}>
                                        {status === "Live" && <span className={`w-2 h-2 bg-white rounded-full ${pulse}`}></span>}
                                        <span>{status}</span>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* Match type tag */}
                <div className="absolute top-3 left-3 bg-gray-700/70 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full text-gray-300">
                    {match.type === "singles" ? "Singles" : "Doubles"}
                </div>
            </div>
        );
    };

    const YourMatchCard = ({ match, currentUser }) => {
        const isMatchCompleted = match.status === "Completed";
        const isCurrentUserPlayer1 = match.player1 === currentUser;
        const isCurrentUserPlayer2 = match.player2 === currentUser;

        // Let's debug the winner logic by examining scores
        // In badminton/tennis matches, typically the player with higher scores wins
        const determineWinnerFromScore = (scoreString) => {
            if (!scoreString) return null;

            let player1Sets = 0;
            let player2Sets = 0;

            const sets = scoreString.split(',').map(set => set.trim());
            sets.forEach(set => {
                const [score1, score2] = set.split('-').map(Number);
                if (score1 > score2) player1Sets++;
                else if (score2 > score1) player2Sets++;
            });

            return player1Sets > player2Sets ? match.player1 : match.player2;
        };

        // Determine winner based on score if match.winner isn't reliable
        const effectiveWinner = match.score ? determineWinnerFromScore(match.score) : match.winner;

        const isCurrentPlayerWinner = isMatchCompleted && currentUser === effectiveWinner;
        const isCurrentPlayerLoser = isMatchCompleted &&
            (isCurrentUserPlayer1 || isCurrentUserPlayer2) &&
            currentUser !== effectiveWinner;

        const opponent = isCurrentUserPlayer1 ? match.player2 : match.player1;
        const opponentAvatar = isCurrentUserPlayer1 ? match.player2Avatar : match.player1Avatar;

        // Format date to be more readable
        const formatMatchDate = (dateString) => {
            const date = new Date(dateString);
            const today = new Date();

            // If today, show time only
            if (date.toDateString() === today.toDateString()) {
                return `Today`;
            }

            // If yesterday
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            if (date.toDateString() === yesterday.toDateString()) {
                return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }

            // Otherwise show date and time
            return date.toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            })
        };

        // Parse score for better display if it's in format "21-15, 18-21, 21-19"
        const parseScore = (scoreString) => {
            if (!scoreString) return null;

            const sets = scoreString.split(',').map(set => set.trim());
            return (
                <div className="flex flex-wrap gap-2">
                    {sets.map((set, index) => (
                        <div
                            key={index}
                            className={`px-2 py-1 rounded text-xs ${
                                // Highlight winning sets in green for visual clarity
                                set.split('-')[0] > set.split('-')[1]
                                    ? 'bg-green-900 border border-green-700'
                                    : 'bg-gray-700 border border-gray-600'
                                }`}
                        >
                            {set}
                        </div>
                    ))}
                </div>
            );
        };

        return (
            <div className="bg-gray-800 hover:bg-gray-750 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md transition-all duration-200 relative overflow-hidden">
                {/* Status indicator line */}
                <div
                    className={`absolute top-0 left-0 h-1 w-full ${match.status === "Completed"
                        ? isCurrentPlayerWinner
                            ? 'bg-green-500'
                            : isCurrentPlayerLoser
                                ? 'bg-red-500'
                                : 'bg-gray-500' // neutral color for completed matches where user isn't a player
                        : match.status === "Scheduled"
                            ? 'bg-blue-500'
                            : 'bg-yellow-500'
                        }`}
                />

                <div className="flex items-center gap-3 w-full">
                    {/* Match type icon */}
                    <div className={`hidden sm:flex h-10 w-10 rounded-full items-center justify-center bg-gray-700 flex-shrink-0 ${match.type === "Singles" ? "text-blue-400" : "text-purple-400"
                        }`}>
                        {match.type === "Singles" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        )}
                    </div>

                    {/* Player details */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 flex-grow">
                        {/* Player avatars and names */}
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {match.player1Avatar ? (
                                    <img
                                        src={match.player1Avatar}
                                        alt={match.player1}
                                        className="w-8 h-8 rounded-full border-2 border-gray-800"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center border-2 border-gray-800">
                                        <span className="text-xs font-bold">{match.player1.charAt(0)}</span>
                                    </div>
                                )}

                                {match.player2Avatar ? (
                                    <img
                                        src={match.player2Avatar}
                                        alt={match.player2}
                                        className="w-8 h-8 rounded-full border-2 border-gray-800"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-red-900 flex items-center justify-center border-2 border-gray-800">
                                        <span className="text-xs font-bold">{match.player2.charAt(0)}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-sm sm:text-base">
                                    {match.player1} <span className="text-gray-400">vs</span> {match.player2}
                                </h3>
                                <p className="text-gray-400 text-xs">
                                    {formatMatchDate(match.date)}
                                </p>
                            </div>
                        </div>

                        {/* Fix 2: Always show score for completed matches */}
                        {isMatchCompleted && (
                            <div className="mt-1 sm:mt-0 sm:ml-auto">
                                {parseScore(match.score)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side with status and actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Fix 3: Improved Result Badge */}
                    <div
                        className={`text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 ${match.status === "Completed"
                            ? isCurrentPlayerWinner
                                ? 'bg-green-700 text-green-100'
                                : isCurrentPlayerLoser
                                    ? 'bg-red-700 text-red-100'
                                    : 'bg-gray-700 text-gray-100'
                            : match.status === "Scheduled"
                                ? 'bg-blue-700 text-blue-100'
                                : 'bg-yellow-700 text-yellow-100'
                            }`}
                    >
                        {match.status === "Completed" && (
                            isCurrentUserPlayer1 || isCurrentUserPlayer2 ? (
                                isCurrentPlayerWinner ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Win
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Loss
                                    </>
                                )
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Completed
                                </>
                            )
                        )}
                        {match.status === "Scheduled" && (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Scheduled
                            </>
                        )}
                        {match.status === "In Progress" && (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                In Progress
                            </>
                        )}
                    </div>
                </div>

                {/* Victory/Loss indicator at bottom */}
                {isMatchCompleted && (isCurrentUserPlayer1 || isCurrentUserPlayer2) && (
                    <div className={`absolute bottom-0 left-0 w-full h-1 ${isCurrentPlayerWinner ? 'bg-green-500' : 'bg-red-500'}`} />
                )}
            </div>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'upcoming':
                return (
                    <div className="p-2 sm:p-4 bg-gray-900 min-h-screen">
                        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                                </div>
                            ) : error ? (
                                <div className="bg-red-900/20 p-4 rounded-lg text-center">
                                    <p className="text-red-400">{error}</p>
                                    <button
                                        onClick={fetchUpcomingMatches}
                                        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : upcomingMatches.length === 0 ? (
                                <div className="bg-gray-800 p-6 rounded-lg text-center">
                                    <p className="text-gray-400">No upcoming matches scheduled.</p>
                                </div>
                            ) : (
                                upcomingMatches.map((match) => (
                                    <MatchCard key={match.id} match={match} />
                                ))
                            )}
                        </div>
                    </div>
                );
            case 'your-matches':
                return (
                    <div className="p-4 bg-gray-900 min-h-screen">
                        <div className="max-w-4xl mx-auto space-y-4">
                            {yourMatches.length === 0 ? (
                                <div className="bg-gray-800 p-6 rounded-lg text-center">
                                    <p className="text-gray-400">You haven't played any matches yet.</p>
                                </div>
                            ) : (
                                yourMatches.map(match => (
                                    <YourMatchCard key={match.id} match={match} currentUser={localStorage.getItem('name')} />
                                ))
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white relative">
            {/* Header */}
            <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold text-green-500">SmashScore</h1>
                </div>

                {/* Desktop navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    {isAdmin && (
                        <button
                            onClick={() => navigateTo("/admin")}
                            className="flex items-center space-x-2 text-gray-300 hover:text-green-500 transition-colors"
                        >
                            <ShieldAlert size={18} />
                            <span>Admin</span>
                        </button>
                    )}
                    <div
                        onClick={() => navigateTo('/leaderboard')}
                        className="flex items-center space-x-2 text-gray-300 hover:text-green-500 cursor-pointer transition-colors"
                    >
                        <Crown size={18} />
                        <span>Leaderboard</span>
                    </div>
                    <div
                        onClick={() => navigateTo('/profile')}
                        className="flex items-center space-x-2 text-gray-300 hover:text-green-500 cursor-pointer transition-colors"
                    >
                        <User size={18} />
                        <span>Profile</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-gray-300 hover:text-red-500 transition-colors"
                        aria-label="Logout"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-white p-1 rounded-md hover:bg-gray-700"
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile menu - now with animation */}
            <div
                className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsMenuOpen(false)}
            >
                <div
                    className={`bg-gray-800 absolute top-16 right-0 w-64 h-screen shadow-lg transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col p-4 space-y-4">
                        <div className="px-4 py-2 border-b border-gray-700">
                            <p className="text-sm text-gray-400">Signed in as</p>
                            <p className="font-medium text-green-500">{username}</p>
                        </div>

                        {isAdmin && (
                            <button
                                onClick={() => navigateTo("/admin")}
                                className="flex items-center space-x-3 text-gray-300 hover:text-green-500 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                            >
                                <ShieldAlert size={18} />
                                <span>Admin Dashboard</span>
                            </button>
                        )}

                        <button
                            onClick={() => navigateTo('/leaderboard')}
                            className="flex items-center space-x-3 text-gray-300 hover:text-green-500 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                        >
                            <Crown size={18} />
                            <span>Leaderboard</span>
                        </button>
                        <button
                            onClick={() => navigateTo('/profile')}
                            className="flex items-center space-x-3 text-gray-300 hover:text-green-500 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                        >
                            <User size={18} />
                            <span>Profile</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 text-gray-300 hover:text-red-500 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className="container mx-auto px-4 pt-6 pb-24">
                <div className="mb-6 max-w-4xl mx-auto">
                    <h2 className="text-xl sm:text-2xl font-bold">Welcome, {username}</h2>
                    <p className="text-gray-400">Track your matches and tournaments</p>
                </div>

                {/* Desktop tabs */}
                <div className="hidden md:flex space-x-4 mb-6 border-b border-gray-700 max-w-4xl mx-auto">
                    <button
                        className={`pb-3 px-4 ${activeTab === 'upcoming' ? 'text-green-500 border-b-2 border-green-500 font-medium' : 'text-gray-400 hover:text-gray-300'}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Matches
                    </button>
                    <button
                        className={`pb-3 px-4 ${activeTab === 'your-matches' ? 'text-green-500 border-b-2 border-green-500 font-medium' : 'text-gray-400 hover:text-gray-300'}`}
                        onClick={() => setActiveTab('your-matches')}
                    >
                        Your Matches
                    </button>
                </div>

                {/* Tab content */}
                <div className="mb-20 md:mb-4">
                    {renderTabContent()}
                </div>
            </main>

            {/* Mobile bottom navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 flex justify-around items-center p-3 border-t border-gray-700 shadow-lg z-10">
                <button
                    className={`flex flex-col items-center ${activeTab === 'upcoming' ? 'text-green-500' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    <Calendar size={20} />
                    <span className="text-xs mt-1">Matches</span>
                </button>
                <button
                    className={`flex flex-col items-center ${activeTab === 'your-matches' ? 'text-green-500' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('your-matches')}
                >
                    <CheckSquare size={20} />
                    <span className="text-xs mt-1">History</span>
                </button>
            </nav>
        </div>
    );
};

export default Home;