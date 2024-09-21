import React from "react";
import loans from "./MockLoans";
import { Loan } from "../models/Loan";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";

interface WeeklyData {
	week: number;
	projectedIncoming: number;
	projectedPayouts: number;
	net: number;
}

const calculateWeeklyData = (loans: Loan[]): WeeklyData[] => {
	const weeks = Array.from({ length: 12 }, (_, i) => i + 1);
	const weeklyData: WeeklyData[] = weeks.map((week) => ({
		week,
		projectedIncoming: 0,
		projectedPayouts: 0,
		net: 0,
	}));

	const loansOwned = loans.filter((loan) => loan.owner === "owned");
	const loansOwed = loans.filter((loan) => loan.owner === "owed");

	const calculateIncoming = (loan: Loan, week: number): number => {
		const payments = loan.paymentsMade.filter(
			(payment) => payment.weekNumber <= week
		);
		return payments.reduce((acc, payment) => acc + payment.amount, 0);
	}

	const calculatePayouts = (loan: Loan, week: number): number => {
		const remainingWeeks = loan.termWeeks - week;
		return loan.weeklyInstallment * remainingWeeks;
	}

	weeks.forEach((week) => {
		
		weeklyData[week - 1].projectedIncoming = loansOwned.reduce(
			(acc, loan) => acc + calculateIncoming(loan, week),
			0
		);

		weeklyData[week - 1].projectedPayouts = loansOwed.reduce(
			(acc, loan) => acc + calculatePayouts(loan, week),
			0
		);

		weeklyData[week - 1].net =
			weeklyData[week - 1].projectedIncoming -
			weeklyData[week - 1].projectedPayouts;
	});

	return weeklyData;
}



const Chart: React.FC<{ data: WeeklyData[] }> = ({ data }) => (
	<LineChart width={600} height={300} data={data}>
		<CartesianGrid strokeDasharray="3 3" />
		<XAxis dataKey="week" />
		<YAxis />
		<Tooltip />
		<Legend />
		<Line type="monotone" dataKey="projectedIncoming" stroke="#82ca9d" />
		<Line type="monotone" dataKey="projectedPayouts" stroke="#8884d8" />
		<Line type="monotone" dataKey="net" stroke="#ff7300" />
	</LineChart>
);

const DashboardTable: React.FC = () => {
	const weeklyData = calculateWeeklyData(loans);

	return (
		<div style={{ padding: "20px" }}>
			<h2>Projected Loan Payments and Payouts</h2>
			<Chart data={weeklyData} />
		</div>
	);
};

export default DashboardTable;
