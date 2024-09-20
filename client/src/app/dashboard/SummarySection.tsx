'use client';

import React from 'react';
import { AccountBalance, TrendingUp, MoneyOff } from '@mui/icons-material'; // Added new icon
import loans from './MockLoans'; // Importing the loans constant

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, bgColor }) => {
  return (
    <div className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 w-full sm:w-auto">
      <div className={`p-4 rounded-full ${bgColor} mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

// Calculate summary values from loans data
const totalLoansIssued = loans.reduce((sum, loan) => sum + loan.principalAmount, 0);
const totalInterestEarned = loans.reduce((sum, loan) => {
  const totalInterest = loan.principalAmount * (loan.interestRate / 100) * (loan.termWeeks / 52);
  return sum + totalInterest;
}, 0);
const debtsCurrentlyOwed = loans.reduce((sum, loan) => {
  const totalPaid = loan.payments.reduce((pSum, payment) => pSum + payment.amount, 0);
  return sum + (loan.principalAmount - totalPaid);
}, 0);

const SummarySection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <SummaryCard
        title="Total Balance"
        value="$12,345"
        icon={<AccountBalance className="text-white" />}
        bgColor="bg-blue-500"
      />
      <SummaryCard
        title="Earnings"
        value="$1,234"
        icon={<TrendingUp className="text-white" />}
        bgColor="bg-green-500"
      />
      <SummaryCard
        title="Expenses"
        value="$567"
        icon={<MoneyOff className="text-white" />}
        bgColor="bg-red-500"
      />
    </div>
  );
};


export default SummarySection;
