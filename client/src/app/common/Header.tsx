// app/components/Header.tsx

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaBriefcase,
  FaHandHoldingUsd,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo"; // Adjust the path to your Logo component if necessary

// Define the shape of your Redux state for better TypeScript support
interface User {
  id: string;
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

  const linkClassNames =
    "flex items-center px-4 py-2 rounded-md text-white border border-white bg-transparent hover:bg-gray-700 hover:border-gray-700 transition duration-300";

  const loggedInHeader = useMemo(
    () => (
      <>
        <Link href="/dashboard" className={linkClassNames}>
          <FaBriefcase className="h-5 w-5 mr-2 text-white" />
          Dashboard
        </Link>
        <Link href="/loanRequests" className={linkClassNames}>
          <FaHandHoldingUsd className="h-5 w-5 mr-2 text-white" />
          Loan Requests
        </Link>
        <Link href="/profile" className={linkClassNames}>
          <FaUser className="h-5 w-5 mr-2 text-white" />
          Profile
        </Link>
        <Link href="/about" className={linkClassNames}>
          <FaInfoCircle className="h-5 w-5 mr-2 text-white" />
          About
        </Link>
        <Link href="/logout" className={linkClassNames}>
          <FaSignOutAlt className="h-5 w-5 mr-2 text-white" />
          Logout
        </Link>
      </>
    ),
    []
  );

  const loggedOutHeader = useMemo(
    () => (
      <>
        <Link href="/about" className={linkClassNames}>
          <FaInfoCircle className="h-5 w-5 mr-2 text-white" />
          About
        </Link>
        <Link href="/auth?tab=login" className={linkClassNames}>
          <FaSignInAlt className="h-5 w-5 mr-2 text-white" />
          Login
        </Link>
        <Link href="/auth?tab=signup" className={linkClassNames}>
          <FaUserPlus className="h-5 w-5 mr-2 text-white" />
          Sign Up
        </Link>
      </>
    ),
    []
  );

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  return (
    <header className="bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo and Brand Name */}
        <Link href="/" className="flex items-center space-x-2">
          <Logo /> {/* Use the Logo component here */}
          <span className="text-2xl font-extrabold text-white">
            Go Fund Yourself!!
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {isLoggedIn ? loggedInHeader : loggedOutHeader}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            type="button"
            className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
            className="md:hidden bg-gray-800 shadow-md"
            id="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-4 pb-3 space-y-2 sm:px-3">
              {isLoggedIn ? (
                <div className="flex flex-col space-y-2">
                  <Link href="/dashboard" className={linkClassNames}>
                    <FaBriefcase className="h-5 w-5 mr-2 text-white" />
                    Dashboard
                  </Link>
                  <Link href="/loanRequests" className={linkClassNames}>
                    <FaHandHoldingUsd className="h-5 w-5 mr-2 text-white" />
                    Loan Requests
                  </Link>
                  <Link href="/profile" className={linkClassNames}>
                    <FaUser className="h-5 w-5 mr-2 text-white" />
                    Profile
                  </Link>
                  <Link href="/about" className={linkClassNames}>
                    <FaInfoCircle className="h-5 w-5 mr-2 text-white" />
                    About
                  </Link>
                  <Link href="/logout" className={linkClassNames}>
                    <FaSignOutAlt className="h-5 w-5 mr-2 text-white" />
                    Logout
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/about" className={linkClassNames}>
                    <FaInfoCircle className="h-5 w-5 mr-2 text-white" />
                    About
                  </Link>
                  <Link href="/auth?tab=login" className={linkClassNames}>
                    <FaSignInAlt className="h-5 w-5 mr-2 text-white" />
                    Login
                  </Link>
                  <Link href="/auth?tab=signup" className={linkClassNames}>
                    <FaUserPlus className="h-5 w-5 mr-2 text-white" />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
