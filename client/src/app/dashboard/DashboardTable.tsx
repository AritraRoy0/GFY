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
import styles from './DashboardTable.module.css'; // Import the CSS module

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

const DashboardTableComponent = (): JSX.Element => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [chartHeight, setChartHeight] = useState(300);

  // Calculate Net Profit
  const totalLoansOwned = mockData.loansOwned.reduce((sum, loan) => sum + loan.amount, 0);
  const totalLoansOwed = mockData.loansOwed.reduce((sum, loan) => sum + loan.amount, 0);
  const netProfit = totalLoansOwned - totalLoansOwed;

  // Combine loan performance data
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
      <div className={styles.centerScreen}>
        <div className={styles.spinner}></div>
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
    <div className={styles.container}>
      <ToastContainer />
      <div id="dashboard-content" className={styles.innerContainer}>
        {/* Header Section */}
        <div className={styles.section}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subTitle}>Overview of your loan activities</p>
        </div>

        {/* Cards Grid */}
        <div className={styles.grid}>
          {/* Total Loans Owned */}
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.iconWrapperBlue}>
                <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12h2V7H9v5z" />
                  <path
                    fillRule="evenodd"
                    d="M2 5a2 2 0 012-2h5.5a2 2 0 011.732 1H16a2 2 0 012 2v6a2 2 0 01-1 1.732V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.268A2 2 0 014 13V7a2 2 0 01-2-2zm2 2v6a2 2 0 001 1.732V17h7v-2.268A2 2 0 0014 13V7H4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className={styles.textGray}>Total Loans Owned</p>
                <p className={styles.amount}>${totalLoansOwned.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Total Loans Owed */}
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.iconWrapperGreen}>
                <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v6h2v-6a4 4 0 018 0v6h2V8a6 6 0 00-6-6z" />
                  <path d="M2 13h16v2H2v-2z" />
                </svg>
              </div>
              <div>
                <p className={styles.textGray}>Total Loans Owed</p>
                <p className={styles.amount}>${totalLoansOwed.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Net Profit */}
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.iconWrapperYellow}>
                <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.257 3.099c.766-1.36 2.68-1.36 3.446 0l5.857 10.417C18.12 14.876 17.184 16 15.857 16H4.143c-1.327 0-2.263-1.124-1.703-2.484L8.257 3.1zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-4a1 1 0 00-.993.883L9 11v2a1 1 0 001.993.117L11 13v-2a1 1 0 00-1-1z" />
                </svg>
              </div>
              <div>
                <p className={styles.textGray}>Net Profit</p>
                <p className={styles.amount}>${netProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Performance Line Charts */}
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Loan Performance (Last 12 Weeks)</h2>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={combinedLoanPerformance}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="week" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="owned"
                name="Loans Owned"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="#3B82F6"
                fillOpacity={0.1}
              />
              <Line
                type="monotone"
                dataKey="owed"
                name="Loans Owed"
                stroke="#10B981"
                strokeWidth={2}
                fill="#10B981"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="owed"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.1}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Profits Bar Chart */}
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Monthly Profits</h2>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={profits}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="month" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" name="Profit" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={handlePostNewLoan}>
            Post New Loan
          </button>
          <button className={styles.secondaryButton} onClick={handleRequestLoan}>
            Request a Loan
          </button>
        </div>
      </div>

      {/* Spinner Keyframes */}
      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export const DashboardTable = (): JSX.Element => {
  return <DashboardTableComponent />;
}
