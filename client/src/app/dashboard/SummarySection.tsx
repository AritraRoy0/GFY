import React from 'react';
import { AccountBalance, TrendingUp, MoneyOff } from '@mui/icons-material'; // Added new icon

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

// Usage of the renamed component
const SummarySection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <SummaryCard 
        title="Total Loans Issued" 
        value="$10,500" 
        icon={<AccountBalance style={{ color: 'white', fontSize: 32 }} />} 
        bgColor="bg-blue-500"
      />
      <SummaryCard 
        title="Total Interest Earned" 
        value="$2,300" 
        icon={<TrendingUp style={{ color: 'white', fontSize: 32 }} />} 
        bgColor="bg-green-500"
      />
      {/* New Card for Total Debt Owed */}
      <SummaryCard 
        title="Debts Currently Owed" 
        value="$5,000" 
        icon={<MoneyOff style={{ color: 'white', fontSize: 32 }} />} 
        bgColor="bg-red-500"
      />
    </div>
  );
};

export default SummarySection;
