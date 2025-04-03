"use client";

import React from 'react';
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Funds Over Time</h3>
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="lent" 
                name="Loans Owned" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="borrowed" 
                name="Loans Owed" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Status Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="expected" name="Expected Amount" fill="#6B7280" />
              <Bar dataKey="received" name="Received Amount" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection; 