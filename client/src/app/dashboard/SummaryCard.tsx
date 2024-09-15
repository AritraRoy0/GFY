import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, bgColor }) => {
  return (
    <div className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 w-full sm:w-auto">
      <div className={`p-4 rounded-full ${bgColor} mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
