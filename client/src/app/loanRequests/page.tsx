"use client";

import React, { useState, useEffect } from "react";
import {
	uploadLoanRequest,
	fetchLoanRequests,
} from "../models/LoanRequestAPIs";
import { LoanRequest, NewLoanRequest } from "../models/LoanInterfaces";
import { setLoanRequestState, clearLoanRequestState } from "../store";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useDispatch } from "react-redux";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../common/LoadingSpinner";

const LoanRequestForm: React.FC = () => {
	const [principalAmount, setPrincipalAmount] = useState<number>(500);
	const [interestRate, setInterestRate] = useState<number>(0);
	const [termWeeks, setTermWeeks] = useState<number>(0);
	const [purpose, setPurpose] = useState("");
	const [loading, setLoading] = useState<boolean>(false);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [principalError, setPrincipalError] = useState<string>("");

	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
		});
		return () => unsubscribe();
	}, []);

	const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
	useEffect(() => {
		const unsubscribe = fetchLoanRequests((requests) => {
			setLoanRequests(requests);
		});
		return () => unsubscribe();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setPrincipalError("");

		if (!currentUser) {
			alert("Please log in to submit a loan request.");
			setLoading(false);
			return;
		}

		if (principalAmount < 500 || principalAmount > 10000) {
			setPrincipalError("Principal amount must be between $500 and $10,000.");
			setLoading(false);
			return;
		}

		const newLoanRequest: NewLoanRequest = {
			borrowedBy: currentUser.uid,
			principalAmount,
			interestRate,
			termWeeks,
			purpose,
		};

		try {
			await uploadLoanRequest(newLoanRequest);
			setPrincipalAmount(500);
			setInterestRate(0);
			setTermWeeks(0);
			setPurpose("");
			alert("Loan request submitted successfully!");
		} catch (error) {
			console.error("Error submitting loan request:", error);
			alert("There was an error submitting your loan request. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleReviewLoan = (loan: LoanRequest) => {
		dispatch(clearLoanRequestState());
		dispatch(setLoanRequestState(loan));
		router.push("/viewLoan");
	};

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Header />
			<main className="flex-grow">
				<div className="container mx-auto px-4 py-12 max-w-7xl">
					<section className="mb-16">
						<div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
							<h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
								</svg>
								New Loan Request
							</h2>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Principal Amount<span className="text-red-500 ml-1">*</span>
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<span className="text-gray-500">$</span>
											</div>
											<input
												type="number"
												id="principalAmount"
												value={principalAmount}
												onChange={(e) => setPrincipalAmount(Number(e.target.value))}
												className={`pl-7 pr-3 block w-full rounded-lg border py-3 focus:ring-2 transition-colors text-gray-900 ${
													principalError
														? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
														: "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
												}`}
												min="500"
												max="10000"
											/>
										</div>
										{principalError && (
											<p className="mt-2 text-sm text-red-600 flex items-center gap-1">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
												</svg>
												{principalError}
											</p>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Interest Rate (%)<span className="text-red-500 ml-1">*</span>
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<span className="text-gray-500">%</span>
											</div>
											<input
												type="number"
												id="interestRate"
												value={interestRate}
												onChange={(e) => setInterestRate(Number(e.target.value))}
												className="pl-10 pr-3 block w-full rounded-lg border border-gray-300 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
											/>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Term (Weeks)<span className="text-red-500 ml-1">*</span>
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
												</svg>
											</div>
											<input
												type="number"
												id="termWeeks"
												value={termWeeks}
												onChange={(e) => setTermWeeks(Number(e.target.value))}
												className="pl-10 pr-3 block w-full rounded-lg border border-gray-300 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
											/>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Purpose<span className="text-red-500 ml-1">*</span>
										</label>
										<textarea
											id="purpose"
											value={purpose}
											onChange={(e) => setPurpose(e.target.value)}
											className="block w-full rounded-lg border border-gray-300 py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 text-gray-900"
											placeholder="Briefly describe the loan purpose..."
										/>
									</div>
								</div>

								<div className="pt-6">
									<button
										type="submit"
										disabled={loading || !currentUser}
										className={`w-full py-4 px-6 flex justify-center items-center gap-2 text-lg font-semibold rounded-lg transition-all ${
											loading || !currentUser
												? "bg-gray-100 text-gray-400 cursor-not-allowed"
												: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
										}`}
									>
										{loading ? (
											<>
												<LoadingSpinner size="small" />
												Submitting...
											</>
										) : "Submit Request"}
									</button>

									{!currentUser && (
										<p className="mt-4 text-center text-red-600 font-medium flex items-center justify-center gap-2">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
											</svg>
											Please log in to submit a loan request
										</p>
									)}
								</div>
							</form>
						</div>
					</section>

					<section>
						<h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
							</svg>
							Existing Loan Requests
						</h2>

						{loanRequests.length === 0 ? (
							<div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
								<p className="text-gray-500 mb-4">No loan requests found</p>
							</div>
						) : (
							<div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50 sticky top-0">
										<tr>
											<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
												Borrower
											</th>
											<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
												Amount
											</th>
											<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
												Rate
											</th>
											<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
												Term
											</th>
											<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
												Purpose
											</th>
											<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
												Action
											</th>
										</tr>
										</thead>
										<tbody className="divide-y divide-gray-200">
										{loanRequests.map((request) => (
											<tr key={request.id} className={currentUser?.uid === request.borrowedBy ? "bg-blue-50/30" : "hover:bg-gray-50"}>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													<div className="flex items-center gap-2 text-black">
														{currentUser?.uid === request.borrowedBy && (
															<span className="text-blue-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </span>
														)}
														{currentUser?.uid === request.borrowedBy ? "Your Request" : `User ${request.borrowedBy.slice(0, 6)}`}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													${request.principalAmount.toLocaleString()}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{request.interestRate}%
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{request.termWeeks} weeks
												</td>
												<td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
													{request.purpose}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													{currentUser?.uid !== request.borrowedBy && (
														<button
															onClick={() => handleReviewLoan(request)}
															className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
														>
															<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
																<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
																<path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
															</svg>
															Review
														</button>
													)}
												</td>
											</tr>
										))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</section>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default LoanRequestForm;