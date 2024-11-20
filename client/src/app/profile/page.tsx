"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./../store";
import Link from "next/link";
import Header from "../common/Header";
import Footer from "../common/Footer";

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading profile...</p>
      </div>
    ); // Or a more sophisticated loading indicator
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center bg-gradient-to-b from-indigo-100 to-white p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center">
            {/* Profile Icon */}
            <div className="w-24 h-24 bg-indigo-500 text-white rounded-full mb-4 flex items-center justify-center">
              <span className="text-4xl font-bold">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </span>
            </div>

            {/* Display User Information */}
            <h1 className="text-2xl font-bold text-gray-800">
              {user.username || "User Name"}
            </h1>
            <p className="text-gray-600">{user.email || "user@example.com"}</p>
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
                <span className="font-medium">Email:</span> {user.email || "user@example.com"}
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
                <span className="font-medium">User ID:</span> {user.id || "Placeholder ID"}
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
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;
