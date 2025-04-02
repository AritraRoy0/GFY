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

    const linkClassNames = "flex items-center px-4 py-2.5 rounded-lg text-gray-100 hover:text-white transition-all duration-300 hover:bg-gradient-to-r from-blue-600/40 to-purple-500/40 font-medium";

    const menuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const navLinks = useMemo(() =>
        isLoggedIn ? [
            { href: "/dashboard", icon: <FaBriefcase className="text-blue-400" />, text: "Dashboard" },
            { href: "/loanRequests", icon: <FaHandHoldingUsd className="text-green-400" />, text: "Loans" },
            { href: "/profile", icon: <FaUser className="text-purple-400" />, text: "Profile" },
            { href: "/about", icon: <FaInfoCircle className="text-yellow-400" />, text: "About" },
            { href: "/logout", icon: <FaSignOutAlt className="text-red-400" />, text: "Logout" },
        ] : [
            { href: "/about", icon: <FaInfoCircle className="text-yellow-400" />, text: "About" },
            { href: "/auth?tab=login", icon: <FaSignInAlt className="text-blue-400" />, text: "Login" },
            { href: "/auth?tab=signup", icon: <FaUserPlus className="text-green-400" />, text: "Sign Up" },
        ], [isLoggedIn]);

    return (
        <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-700">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo Section */}
                    <motion.div 
                        whileHover={{ scale: 1.05 }} 
                        className="flex items-center"
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
                            <Logo />
                            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                                Vault Technologies
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Link
                                    href={link.href}
                                    className={linkClassNames}
                                    onClick={closeMenu}
                                >
                                    <span className="mr-2 text-lg">{link.icon}</span>
                                    {link.text}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        onClick={toggleMenu}
                        className="md:hidden p-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors shadow-md"
                        aria-label="Toggle navigation menu"
                        whileTap={{ scale: 0.9 }}
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
                                <FaBars className="w-6 h-6 text-blue-400" />
                            )}
                        </motion.div>
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="md:hidden overflow-hidden bg-gray-800/90 backdrop-blur-sm rounded-b-xl shadow-lg border border-gray-700"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={menuVariants}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                            <div className="pt-3 pb-4 space-y-1">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={closeMenu}
                                            className="flex items-center mx-2 px-4 py-3 text-gray-100 hover:bg-gray-700/50 rounded-lg transition-colors"
                                        >
                                            <span className="mr-3 text-lg">{link.icon}</span>
                                            <span className="font-medium">{link.text}</span>
                                        </Link>
                                    </motion.div>
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