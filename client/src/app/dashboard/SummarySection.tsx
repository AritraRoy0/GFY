"use client";

import React from "react";
import {
	AccountBalance,
	TrendingUp,
	TrendingDown,
} from "@mui/icons-material";

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

	const totalOwned = 30000;
	const totalOwed = 20000;
	const totalReserves = 10000;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		<SummaryCard
		  title="Loans Owed to You"
		  value={`$${totalOwned.toLocaleString()}`}
		  icon={<TrendingUp className="text-green-500" />}
		/>
		<SummaryCard
		  title="Your Balance Including Interest"
		  value={`$${totalReserves.toLocaleString()}`}
		  icon={<AccountBalance className="text-green-500" />}
		/>
		<SummaryCard
		  title="Loans You Owe to Others"
		  value={`$${totalOwed.toLocaleString()}`}
		  icon={<TrendingDown className="text-red-500" />}
		/>
	  </div>

	);
};

export default SummarySection;
