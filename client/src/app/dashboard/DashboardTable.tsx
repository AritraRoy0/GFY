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
  // Removed notifications as they are now handled separately
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
      <div style={styles.centerScreen}>
        <div style={styles.spinner}></div>
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
    <div style={styles.container}>
      <ToastContainer />
      <div id="dashboard-content" style={styles.innerContainer}>
        {/* Header Section */}
        <div style={styles.section}>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subTitle}>Overview of your loan activities</p>
        </div>

        {/* Cards Grid */}
        <div style={styles.grid}>
          {/* Total Loans Owned */}
          <div style={styles.card}>
            <div style={styles.cardContent}>
              <div style={styles.iconWrapperBlue}>
                <svg style={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12h2V7H9v5z" />
                  <path
                    fillRule="evenodd"
                    d="M2 5a2 2 0 012-2h5.5a2 2 0 011.732 1H16a2 2 0 012 2v6a2 2 0 01-1 1.732V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.268A2 2 0 014 13V7a2 2 0 01-2-2zm2 2v6a2 2 0 001 1.732V17h7v-2.268A2 2 0 0014 13V7H4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p style={styles.textGray}>Total Loans Owned</p>
                <p style={styles.amount}>${totalLoansOwned.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Total Loans Owed */}
          <div style={styles.card}>
            <div style={styles.cardContent}>
              <div style={styles.iconWrapperGreen}>
                <svg style={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v6h2v-6a4 4 0 018 0v6h2V8a6 6 0 00-6-6z" />
                  <path d="M2 13h16v2H2v-2z" />
                </svg>
              </div>
              <div>
                <p style={styles.textGray}>Total Loans Owed</p>
                <p style={styles.amount}>${totalLoansOwed.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Net Profit */}
          <div style={styles.card}>
            <div style={styles.cardContent}>
              <div style={styles.iconWrapperYellow}>
                <svg style={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.257 3.099c.766-1.36 2.68-1.36 3.446 0l5.857 10.417C18.12 14.876 17.184 16 15.857 16H4.143c-1.327 0-2.263-1.124-1.703-2.484L8.257 3.1zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-4a1 1 0 00-.993.883L9 11v2a1 1 0 001.993.117L11 13v-2a1 1 0 00-1-1z" />
                </svg>
              </div>
              <div>
                <p style={styles.textGray}>Net Profit</p>
                <p style={styles.amount}>${netProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Performance Line Charts */}
        <div style={styles.chartContainer}>
          <h2 style={styles.chartTitle}>Loan Performance (Last 12 Weeks)</h2>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={loanPerformance.owned}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="week" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                name="Loans Owned"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="#3B82F6"
                fillOpacity={0.1}
              />
              <Line
                type="monotone"
                dataKey="amount"
                data={loanPerformance.owed}
                name="Loans Owed"
                stroke="#10B981"
                strokeWidth={2}
                fill="#10B981"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="amount"
                data={loanPerformance.owed}
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.1}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Profits Bar Chart */}
        <div style={styles.chartContainer}>
          <h2 style={styles.chartTitle}>Monthly Profits</h2>
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
        <div style={styles.buttonContainer}>
          <button style={styles.primaryButton} onClick={handlePostNewLoan}>
            Post New Loan
          </button>
          <button style={styles.secondaryButton} onClick={handleRequestLoan}>
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

// Enhanced Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F3F4F6',
    fontFamily: 'Arial, sans-serif',
  },
  innerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  section: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  subTitle: {
    color: '#6B7280',
    marginTop: '0.5rem',
    fontSize: '1.125rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
    marginBottom: '2rem',
    // Responsive grid layout
    // For larger screens, display 3 columns
    // For medium screens, display 2 columns
    // For small screens, display 1 column
    // Using media queries via CSS-in-JS
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
  },
  iconWrapperBlue: {
    padding: '0.75rem',
    borderRadius: '50%',
    backgroundColor: '#E0F2FE',
    color: '#3B82F6',
    marginRight: '1rem',
  },
  iconWrapperGreen: {
    padding: '0.75rem',
    borderRadius: '50%',
    backgroundColor: '#D1FAE5',
    color: '#10B981',
    marginRight: '1rem',
  },
  iconWrapperYellow: {
    padding: '0.75rem',
    borderRadius: '50%',
    backgroundColor: '#FEF3C7',
    color: '#F59E0B',
    marginRight: '1rem',
  },
  icon: {
    width: '32px',
    height: '32px',
  },
  textGray: {
    color: '#6B7280',
    margin: 0,
    fontSize: '1rem',
  },
  amount: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
  },
  chartTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#111827',
    marginBottom: '1rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  primaryButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    borderRadius: '0.5rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.4)',
    transition: 'background-color 0.3s, transform 0.2s',
  },
  secondaryButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    borderRadius: '0.5rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.4)',
    transition: 'background-color 0.3s, transform 0.2s',
  },
  centerScreen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    position: 'relative',
  },
  spinner: {
    width: '64px',
    height: '64px',
    border: '8px solid #f3f3f3',
    borderTop: '8px solid #3B82F6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Responsive Grid Layout using media queries
const mediaQueries = `
  @media (min-width: 640px) {
    div[style*="grid"] {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    div[style*="grid"] {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

// Inject media queries into the global stylesheet
const GlobalStyles = () => (
  <style jsx global>{`
    ${mediaQueries}
  `}</style>
);

export default function Dashboard() {
  return (
    <>
      <DashboardTable />
      <GlobalStyles />
    </>
  );
}
