"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Legend,
} from "recharts";
import { ToastContainer } from "react-toastify";
import loans from "./MockLoans"; // Importing the loans constant

const Dashboard: React.FC = () => {
	const router = useRouter();
	const user = useSelector((state: RootState) => state.auth.user);
	const [loading, setLoading] = useState(true);
	const [chartHeight, setChartHeight] = useState(300);

	const combinedLoanPerformance = loans.map((loan, index) => ({
		week: index + 1,
		owned: loan.principalAmount,
		owed: loan.payments.reduce((pSum, payment) => pSum + payment.amount, 0),
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
		if (typeof user !== "undefined") {
			if (!user) {
				const timeout = setTimeout(() => {
					router.push("/auth");
				}, 500);
				return () => clearTimeout(timeout);
			} else {
				setLoading(false);
			}
		}
	}, [user, router]);

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center h-screen bg-gray-50">
				<div className="w-15 h-15 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
				<ToastContainer />
			</div>
		);
	}

	const handlePostNewLoan = () => {
		router.push("/loans/new");
	};

	const handleRequestLoan = () => {
		router.push("/loans/request");
	};

	return (
		<div className="font-sans bg-gray-50 min-h-screen p-5 text-gray-900">
			<ToastContainer />
			<div
				style={{
					padding: "10px",
					backgroundColor: "#FFEB3B",
					color: "#000",
					textAlign: "center",
					fontWeight: "bold",
				}}
			>
				Warning: This is mock data to test the dashboard.
			</div>
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
					<p className="text-lg text-gray-600">
						Overview of your loan activities
					</p>
				</div>
				{/* Loan Performance Line Charts */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-10">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Loan Performance (Last 12 Weeks)
					</h2>
					<ResponsiveContainer width="100%" height={chartHeight}>
						<LineChart data={combinedLoanPerformance}>
							<defs>
								<linearGradient id="colorOwned" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
									<stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
								</linearGradient>
								<linearGradient id="colorOwed" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
									<stop offset="95%" stopColor="#10B981" stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid stroke="#e5e7eb" />
							<XAxis dataKey="week" stroke="#6B7280" />
							<YAxis stroke="#6B7280" />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="owned"
								name="Loans Owned"
								stroke="#3B82F6"
								strokeWidth={2}
								fill="url(#colorOwned)"
								fillOpacity={0.1}
								activeDot={{ r: 6 }}
							/>
							<Line
								type="monotone"
								dataKey="owed"
								name="Loans Owed"
								stroke="#10B981"
								strokeWidth={2}
								fill="url(#colorOwed)"
								fillOpacity={0.1}
								activeDot={{ r: 6 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
				{/* Action Buttons */}
				<div className="flex justify-center gap-6 mb-10">
					<button
						onClick={handlePostNewLoan}
						className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors transform hover:-translate-y-0.5"
					>
						Post New Loan
					</button>
					<button
						onClick={handleRequestLoan}
						className="px-6 py-3 bg-white text-blue-500 border-2 border-blue-500 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-colors transform hover:-translate-y-0.5"
					>
						Request a Loan
					</button>
				</div>
			</div>
		</div>
	);
};

const DashboardTable: React.FC = () => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
			<Dashboard />
		</div>
	);
}


export default DashboardTable;
