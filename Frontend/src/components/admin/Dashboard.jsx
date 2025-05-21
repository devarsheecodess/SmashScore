import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;
    const navigate = useNavigate();

    const checkAdmin = async () => {
        const userID = localStorage.getItem('userID');

        if (!userID) {
            alert('No user ID found. Please log in.');
            return navigate('/login');
        }

        console.log('User ID:', userID);

        try {
            const response = await axios.get(`${BACKEND_URL}/auth/checkAdmin?id=${userID}`);
            console.log(response.data);

            if (!response.data?.isAdmin) {
                alert('Access denied!');
                navigate('/home');
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            alert('Something went wrong. Please try again.');
            navigate('/home');
        }
    };

    useEffect(() => {
        checkAdmin();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4">
            <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-800 p-6 border-b border-gray-700">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.23-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
                    <p className="text-center text-gray-400 mt-2">Manage tournaments and matches</p>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <Link
                            to="/home"
                            className="flex items-center p-3 w-full bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            Return Back
                        </Link>

                        <Link
                            to="/admin/AddMatches"
                            className="flex items-center p-3 w-full bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            Add Matches
                        </Link>

                        <Link
                            to="/admin/match/score"
                            className="flex items-center p-3 w-full bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                            Score Matches
                        </Link>

                        {/* <Link
                            to="/admin/tournament/score"
                            className="flex items-center p-3 w-full bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
                                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                            </svg>
                            Score Tournaments
                        </Link> */}
                    </div>
                </div>

                <div className="bg-gray-800 p-4 border-t border-gray-700">
                    <p className="text-center text-gray-400 text-sm">
                        SmashScore Admin Panel
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
