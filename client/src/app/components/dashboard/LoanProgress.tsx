'use client';

import React from 'react';
import { FaDollarSign, FaPercentage, FaCalendarAlt } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import loans from './MockLoans'; // Importing the loans constant

interface LoanProgressProps {
    loanAmount: number;
    paidAmount: number;
    interestRate: number;
    loanTerm: number; // in years
}

const Progress: React.FC<LoanProgressProps> = ({ loanAmount, paidAmount, interestRate, loanTerm }) => {
    const progressPercentage = (paidAmount / loanAmount) * 100;
    const remainingAmount = loanAmount - paidAmount;
    const monthlyPayment = (loanAmount * (interestRate / 100) / 12) / (1 - Math.pow(1 + (interestRate / 100) / 12, -loanTerm * 12));

    const data = [
        { name: 'Paid', value: paidAmount },
        { name: 'Remaining', value: remainingAmount },
    ];

    const COLORS = ['#4CAF50', '#FF5722'];

    return (
        <div className="border border-gray-300 p-6 my-4 rounded-lg bg-white shadow-md">
            <h2 className="text-2xl font-bold mb-4">Loan Progress</h2>
            <div className="mb-4">
                <p className="mb-2"><strong>Loan Amount:</strong> <FaDollarSign className="inline" /> {loanAmount}</p>
                <p className="mb-2"><strong>Paid Amount:</strong> <FaDollarSign className="inline" /> {paidAmount}</p>
                <p className="mb-2"><strong>Remaining Amount:</strong> <FaDollarSign className="inline" /> {remainingAmount}</p>
                <p className="mb-2"><strong>Interest Rate:</strong> <FaPercentage className="inline" /> {interestRate}%</p>
                <p className="mb-2"><strong>Loan Term:</strong> <FaCalendarAlt className="inline" /> {loanTerm} years</p>
                <p className="mb-2"><strong>Monthly Payment:</strong> <FaDollarSign className="inline" /> {monthlyPayment.toFixed(2)}</p>
            </div>
            <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden relative mb-4">
                <div
                    className="bg-blue-500 h-full flex items-center justify-center text-white font-bold"
                    style={{ width: `${progressPercentage}%` }}
                >
                    <span className="absolute w-full text-center text-sm text-gray-800">{progressPercentage.toFixed(2)}%</span>
                </div>
            </div>
            <PieChart width={300} height={300}>
                <Pie
                    data={data}
                    cx={150}
                    cy={150}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

const LoanProgress: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            {loans.map((loan, index) => {
                const totalPaid = loan.payments.reduce((sum, payment) => sum + payment.amount, 0);
                return (
                    <Progress
                        key={index}
                        loanAmount={loan.principalAmount}
                        paidAmount={totalPaid}
                        interestRate={loan.interestRate}
                        loanTerm={loan.termWeeks / 52} // Convert weeks to years
                    />
                );
            })}
        </div>
    );
};

export default LoanProgress;
