'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const Header: React.FC = () => {
  // Access Redux state to determine if the user is logged in
  const isLoggedIn = useSelector((state: any) => state.auth.user) ? true : false;

  // Logged-in content for the header
  const loggedInHeader = (
    <div className="space-x-4">
      <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">
        Dashboard
      </Link>
      <Link href="/profile" className="text-gray-600 hover:text-indigo-600">
        Profile
      </Link>
      <Link href="/logout" className="text-gray-600 hover:text-indigo-600">
        Logout
      </Link>
    </div>
  );

  // Logged-out content for the header
  const loggedOutHeader = (
    <div className="space-x-4">
      <Link href="/auth?tab=login" className="text-gray-600 hover:text-indigo-600">
        Login
      </Link>
      <Link href="/auth?tab=signup" className="text-gray-600 hover:text-indigo-600">
        Sign Up
      </Link>
    </div>
  );

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <div>
          <Link href="/">
            <span className="text-xl font-bold text-indigo-600 cursor-pointer">
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
