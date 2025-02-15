// src/components/LoanRequestCarousel.tsx
"use client";

import React, { useState, useEffect } from "react";
import { fetchLoanRequests } from "../models/LoanRequestAPIs";
import { LoanRequest } from "../models/LoanInterfaces";
import { motion } from "framer-motion";
import { FiDollarSign, FiPercent, FiCalendar, FiTrendingUp } from "react-icons/fi";

interface User {
    uid: string;
    displayName?: string;
    email?: string;
}

const LoanRequestCarousel: React.FC = () => {
    const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
    const [userMap, setUserMap] = useState<{ [uid: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // Fetch loan requests on component mount
    useEffect(() => {
        const unsubscribe = fetchLoanRequests((requests) => {
            setLoanRequests(requests);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch user details whenever loanRequests change
    useEffect(() => {
        const fetchAllUserDetails = async () => {
            const uniqueUids = Array.from(new Set(loanRequests.map((req) => req.borrowedBy)));
            const userPromises = uniqueUids.map((uid) => fetchUserDetails(uid));
            try {
                const users = await Promise.all(userPromises);
                const newUserMap: { [uid: string]: string } = {};
                users.forEach((user) => {
                    newUserMap[user.uid] = user.displayName || user.email || user.uid;
                });
                setUserMap(newUserMap);
            } catch (err) {
                console.error("Error fetching user details:", err);
                setError("Failed to load user details.");
            }
        };

        if (loanRequests.length > 0) fetchAllUserDetails();
    }, [loanRequests]);

    const calculateProfits = (principal: number, interestRate: number): number => {
        return (principal * interestRate) / 100;
    };

    const TickerItem = ({ request }: { request: LoanRequest }) => {
        const profits = calculateProfits(request.principalAmount, request.interestRate);

        return (
            <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex-shrink-0 mx-4 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-4 min-w-[240px] border border-gray-200 hover:border-emerald-200 transition-all"
            >
                <div className="mb-3 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                        <span className="text-emerald-600 text-sm font-medium">
                            {userMap[request.borrowedBy]?.charAt(0) || "U"}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                        {userMap[request.borrowedBy] || "Anonymous User"}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                        <FiDollarSign className="text-emerald-500" />
                        <div>
                            <p className="text-xs text-gray-500">Principal</p>
                            <p className="text-sm font-semibold text-gray-800">
                                ${request.principalAmount.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FiPercent className="text-purple-500" />
                        <div>
                            <p className="text-xs text-gray-500">Interest</p>
                            <p className="text-sm font-semibold text-purple-600">
                                {request.interestRate}%
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FiCalendar className="text-blue-500" />
                        <div>
                            <p className="text-xs text-gray-500">Term</p>
                            <p className="text-sm font-semibold text-blue-600">
                                {request.termWeeks} weeks
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FiTrendingUp className="text-green-500" />
                        <div>
                            <p className="text-xs text-gray-500">Profit</p>
                            <p className="text-sm font-semibold text-green-600">
                                +${profits.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="w-full bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 animate-pulse">
                    <div className="flex space-x-4 overflow-hidden">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 w-60 bg-white rounded-xl shadow-sm border" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-red-50 py-4">
                <div className="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-red-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-700 mb-6 px-2">
                    Live Lending Opportunities
                </h3>

                <motion.div
                    className="flex"
                    animate={{ x: ['0%', '-100%'] }}
                    transition={{
                        duration: loanRequests.length * 4,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {loanRequests.map((request) => (
                        <TickerItem key={request.id} request={request} />
                    ))}
                    {loanRequests.map((request) => (
                        <TickerItem key={`clone-${request.id}`} request={request} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

// Mock function remains the same
const fetchUserDetails = async (uid: string): Promise<User> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ uid, displayName: `User ${uid.slice(0, 5)}` });
        }, 100);
    });
};

export default LoanRequestCarousel;