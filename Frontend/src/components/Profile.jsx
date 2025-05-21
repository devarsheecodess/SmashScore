import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Home } from 'lucide-react'

const Profile = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;
    // Mock user data - this would typically come from your application state or API
    const [user, setUser] = useState({
        fullName: "John Doe",
        username: "john_smash",
        email: "john@example.com",
        age: "25",
        gender: "Male",
        profilePic: null,
        // Player statistics
        stats: {
            singleMatches: 0,
            doubleMatches: 0,
            matchesWon: 0,
            matchesLost: 0,
            totalPointsScored: 0,
            winRate: 0, // Percentage
            bestMatch: "",
            playerRank: 0 // Global ranking
        }
    });

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/users/profile?id=${localStorage.getItem("userID")}`);
            const userData = response.data;
            setUser((prevUser) => ({
                ...prevUser,
                ...userData,
                fullName: userData.name,
                stats: {
                    ...prevUser.stats,
                    singleMatches: userData.stats.singles,
                    doubleMatches: userData.stats.doubles,
                    matchesWon: userData.stats.wins,
                    matchesLost: userData.stats.losses,
                    totalPointsScored: userData.stats.totalpoints,
                    bestMatch: userData.bestMatch || "Play matches to see your best match",
                    playerRank: userData.playerRank
                }
            }));

            calculateWinRate();
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    const calculateWinRate = () => {
        const totalMatches = user.stats.matchesWon + user.stats.matchesLost;
        if (totalMatches === 0) return 0;
        const winrate = ((user.stats.matchesWon / totalMatches) * 100).toFixed(2)
        console.log(totalMatches, user.stats.matchesWon, user.stats.matchesLost, winrate);
        setUser((prevUser) => ({
            ...prevUser,
            stats: {
                ...prevUser.stats,
                winRate: winrate
            }
        }));
    };

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    const handlePasswordUpdate = async (e) => {
        if (e) e.preventDefault();
        try {
            // Reset messages
            setPasswordError("");
            setPasswordSuccess("");

            // Basic validation
            if (passwordData.newPassword.length < 6) {
                setPasswordError("Password must be at least 6 characters");
                return;
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setPasswordError("Passwords do not match");
                return;
            }

            const response = await axios.put(`${BACKEND_URL}/users/updatePassword`, {
                id: localStorage.getItem("userID"),
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })

            setPasswordSuccess("Password updated successfully!");

            // Clear form
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            // Close modal after a delay
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordSuccess("");
            }, 2000);
        } catch (error) {
            alert("Current password is incorrect");
        }
    };

    // Calculate matches total for progress bar
    const totalMatches = user.stats.matchesWon + user.stats.matchesLost;
    const winPercentage = totalMatches > 0 ? (user.stats.matchesWon / totalMatches) * 100 : 0;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center py-4 px-2 sm:py-8 sm:px-4">
            <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-700 py-4 px-4 sm:py-6 sm:px-6 text-center relative">
                    <h1 className="text-xl sm:text-2xl font-bold">Your Profile</h1>
                    <p className="text-gray-400 text-sm sm:text-base mt-1">View and manage your account details</p>
                </div>

                {/* Profile Picture */}
                <div className="flex justify-center -mt-8 sm:-mt-10">
                    <div className="relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-600 border-4 border-gray-800 flex items-center justify-center overflow-hidden">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            )}
                        </div>
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 border-2 border-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Info */}
                <div className="p-4 sm:p-6 pt-2">
                    {/* User Information Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <>
                            <div className="space-y-1">
                                <p className="text-gray-400 text-xs sm:text-sm">Full Name</p>
                                <p className="font-medium text-sm sm:text-base">{user.fullName}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-gray-400 text-xs sm:text-sm">Username</p>
                                <p className="font-medium text-sm sm:text-base">{user.username}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-gray-400 text-xs sm:text-sm">Email</p>
                                <p className="font-medium text-sm sm:text-base">{user.email}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-gray-400 text-xs sm:text-sm">Age</p>
                                <p className="font-medium text-sm sm:text-base">{user.age}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-gray-400 text-xs sm:text-sm">Gender</p>
                                <p className="font-medium text-sm sm:text-base">{user.gender}</p>
                            </div>
                        </>
                    </div>

                    {/* Player Statistics */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Player Statistics
                        </h2>

                        {/* Win/Loss Visual */}
                        <div className="mb-4">
                            <div className="flex justify-between text-xs sm:text-sm mb-1">
                                <span>Win/Loss Ratio</span>
                                <span>{user.stats.matchesWon} - {user.stats.matchesLost}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 h-2.5 rounded-full"
                                    style={{ width: `${(user.stats.matchesWon / (user.stats.matchesWon + user.stats.matchesLost) * 100)}%` }}
                                ></div>
                            </div>
                            <div className="text-right text-xs text-gray-400 mt-1">{user.stats.winRate}% win rate</div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                            {/* Match Types */}
                            <div className="col-span-2 grid grid-cols-2 gap-2 sm:gap-4 mb-2">
                                <div className="bg-gray-700 rounded-lg p-3 text-center">
                                    <p className="text-xl sm:text-2xl font-bold">{user.stats.singleMatches}</p>
                                    <p className="text-gray-400 text-xs sm:text-sm">Singles Played</p>
                                </div>
                                <div className="bg-gray-700 rounded-lg p-3 text-center">
                                    <p className="text-xl sm:text-2xl font-bold">{user.stats.doubleMatches}</p>
                                    <p className="text-gray-400 text-xs sm:text-sm">Doubles Played</p>
                                </div>
                            </div>

                            {/* Win/Loss Stats */}
                            <div className="bg-gray-700 rounded-lg p-3 text-center">
                                <p className="text-xl sm:text-2xl font-bold text-green-500">{user.stats.matchesWon}</p>
                                <p className="text-gray-400 text-xs sm:text-sm">Matches Won</p>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-3 text-center">
                                <p className="text-xl sm:text-2xl font-bold text-red-500">{user.stats.matchesLost}</p>
                                <p className="text-gray-400 text-xs sm:text-sm">Matches Lost</p>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-3 text-center">
                                <p className="text-xl sm:text-2xl font-bold">{user.stats.totalPointsScored}</p>
                                <p className="text-gray-400 text-xs sm:text-sm">Total Points</p>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-3 text-center">
                                <p className="text-xl sm:text-2xl font-bold text-yellow-500">{user.stats.winRate}%</p>
                                <p className="text-gray-400 text-xs sm:text-sm">Win Rate</p>
                            </div>
                        </div>

                        {/* Best Match and Rank */}
                        <div className="mt-2 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div className="bg-gray-700 rounded-lg p-3">
                                <p className="text-gray-400 text-xs sm:text-sm">Best Match</p>
                                <p className="font-medium text-sm sm:text-base">{user.stats.bestMatch}</p>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-3 flex items-center">
                                <div className="mr-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-600 border-2 border-yellow-500 flex items-center justify-center">
                                        <span className="text-lg sm:text-xl font-bold text-yellow-500">#{user.stats.playerRank}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs sm:text-sm">Player Rank</p>
                                    <p className="font-medium text-sm sm:text-base">Local Rank</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Management Buttons */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="py-2 sm:py-3 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium text-sm sm:text-base transition-colors duration-300 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Update Password
                        </button>
                        <button
                            onClick={() => window.location.href = '/home'}
                            className="py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium text-sm sm:text-base transition-colors duration-300 flex items-center justify-center"
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>

            {/* Password Update Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-bold">Update Password</h2>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div>
                            {passwordError && (
                                <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-md text-red-200 text-sm">
                                    {passwordError}
                                </div>
                            )}

                            {passwordSuccess && (
                                <div className="mb-4 p-3 bg-green-900 bg-opacity-50 border border-green-700 rounded-md text-green-200 text-sm">
                                    {passwordSuccess}
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-400 text-xs sm:text-sm mb-1">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-400 text-xs sm:text-sm mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-400 text-xs sm:text-sm mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors duration-300 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePasswordUpdate}
                                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition-colors duration-300 text-sm"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;