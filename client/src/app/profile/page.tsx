// src/components/ProfilePage.tsx

"use client";

import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import Header from "../common/Header";
import Footer from "../common/Footer";
import LoanSummary from "./LoanSummary"; // Ensure the correct import path

const ProfilePage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch authenticated user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Update loading state after auth state is determined
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
    );
  }

  if (!currentUser) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <p className="text-gray-700 text-lg">
            Please log in to view your profile.
          </p>
        </div>
    );
  }

  return (
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow bg-gradient-to-b from-indigo-100 to-white p-6">
          <div className="max-w-4xl mx-auto">
            {/* Profile Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <div className="flex items-center">
                {/* Profile Icon */}
                <div className="w-24 h-24 bg-indigo-500 text-white rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold">
                  {currentUser.displayName
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : "U"}
                </span>
                </div>

                {/* Display User Information */}
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {currentUser.displayName || "User Name"}
                  </h1>
                  <p className="text-gray-600">
                    {currentUser.email || "user@example.com"}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center">
                    {/* Email Icon */}
                    <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                      <path d="M2.003 5.884L10 12l-7.997 6.116A1 1 0 012 17.116V6.884a1 1 0 01.003-.001zM12 12l7.997 6.116A1 1 0 0022 17.116V6.884a1 1 0 00-.003-.001L12 12z" />
                    </svg>
                  </div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-medium">Email:</span>{" "}
                    {currentUser.email || "user@example.com"}
                  </p>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center">
                    {/* User ID Icon */}
                    <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                      <path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm8-6a6 6 0 100 12A6 6 0 0010 4z" />
                    </svg>
                  </div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-medium">User ID:</span>{" "}
                    {currentUser.uid || "Placeholder ID"}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-8">
                <Link
                    href="/logout"
                    className="w-full inline-block text-center px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
                >
                  Logout
                </Link>
              </div>
            </div>

            {/* Loan Summary Section */}
            <LoanSummary />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
  );
};

export default ProfilePage;
