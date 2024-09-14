import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <div>
          <Link href="/">
            <span className="text-xl font-bold text-indigo-600 cursor-pointer">Go Fund Yourself!!</span>
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/auth?tab=login" className="text-gray-600 hover:text-indigo-600">
            Login
          </Link>
          <Link href="/auth?tab=signup" className="text-gray-600 hover:text-indigo-600">
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
