"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import { fetchBorrowedLoans, fetchLentLoans } from "../models/LoanAPIs";
import { Loan } from "../models/LoanInterfaces";
import { calculateWeeklyAveragedInstallment } from "../models/LoanInterfaces";
import Link from "next/link";

interface LendeeProfileData {
  id: string;
  name: string;
  email: string;
  username: string;
  memberSince?: string;
  lastActive?: string;
}

const OtherLendeeProfile: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [lendeeData, setLendeeData] = useState<LendeeProfileData | null>(null);
  const [borrowedLoans, setBorrowedLoans] = useState<Loan[]>([]);
  const [lentLoans, setLentLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'loans'>('overview');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchLendeeData = async () => {
      try {
        const docRef = doc(firestore, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<LendeeProfileData, "id">;
          setLendeeData({ id, ...data });
        } else {
          console.error("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching lendee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLendeeData();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const unsubscribeBorrowed = fetchBorrowedLoans(id, setBorrowedLoans);
    const unsubscribeLent = fetchLentLoans(id, setLentLoans);
    return () => {
      unsubscribeBorrowed();
      unsubscribeLent();
    };
  }, [id]);

  const calculateTotalBorrowed = () => {
    return borrowedLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
  };

  const calculateTotalLent = () => {
    return lentLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
  };

  const calculateTotalWeeklyPayments = () => {
    return borrowedLoans.reduce((sum, loan) => {
      return sum + calculateWeeklyAveragedInstallment(
        loan.principalAmount,
        loan.interestRate,
        loan.termWeeks
      );
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!lendeeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Profile Not Found</h2>
          <p className="text-gray-600">The requested profile could not be found.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl text-white p-8 mb-12"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center text-5xl font-bold">
                  {lendeeData.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 border-4 border-indigo-600">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{lendeeData.name}</h1>
                <p className="text-lg opacity-90 mb-4">@{lendeeData.username}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/10 rounded-lg px-4 py-2">
                    <p className="text-sm opacity-75">Member Since</p>
                    <p className="font-semibold">{lendeeData.memberSince?.split('T')[0] || 'N/A'}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg px-4 py-2">
                    <p className="text-sm opacity-75">Last Active</p>
                    <p className="font-semibold">{lendeeData.lastActive?.split('T')[0] || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('loans')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'loans'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Loans
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Loan Statistics Cards */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Borrowed</p>
                      <p className="text-2xl font-bold text-gray-800">${calculateTotalBorrowed().toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Lent</p>
                      <p className="text-2xl font-bold text-gray-800">${calculateTotalLent().toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weekly Payments</p>
                      <p className="text-2xl font-bold text-gray-800">${calculateTotalWeeklyPayments().toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2 lg:col-span-3">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{lendeeData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-medium text-gray-800">@{lendeeData.username}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="loans"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Borrowed Loans Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Borrowing History</h3>
                  {borrowedLoans.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">No loans borrowed yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {borrowedLoans.map((loan) => (
                        <div key={loan.id} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all bg-gray-50">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-semibold text-gray-800">${loan.principalAmount}</span>
                                <span className="text-sm text-gray-500">at {loan.interestRate}% interest</span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{loan.termWeeks} weeks term</span>
                                <span>•</span>
                                <span>{loan.paymentsMade.length} payments made</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Weekly Payment</p>
                                <p className="font-semibold text-gray-800">
                                  ${calculateWeeklyAveragedInstallment(
                                    loan.principalAmount,
                                    loan.interestRate,
                                    loan.termWeeks
                                  ).toFixed(2)}
                                </p>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                loan.paymentsMade.length === loan.termWeeks
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {loan.paymentsMade.length === loan.termWeeks ? 'Completed' : 'In Progress'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lent Loans Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Lending History</h3>
                  {lentLoans.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">No loans lent yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lentLoans.map((loan) => (
                        <div key={loan.id} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all bg-gray-50">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-semibold text-gray-800">${loan.principalAmount}</span>
                                <span className="text-sm text-gray-500">at {loan.interestRate}% interest</span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{loan.termWeeks} weeks term</span>
                                <span>•</span>
                                <span>{loan.paymentsMade.length} payments received</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Weekly Payment</p>
                                <p className="font-semibold text-gray-800">
                                  ${calculateWeeklyAveragedInstallment(
                                    loan.principalAmount,
                                    loan.interestRate,
                                    loan.termWeeks
                                  ).toFixed(2)}
                                </p>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                loan.paymentsMade.length === loan.termWeeks
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {loan.paymentsMade.length === loan.termWeeks ? 'Completed' : 'In Progress'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OtherLendeeProfile;
