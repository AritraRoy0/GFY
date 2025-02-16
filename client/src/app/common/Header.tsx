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
import Logo from "./Logo";

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

    const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
    const closeMenu = useCallback(() => setIsMenuOpen(false), []);

    const linkClassNames = "flex items-center px-4 py-3 rounded-lg text-gray-100 hover:text-white transition-all duration-300 hover:bg-gradient-to-r from-blue-600/30 to-purple-500/30";

    const menuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const navLinks = useMemo(() =>
        isLoggedIn ? [
            { href: "/dashboard", icon: <FaBriefcase />, text: "Dashboard" },
            { href: "/loanRequests", icon: <FaHandHoldingUsd />, text: "Loans" },
            { href: "/profile", icon: <FaUser />, text: "Profile" },
            { href: "/about", icon: <FaInfoCircle />, text: "About" },
            { href: "/logout", icon: <FaSignOutAlt />, text: "Logout" },
        ] : [
            { href: "/about", icon: <FaInfoCircle />, text: "About" },
            { href: "/auth?tab=login", icon: <FaSignInAlt />, text: "Login" },
            { href: "/auth?tab=signup", icon: <FaUserPlus />, text: "Sign Up" },
        ], [isLoggedIn]);

    return (
        <header className="bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Section */}
                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
                            <Logo />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                Vault Technologies
              </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className={linkClassNames}
                                onClick={closeMenu}
                            >
                                <span className="mr-2 text-lg">{link.icon}</span>
                                {link.text}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-3 rounded-lg hover:bg-gray-700/30 transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        <motion.div
                            animate={isMenuOpen ? "open" : "closed"}
                            variants={{
                                open: { rotate: 180 },
                                closed: { rotate: 0 }
                            }}
                        >
                            {isMenuOpen ? (
                                <FaTimes className="w-6 h-6 text-purple-400" />
                            ) : (
                                <FaBars className="w-6 h-6 text-gray-100" />
                            )}
                        </motion.div>
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="md:hidden overflow-hidden"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={menuVariants}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                            <div className="pt-4 pb-6 space-y-2">
                                {navLinks.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        onClick={closeMenu}
                                        className="flex items-center px-4 py-3 text-gray-100 hover:bg-gray-700/20 rounded-lg transition-colors"
                                    >
                                        <span className="mr-3 text-lg">{link.icon}</span>
                                        {link.text}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default Header;