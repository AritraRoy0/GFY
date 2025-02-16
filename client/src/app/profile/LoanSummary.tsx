import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { fetchUserLoanRequests } from '../models/LoanRequestAPIs';
import { LoanRequest } from '../models/LoanInterfaces';
import { Timestamp } from "firebase/firestore";
import { motion } from 'framer-motion';

const LoanSummary: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (currentUser) {
            setLoading(true);
            setError(null);

            const unsubscribeLoanRequests = fetchUserLoanRequests(
                currentUser.uid,
                (userLoanRequests) => {
                    setLoanRequests(userLoanRequests);
                    setLoading(false);
                },
                (err) => {
                    setError("Failed to load loan requests. Please try again later.");
                    setLoading(false);
                }
            );
            return () => unsubscribeLoanRequests();
        } else {
            setLoanRequests([]);
            setLoading(false);
        }
    }, [currentUser]);

    const isTimestamp = (obj: any): obj is Timestamp => obj instanceof Timestamp;
    const isDate = (obj: any): obj is Date => obj instanceof Date;

    const convertToDate = (timestamp: Timestamp | Date | null): Date | undefined => {
        if (isTimestamp(timestamp)) return timestamp.toDate();
        if (isDate(timestamp)) return timestamp;
        return undefined;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 space-x-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white rounded-xl p-6 w-80 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-red-50 rounded-xl max-w-2xl mx-auto">
                <div className="inline-flex items-center text-red-600 space-x-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-lg font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="text-center p-8 bg-blue-50 rounded-xl max-w-2xl mx-auto">
                <p className="text-lg text-blue-600 font-medium">🔒 Please log in to view your loan requests</p>
            </div>
        );
    }

    if (loanRequests.length === 0) {
        return (
            <div className="text-center p-8 bg-indigo-50 rounded-xl max-w-2xl mx-auto">
                <p className="text-lg text-indigo-600 font-medium">📭 No active loan requests found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Loan Portfolio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {loanRequests.map((request, index) => {
                    const date = convertToDate(request.timestamp);
                    const formattedDate = date ? date.toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                    }) : "Date not available";

                    return (
                        <motion.div
                            key={request.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
                        >
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        ${request.principalAmount.toLocaleString()}
                                    </h3>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                        {request.termWeeks} weeks
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        <span className="text-gray-600">{request.interestRate}% Interest Rate</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-gray-600">{request.purpose}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Requested {formattedDate}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default LoanSummary;