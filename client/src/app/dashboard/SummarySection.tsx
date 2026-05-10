// src/components/SummarySection.tsx
"use client";
import React from "react";
import { AccountBalance, TrendingUp, TrendingDown, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { Loan } from "@/app/models/LoanInterfaces";

interface SummarySectionProps {
	totalOwned: number;
	totalOwed: number;
	totalReserves: number;
	lentLoans: Loan[];
	borrowedLoans: Loan[];
}

const SummaryCard: React.FC<{
	title: string;
	value: string;
	icon: React.ReactNode;
	trend?: { value: number; isPositive: boolean };
}> = ({ title, value, icon, trend }) => {
	return (
		<div className="w-full sm:w-auto">
			<div className="flex items-center p-6 glass-card rounded-2xl card-hover shadow-lg">
				<div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white mr-4 shadow-lg">
					{icon}
				</div>
				<div className="flex-1">
					<h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
					<p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
					{trend && (
						<div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
							{trend.isPositive ? <ArrowUpward className="w-4 h-4 mr-1" /> : <ArrowDownward className="w-4 h-4 mr-1" />}
							<span>{Math.abs(trend.value)}% from last month</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const calculateTrend = (loans: Loan[]): { value: number; isPositive: boolean } => {
	if (loans.length === 0) return { value: 0, isPositive: true };

	const now = new Date();
	const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

	const currentMonthTotal = loans.reduce((sum, loan) => {
		const loanDate = new Date(loan.timestamp);
		if (loanDate >= lastMonth) {
			return sum + loan.principalAmount;
		}
		return sum;
	}, 0);

	const previousMonthTotal = loans.reduce((sum, loan) => {
		const loanDate = new Date(loan.timestamp);
		if (loanDate < lastMonth && loanDate >= new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate())) {
			return sum + loan.principalAmount;
		}
		return sum;
	}, 0);

	if (previousMonthTotal === 0) return { value: 0, isPositive: true };

	const percentageChange = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
	return {
		value: Math.round(percentageChange),
		isPositive: percentageChange >= 0
	};
};

const SummarySection: React.FC<SummarySectionProps> = ({ 
	totalOwned, 
	totalOwed, 
	totalReserves,
	lentLoans,
	borrowedLoans
}) => {
	const trends = {
		owned: calculateTrend(lentLoans),
		owed: calculateTrend(borrowedLoans),
		reserves: { value: 0, isPositive: true } // Reserves trend would need historical data
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			<SummaryCard
				title="Loans Owed to You"
				value={`$${totalOwned.toLocaleString()}`}
				icon={<TrendingUp className="text-white w-6 h-6" />}
				trend={trends.owned}
			/>
			<SummaryCard
				title="Your Balance Including Interest"
				value={`$${totalReserves.toLocaleString()}`}
				icon={<AccountBalance className="text-white w-6 h-6" />}
				trend={trends.reserves}
			/>
			<SummaryCard
				title="Loans You Owe to Others"
				value={`$${totalOwed.toLocaleString()}`}
				icon={<TrendingDown className="text-white w-6 h-6" />}
				trend={trends.owed}
			/>
		</div>
	);
};

export default SummarySection;
