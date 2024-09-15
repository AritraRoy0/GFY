'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';  // Adjust the path to your store

const mockLoans = {
  loansOwned: [
    { id: '1', amount: 300, interestRate: 5, duration: 12, status: 'active' },
    { id: '2', amount: 500, interestRate: 7, duration: 8, status: 'completed' },
  ],
  loansOwed: [
    { id: '3', amount: 200, interestRate: 3, duration: 10, status: 'active' },
  ],
  notifications: [
    'Your loan #1 payment is due in 7 days.',
    'Loan #2 has been completed.',
  ],
};

const Dashboard = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add a safeguard to wait for the user state to be defined before redirecting
    if (typeof user !== 'undefined') {
      if (!user) {
        // Redirect to auth page if no user is found
        const timeout = setTimeout(() => {
          router.push('/auth');
        }, 500);
        return () => clearTimeout(timeout);
      } else {
        setLoading(false);
      }
    }
  }, [user, router]);

  // If still loading, show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  const handlePostNewLoan = () => {
    router.push('/loans/new');
  };

  const handleRequestLoan = () => {
    router.push('/loans/request');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto fade-in">

        {/* User Profile Section */}
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Loan Overview Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Loans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Loans Owned */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-600">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Loans Owned</h3>
              {mockLoans.loansOwned.length > 0 ? (
                <div>
                  {mockLoans.loansOwned.map((loan) => (
                    <div key={loan.id} className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <p><strong>Amount:</strong> ${loan.amount}</p>
                      <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
                      <p><strong>Duration:</strong> {loan.duration} weeks</p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className={`font-semibold ${loan.status === 'active' ? 'text-green-700' : 'text-gray-700'}`}>
                          {loan.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">You have no owned loans.</p>
              )}
            </div>

            {/* Loans Owed */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Loans Owed</h3>
              {mockLoans.loansOwed.length > 0 ? (
                <div>
                  {mockLoans.loansOwed.map((loan) => (
                    <div key={loan.id} className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <p><strong>Amount:</strong> ${loan.amount}</p>
                      <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
                      <p><strong>Duration:</strong> {loan.duration} weeks</p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className={`font-semibold ${loan.status === 'active' ? 'text-green-700' : 'text-gray-700'}`}>
                          {loan.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">You have no owed loans.</p>
              )}
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-8 fade-in">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Notifications</h2>
          <ul>
            {mockLoans.notifications.length > 0 ? (
              mockLoans.notifications.map((notification, index) => (
                <li key={index} className="flex items-center bg-yellow-100 p-3 mb-2 rounded-lg shadow-md">
                  <svg className="w-6 h-6 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.766-1.36 2.68-1.36 3.446 0l5.857 10.417C18.12 14.876 17.184 16 15.857 16H4.143c-1.327 0-2.263-1.124-1.703-2.484L8.257 3.1zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-4a1 1 0 00-.993.883L9 11v2a1 1 0 001.993.117L11 13v-2a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{notification}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-600">You have no notifications.</p>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button onClick={handlePostNewLoan} className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition duration-300">
            Post New Loan
          </button>
          <button onClick={handleRequestLoan} className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition duration-300">
            Request a Loan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
