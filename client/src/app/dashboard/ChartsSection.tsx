"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaChartBar } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Loan } from '@/app/models/LoanInterfaces';

interface ChartsSectionProps {
  lentLoans: Loan[];
  borrowedLoans: Loan[];
  totalReserves: number;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ lentLoans, borrowedLoans, totalReserves }) => {
  // Calculate total funds over time for lent loans
  const lentFundsOverTime = lentLoans.reduce((acc: { [key: string]: number }, loan) => {
    if (loan.timestamp) {
      const date = loan.timestamp.toLocaleDateString();
      acc[date] = (acc[date] || 0) + loan.principalAmount;
    }
    return acc;
  }, {});

  // Calculate total funds over time for borrowed loans
  const borrowedFundsOverTime = borrowedLoans.reduce((acc: { [key: string]: number }, loan) => {
    if (loan.timestamp) {
      const date = loan.timestamp.toLocaleDateString();
      acc[date] = (acc[date] || 0) + loan.principalAmount;
    }
    return acc;
  }, {});

  // Combine and sort dates
  const allDates = Array.from(new Set([
    ...Object.keys(lentFundsOverTime),
    ...Object.keys(borrowedFundsOverTime)
  ])).sort();

  // Prepare data for the funds over time line chart
  const fundsOverTimeData = allDates.map(date => ({
    date,
    lent: lentFundsOverTime[date] || 0,
    borrowed: borrowedFundsOverTime[date] || 0
  }));

  // Calculate total payments made vs expected
  const paymentData = [
    {
      name: 'Lent Loans',
      expected: lentLoans.reduce((sum, loan) => sum + loan.principalAmount, 0),
      received: lentLoans.reduce((sum, loan) => 
        sum + loan.paymentsMade.reduce((pSum, payment) => pSum + payment.amount, 0), 0)
    },
    {
      name: 'Borrowed Loans',
      expected: borrowedLoans.reduce((sum, loan) => sum + loan.principalAmount, 0),
      received: borrowedLoans.reduce((sum, loan) => 
        sum + loan.paymentsMade.reduce((pSum, payment) => pSum + payment.amount, 0), 0)
    }
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Funds Over Time Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-3xl shadow-xl card-hover"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <FaChartLine className="text-blue-500" />
          Funds Over Time
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={fundsOverTimeData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="lent" 
                name="Loans Owned" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#3b82f6' }}
                activeDot={{ r: 7, fill: '#1d4ed8' }}
              />
              <Line 
                type="monotone" 
                dataKey="borrowed" 
                name="Loans Owed" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#ef4444' }}
                activeDot={{ r: 7, fill: '#dc2626' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Payment Status Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-3xl shadow-xl card-hover"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <FaChartBar className="text-emerald-500" />
          Payment Status
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={paymentData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="expected" name="Expected Amount" fill="#6b7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="received" name="Received Amount" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ChartsSection; 