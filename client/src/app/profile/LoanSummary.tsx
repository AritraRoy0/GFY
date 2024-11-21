// src/components/LoanSummary.tsx

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { fetchUserLoanRequests } from '../models/LoanRequestAPIs';
import { LoanRequest } from '../models/LoanInterfaces';
import { Timestamp } from "firebase/firestore";

const LoanSummary: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); // For error handling

    // Fetch authenticated user
    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);

    // Fetch loan requests associated with the current user
    useEffect(() => {
        if (currentUser) {
            setLoading(true);
            setError(null); // Reset error state

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

            return () => {
                unsubscribeLoanRequests();
            };
        } else {
            setLoanRequests([]);
            setLoading(false);
        }
    }, [currentUser]);

    /**
     * Type guard to check if an object is a Firestore Timestamp.
     * @param obj - The object to check.
     * @returns True if the object is a Timestamp, else false.
     */
    const isTimestamp = (obj: any): obj is Timestamp => {
        return obj instanceof Timestamp;
    };

    /**
     * Type guard to check if an object is a Date.
     * @param obj - The object to check.
     * @returns True if the object is a Date, else false.
     */
    const isDate = (obj: any): obj is Date => {
        return obj instanceof Date;
    };

    /**
     * Converts a Timestamp | Date | null to a Date object.
     * If the input is null or invalid, returns undefined.
     * @param timestamp - The timestamp to convert.
     * @returns A Date object or undefined.
     */
    const convertToDate = (timestamp: Timestamp | Date | null): Date | undefined => {
        if (isTimestamp(timestamp)) {
            return timestamp.toDate();
        } else if (isDate(timestamp)) {
            return timestamp;
        } else {
            return undefined; // Indicate that the timestamp is not set
        }
    };

    // Debugging: Log loan requests to verify timestamp values
    useEffect(() => {
        console.log("Loan Requests:", loanRequests);
    }, [loanRequests]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) { // Optional: Display error message
        return (
            <div className="text-center mt-8">
                <p className="text-lg text-red-600">{error}</p>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="text-center mt-8">
                <p className="text-lg text-gray-700">Please log in to view your loan requests.</p>
            </div>
        );
    }

    if (loanRequests.length === 0) {
        return (
            <div className="text-center mt-8">
                <p className="text-lg text-gray-700">You have no loan requests.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 bg-blue-50">
            <h2 className="text-3xl font-semibold mb-8 text-center text-teal-800">
                Your Loan Requests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loanRequests.map((request) => {
                    const date = convertToDate(request.timestamp);
                    const formattedDate = date ? date.toLocaleString() : "Timestamp not available";

                    return (
                        <div
                            key={request.id}
                            className="bg-white shadow-lg rounded-lg overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    ${request.principalAmount.toLocaleString()}
                                </h3>
                                <p className="text-gray-600 mb-2">
                                    <span className="font-medium">Interest Rate:</span> {request.interestRate}%
                                </p>
                                <p className="text-gray-600 mb-2">
                                    <span className="font-medium">Term:</span> {request.termWeeks} weeks
                                </p>
                                <p className="text-gray-600 mb-4">
                                    <span className="font-medium">Purpose:</span> {request.purpose}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    <span className="font-medium">Requested On:</span> {formattedDate}
                                </p>
                            </div>
                        </div>
                    )})}
            </div>
        </div>
    );
};

export default LoanSummary;
