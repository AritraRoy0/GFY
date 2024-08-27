// Header component for every page 

import React from 'react';
import { FaUserFriends, FaHandshake, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';



const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
            <a href="/" className="text-2xl font-bold text-purple-600">Go Fund Yourself!</a>
            <nav className="hidden md:block">
                <a href="/auth" className="text-gray-600 hover:text-gray-800 px-4">Sign Up</a>
                <a href="/auth" className="text-gray-600 hover:text-gray-800 px-4">Login</a>
            </nav>
            <div className="md:hidden">
                <button className="block text-gray-600 hover:text-gray-800 focus:outline-none">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
                </button>
            </div>
            </div>
        </div>
        </header>
    );
    }

export default Header;

