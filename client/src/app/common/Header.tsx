'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const Header: React.FC = () => {
  // Access Redux state to determine if the user is logged in
  const isLoggedIn = useSelector((state: any) => state.auth.user) ? true : false;

  // Logged-in content for the header
  const loggedInHeader = (
    <div className="space-x-6 flex items-center">
      <Link href="/dashboard">
        <span className="px-4 py-2 rounded-md text-gray-700 hover:text-white hover:bg-indigo-600 transition duration-300 cursor-pointer">
          Dashboard
        </span>
      </Link>
      <Link href="/profile">
        <span className="px-4 py-2 rounded-md text-gray-700 hover:text-white hover:bg-indigo-600 transition duration-300 cursor-pointer">
          Profile
        </span>
      </Link>
      <Link href="/logout">
        <span className="px-4 py-2 rounded-md text-gray-700 hover:text-white hover:bg-red-500 transition duration-300 cursor-pointer">
          Logout
        </span>
      </Link>
    </div>
  );

  // Logged-out content for the header
  const loggedOutHeader = (
    <div className="space-x-6 flex items-center">
      <Link href="/auth?tab=login">
        <span className="px-4 py-2 rounded-md text-gray-700 hover:text-white hover:bg-indigo-600 transition duration-300 cursor-pointer">
          Login
        </span>
      </Link>
      <Link href="/auth?tab=signup">
        <span className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 cursor-pointer">
          Sign Up
        </span>
      </Link>
    </div>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <div>
          <Link href="/">
            <span className="text-2xl font-extrabold text-indigo-600 cursor-pointer hover:text-indigo-700 transition duration-300">
              Go Fund Yourself!!
            </span>
          </Link>
        </div>
        {/* Conditionally render the header based on the user's login status */}
        {isLoggedIn ? loggedInHeader : loggedOutHeader}
      </nav>
    </header>
  );
};

export default Header;
