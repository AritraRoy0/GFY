"use client";

import React from "react";
import {
	AccountBalance,
	TrendingUp,
	MoneyOff,
	AttachMoney,
	ShowChart,
	AccountBalanceWallet,
	TrendingDown,


} from "@mui/icons-material";
import loans from "./MockLoans"; // Importing the loans constant

import {
	calculateTotalOwned,
	calculateTotalOwed,
	calculateNetCredit,
	calculateTotalInterestExpected,
	calculateTotalInterestToPay,
	calculateAverageInterestRateOwned,
	calculateAverageInterestRateOwed,
	calculateTotalReserves,
} from "./utils/loanUtils";

interface SummaryCardProps {
	title: string;
	value: string;
	icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => {
	return (
		<div className="w-full sm:w-auto">
			<div className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
				<div className="p-4 rounded-full bg-gray-100 mr-4">{icon}</div>
				<div>
					<h3 className="text-md font-semibold text-gray-600">{title}</h3>
					<p className="text-xl font-bold text-gray-900">{value}</p>
				</div>
			</div>
		</div>
	);
};

const SummarySection: React.FC = () => {

	const totalOwned = calculateTotalOwned(loans);
	const totalOwed = calculateTotalOwed(loans);
	const totalReserves = calculateTotalReserves(loans);

	const netCredit = calculateNetCredit(totalOwned, totalOwed);
	const totalInterestExpected = calculateTotalInterestExpected(loans);
	const totalInterestToPay = calculateTotalInterestToPay(loans);
	const averageInterestRateOwned = calculateAverageInterestRateOwned(loans);
	const averageInterestRateOwed = calculateAverageInterestRateOwed(loans);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			<SummaryCard
				title="Total Loans Owned"
				value={`$${totalOwned.toLocaleString()}`}
				icon={<TrendingUp className="text-green-500" />}
			/>
			<SummaryCard
				title="Total Reserves"
				value={`$${totalReserves.toLocaleString()}`}
				icon={<AccountBalance className="text-green-500" />}
			/>
			<SummaryCard
				title="Total Loans Owed"
				value={`$${totalOwed.toLocaleString()}`}
				icon={<TrendingDown className="text-red-500" />}
			/>
			<SummaryCard
				title="Net Credit"
				value={`$${netCredit.toLocaleString()}`}
				icon={<AccountBalanceWallet className="text-green-500" />}
			/>
			<SummaryCard
				title="Interest Expected"
				value={`$${totalInterestExpected.toLocaleString()}`}
				icon={<AttachMoney className="text-purple-500" />}
			/>
			<SummaryCard
				title="Interest to Pay"
				value={`$${totalInterestToPay.toLocaleString()}`}
				icon={<MoneyOff className="text-yellow-500" />}
			/>
			<SummaryCard
				title="Avg Interest Rate (Owned)"
				value={`${averageInterestRateOwned.toFixed(2)}%`}
				icon={<ShowChart className="text-orange-500" />}
			/>
			<SummaryCard
				title="Avg Interest Rate (Owed)"
				value={`${averageInterestRateOwed.toFixed(2)}%`}
				icon={<ShowChart className="text-pink-500" />}
			/>
		</div>
	);
};

export default SummarySection;
