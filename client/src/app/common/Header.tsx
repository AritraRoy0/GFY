'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaBriefcase,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

// Define the shape of your Redux state for better TypeScript support
interface User {
  id: string;
  name: string;
  email: string;
}

interface RootState {
  auth: {
    user: User | null;
  };
}

const Header: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.user) !== null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevState) => !prevState);
  }, []);

  const loggedInHeader = useMemo(() => (
    <>
      <Link
        href="/dashboard"
        className="flex items-center px-3 py-2 rounded-md text-white bg-purple-700 hover:bg-purple-800 transition duration-300"
      >
        <FaBriefcase className="h-5 w-5 mr-1" />
        Dashboard
      </Link>
      <Link
        href="/profile"
        className="flex items-center px-3 py-2 rounded-md text-white bg-purple-700 hover:bg-purple-800 transition duration-300"
      >
        <FaUser className="h-5 w-5 mr-1" />
        Profile
      </Link>
      <Link
        href="/logout"
        className="flex items-center px-3 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition duration-300"
      >
        <FaSignOutAlt className="h-5 w-5 mr-1" />
        Logout
      </Link>
    </>
  ), []);

  const loggedOutHeader = useMemo(() => (
    <>
      <Link
        href="/auth?tab=login"
        className="flex items-center px-3 py-2 rounded-md text-white bg-purple-700 hover:bg-purple-800 transition duration-300"
      >
        <FaSignInAlt className="h-5 w-5 mr-1" />
        Login
      </Link>
      <Link
        href="/auth?tab=signup"
        className="flex items-center px-3 py-2 rounded-md text-white bg-purple-700 hover:bg-purple-800 transition duration-300"
      >
        <FaUserPlus className="h-5 w-5 mr-1" />
        Sign Up
      </Link>
    </>
  ), []);

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo and Brand Name */}
        <Link href="/" className="flex items-center space-x-2">
          <Logo /> {/* Logo resizes within the flex container */}
          <span className="hidden md:inline-block text-2xl font-extrabold text-purple-700">
            Go Fund Yourself!!
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {isLoggedIn ? loggedInHeader : loggedOutHeader}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            type="button"
            className="text-gray-700 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700"
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

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-md"
            id="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isLoggedIn ? loggedInHeader : loggedOutHeader}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
