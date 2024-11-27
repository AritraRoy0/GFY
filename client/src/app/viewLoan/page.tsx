"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

import { RootState, AppDispatch, setLoanRequestState } from "../store";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const ViewLoan: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const loanRequest = useSelector((state: RootState) => state.loanRequest);
	const loanId = loanRequest?.id;
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (loanId) {
			setLoading(true);
			// Example dispatch for fetching loan data by ID (add actual logic here)
			// dispatch(fetchLoanRequest(loanId));
			setLoading(false);
		}
	}, [loanId, dispatch]);

	const handleApprove = async () => {
		if (!loanRequest || !loanId) {
			setError("Loan request not found.");
			return;
		}

		setLoading(true);
		setError(null); // Reset error state before making the API call

		try {
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
			setError("Error during Stripe checkout. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<span className="text-xl">Loading...</span>
			</div>
		);
	}

	if (!loanRequest) {
		return (
			<div className="flex justify-center items-center h-screen">
				<span className="text-xl text-red-500">Loan request not found.</span>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-md">
			<h1 className="text-3xl font-semibold mb-6 text-gray-800">Loan Request Details</h1>
			<div className="space-y-4 text-lg text-gray-700">
				<p><strong className="font-medium">Borrower:</strong> {loanRequest.borrowedBy}</p>
				<p><strong className="font-medium">Principal Amount:</strong> ${loanRequest.principalAmount.toFixed(2)}</p>
				<p><strong className="font-medium">Interest Rate:</strong> {loanRequest.interestRate}%</p>
				<p><strong className="font-medium">Term:</strong> {loanRequest.termWeeks} weeks</p>
				<p><strong className="font-medium">Purpose:</strong> {loanRequest.purpose}</p>
			</div>

			{/* Error Message */}
			{error && (
				<div className="mt-4 text-red-500 text-sm">
					<strong>Error: </strong>{error}
				</div>
			)}

			<div className="mt-6 flex justify-end">
				<button
					onClick={handleApprove}
					className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
					disabled={loading}
				>
					{loading ? "Processing..." : "Approve and Pay"}
				</button>
			</div>
		</div>
	);
};

export default ViewLoan;
