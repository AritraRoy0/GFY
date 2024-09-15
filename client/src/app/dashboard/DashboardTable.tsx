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
  Area,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  HomeIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  PlusCircleIcon,
  ArrowUpCircleIcon,
} from '@heroicons/react/24/outline';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is set up

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
    { month: 'Jan', profit: 2000 },
    { month: 'Feb', profit: 2500 },
    { month: 'Mar', profit: 2200 },
    { month: 'Apr', profit: 2700 },
    { month: 'May', profit: 3000 },
    { month: 'Jun', profit: 2800 },
    { month: 'Jul', profit: 3200 },
    { month: 'Aug', profit: 3500 },
    { month: 'Sep', profit: 3300 },
    { month: 'Oct', profit: 3600 },
    { month: 'Nov', profit: 4000 },
    { month: 'Dec', profit: 4200 },
  ],
};

export const DashboardTable = (): JSX.Element => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [chartHeight, setChartHeight] = useState(300);

  // Calculate Net Profit
  const totalLoansOwned = mockData.loansOwned.reduce((sum, loan) => sum + loan.amount, 0);
  const totalLoansOwed = mockData.loansOwed.reduce((sum, loan) => sum + loan.amount, 0);
  const netProfit = totalLoansOwned - totalLoansOwed;

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
      <div className="flex justify-center items-center h-screen relative">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
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

  const { loanPerformance, profits } = mockData;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <ToastContainer />
      <div id="dashboard-content" className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-lg text-gray-500 mt-2">Overview of your loan activities</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Loans Owned */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 text-blue-500 rounded-full">
                <HomeIcon className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Loans Owned</p>
                <p className="text-2xl font-semibold text-gray-800">
                  ${totalLoansOwned.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Total Loans Owed */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 text-green-500 rounded-full">
                <CreditCardIcon className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Loans Owed</p>
                <p className="text-2xl font-semibold text-gray-800">
                  ${totalLoansOwed.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 text-yellow-500 rounded-full">
                <CurrencyDollarIcon className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Net Profit</p>
                <p className="text-2xl font-semibold text-gray-800">
                  ${netProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Performance Line Charts */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Loan Performance (Last 12 Weeks)
          </h2>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={loanPerformance.owned}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                name="Loans Owned"
                stroke="#3b82f6"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="amount"
                data={loanPerformance.owed}
                name="Loans Owed"
                stroke="#10b981"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="amount"
                data={loanPerformance.owed}
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.1}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Profits Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Profits</h2>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={profits}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem' }} />
              <Legend />
              <Bar dataKey="profit" name="Profit" fill="#f59e0b" barSize={30} animationDuration={1500}>
                <animate
                  attributeName="y"
                  attributeType="XML"
                  begin="0s"
                  dur="1.5s"
                  from={chartHeight}
                  to={0}
                  fill="freeze"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6 mb-8">
          <button
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105"
            onClick={handlePostNewLoan}
          >
            <PlusCircleIcon className="h-6 w-6 mr-2" />
            Post New Loan
          </button>
          <button
            className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300 transform hover:scale-105"
            onClick={handleRequestLoan}
          >
            <ArrowUpCircleIcon className="h-6 w-6 mr-2" />
            Request a Loan
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Styles with Tailwind CSS are incorporated directly into the JSX above

export default function Dashboard() {
  return <DashboardTable />;
}
