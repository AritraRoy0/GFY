"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./../store"; // Update import path as needed
import Notifications from "./Notifications";
import OutstandingLoansTable from "./LoanTable";
import SummarySection from "./SummarySection";
import Header from "../common/Header";
import Footer from "../common/Footer";

// Import your API functions
import { fetchBorrowedLoans, fetchLentLoans } from "@/app/models/LoanAPIs";
import { fetchUserLoanRequests } from "@/app/models/LoanRequestAPIs";
import { Loan, LoanRequest } from "@/app/models/LoanInterfaces";

export default function Page() {
	const user = useSelector((state: RootState) => state.auth.user);
	const userId = user?.id || null;

	const [lentLoans, setLentLoans] = useState<Loan[]>([]);
	const [borrowedLoans, setBorrowedLoans] = useState<Loan[]>([]);
	const [notifications, setNotifications] = useState<{
		id: string;
		message: string;
		type: "info";
		timestamp: Date;
	}[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch lent loans when userId is available
	useEffect(() => {
		if (!userId) return;

		const unsubscribe = fetchLentLoans(
			userId,
			(loans) => {
				setLentLoans(loans);
			},
			(error) => {
				console.error("Error fetching lent loans:", error);
				setError("Failed to load lent loans.");
			}
		);

		return () => {
			unsubscribe();
		};
	}, [userId]);

	// Fetch borrowed loans when userId is available
	useEffect(() => {
		if (!userId) return;

		const unsubscribe = fetchBorrowedLoans(
			userId,
			(loans) => {
				setBorrowedLoans(loans);
			},
			(error) => {
				console.error("Error fetching borrowed loans:", error);
				setError("Failed to load borrowed loans.");
			}
		);

		return () => {
			unsubscribe();
		};
	}, [userId]);

	// Fetch user loan requests to create notifications
	useEffect(() => {
		if (!userId) {
			setNotifications([]);
			setLoading(false);
			return;
		}

		const unsubscribe = fetchUserLoanRequests(
			userId,
			(loanRequests: LoanRequest[]) => {
				// Convert LoanRequests to a notifications format
				const requestNotifications = loanRequests.map((request) => ({
					id: `loan_${request.id}`,
					message: `Your loan request for $${request.principalAmount.toLocaleString()} is pending.`,
					type: "info" as const,
					timestamp: request.timestamp.toDate(),
				}));

				setNotifications(requestNotifications);
				setLoading(false);
			},
			(error) => {
				console.error("Error fetching user loan requests:", error);
				setError("Failed to load notifications.");
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, [userId]);

	// Compute summary values
	const totalOwned = lentLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
	const totalOwed = borrowedLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
	const totalReserves = 10000; // Example static or computed value

	// Combined loading and error state
	if (loading) {
		return (
			<div className="flex flex-col min-h-screen bg-gray-100">
				<Header />
				<main className="flex-grow flex items-center justify-center">
					<div className="flex items-center space-x-2 text-gray-700">
						<svg
							className="animate-spin h-8 w-8 text-blue-500"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							aria-label="Loading"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							></path>
						</svg>
						<span className="text-lg">Loading dashboard data...</span>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col min-h-screen bg-gray-100">
				<Header />
				<main className="flex-grow flex flex-col items-center justify-center">
					<div className="flex items-center space-x-2 text-red-600 mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-label="Error"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span className="text-lg">{error}</span>
					</div>
					<button
						onClick={() => window.location.reload()}
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
					>
						Retry
					</button>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
			<Header />
			<main className="flex-grow container mx-auto px-4 py-6">
				{/* Summary Section */}
				<section className="mb-8">
					<SummarySection
						totalOwned={totalOwned}
						totalOwed={totalOwed}
						totalReserves={totalReserves}
					/>
				</section>

				{/* Loans Overview */}
				<section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					{/* Loans You Own */}
					<div>
						<OutstandingLoansTable
							userId={userId || ""}
							type="owned"
							loans={lentLoans}
						/>
					</div>

					{/* Loans You Owe */}
					<div>
						<OutstandingLoansTable
							userId={userId || ""}
							type="owed"
							loans={borrowedLoans}
						/>
					</div>
				</section>

				{/* Notifications */}
				<section>
					<Notifications notifications={notifications} />
				</section>
			</main>
			<Footer />
		</div>
	);
}
