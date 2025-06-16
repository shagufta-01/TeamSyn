import React, { useState, useEffect } from 'react';
import HomeBackground from "./assests/HeroBackground.png";
import { Link } from 'react-router-dom';
const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section
            id='home'
            className="hero bg-cover bg-center h-screen relative flex items-center justify-center overflow-hidden"
            style={{ backgroundImage: `url(${HomeBackground})` }}
        >
            <div className="absolute inset-0 bg-black/20"></div>

            <div className="absolute top-20 right-20 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>


            <div className={`relative z-2 text-center px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className=" text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                    The all-in-one app <br className="hidden md:block" />
                    <span className="text-white">for modern teams.</span>
                </h1>

                <p className="text-lg sm:text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed">
                    One app for collaboration, projects, communication, and more.
                    Work smarter, move faster—together.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">

                    <Link to="/UserAuth/login">
                        <button className="group bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                            Get Started
                            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </button>

                    </Link>

                    <button className="text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
                        Learn More
                    </button>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
                <div className="w-8 h-12 border-2 border-gray-100 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-3 bg-white rounded-full animate-ping"></div>
                </div>
            </div>

            <div className="absolute z-10 bottom-0 left-0 right-0 h-9 bg-gradient-to-t from-gray-50 to-transparent "></div>
        </section>
    );
};

export default Hero;


