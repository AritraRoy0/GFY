// src/components/LoanRequestCarousel.tsx
"use client";

import React, { useState, useEffect } from "react";
import { fetchLoanRequests } from "../models/LoanRequestAPIs";
import { LoanRequest } from "../models/LoanInterfaces";
import { format } from "date-fns";

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
    const unsubscribe = fetchLoanRequests(
      (requests) => {
        setLoanRequests(requests);
        setLoading(false);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch user details whenever loanRequests change
  useEffect(() => {
    const fetchAllUserDetails = async () => {
      const uniqueUids = Array.from(new Set(loanRequests.map(req => req.borrowedBy)));
      const userPromises = uniqueUids.map(uid => fetchUserDetails(uid));
      try {
        const users = await Promise.all(userPromises);
        const newUserMap: { [uid: string]: string } = {};
        users.forEach(user => {
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

  // Prepare the ticker content by mapping over loan requests
  const tickerContent = loanRequests
    .map((request) => {
      return (
        <div key={request.id} className="inline-block flex-horizontal mx-4">

          <div className="flex items-center space-x-2">
            <span className="font-semibold">Principal:</span>
            <span className="text-green-300">${request.principalAmount.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Interest:</span>
            <span className="text-blue-300">{request.interestRate}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Term:</span>
            <span className="text-purple-300">{request.termWeeks} weeks</span>
          </div>

        </div>
      );
    })
    .reduce((acc, curr) => acc.concat(curr, <span key={Math.random()} className="mx-4">|</span>), [] as React.ReactNode[])
    .slice(0, -1); // Remove the last separator

  if (loading) {
    return (
      <div className="w-full bg-gray-800 text-green-400 font-sans overflow-hidden py-4">
        <div className="relative">
          <div className="whitespace-nowrap text-base md:text-lg animate-scroll" style={{ animationDuration: `20s` }}>
            <span className="mr-8">Loading loan requests...</span>
            {/* Duplicate content for seamless scrolling */}
            <span className="mr-8">Loading loan requests...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gray-800 text-red-500 font-sans overflow-hidden py-4">
        <div className="relative">
          <div className="whitespace-nowrap text-base md:text-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white font-sans overflow-hidden py-4">
      <div className="relative">
        <div
          className="whitespace-nowrap flex items-center animate-scroll hover:animate-paused transition-all duration-300"
          style={{ animationDuration: `${loanRequests.length * 2 || 20}s` }}
          aria-label="Loan Requests Ticker"
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
