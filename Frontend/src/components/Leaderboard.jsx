import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Crown, Medal, Star, Sparkles } from 'lucide-react';
import axios from 'axios';

const Leaderboard = ({ players = [] }) => {
    const [showAnimation, setShowAnimation] = useState(true);
    const [animateCards, setAnimateCards] = useState(false);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URI

    // Dummy data for testing
    const [Players, setPlayers] = useState([{
        rank: 0,
        name: "",
        profilePic: "",
        stats: { totalpoints: 0 }
    }]);

    const fetchPlayers = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/matches/rankings`);
            const data = response.data.rankings;

            // Ensure it's an array before proceeding
            if (Array.isArray(data)) {
                const rankedPlayers = data.map((player, index) => ({
                    ...player,
                    rank: index + 1,
                    profilePic: player.avatar, // optional: normalize avatar field name
                    stats: { totalpoints: player.totalPoints } // optional: normalize stats
                }));
                setPlayers(rankedPlayers);
            } else {
                console.warn("Expected array, got:", data);
                setPlayers([]);
            }
        } catch (error) {
            console.error("Error fetching players:", error);
        }
    };

    // Process the rankings data
    const rankings = Players.map((player, index) => ({
        rank: index + 1,
        name: player.name,
        avatar: player.profilePic,
        totalPoints: player.stats.totalpoints,
    }));

    const topThree = rankings.slice(0, 3);
    const restPlayers = rankings.slice(3);

    useEffect(() => {
        fetchPlayers();

        const timer = setTimeout(() => {
            setShowAnimation(false);
            setAnimateCards(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);


    const PartyPopper = ({ delay = 0 }) => (
        <div
            className={`absolute animate-bounce`}
            style={{
                animationDelay: `${delay}ms`,
                animationDuration: '2s'
            }}
        >
            <Sparkles className="text-green-400 w-6 h-6" />
        </div>
    );

    const Confetti = ({ delay = 0, x = 0, y = 0 }) => (
        <div
            className="absolute w-2 h-2 bg-green-400 animate-ping"
            style={{
                left: `${x}%`,
                top: `${y}%`,
                animationDelay: `${delay}ms`,
                animationDuration: '1.5s'
            }}
        />
    );

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Crown className="w-8 h-8 text-yellow-400" />;
            case 2:
                return <Trophy className="w-7 h-7 text-gray-300" />;
            case 3:
                return <Medal className="w-6 h-6 text-amber-600" />;
            default:
                return <Star className="w-5 h-5 text-green-400" />;
        }
    };

    const getPodiumHeight = (rank) => {
        switch (rank) {
            case 1:
                return 'h-40';
            case 2:
                return 'h-32';
            case 3:
                return 'h-28';
            default:
                return 'h-16';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            {/* Animated Background Elements */}
            {showAnimation && (
                <>
                    {/* Party Poppers */}
                    <PartyPopper delay={0} />
                    <PartyPopper delay={500} />
                    <PartyPopper delay={1000} />

                    {/* Confetti */}
                    {[...Array(20)].map((_, i) => (
                        <Confetti
                            key={i}
                            delay={i * 100}
                            x={Math.random() * 100}
                            y={Math.random() * 100}
                        />
                    ))}

                    {/* Celebration Text */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/80 backdrop-blur-sm">
                        <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-green-400 animate-pulse text-center px-4">
                            🎉 LEADERBOARD 🎉
                        </div>
                    </div>
                </>
            )}

            {/* Main Content */}
            <div className={`transition-opacity duration-1000 ${showAnimation ? 'opacity-0' : 'opacity-100'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 bg-slate-800/50 backdrop-blur-sm">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Back to Home</span>
                        <span className="sm:hidden">Back</span>
                    </button>
                    <h1 className="text-lg sm:text-2xl font-bold text-green-400 text-center flex-1 px-4">SmashScore Leaderboard</h1>
                    <div className="w-16 sm:w-32"></div> {/* Spacer for centering */}
                </div>

                <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
                    {/* Top 3 Podium */}
                    {topThree.length > 0 && (
                        <div className="mb-8 sm:mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-green-400">Top Champions</h2>

                            {/* Podium Base */}
                            <div className="flex items-end justify-center gap-1 sm:gap-2 md:gap-4 mb-6 sm:mb-8 px-2">
                                {/* Rearrange for podium effect: 2nd, 1st, 3rd */}
                                {[topThree[1], topThree[0], topThree[2]].filter(Boolean).map((player, index) => {
                                    const actualRank = player?.rank;
                                    const isFirst = actualRank === 1;

                                    return (
                                        <div
                                            key={player?.name}
                                            className={`relative flex flex-col items-center ${animateCards ? 'animate-slide-up' : ''} flex-1 max-w-32 sm:max-w-40`}
                                            style={{ animationDelay: `${index * 300}ms` }}
                                        >
                                            {/* Player Card - Above Podium */}
                                            <div className={`relative z-10 bg-slate-800 p-2 sm:p-4 rounded-xl shadow-2xl border-2 ${isFirst ? 'border-yellow-400 shadow-yellow-400/30' :
                                                actualRank === 2 ? 'border-gray-300 shadow-gray-300/20' :
                                                    'border-amber-500 shadow-amber-500/20'
                                                } w-full mb-2 transform ${isFirst ? 'scale-105 sm:scale-110' : ''}`}>
                                                <div className="flex flex-col items-center">
                                                    {/* Rank Badge */}
                                                    <div className={`absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${actualRank === 1 ? 'bg-yellow-400 text-yellow-900' :
                                                        actualRank === 2 ? 'bg-gray-300 text-gray-800' :
                                                            'bg-amber-500 text-amber-900'
                                                        }`}>
                                                        {actualRank}
                                                    </div>

                                                    {/* Crown/Medal */}
                                                    <div className="mb-2 sm:mb-3">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8">
                                                            {getRankIcon(actualRank)}
                                                        </div>
                                                    </div>

                                                    {/* Avatar */}
                                                    <div className="relative mb-2 sm:mb-3">
                                                        <img
                                                            src={player?.avatar || '/default-avatar.png'}
                                                            alt={player?.name}
                                                            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 sm:border-3 ${isFirst ? 'border-yellow-400' :
                                                                actualRank === 2 ? 'border-gray-300' :
                                                                    'border-amber-500'
                                                                }`}
                                                            onError={(e) => {
                                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDE0MTQxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Vc2VyPC90ZXh0Pgo8L3N2Zz4K';
                                                            }}
                                                        />
                                                        {isFirst && (
                                                            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                                                        )}
                                                    </div>

                                                    {/* Player Info */}
                                                    <h3 className="font-bold text-xs sm:text-sm text-center mb-1 text-white truncate w-full px-1">
                                                        {player?.name}
                                                    </h3>
                                                    <p className={`font-bold text-sm sm:text-lg ${isFirst ? 'text-yellow-400' :
                                                        actualRank === 2 ? 'text-gray-300' :
                                                            'text-amber-500'
                                                        }`}>
                                                        {player?.totalPoints}
                                                    </p>
                                                    <p className="text-gray-400 text-xs">points</p>
                                                </div>
                                            </div>

                                            {/* Podium Step */}
                                            <div className={`relative ${getPodiumHeight(actualRank)} w-full bg-gradient-to-t ${actualRank === 1 ? 'from-yellow-700 via-yellow-600 to-yellow-500' :
                                                actualRank === 2 ? 'from-gray-700 via-gray-600 to-gray-500' :
                                                    'from-amber-800 via-amber-700 to-amber-600'
                                                } shadow-2xl`}>
                                                {/* Podium Face */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

                                                {/* Podium Number */}
                                                <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2">
                                                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg ${actualRank === 1 ? 'bg-yellow-400 text-yellow-900' :
                                                        actualRank === 2 ? 'bg-gray-300 text-gray-800' :
                                                            'bg-amber-400 text-amber-900'
                                                        }`}>
                                                        {actualRank}
                                                    </div>
                                                </div>

                                                {/* Podium Shine Effect */}
                                                <div className="absolute top-0 left-0 w-full h-1 sm:h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                                            </div>

                                            {/* Podium Base Shadow */}
                                            <div className="w-full h-1 sm:h-2 bg-black/20 rounded-full blur-sm"></div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Rest of the Rankings */}
                    {restPlayers.length > 0 && (
                        <div className="max-w-4xl mx-auto px-2 sm:px-0">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-green-400">Other Players</h2>
                            <div className="grid gap-2 sm:gap-4">
                                {restPlayers.map((player, index) => (
                                    <div
                                        key={player.name}
                                        className={`bg-slate-800 p-3 sm:p-4 rounded-lg shadow-lg border border-slate-700 hover:border-green-500 transition-all duration-300 hover:shadow-green-500/20 ${animateCards ? 'animate-fade-in-up' : ''
                                            }`}
                                        style={{ animationDelay: `${(index + 3) * 100}ms` }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                                                {/* Rank */}
                                                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                                    <span className="text-lg sm:text-2xl font-bold text-green-400 w-6 sm:w-8">
                                                        #{player.rank}
                                                    </span>
                                                    <div className="w-4 h-4 sm:w-5 sm:h-5">
                                                        {getRankIcon(player.rank)}
                                                    </div>
                                                </div>

                                                {/* Avatar and Name */}
                                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                                    <img
                                                        src={player.avatar || '/default-avatar.png'}
                                                        alt={player.name}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-green-400 flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDE0MTQxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Vc2VyPC90ZXh0Pgo8L3N2Zz4K';
                                                        }}
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-bold text-sm sm:text-base text-white truncate">{player.name}</h3>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Points */}
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-lg sm:text-2xl font-bold text-green-400">{player.totalPoints}</p>
                                                <p className="text-gray-400 text-xs sm:text-sm">points</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {rankings.length === 0 && (
                        <div className="text-center py-16">
                            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-400 mb-2">No Rankings Yet</h2>
                            <p className="text-gray-500">Start playing matches to see the leaderboard!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
        </div>
    );
};

export default Leaderboard;