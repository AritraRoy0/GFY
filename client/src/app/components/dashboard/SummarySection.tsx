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
        <p className="text-sm text-gray-500">{title}</p>
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

// Usage of the renamed component
const SummarySection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <SummaryCard 
        title="Total Loans Issued" 
        value={`$${totalLoansIssued.toFixed(2)}`} 
        icon={<AccountBalance style={{ color: 'white', fontSize: 32 }} />} 
        bgColor="bg-blue-500"
      />
      <SummaryCard 
        title="Total Interest Earned" 
        value={`$${totalInterestEarned.toFixed(2)}`} 
        icon={<TrendingUp style={{ color: 'white', fontSize: 32 }} />} 
        bgColor="bg-green-500"
      />
      {/* New Card for Total Debt Owed */}
      <SummaryCard 
        title="Debts Currently Owed" 
        value={`$${debtsCurrentlyOwed.toFixed(2)}`} 
        icon={<MoneyOff style={{ color: 'white', fontSize: 32 }} />} 
        bgColor="bg-red-500"
      />
    </div>
  );
};

export default SummarySection;
