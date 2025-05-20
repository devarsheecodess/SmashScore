import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, User, Calendar, Award, Clock, Users, ChevronDown } from 'lucide-react';

const Landing = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Mock court images for the swiper
    const courtImages = [
        { id: 1, url: "/assets/pic1.jpg", alt: "Professional badminton court with proper lighting", title: "Main Championship Court" },
        { id: 2, url: "/assets/pic2.jpg", alt: "Indoor badminton courts with spectator seating", title: "Training Courts" },
        { id: 3, url: "/assets/pic3.jpg", alt: "Outdoor badminton court in a scenic location", title: "Outdoor Court" },
        { id: 4, url: "/assets/pic4.jpg", alt: "Night time badminton court with lighting", title: "Evening Play Area" }
    ];


    // Features list
    const features = [
        {
            icon: <User className="h-12 w-12 mb-4 text-green-500" />,
            title: "Player Profiles",
            description: "Create and maintain your personal badminton profile. Track your progress, view match history, and analyze your game statistics over time."
        },
        {
            icon: <Calendar className="h-12 w-12 mb-4 text-green-500" />,
            title: "Host Games",
            description: "Easily create and manage badminton matches and tournaments. Invite players, set schedules, and keep track of scores in real-time."
        },
        {
            icon: <Award className="h-12 w-12 mb-4 text-green-500" />,
            title: "Performance Analytics",
            description: "Get detailed insights into your gameplay with advanced statistics. Identify strengths and areas for improvement."
        },
        {
            icon: <Clock className="h-12 w-12 mb-4 text-green-500" />,
            title: "Live Scoring",
            description: "Real-time score tracking during matches. Share your game progress with friends and followers instantly."
        },
        {
            icon: <Users className="h-12 w-12 mb-4 text-green-500" />,
            title: "Community",
            description: "Connect with other badminton enthusiasts. Find partners, join clubs, and participate in local tournaments."
        }
    ];

    // Simple swiper effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === courtImages.length - 1 ? 0 : prev + 1));
        }, 5000);

        return () => clearInterval(interval);
    }, [courtImages.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === courtImages.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? courtImages.length - 1 : prev - 1));
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Navigation */}
            <nav className="bg-gray-800 py-4 px-6 shadow-md sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L6 6v6l6 4 6-4V6l-6-4z" />
                                <path d="M12 22V12" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold">SmashScore</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        <a href="#features" className="hover:text-green-400 transition">Features</a>
                        <a href="#courts" className="hover:text-green-400 transition">Courts</a>
                        <a href="#location" className="hover:text-green-400 transition">Location</a>
                        <a href="/login" className="hover:text-green-400 transition">Login</a>
                        <a href="/signup" className="bg-green-500 hover:bg-green-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition">Sign Up</a>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="flex items-center text-white p-2"
                        >
                            <span className="mr-2">Menu</span>
                            <ChevronDown className={`h-5 w-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden container mx-auto mt-4 px-2 py-3 bg-gray-700 rounded-lg">
                        <div className="flex flex-col space-y-3">
                            <a href="#features" className="px-3 py-2 rounded hover:bg-gray-600">Features</a>
                            <a href="#courts" className="px-3 py-2 rounded hover:bg-gray-600">Courts</a>
                            <a href="#location" className="px-3 py-2 rounded hover:bg-gray-600">Location</a>
                            <a href="/login" className="px-3 py-2 rounded hover:bg-gray-600">Login</a>
                            <a href="/signup" className="bg-green-500 hover:bg-green-600 text-gray-900 font-bold py-2 px-4 rounded-lg text-center transition">Sign Up</a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative h-96 md:h-screen overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 z-10"></div>
                <div className="absolute inset-0 bg-[url('https://c4.wallpaperflare.com/wallpaper/742/589/192/sports-badminton-wallpaper-preview.jpg')] bg-cover bg-center opacity-30"></div>
                <div className="relative container mx-auto px-6 h-full flex items-center z-20">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Track Your Badminton Journey</h1>
                        <p className="text-xl md:text-2xl mb-8 text-gray-300">
                            Professional scoring, stats tracking, and player profiles for badminton enthusiasts
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <a href="/signup" className="bg-green-500 hover:bg-green-600 text-gray-900 font-bold py-3 px-8 rounded-lg text-center transition text-lg">
                                Get Started
                            </a>
                            <a href="#features" className="border border-green-500 text-green-400 hover:bg-green-500/10 font-bold py-3 px-8 rounded-lg text-center transition text-lg">
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            SmashScore provides everything you need to elevate your badminton experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-green-500/10 hover:translate-y-[-5px] transition-all duration-300">
                                <div className="flex justify-center">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-center">{feature.title}</h3>
                                <p className="text-gray-400 text-center">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Court Images Section */}
            <section id="courts" className="py-20 bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Courts</h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Professional-grade courts designed for all levels of play
                        </p>
                    </div>

                    {/* Custom Swiper */}
                    <div className="relative w-full max-w-4xl mx-auto">
                        <div className="overflow-hidden rounded-xl shadow-lg">
                            <div className="relative h-64 md:h-96">
                                {courtImages.map((image, index) => (
                                    <div
                                        key={image.id}
                                        className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/30"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                            <h3 className="text-xl font-bold">{image.title}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>

                        {/* Dots */}
                        <div className="flex justify-center space-x-2 mt-4">
                            {courtImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-green-500' : 'bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section id="location" className="py-20 bg-gray-800 text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Us</h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Our state-of-the-art badminton facility is conveniently located
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Google Maps Embed */}
                        <div className="bg-gray-700 p-6 rounded-xl shadow-lg">
                            <div className="w-full h-72 rounded-lg overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps?q=15.420099,73.971584&z=16&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="SmashScore Location"
                                ></iframe>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="flex flex-col justify-center">
                            <h3 className="text-2xl font-bold mb-6">SmashCourt Badminton Center</h3>
                            <div className="space-y-4 text-gray-300">
                                <p className="flex items-start">
                                    <MapPin className="h-5 w-5 mr-3 text-green-500 mt-1 flex-shrink-0" />
                                    <span>Badminton Ground, Rajinwada</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-green-500">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Ready to Elevate Your Game?</h2>
                    <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
                        Join SmashScore today and take your badminton experience to the next level
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <a href="/signup" className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition text-lg">
                            Sign Up Now
                        </a>
                        <a href="/login" className="bg-transparent border-2 border-gray-900 text-gray-900 hover:bg-gray-900/10 font-bold py-3 px-8 rounded-lg transition text-lg">
                            Log In
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-8 md:mb-0">
                            <div className="flex items-center mb-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L6 6v6l6 4 6-4V6l-6-4z" />
                                        <path d="M12 22V12" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold text-white">SmashScore</span>
                            </div>
                            <p className="max-w-xs">
                                The ultimate badminton scoring and player management platform for enthusiasts and professionals alike.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-white font-bold mb-4">Quick Links</h3>
                                <ul className="space-y-2">
                                    <li><a href="#features" className="hover:text-green-400 transition">Features</a></li>
                                    <li><a href="#courts" className="hover:text-green-400 transition">Courts</a></li>
                                    <li><a href="#location" className="hover:text-green-400 transition">Location</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-white font-bold mb-4">Account</h3>
                                <ul className="space-y-2">
                                    <li><a href="/login" className="hover:text-green-400 transition">Login</a></li>
                                    <li><a href="/signup" className="hover:text-green-400 transition">Sign Up</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition">My Profile</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-white font-bold mb-4">Support</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-green-400 transition">Help Center</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition">Contact Us</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition">Privacy Policy</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
                        <p>&copy; {new Date().getFullYear()} SmashScore. All rights reserved.</p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a href="#" className="hover:text-green-400 transition">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="#" className="hover:text-green-400 transition">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="#" className="hover:text-green-400 transition">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1.5 14.25h-3v-3h3v3zm0-4.5h-3V7.5h3v4.25z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="#" className="hover:text-green-400 transition">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1.5 14.25h-3v-3h3v3zm0-4.5h-3V7.5h3v4.25z" clipRule="evenodd" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;