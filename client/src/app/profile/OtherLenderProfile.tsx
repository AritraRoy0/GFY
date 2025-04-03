"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import { fetchLentLoans } from "../models/LoanAPIs";
import { Loan } from "../models/LoanInterfaces";
import { calculateWeeklyAveragedInstallment } from "../models/LoanInterfaces";

interface LenderProfileData {
  id: string;
  name: string;
  email: string;
  rating: number;
  memberSince?: string;
  lastActive?: string;
  totalLent?: number;
  completedLoans?: number;
  activeLoans?: number;
}

const OtherLenderProfile: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [lenderData, setLenderData] = useState<LenderProfileData | null>(null);
  const [lentLoans, setLentLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'loans'>('overview');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchLenderData = async () => {
      try {
        const docRef = doc(firestore, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<LenderProfileData, "id">;
          setLenderData({ id, ...data });
        } else {
          console.error("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching lender data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLenderData();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = fetchLentLoans(id, setLentLoans);
    return () => unsubscribe();
  }, [id]);

  const calculateTotalLent = () => {
    return lentLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
  };

  const calculateCompletedLoans = () => {
    return lentLoans.filter(loan => loan.paymentsMade.length === loan.termWeeks).length;
  };

  const calculateActiveLoans = () => {
    return lentLoans.filter(loan => loan.paymentsMade.length < loan.termWeeks).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!lenderData) {
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
            className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-xl text-white p-8 mb-12"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center text-5xl font-bold">
                  {lenderData.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 border-4 border-green-600">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{lenderData.name}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(lenderData.rating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg opacity-90">({(lenderData.rating || 0).toFixed(1)})</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/10 rounded-lg px-4 py-2">
                    <p className="text-sm opacity-75">Member Since</p>
                    <p className="font-semibold">{lenderData.memberSince?.split('T')[0] || 'N/A'}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg px-4 py-2">
                    <p className="text-sm opacity-75">Last Active</p>
                    <p className="font-semibold">{lenderData.lastActive?.split('T')[0] || 'N/A'}</p>
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
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('loans')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'loans'
                  ? 'bg-green-600 text-white'
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
                {/* Lender Statistics Cards */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount Lent</p>
                      <p className="text-2xl font-bold text-gray-800">${calculateTotalLent().toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completed Loans</p>
                      <p className="text-2xl font-bold text-gray-800">{calculateCompletedLoans()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Active Loans</p>
                      <p className="text-2xl font-bold text-gray-800">{calculateActiveLoans()}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2 lg:col-span-3">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{lenderData.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2 lg:col-span-3">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href={`/message?to=${lenderData.id}`}
                      className="flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Send Message</p>
                        <p className="text-sm text-gray-500">Contact this lender</p>
                      </div>
                    </Link>
                    <Link
                      href={`/loanRequests?lenderId=${lenderData.id}`}
                      className="flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Request Loan</p>
                        <p className="text-sm text-gray-500">Initiate a loan request</p>
                      </div>
                    </Link>
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
                {/* Lending History */}
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

export default OtherLenderProfile;
