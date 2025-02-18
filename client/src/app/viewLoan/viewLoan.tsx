"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { RootState, AppDispatch } from "../store";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { approveLoan } from "../models/LoanRequestAPIs";
import { ClockIcon, UserCircleIcon, CurrencyDollarIcon, ScaleIcon, CalendarIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

type ButtonProps = {
	onClick: () => void;
	disabled?: boolean;
	variant: "primary" | "secondary";
	children?: React.ReactNode;
};

const ViewLoan: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const loanRequest = useSelector((state: RootState) => state.loanRequest);
	const user = useSelector((state: RootState) => state.auth.user);
	const userId = user?.id;
	const loanId = loanRequest?.id;
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	// Validate loan request data
	const isValidLoanRequest = useMemo(() => {
		if (!loanRequest) return false;
		return (
			loanRequest.termWeeks >= 1 &&
			loanRequest.termWeeks <= 52 &&
			loanRequest.principalAmount >= 500 &&
			loanRequest.principalAmount <= 10000 &&
			loanRequest.interestRate >= 5
		);
	}, [loanRequest]);

	const weeklyPayments = useMemo(() => {
		if (!loanRequest || !isValidLoanRequest) return [];
		const totalAmount =
			loanRequest.principalAmount + (loanRequest.principalAmount * loanRequest.interestRate) / 100;
		const weeklyPayment = totalAmount / loanRequest.termWeeks;

		return Array.from({ length: loanRequest.termWeeks }, (_, i) => ({
			week: i + 1,
			amount: Number(weeklyPayment.toFixed(2)),
		}));
	}, [loanRequest, isValidLoanRequest]);

	useEffect(() => {
		if (loanId) {
			setLoading(true);
			setTimeout(() => setLoading(false), 1000);
		}
	}, [loanId, dispatch]);

	const handleApprove = async () => {
		if (!loanRequest || !loanId) {
			setError("Loan request not found.");
			return;
		}

		if (!userId) {
			setError("User ID is required.");
			setLoading(false);
			return;
		}

		if (!isValidLoanRequest) {
			setError("Invalid loan request. Please check the terms.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			await approveLoan(loanRequest, userId);
			toast.success("Loan approved successfully!", {
				position: "top-center",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});

			// Redirect after success
			setTimeout(() => {
				router.push("/loanRequests");
			}, 3000);
		} catch (err) {
			setError("Failed to approve loan. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleReject = () => {
		router.push("/loanRequests");
	};

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
				<div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
					))}
				</div>
				<div className="h-64 bg-gray-100 rounded-xl"></div>
			</div>
		);
	}

	if (!loanRequest) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-12">
				<div className="p-6 bg-red-50 rounded-xl text-center">
					<ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
					<h2 className="text-2xl font-semibold text-red-600">Loan request not found</h2>
					<p className="text-gray-600 mt-2">Please check the loan ID and try again</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<ToastContainer />
			<div className="space-y-8">
				<div className="pb-6 border-b border-gray-200">
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
						<CurrencyDollarIcon className="h-8 w-8 text-indigo-600" />
						Loan Request Details
					</h1>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<DetailCard
						label="Borrower"
						value={loanRequest.borrowedBy}
						icon={<UserCircleIcon className="h-6 w-6 text-indigo-600" />}
					/>
					<DetailCard
						label="Principal Amount"
						value={`$${loanRequest.principalAmount.toFixed(2)}`}
						icon={<CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />}
					/>
					<DetailCard
						label="Interest Rate"
						value={`${loanRequest.interestRate}%`}
						icon={<ScaleIcon className="h-6 w-6 text-indigo-600" />}
					/>
					<DetailCard
						label="Term Duration"
						value={`${loanRequest.termWeeks} weeks`}
						icon={<CalendarIcon className="h-6 w-6 text-indigo-600" />}
					/>
					<div className="md:col-span-2">
						<DetailCard
							label="Purpose"
							value={loanRequest.purpose}
							icon={<ClockIcon className="h-6 w-6 text-indigo-600" />}
							full
						/>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
					<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
						<CalendarIcon className="h-6 w-6 text-indigo-600" />
						Repayment Schedule
					</h2>
					<div className="h-96">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={weeklyPayments}>
								<XAxis
									dataKey="week"
									tick={{ fill: "#4B5563" }}
									label={{
										value: "Week Number",
										position: "bottom",
										fill: "#4B5563",
									}}
								/>
								<YAxis
									tick={{ fill: "#4B5563" }}
									label={{
										value: "Amount ($)",
										angle: -90,
										position: "insideLeft",
										fill: "#4B5563",
									}}
								/>
								<Tooltip
									cursor={{ fill: "#E5E7EB" }}
									contentStyle={{
										background: "#fff",
										border: "1px solid #E5E7EB",
										borderRadius: "8px",
										boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
									}}
								/>
								<Bar dataKey="amount" radius={[4, 4, 0, 0]}>
									{weeklyPayments.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={index % 2 === 0 ? "#6366F1" : "#818CF8"}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{error && (
					<div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
						<ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
						<div>
							<p className="text-sm font-medium text-red-800">{error}</p>
						</div>
					</div>
				)}

				<div className="flex flex-col sm:flex-row gap-4 justify-end">
					<Button
						onClick={handleApprove}
						disabled={loading || !isValidLoanRequest}
						variant="primary"
					>
						{loading ? (
							<>
								<svg
									className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									fill="none"
									viewBox="0 0 24 24"
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
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Processing...
							</>
						) : (
							<>
								<CheckCircleIcon className="h-5 w-5" />
								Approve and Pay
							</>
						)}
					</Button>
					<Button onClick={handleReject} variant="secondary">
						<XCircleIcon className="h-5 w-5" />
						Reject Loan
					</Button>
				</div>
			</div>
		</div>
	);
};

const DetailCard: React.FC<{
	label: string;
	value: string;
	icon: React.ReactNode;
	full?: boolean;
}> = ({ label, value, icon, full }) => (
	<div className={`flex items-start gap-4 p-4 bg-gray-50 rounded-lg ${full ? "col-span-2" : ""}`}>
		<div className="bg-indigo-50 p-2 rounded-lg">{icon}</div>
		<div>
			<dt className="text-sm font-medium text-gray-500">{label}</dt>
			<dd className="mt-1 text-lg font-semibold text-gray-900">{value}</dd>
		</div>
	</div>
);

const Button: React.FC<ButtonProps> = ({ onClick, disabled, variant, children }) => {
	const baseClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg transition-all";
	const variants = {
		primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 disabled:opacity-70",
		secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-4 focus:ring-gray-100 disabled:opacity-70",
	};

	return (
		<button
			onClick={onClick}
			className={`${baseClasses} ${variants[variant]}`}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default ViewLoan;