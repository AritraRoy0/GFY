'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Adjust the path to your store
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = {
  loansOwned: [
    { id: '1', amount: 3000, interestRate: 5, duration: 12, status: 'active' },
    { id: '2', amount: 5000, interestRate: 7, duration: 8, status: 'completed' },
    { id: '4', amount: 1500, interestRate: 6, duration: 6, status: 'active' },
  ],
  loansOwed: [
    { id: '3', amount: 2000, interestRate: 3, duration: 10, status: 'active' },
    { id: '5', amount: 2500, interestRate: 4, duration: 15, status: 'active' },
  ],
  notifications: [
    'Your loan #1 payment is due in 7 days.',
    'Loan #2 has been completed.',
    'New loan requests available for funding.',
  ],
};

export const DashboardTable = (): JSX.Element => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof user !== 'undefined') {
      if (!user) {
        const timeout = setTimeout(() => {
          router.push('/auth');
        }, 500);
        return () => clearTimeout(timeout);
      } else {
        setLoading(false);
      }
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  const handlePostNewLoan = () => {
    router.push('/loans/new');
  };

  const handleRequestLoan = () => {
    router.push('/loans/request');
  };

  const totalLoansOwned = mockData.loansOwned.reduce((sum, loan) => sum + loan.amount, 0);
  const totalLoansOwed = mockData.loansOwed.reduce((sum, loan) => sum + loan.amount, 0);

  // Sample data for the chart
  const loanPerformanceData = [
    { month: 'Jan', amount: 500 },
    { month: 'Feb', amount: 1000 },
    { month: 'Mar', amount: 1500 },
    { month: 'Apr', amount: 1200 },
    { month: 'May', amount: 1700 },
    { month: 'Jun', amount: 1400 },
    { month: 'Jul', amount: 1900 },
    { month: 'Aug', amount: 2200 },
    { month: 'Sep', amount: 2400 },
    { month: 'Oct', amount: 2600 },
    { month: 'Nov', amount: 2800 },
    { month: 'Dec', amount: 3000 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your loan activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Loans Owned */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12h2V7H9v5z" />
                  <path
                    fillRule="evenodd"
                    d="M2 5a2 2 0 012-2h5.5a2 2 0 011.732 1H16a2 2 0 012 2v6a2 2 0 01-1 1.732V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.268A2 2 0 014 13V7a2 2 0 01-2-2zm2 2v6a2 2 0 001 1.732V17h7v-2.268A2 2 0 0014 13V7H4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-600">Total Loans Owned</p>
                <p className="text-2xl font-semibold text-gray-800">${totalLoansOwned}</p>
              </div>
            </div>
          </div>

          {/* Total Loans Owed */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v6h2v-6a4 4 0 018 0v6h2V8a6 6 0 00-6-6z" />
                  <path d="M2 13h16v2H2v-2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600">Total Loans Owed</p>
                <p className="text-2xl font-semibold text-gray-800">${totalLoansOwed}</p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.257 3.099c.766-1.36 2.68-1.36 3.446 0l5.857 10.417C18.12 14.876 17.184 16 15.857 16H4.143c-1.327 0-2.263-1.124-1.703-2.484L8.257 3.1zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-4a1 1 0 00-.993.883L9 11v2a1 1 0 001.993.117L11 13v-2a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-600">Notifications</p>
                <p className="text-2xl font-semibold text-gray-800">{mockData.notifications.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Performance Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Loan Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={loanPerformanceData}>
              <XAxis dataKey="month" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Loans List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Loans Owned */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Loans Owned</h2>
            {mockData.loansOwned.length > 0 ? (
              <div className="space-y-4">
                {mockData.loansOwned.map((loan) => (
                  <div key={loan.id} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-600">Loan ID: {loan.id}</p>
                        <p className="text-gray-800 font-semibold">${loan.amount}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${loan.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {loan.status}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-600">Interest Rate: {loan.interestRate}%</p>
                      <p className="text-gray-600">Duration: {loan.duration} weeks</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">You have no owned loans.</p>
            )}
          </div>

          {/* Loans Owed */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Loans Owed</h2>
            {mockData.loansOwed.length > 0 ? (
              <div className="space-y-4">
                {mockData.loansOwed.map((loan) => (
                  <div key={loan.id} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-600">Loan ID: {loan.id}</p>
                        <p className="text-gray-800 font-semibold">${loan.amount}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${loan.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {loan.status}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-600">Interest Rate: {loan.interestRate}%</p>
                      <p className="text-gray-600">Duration: {loan.duration} weeks</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">You have no owed loans.</p>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
          {mockData.notifications.length > 0 ? (
            <ul className="space-y-2">
              {mockData.notifications.map((notification, index) => (
                <li key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm flex items-start">
                  <svg className="w-6 h-6 text-yellow-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.766-1.36 2.68-1.36 3.446 0l5.857 10.417C18.12 14.876 17.184 16 15.857 16H4.143c-1.327 0-2.263-1.124-1.703-2.484L8.257 3.1zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-4a1 1 0 00-.993.883L9 11v2a1 1 0 001.993.117L11 13v-2a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-800">{notification}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You have no notifications.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6">
          <button
            onClick={handlePostNewLoan}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300"
          >
            Post New Loan
          </button>
          <button
            onClick={handleRequestLoan}
            className="bg-green-600 text-white px-8 py-3 rounded-lg shadow hover:bg-green-700 transition duration-300"
          >
            Request a Loan
          </button>
        </div>
      </div>
    </div>
  );
};
