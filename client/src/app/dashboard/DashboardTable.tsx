import React, { useEffect, useState } from "react";
import { LineChart, Line, Tooltip, ResponsiveContainer, Legend } from "recharts";
import loansData from "./MockLoans"; // Importing the loans constant
import { Loan } from "../models/Loan"; // Import the Loan model

const Dashboard: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartHeight, setChartHeight] = useState(300);

  const calculateRemainingBalance = (loan: Loan): number => {
    const totalPaid = loan.payments.reduce((sum, payment) => sum + payment.amount, 0);
    return loan.principalAmount - totalPaid;
  };

  const calculateTotalPaid = (loan: Loan): number => {
    return loan.payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const processedLoans = loans.map(loan => ({
    ...loan,
    remainingBalance: calculateRemainingBalance(loan),
    totalPaid: calculateTotalPaid(loan)
  }));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateChartHeight = () => {
        setChartHeight(window.innerWidth < 768 ? 200 : 300);
      };

      updateChartHeight();
      window.addEventListener("resize", updateChartHeight);
      return () => window.removeEventListener("resize", updateChartHeight);
    }
  }, []);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setLoans(loansData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen w-screen p-5 text-gray-900 flex flex-col">
      <div className="max-w-6xl mx-auto flex-grow">
        {/* Loan Performance Line Chart */}
        <div className="chart-container h-full">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={processedLoans}>
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="remainingBalance"
                name="Remaining Balance"
                stroke="#3B82F6"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="totalPaid"
                name="Total Paid"
                stroke="#EF4444"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const DashboardTable: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Dashboard />
    </div>
  );
};

export default DashboardTable;
