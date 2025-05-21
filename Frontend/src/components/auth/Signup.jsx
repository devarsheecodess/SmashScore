import React, { useState } from 'react'
import axios from 'axios'
import { Users, Award, Calendar, Clock, ChevronRight, RotateCcw, Play, Pause, LogIn, User, Lock, Home, Mail, UserPlus, Image, Calendar as CalendarIcon, Heart } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({})
    const BACKEND_URI = import.meta.env.VITE_BACKEND_URI
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0],
            }));

            // Create preview for the image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("profilePic", formData.profilePic);
        data.append("name", formData.name);
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("age", formData.age);
        data.append("gender", formData.gender);
        data.append("password", formData.password);

        // ✅ Log the contents of FormData
        for (let [key, value] of data.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const response = await axios.post(`${BACKEND_URI}/auth/signup`, data);
            console.log("Signup response:", response);
            if (response.status === 201) {
                alert("Signup successful!");
                console.log("Signup successful:", response.data);
                localStorage.setItem('userID', response.data._id);
                localStorage.setItem('username', data.username);
                localStorage.setItem('profilePic', data.profilePic);
                window.location.href = '/home';
                setLoading(false);
            } else {
                alert("Signup failed");
            }
        } catch (err) {
            console.error('Error signing up:', err);
            setError('Signup failed. Please try again.');
            setLoading(false);
            alert("Signup failed!");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-green-500/20">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-3">
                        <div className="bg-green-500 p-3 rounded-full">
                            <UserPlus className="h-8 w-8 text-gray-900" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Join SmashScore</h1>
                    <p className="text-gray-400">Create your account to start tracking matches</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="text-center">
                        <label htmlFor="profilePic" className="block text-gray-400 mb-2 font-medium">
                            Profile Picture
                        </label>
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 mb-3 rounded-full bg-gray-700 overflow-hidden border-2 border-green-500 flex items-center justify-center">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="h-12 w-12 text-gray-500" />
                                )}
                            </div>
                            <label htmlFor="profilePic" className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md cursor-pointer text-sm flex items-center">
                                <Image className="h-4 w-4 mr-2" />
                                Choose Image
                                <input
                                    onChange={handleFileChange}
                                    type="file"
                                    id="profilePic"
                                    name="profilePic"
                                    accept="image/*"
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-400 mb-2 font-medium">
                                Full Name
                            </label>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="bg-gray-700 text-white w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-600"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-gray-400 mb-2 font-medium">
                                Username
                            </label>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="username"
                                name="username"
                                required
                                className="bg-gray-700 text-white w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-600"
                                placeholder="john_smash"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-400 mb-2 font-medium">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                onChange={handleChange}
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="bg-gray-700 text-white w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-600"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="age" className="block text-gray-400 mb-2 font-medium">
                                Age
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    onChange={handleChange}
                                    type="number"
                                    id="age"
                                    name="age"
                                    min="8"
                                    max="100"
                                    required
                                    className="bg-gray-700 text-white w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-600"
                                    placeholder="25"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="gender" className="block text-gray-400 mb-2 font-medium">
                                Gender
                            </label>
                            <select
                                onChange={handleChange}
                                id="gender"
                                name="gender"
                                required
                                className="bg-gray-700 text-white w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-600"
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
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
                                className="bg-gray-700 text-white w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-600"
                                placeholder="Password (min 6 characters)"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-2 rounded-md">
                            <p>{error}</p>
                        </div>
                    )}

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
                                Creating account...
                            </span>
                        ) : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/login" className="text-green-400 hover:text-green-300 text-sm">
                        Already have an account? Sign in
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Signup
