'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { ToastContainer } from 'react-toastify';
import SummarySection from './SummarySection'; // Corrected the import

// Mock Data
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
  loanPerformance: {
    owned: [
      { week: 'Week 1', amount: 500 },
      { week: 'Week 2', amount: 1000 },
      { week: 'Week 3', amount: 1500 },
      { week: 'Week 4', amount: 1200 },
      { week: 'Week 5', amount: 1700 },
      { week: 'Week 6', amount: 1400 },
      { week: 'Week 7', amount: 1900 },
      { week: 'Week 8', amount: 2200 },
      { week: 'Week 9', amount: 2400 },
      { week: 'Week 10', amount: 2600 },
      { week: 'Week 11', amount: 2800 },
      { week: 'Week 12', amount: 3000 },
    ],
    owed: [
      { week: 'Week 1', amount: 300 },
      { week: 'Week 2', amount: 600 },
      { week: 'Week 3', amount: 900 },
      { week: 'Week 4', amount: 800 },
      { week: 'Week 5', amount: 1100 },
      { week: 'Week 6', amount: 1000 },
      { week: 'Week 7', amount: 1300 },
      { week: 'Week 8', amount: 1600 },
      { week: 'Week 9', amount: 1800 },
      { week: 'Week 10', amount: 2000 },
      { week: 'Week 11', amount: 2200 },
      { week: 'Week 12', amount: 2500 },
    ],
  },
  profits: [
    { week: 'Week 1', profit: 500 },
    { week: 'Week 2', profit: 700 },
    { week: 'Week 3', profit: 650 },
    { week: 'Week 4', profit: 800 },
    { week: 'Week 5', profit: 950 },
    { week: 'Week 6', profit: 900 },
    { week: 'Week 7', profit: 1100 },
    { week: 'Week 8', profit: 1200 },
    { week: 'Week 9', profit: 1300 },
    { week: 'Week 10', profit: 1400 },
    { week: 'Week 11', profit: 1600 },
    { week: 'Week 12', profit: 1800 },
  ],
};

const DashboardTable = (): JSX.Element => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [chartHeight, setChartHeight] = useState(300);

  const totalLoansOwned = mockData.loansOwned.reduce((sum, loan) => sum + loan.amount, 0);
  const totalLoansOwed = mockData.loansOwed.reduce((sum, loan) => sum + loan.amount, 0);
  const netProfit = totalLoansOwned - totalLoansOwed;

  const combinedLoanPerformance = mockData.loanPerformance.owned.map((ownedData, index) => ({
    week: ownedData.week,
    owned: ownedData.amount,
    owed: mockData.loanPerformance.owed[index].amount,
  }));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateChartHeight = () => {
        setChartHeight(window.innerWidth < 768 ? 200 : 300);
      };

      updateChartHeight();
      window.addEventListener('resize', updateChartHeight);
      return () => window.removeEventListener('resize', updateChartHeight);
    }
  }, []);

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
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-15 h-15 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <ToastContainer />
      </div>
    );
  }

  const handlePostNewLoan = () => {
    router.push('/loans/new');
  };

  const handleRequestLoan = () => {
    router.push('/loans/request');
  };

  const { profits } = mockData;

  return (
    <div className="font-sans bg-gray-50 min-h-screen p-5 text-gray-900">
      <ToastContainer />
      <div style={{ padding: '10px', backgroundColor: '#FFEB3B', color: '#000', textAlign: 'center', fontWeight: 'bold' }}>
        Warning: This is mock data to test the dashboard.
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-lg text-gray-600">Overview of your loan activities</p>
        </div>

        {/* Summary Section */}
        <SummarySection />

        {/* Loan Performance Line Charts */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Loan Performance (Last 12 Weeks)</h2>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={combinedLoanPerformance}>
              <defs>
                <linearGradient id="colorOwned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOwed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="owned"
                name="Loans Owned"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#colorOwned)"
                fillOpacity={0.1}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="owed"
                name="Loans Owed"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorOwed)"
                fillOpacity={0.1}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Divider with Shadow */}
        <div className="my-10">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent shadow-inner"></div>
        </div>

        {/* Profits Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Weekly Profits</h2>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={profits}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" name="Profit" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-10">
          <button
            onClick={handlePostNewLoan}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors transform hover:-translate-y-0.5"
          >
            Post New Loan
          </button>
          <button
            onClick={handleRequestLoan}
            className="px-6 py-3 bg-white text-blue-500 border-2 border-blue-500 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-colors transform hover:-translate-y-0.5"
          >
            Request a Loan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardTable;
