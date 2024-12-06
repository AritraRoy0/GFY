// src/components/LoanRequestCarousel.tsx
"use client";

import React, { useState, useEffect } from "react";
import { fetchLoanRequests } from "../models/LoanRequestAPIs";
import { LoanRequest } from "../models/LoanInterfaces";

interface User {
    uid: string;
    displayName?: string;
    email?: string;
}

// Mock function to fetch user details by UID
const fetchUserDetails = async (uid: string): Promise<User> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ uid, displayName: `User ${uid.slice(0, 5)}` });
        }, 100);
    });
};

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
        return () => {
            unsubscribe();
        };
    }, []);

    // Fetch user details whenever loanRequests change
    useEffect(() => {
        const fetchAllUserDetails = async () => {
            const uniqueUids = Array.from(
                new Set(loanRequests.map((req) => req.borrowedBy))
            );
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

        if (loanRequests.length > 0) {
            fetchAllUserDetails();
        }
    }, [loanRequests]);

    // Function to calculate profits
    const calculateProfits = (
        principal: number,
        interestRate: number
    ): number => {
        return (principal * interestRate) / 100;
    };

    // Prepare the ticker content by mapping over loan requests
    const tickerContent = loanRequests
        .map((request) => {
            const profits = calculateProfits(
                request.principalAmount,
                request.interestRate
            );
            return (
                <div
                    key={request.id}
                    className="inline-block mx-2 bg-white rounded-md shadow-md p-4 min-w-[180px] border border-gray-200"
                >
                    <div className="grid grid-cols-2 gap-2">
                        {/* Principal */}
                        <div className="flex flex-col">
                            <span className="text-gray-700 text-sm font-medium">Principal</span>
                            <span className="text-green-600 text-sm">
                ${request.principalAmount.toLocaleString()}
              </span>
                        </div>
                        {/* Interest */}
                        <div className="flex flex-col">
                            <span className="text-gray-700 text-sm font-medium">Interest</span>
                            <span className="text-blue-600 text-sm">
                {request.interestRate}%
              </span>
                        </div>
                        {/* Term */}
                        <div className="flex flex-col">
                            <span className="text-gray-700 text-sm font-medium">Term</span>
                            <span className="text-purple-600 text-sm">
                {request.termWeeks} wks
              </span>
                        </div>
                        {/* Profits */}
                        <div className="flex flex-col">
                            <span className="text-gray-700 text-sm font-medium">Profits</span>
                            <span className="text-green-700 text-sm">
                ${profits.toLocaleString()}
              </span>
                        </div>
                    </div>
                </div>
            );
        })
        .reduce(
            (acc, curr, idx, arr) =>
                idx < arr.length - 1
                    ? acc.concat(
                        curr,
                        <span
                            key={`sep-${idx}`}
                            className="mx-1 text-gray-400 select-none"
                            aria-hidden="true"
                        >
                •
              </span>
                    )
                    : acc.concat(curr),
            [] as React.ReactNode[]
        );

    if (loading) {
        return (
            <div className="w-full bg-gray-100 text-gray-600 font-sans overflow-hidden py-4">
                <div className="relative">
                    <div
                        className="whitespace-nowrap text-xs md:text-sm animate-scroll"
                        style={{ animationDuration: `15s` }}
                    >
                        <span className="mr-6 opacity-80">Loading loan requests...</span>
                        <span className="mr-6 opacity-80">Loading loan requests...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-gray-100 text-red-500 font-sans overflow-hidden py-4">
                <div className="relative px-2">
                    <div className="whitespace-nowrap text-xs md:text-sm">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-100 text-gray-800 font-sans overflow-hidden py-4">
            <div className="relative">
                <div
                    className="whitespace-nowrap flex items-center animate-scroll hover:animate-paused transition-all duration-300"
                    style={{ animationDuration: `${loanRequests.length * 1.5 || 15}s` }}
                    aria-label="Loan Requests Ticker with Profits"
                >
                    {tickerContent}
                    {/* Duplicate content for seamless scrolling */}
                    {tickerContent}
                </div>
            </div>
        </div>
    );
};

export default LoanRequestCarousel;
