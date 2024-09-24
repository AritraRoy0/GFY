// src/components/LoanProgress.tsx

"use client";

import React, { useMemo } from "react";
import {
  FaDollarSign,
  FaPercentage,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import loans from "./MockLoans";
import { calculateTotalAmountToBePaid } from "./utils/loanUtils";
import { Loan } from "../models/Loan";

interface LoanDetailProps {
  loan: Loan;
}

const COLORS = ["#4CAF50", "#FF5722"];

/**
 * Capitalizes the first letter of a string.
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * LoanDetail Component: Displays detailed progress for a single loan.
 */
const LoanDetail: React.FC<LoanDetailProps> = ({ loan }) => {
  const {
    id,
    owner,
    principalAmount,
    interestRate,
    termWeeks,
    weeklyInstallment,
    paymentsMade,
  } = loan;

  // Calculate total amount to be paid (principal + interest)
  const totalAmountToBePaid = useMemo(
    () => calculateTotalAmountToBePaid(loan),
    [loan]
  );

  // Calculate total paid
  const totalPaid = useMemo(
    () => paymentsMade.reduce((sum, payment) => sum + payment.amount, 0),
    [paymentsMade]
  );

  // Calculate remaining amount
  const remainingAmount = useMemo(
    () => totalAmountToBePaid - totalPaid,
    [totalAmountToBePaid, totalPaid]
  );

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    const percentage = (totalPaid / totalAmountToBePaid) * 100;
    return isNaN(percentage) ? 0 : percentage;
  }, [totalPaid, totalAmountToBePaid]);

  // Prepare data for PieChart
  const data = useMemo(
    () => [
      { name: "Paid", value: totalPaid },
      { name: "Remaining", value: remainingAmount },
    ],
    [totalPaid, remainingAmount]
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Loan Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-gray-800">Loan ID: {id}</h2>
          <p className="text-gray-600 flex items-center">
            <FaUser className="mr-2" /> <strong>Owner:</strong>{" "}
            {capitalizeFirstLetter(owner)}
          </p>
        </div>
        <div className="flex space-x-6">
          <div className="text-center">
            <p className="text-gray-500">Principal Amount</p>
            <p className="text-2xl font-semibold text-gray-800">
              ${principalAmount.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Total Paid</p>
            <p className="text-2xl font-semibold text-green-600">
              ${totalPaid.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Remaining Amount</p>
            <p className="text-2xl font-semibold text-red-600">
              ${remainingAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Loan Details */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-gray-600 flex items-center mb-2">
            <FaPercentage className="mr-2" /> <strong>Interest Rate:</strong>{" "}
            {interestRate}%
          </p>
          <p className="text-gray-600 flex items-center mb-2">
            <FaCalendarAlt className="mr-2" /> <strong>Loan Term:</strong>{" "}
            {termWeeks} weeks
          </p>
          <p className="text-gray-600 flex items-center mb-2">
            <FaDollarSign className="mr-2" /> <strong>Weekly Payment:</strong>{" "}
            ${weeklyInstallment.toFixed(2)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="col-span-1 md:col-span-2">
          <p className="text-gray-600 mb-2">
            <strong>Progress:</strong> {progressPercentage.toFixed(2)}% paid
          </p>
          <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden relative">
            <div
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
            <span className="absolute left-0 top-0 w-full text-center text-sm text-white">
              {progressPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={80}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{ fontSize: "14px" }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/**
 * LoanProgress Component: Displays progress for all loans.
 */
const LoanProgress: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Loans</h1>
      {loans.map((loan) => (
        <LoanDetail key={loan.id} loan={loan} />
      ))}
    </div>
  );
};

export default LoanProgress;
