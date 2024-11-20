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
  // Changed state types from number | "" to string
  const [principalAmount, setPrincipalAmount] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [termWeeks, setTermWeeks] = useState<string>("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Parse the string inputs to numbers for validation
    const principal = parseFloat(principalAmount);
    const interest = parseFloat(interestRate);
    const term = parseFloat(termWeeks);

    if (!principalAmount || isNaN(principal) || principal <= 0) {
      newErrors.principalAmount = "Please enter a valid principal amount.";
    }
    if (!interestRate || isNaN(interest) || interest <= 0) {
      newErrors.interestRate = "Please enter a valid interest rate.";
    }
    if (!termWeeks || isNaN(term) || term <= 0) {
      newErrors.termWeeks = "Please enter a valid term in weeks.";
    }
    if (!purpose.trim()) {
      newErrors.purpose = "Please provide a purpose for the loan.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please log in to submit a loan request.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const newLoanRequest: LoanRequest = {
      id: "",
      borrowedBy: currentUser.uid,
      // Convert strings to numbers
      principalAmount: parseFloat(principalAmount),
      interestRate: parseFloat(interestRate),
      termWeeks: parseFloat(termWeeks),
      purpose,
      timestamp: new Date(),
    };

    try {
      await uploadLoanRequest(newLoanRequest);
      // Reset form fields
      setPrincipalAmount("");
      setInterestRate("");
      setTermWeeks("");
      setPurpose("");
      setErrors({});
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container px-6 py-12 mx-auto">
          <section className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-md">
            <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
              Submit a New Loan Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="principalAmount"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Principal Amount
                  </label>
                  <input
                    type="number"
                    id="principalAmount"
                    value={principalAmount}
                    onChange={(e) => setPrincipalAmount(e.target.value)}
                    placeholder="Enter principal amount"
                    className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.principalAmount
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.principalAmount && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.principalAmount}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="interestRate"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    id="interestRate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="Enter interest rate"
                    className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.interestRate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.interestRate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.interestRate}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="termWeeks"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Term (Weeks)
                  </label>
                  <input
                    type="number"
                    id="termWeeks"
                    value={termWeeks}
                    onChange={(e) => setTermWeeks(e.target.value)}
                    placeholder="Enter term in weeks"
                    className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.termWeeks ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.termWeeks && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.termWeeks}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="purpose"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Purpose
                  </label>
                  <textarea
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Describe the purpose of the loan"
                    className={`block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:ring-blue-500 focus:border-blue-500 h-28 ${
                      errors.purpose ? "border-red-500" : "border-gray-300"
                    }`}
                  ></textarea>
                  {errors.purpose && (
                    <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !currentUser}
                className={`w-full px-6 py-3 text-white font-semibold rounded-md transition-colors duration-300 ${
                  loading || !currentUser
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
              {!currentUser && (
                <p className="mt-4 text-sm font-medium text-center text-red-600">
                  Please log in to submit a loan request.
                </p>
              )}
            </form>
          </section>

          <section className="max-w-6xl px-4 mx-auto mt-12">
            <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
              Existing Loan Requests
            </h2>
            {loanRequests.length === 0 ? (
              <p className="text-center text-gray-600">
                No loan requests found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full overflow-hidden bg-white rounded-lg shadow-md">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">
                        Borrowed By
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">
                        Principal Amount
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">
                        Interest Rate (%)
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">
                        Term (Weeks)
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">
                        Purpose
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loanRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800">
                          {request.borrowedBy}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          ${request.principalAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {request.interestRate}%
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {request.termWeeks}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {request.purpose}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
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
