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
    return <div>Loading loan requests...</div>;
  }

  if (!currentUser) {
    return <div>Please log in to view your loan requests.</div>;
  }

  if (loanRequests.length === 0) {
    return <div>You have no loan requests.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        Your Loan Requests
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Principal Amount
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Interest Rate (%)
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Term (Weeks)
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Purpose
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loanRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  ${request.principalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {request.interestRate}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {request.termWeeks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {request.purpose}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {new Date(request.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanSummary;
