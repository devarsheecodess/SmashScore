import React, { useState } from 'react'
import axios from 'axios'
import { Users, Award, Calendar, Clock, ChevronRight, RotateCcw, Play, Pause, LogIn, User, Lock, Home } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URI

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            console.log('Form data:', formData)
            const response = await axios.post(`${BACKEND_URL}/auth/login`, formData)
            alert('Login successful!')
            localStorage.setItem('userID', response.data.id)
            localStorage.setItem('username', response.data.username)
            localStorage.setItem('profilePic', response.data.profilePic)
            localStorage.setItem('isAdmin', response.data.isAdmin)
            window.location.href = '/home'
        } catch (err) {
            console.error('Error logging in:', err)
            setError('Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-green-500/20">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-3">
                        <div className="bg-green-500 p-3 rounded-full">
                            <LogIn className="h-8 w-8 text-gray-900" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">SmashScore</h1>
                    <p className="text-gray-400">Sign in to track your badminton matches</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="username" className="block text-gray-400 mb-2 font-medium">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="username"
                                name="username"
                                required
                                className="bg-gray-700 text-white w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-600"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-400 mb-2 font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                onChange={handleChange}
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="bg-gray-700 text-white w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-600"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                        {loading ? (
                            <span className="inline-flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/signup" className="text-green-400 hover:text-green-300 text-sm">
                        Don't have an account? Register now
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login
