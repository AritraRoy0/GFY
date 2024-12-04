"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { RootState, AppDispatch } from "../store";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { approveLoan } from "../models/LoanRequestAPIs";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

type ButtonProps = {
	onClick: () => void;
	disabled?: boolean;
	variant: "primary" | "secondary";
	children?: React.ReactNode;
};

const ViewLoan: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const loanRequest = useSelector((state: RootState) => state.loanRequest);
	const user = useSelector((state: RootState) => state.auth.user);
	const userId = user?.id;
	const loanId = loanRequest?.id;
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	// Memoize weekly payment calculations for performance
	const weeklyPayments = useMemo(() => {
		if (!loanRequest) return [];
		const totalAmount =
			loanRequest.principalAmount + (loanRequest.principalAmount * loanRequest.interestRate) / 100;
		const weeklyPayment = totalAmount / loanRequest.termWeeks;

		return Array.from({ length: loanRequest.termWeeks }, (_, i) => ({
			week: `Week ${i + 1}`,
			amount: Number(weeklyPayment.toFixed(2)),
		}));
	}, [loanRequest]);

	useEffect(() => {
		if (loanId) {
			setLoading(true);
			// Simulate loan data fetch
			setTimeout(() => setLoading(false), 1000);
		}
	}, [loanId, dispatch]);

	const handleApprove = async () => {
		if (!loanRequest || !loanId) {
			setError("Loan request not found.");
			return;
		}

		if (!userId) {
			setError('User ID is required.');
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		await approveLoan(loanRequest, userId);

	}

		/*try {
			// Call the approveLoan function
			await approveLoan(loanRequest);

			// Proceed with Stripe checkout if applicable
			const stripe = await stripePromise;
			if (!stripe) {
				setError("Stripe failed to load. Please try again later.");
				return;
			}

			const response = await axios.post("/api/create-checkout-session", {
				loanId,
				principalAmount: loanRequest.principalAmount,
			});

			const { sessionId } = response.data;
			const result = await stripe.redirectToCheckout({ sessionId });

			if (result.error) {
				setError(`Stripe Checkout error: ${result.error.message}`);
			}
		} catch (err) {
			setError("Error during loan approval or Stripe checkout. Please try again later.");
		} finally {
			setLoading(false);
		}
	};*/


	// Loading state
	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen bg-gray-100">
				<div className="text-center">
					<div className="animate-spin rounded-full border-4 border-t-4 border-blue-500 h-12 w-12 mb-4"></div>
					<p className="text-xl font-medium text-gray-700">Processing, please wait...</p>
				</div>
			</div>
		);
	}

	// Error or empty state
	if (!loanRequest) {
		return (
			<div className="flex justify-center items-center h-screen bg-gray-100">
				<div className="text-center">
					<p className="text-xl text-red-600 font-semibold">Loan request not found.</p>
				</div>
			</div>
		);
	}

	// Main UI
	return (
		<div className="min-h-screen bg-gray-100 py-10">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white shadow-lg rounded-lg p-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-6">Loan Request Details</h1>

					{/* Loan Details */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<DetailCard label="Borrower" value={loanRequest.borrowedBy} />
						<DetailCard
							label="Principal Amount"
							value={`$${loanRequest.principalAmount.toFixed(2)}`}
						/>
						<DetailCard label="Interest Rate" value={`${loanRequest.interestRate}%`} />
						<DetailCard label="Term" value={`${loanRequest.termWeeks} weeks`} />
						<DetailCard label="Purpose" value={loanRequest.purpose} full />
					</div>

					{/* Weekly Payments Chart */}
					<div className="mt-8">
						<h2 className="text-xl font-medium text-gray-800 mb-4">Weekly Payments</h2>
						<div className="w-full h-64 bg-gray-50 rounded-lg shadow-sm">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={weeklyPayments}>
									<XAxis dataKey="week" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar dataKey="amount" fill="#4F46E5" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Error Message */}
					{error && (
						<div
							className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
							role="alert"
						>
							<p>
								<strong>Error:</strong> {error}
							</p>
						</div>
					)}

					{/* Action Buttons */}
					<div className="mt-8 flex justify-end gap-4">
						<Button onClick={handleApprove} disabled={loading} variant="primary">
							{loading ? "Processing..." : "Approve and Pay"}
						</Button>
						<Button onClick={() => console.log("Reject Loan")} variant="secondary">
							Reject Loan
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

// Reusable Detail Card Component
const DetailCard: React.FC<{ label: string; value: string; full?: boolean }> = ({ label, value, full }) => (
	<div className={`p-4 bg-gray-50 rounded-lg shadow-sm ${full ? "md:col-span-2" : ""}`}>
		<p className="text-gray-600">
			<strong className="font-medium text-gray-800">{label}:</strong> {value}
		</p>
	</div>
);

// Reusable Button Component
const Button: React.FC<ButtonProps> = ({ onClick, disabled, variant, children }) => {
	const baseClasses =
		"px-6 py-3 font-semibold rounded-md shadow focus:ring focus:ring-offset-2 focus:ring-opacity-50";
	const variants = {
		primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
		secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300",
	};
	return (
		<button
			onClick={onClick}
			className={`${baseClasses} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default ViewLoan;