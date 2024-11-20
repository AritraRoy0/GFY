"use client";

import React, { useState, useEffect } from "react";
import {
  uploadLoanRequest,
  fetchLoanRequests,
} from "../models/LoanRequestAPIs";
import { LoanRequest } from "../models/LoanInterfaces";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Header from "../common/Header";
import Footer from "../common/Footer";

const LoanRequestForm: React.FC = () => {
  const [principalAmount, setPrincipalAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [termWeeks, setTermWeeks] = useState<number>(0);
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch authenticated user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch existing loan requests
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  useEffect(() => {
    const unsubscribe = fetchLoanRequests((requests) => {
      setLoanRequests(requests);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!currentUser) {
      alert("Please log in to submit a loan request.");
      setLoading(false);
      return;
    }

    const newLoanRequest: LoanRequest = {
      id: "",
      borrowedBy: currentUser.uid,
      principalAmount,
      interestRate,
      termWeeks,
      purpose,
      timestamp: new Date(),
    };

    try {
      await uploadLoanRequest(newLoanRequest);
      // Reset form fields
      setPrincipalAmount(0);
      setInterestRate(0);
      setTermWeeks(0);
      setPurpose("");
    } catch (error) {
      console.error("Error submitting loan request:", error);
      alert(
        "There was an error submitting your loan request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <section className="bg-white shadow-lg rounded-lg p-8 mb-12">
            <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
              Submit a New Loan Request
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-8 max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <label
                    htmlFor="principalAmount"
                    className="mb-2 font-semibold text-gray-700"
                  >
                    Principal Amount
                  </label>
                  <input
                    type="number"
                    id="principalAmount"
                    value={principalAmount}
                    onChange={(e) =>
                      setPrincipalAmount(Number(e.target.value))
                    }
                    required
                    placeholder="Enter principal amount"
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="interestRate"
                    className="mb-2 font-semibold text-gray-700"
                  >
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    id="interestRate"
                    value={interestRate}
                    onChange={(e) =>
                      setInterestRate(Number(e.target.value))
                    }
                    required
                    placeholder="Enter interest rate"
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <label
                    htmlFor="termWeeks"
                    className="mb-2 font-semibold text-gray-700"
                  >
                    Term (Weeks)
                  </label>
                  <input
                    type="number"
                    id="termWeeks"
                    value={termWeeks}
                    onChange={(e) => setTermWeeks(Number(e.target.value))}
                    required
                    placeholder="Enter term in weeks"
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="purpose"
                    className="mb-2 font-semibold text-gray-700"
                  >
                    Purpose
                  </label>
                  <textarea
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                    placeholder="Describe the purpose of the loan"
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none bg-white text-gray-800"
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !currentUser}
                className={`w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-lg transition duration-300 ${
                  loading || !currentUser
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
              {!currentUser && (
                <p className="text-red-600 mt-4 text-center font-medium">
                  Please log in to submit a loan request.
                </p>
              )}
            </form>
          </section>

          <section>
            <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
              Existing Loan Requests
            </h2>
            {loanRequests.length === 0 ? (
              <p className="text-center text-gray-600">
                No loan requests found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Borrowed By
                      </th>
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
                          {request.borrowedBy}
                        </td>
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
                          {request.timestamp.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoanRequestForm;
