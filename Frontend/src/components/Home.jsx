import React, { useState } from 'react';
import { Calendar, Trophy, User, CheckSquare, LogOut, Menu, X, Plus, ShieldAlert } from 'lucide-react';

const Home = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const username = localStorage.getItem('username');
    const isAdmin = localStorage.getItem('isAdmin');

    // Sample data for demonstration
    const upcomingMatches = [
        { id: 1, opponent: "SmasherX", date: "May 22, 2025", time: "14:00" },
        { id: 2, opponent: "ProGamer99", date: "May 24, 2025", time: "16:30" },
        { id: 3, opponent: "GameMaster", date: "May 26, 2025", time: "19:00" }
    ];

    const tournaments = [
        { id: 1, name: "Spring Championship", date: "May 28, 2025", participants: 32 },
        { id: 2, name: "Summer Smash", date: "June 15, 2025", participants: 64 },
    ];

    const yourMatches = [
        { id: 1, opponent: "GameWizard", date: "May 15, 2025", result: "Win" },
        { id: 2, opponent: "SmashKing", date: "May 10, 2025", result: "Loss" },
    ];

    const handleLogout = () => {
        const cf = confirm("Are you sure you want to logout?");
        if (!cf) return;
        localStorage.clear();
        window.location.href = '/';
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'upcoming':
                return (
                    <div className="space-y-4">
                        {upcomingMatches.map(match => (
                            <div key={match.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-medium">vs {match.opponent}</h3>
                                    <p className="text-gray-400 text-sm">{match.date} at {match.time}</p>
                                </div>
                                <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    Upcoming
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'tournaments':
                return (
                    <div className="space-y-4">
                        {tournaments.map(tournament => (
                            <div key={tournament.id} className="bg-gray-800 rounded-lg p-4">
                                <h3 className="text-white font-medium">{tournament.name}</h3>
                                <p className="text-gray-400 text-sm">{tournament.date}</p>
                                <div className="mt-2 flex items-center">
                                    <span className="text-green-500 text-xs font-bold px-3 py-1 rounded-full bg-green-500 bg-opacity-20">
                                        {tournament.participants} participants
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'your-matches':
                return (
                    <div className="space-y-4">
                        {yourMatches.map(match => (
                            <div key={match.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-medium">vs {match.opponent}</h3>
                                    <p className="text-gray-400 text-sm">{match.date}</p>
                                </div>
                                <div className={`text-white text-xs font-bold px-3 py-1 rounded-full ${match.result === 'Win' ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {match.result}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white relative">
            {/* Desktop header */}
            <header className="bg-gray-800 p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold text-green-500">SmashScore</h1>
                </div>

                {/* Desktop navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    {
                        isAdmin == "true" && (
                            <button onClick={() => window.location.href = "/admin"} className="flex items-center space-x-2 text-gray-300 hover:text-green-500">
                                <ShieldAlert size={18} />
                                <span>Admin</span>
                            </button>
                        )
                    }
                    <div className="flex items-center space-x-2 text-gray-300 hover:text-green-500 cursor-pointer">
                        <User size={18} />
                        <span>Profile</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-gray-300 hover:text-red-500"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>

                {/* Mobile menu button */}
                <button className="md:hidden text-white" onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-800 absolute top-16 left-0 right-0 z-10 p-4 shadow-lg">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2 text-gray-300 hover:text-green-500 cursor-pointer">
                            <User size={18} />
                            <span>Profile</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 text-gray-300 hover:text-red-500"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Main content */}
            <main className="container mx-auto p-4">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Welcome, {username}</h2>
                    <p className="text-gray-400">Track your matches and tournaments</p>
                </div>

                {/* Desktop tabs */}
                <div className="hidden md:flex space-x-4 mb-6 border-b border-gray-700">
                    <button
                        className={`pb-3 px-2 ${activeTab === 'upcoming' ? 'text-green-500 border-b-2 border-green-500 font-medium' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Matches
                    </button>
                    <button
                        className={`pb-3 px-2 ${activeTab === 'tournaments' ? 'text-green-500 border-b-2 border-green-500 font-medium' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('tournaments')}
                    >
                        Upcoming Tournaments
                    </button>
                    <button
                        className={`pb-3 px-2 ${activeTab === 'your-matches' ? 'text-green-500 border-b-2 border-green-500 font-medium' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('your-matches')}
                    >
                        Your Matches
                    </button>
                </div>

                {/* Tab content */}
                <div className="mb-20 md:mb-0">
                    {renderTabContent()}
                </div>
            </main>

            {/* Mobile bottom navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 flex justify-around items-center p-3 border-t border-gray-700">
                <button
                    className={`flex flex-col items-center ${activeTab === 'upcoming' ? 'text-green-500' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    <Calendar size={20} />
                    <span className="text-xs mt-1">Matches</span>
                </button>
                <button
                    className={`flex flex-col items-center ${activeTab === 'tournaments' ? 'text-green-500' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('tournaments')}
                >
                    <Trophy size={20} />
                    <span className="text-xs mt-1">Tournaments</span>
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