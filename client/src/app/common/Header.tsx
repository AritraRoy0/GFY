'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import {
  FaBars,            // Hamburger menu icon
  FaTimes,           // Close menu icon
  FaUser,            // Profile icon
  FaSignOutAlt,      // Logout icon
  FaSignInAlt,       // Login icon
  FaUserPlus,        // Sign Up icon
  FaHome,            // Home icon
  FaBriefcase,       // Dashboard icon
  FaCog,             // Settings icon (optional for future use)
} from 'react-icons/fa'; // Importing from React Icons (Font Awesome)

const Header: React.FC = () => {
  // Access Redux state to determine if the user is logged in
  const isLoggedIn = useSelector((state: any) => state.auth.user) ? true : false;

  // State to manage mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Logged-in content for the header
  const loggedInHeader = (
    <>
      <Link
        href="/dashboard"
        className={`flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-white hover:bg-green-500 transition duration-300`}
      >
        <FaBriefcase className="h-5 w-5 mr-1" />
        Dashboard
      </Link>
      <Link
        href="/profile"
        className={`flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-white hover:bg-green-500 transition duration-300`}
      >
        <FaUser className="h-5 w-5 mr-1" />
        Profile
      </Link>
      <Link
        href="/logout"
        className={`flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-white hover:bg-red-500 transition duration-300`}
      >
        <FaSignOutAlt className="h-5 w-5 mr-1" />
        Logout
      </Link>
    </>
  );

  // Logged-out content for the header
  const loggedOutHeader = (
    <>
      <Link
        href="/auth?tab=login"
        className={`flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-white hover:bg-blue-500 transition duration-300`}
      >
        <FaSignInAlt className="h-5 w-5 mr-1" />
        Login
      </Link>
      <Link
        href="/auth?tab=signup"
        className={`flex items-center px-3 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300`}
      >
        <FaUserPlus className="h-5 w-5 mr-1" />
        Sign Up
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center text-2xl font-extrabold text-indigo-600 cursor-pointer hover:text-indigo-700 transition duration-300"
          >
            <FaHome className="h-8 w-8 mr-2" />
            Go Fund Yourself!!
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {isLoggedIn ? loggedInHeader : loggedOutHeader}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            type="button"
            className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isLoggedIn ? loggedInHeader : loggedOutHeader}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
