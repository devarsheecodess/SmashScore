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
        <div>
            <h1 className="text-3xl font-bold text-center mt-10">Admin Dashboard</h1>
            <ul className="mt-6 space-y-2 list-disc list-inside">
                <li>
                    <Link to="/home" className="text-green-500 hover:underline">
                        Return Back
                    </Link>
                </li>
                <li>
                    <Link to="/admin/AddMatches" className="text-green-500 hover:underline">
                        Add Matches
                    </Link>
                </li>
                <li>
                    <Link to="/admin/match/score" className="text-green-500 hover:underline">
                        Score Matches
                    </Link>
                </li>
                <li>
                    <Link to="/admin/tournament/score" className="text-green-500 hover:underline">
                        Score Tournaments
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Dashboard;
