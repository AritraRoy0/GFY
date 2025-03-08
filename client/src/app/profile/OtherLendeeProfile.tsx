"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { motion } from "framer-motion";
import Link from "next/link";

interface LendeeProfileData {
  id: string;
  name: string;
  email: string;
  // additional fields (e.g., credit rating, loan history) can be added here
}

const OtherLendeeProfile: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // expects a lendee id from the URL
  const [lendeeData, setLendeeData] = useState<LendeeProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      // Replace with a real API call as needed. Here we simulate with dummy data.
      const fetchLendeeData = async () => {
        const data: LendeeProfileData = {
          id: id as string,
          name: "Lendee Name",
          email: "lendee@example.com",
        };
        setLendeeData(data);
        setLoading(false);
      };
      fetchLendeeData();
    }
  }, [id]);

  if (loading || !lendeeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Lendee Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl text-white p-8 mb-12"
          >
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-4xl font-bold">
                {lendeeData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{lendeeData.name}</h1>
                <p className="text-lg opacity-90">Borrower Profile</p>
              </div>
            </div>
          </motion.div>

          {/* Lendee Public Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Borrower Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  {/* Email Icon */}
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{lendeeData.email}</p>
                </div>
              </div>
              {/* Additional borrower info (e.g., credit rating, loan history) can be added here */}
            </div>
          </div>

          {/* Actions for interacting with borrower */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Actions</h3>
            <div className="space-y-4">
              <Link
                href={`/message?to=${lendeeData.id}`}
                className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="p-3 bg-blue-100 rounded-lg">
                  {/* Message Icon */}
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Send Message</p>
                  <p className="text-sm text-gray-500">Contact this borrower</p>
                </div>
              </Link>
              <Link
                href="/loanRequests"
                className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="p-3 bg-green-100 rounded-lg">
                  {/* Invest Icon */}
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Invest</p>
                  <p className="text-sm text-gray-500">View loan details and invest</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OtherLendeeProfile;
