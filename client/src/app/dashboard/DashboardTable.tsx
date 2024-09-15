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

export const DashboardTable  = (): JSX.Element => {
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
      <div
        style={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f9fafb',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            border: '8px solid #f3f3f3',
            borderTop: '8px solid #3498db',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            animation: 'spin 2s linear infinite',
          }}
        ></div>
        <ToastContainer />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f9fafb',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <ToastContainer />
      <div
        id="dashboard-content"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0', color: '#111827' }}>Dashboard</h1>
          <p style={{ fontSize: '1rem', color: '#6b7280' }}>Overview of your loan activities</p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              flex: '1 1 300px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#3B82F6',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '15px',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 20 20" width="24" height="24">
                <path d="M9 12h2V7H9v5z" />
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h5.5a2 2 0 011.732 1H16a2 2 0 012 2v6a2 2 0 01-1 1.732V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.268A2 2 0 014 13V7a2 2 0 01-2-2zm2 2v6a2 2 0 001 1.732V17h7v-2.268A2 2 0 0014 13V7H4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p style={{ color: '#6b7280', margin: '0 0 5px 0' }}>Total Loans Owned</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>${totalLoansOwned.toLocaleString()}</p>
            </div>
          </div>

          <div
            style={{
              flex: '1 1 300px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#10B981',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '15px',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 20 20" width="24" height="24">
                <path d="M10 2a6 6 0 00-6 6v6h2v-6a4 4 0 018 0v6h2V8a6 6 0 00-6-6z" />
                <path d="M2 13h16v2H2v-2z" />
              </svg>
            </div>
            <div>
              <p style={{ color: '#6b7280', margin: '0 0 5px 0' }}>Total Loans Owed</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>${totalLoansOwed.toLocaleString()}</p>
            </div>
          </div>

          <div
            style={{
              flex: '1 1 300px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#F59E0B',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '15px',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 20 20" width="24" height="24">
                <path d="M8.257 3.099c.766-1.36 2.68-1.36 3.446 0l5.857 10.417C18.12 14.876 17.184 16 15.857 16H4.143c-1.327 0-2.263-1.124-1.703-2.484L8.257 3.1zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-4a1 1 0 00-.993.883L9 11v2a1 1 0 001.993.117L11 13v-2a1 1 0 00-1-1z" />
              </svg>
            </div>
            <div>
              <p style={{ color: '#6b7280', margin: '0 0 5px 0' }}>Net Profit</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>${netProfit.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Loan Performance Line Charts */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '20px',
            marginBottom: '40px',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#111827' }}>
            Loan Performance (Last 12 Weeks)
          </h2>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={combinedLoanPerformance}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="week" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="owned" name="Loans Owned" stroke="#3B82F6" strokeWidth={2} fillOpacity={0.1} />
              <Line type="monotone" dataKey="owed" name="Loans Owed" stroke="#10B981" strokeWidth={2} fillOpacity={0.1} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Profits Bar Chart */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '20px',
            marginBottom: '40px',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#111827' }}>
            Monthly Profits
          </h2>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={profits}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" name="Profit" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <button
            onClick={handlePostNewLoan}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3B82F6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3B82F6')}
          >
            Post New Loan
          </button>
          <button
            onClick={handleRequestLoan}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ffffff',
              color: '#3B82F6',
              border: '2px solid #3B82F6',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'background-color 0.3s ease, color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3B82F6';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#3B82F6';
            }}
          >
            Request a Loan
          </button>
        </div>
      </div>
    </div>
  );
};
