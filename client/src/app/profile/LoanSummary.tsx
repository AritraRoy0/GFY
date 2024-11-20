import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { fetchUserLoanRequests } from '../models/LoanRequestAPIs';
import { LoanRequest } from '../models/LoanInterfaces';

const LoanSummary: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      const unsubscribeLoanRequests = fetchUserLoanRequests(currentUser.uid, (userLoanRequests) => {
        setLoanRequests(userLoanRequests);
        setLoading(false);
      });

      return () => {
        unsubscribeLoanRequests();
      };
    } else {
      setLoanRequests([]);
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
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
        {loanRequests.map((request) => (
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
                {new Date(request.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanSummary;
