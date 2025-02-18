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
								<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600"
								     viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
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
											<div
												className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"
												     viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd"
													      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
													      clipRule="evenodd"/>
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
											<div
												className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
											<div
												className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<svg xmlns="http://www.w3.org/2000/svg"
												     className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
												     fill="currentColor">
													<path fillRule="evenodd"
													      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
													      clipRule="evenodd"/>
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
												<LoadingSpinner size="small"/>
												Submitting...
											</>
										) : "Submit Request"}
									</button>

									{!currentUser && (
										<p className="mt-4 text-center text-red-600 font-medium flex items-center justify-center gap-2">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
											     viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd"
												      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
												      clipRule="evenodd"/>
											</svg>
											Please log in to submit a loan request
										</p>
									)}
								</div>
							</form>
						</div>
					</section>
					<section className="px-4 py-8">
  {/* Section Header */}
  <div className="flex items-center gap-4 mb-10">
    <div className="p-2 bg-green-100 rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-green-600"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    </div>
    <h2 className="text-3xl font-bold text-gray-900">Existing Loan Requests</h2>
  </div>

  {/* No Data Message */}
  {loanRequests.length === 0 ? (
    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
      <p className="text-gray-500">No loan requests found</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {loanRequests.map((request) => (
        <div
          key={request.id}
          className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border ${
            currentUser?.uid === request.borrowedBy ? 'border-blue-500' : 'border-gray-200'
          }`}
        >
          {/* Request ID Badge */}
          <div className="absolute top-4 right-4 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            #{request.id.slice(0, 6)}
          </div>

          {/* Card Header */}
          <div className="flex items-center mb-5">
            {currentUser?.uid === request.borrowedBy && (
              <span className="mr-2 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
            <h3 className="text-xl font-semibold text-gray-900">
              {currentUser?.uid === request.borrowedBy ? "Your Request" : `User ${request.borrowedBy.slice(0, 6)}`}
            </h3>
          </div>

          {/* Loan Details */}
          <div className="space-y-4">
            {/* Amount */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-lg font-bold text-gray-900">${request.principalAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Interest Rate</p>
                <p className="text-lg font-semibold text-gray-900">{request.interestRate}%</p>
              </div>
            </div>

            {/* Term */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Term</p>
                <p className="text-lg font-semibold text-gray-900">{request.termWeeks} weeks</p>
              </div>
            </div>

            {/* Purpose */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Purpose</p>
                <p className="text-gray-700 line-clamp-2">{request.purpose}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {currentUser?.uid !== request.borrowedBy && (
            <button
              onClick={() => handleReviewLoan(request)}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 transition-transform transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              Review Loan
            </button>
          )}
        </div>
      ))}
    </div>
  )}
</section>

				</div>
			</main>
			<Footer/>
		</div>
	);
};

export default LoanRequestForm;