// src/components/OutstandingLoansTable.tsx
import React, { useState } from 'react';
import {
	FaUserFriends,
	FaUser,
	FaMoneyCheckAlt,
	FaCheckCircle,
	FaCopy,
	FaClipboardCheck,
} from 'react-icons/fa';
import { Loan } from '../models/LoanInterfaces';

interface OutstandingLoansTableProps {
	userId: string;
	type: 'owed' | 'owned';
	loans: Loan[];
}

const OutstandingLoansTable: React.FC<OutstandingLoansTableProps> = ({ userId, type, loans }) => {
	// State to track which loan ID was copied
	const [copiedLoanId, setCopiedLoanId] = useState<string | null>(null);

	const handleMakePayment = (loanId: string) => {
		console.log(`Making payment for loan ID: ${loanId}`);
		// Implement payment logic here, possibly with feedback
	};

	const handleCopyId = (id: string) => {
		navigator.clipboard.writeText(id).then(
			() => {
				setCopiedLoanId(id);
				setTimeout(() => setCopiedLoanId(null), 2000); // Reset after 2 seconds
			},
			(err) => {
				console.error('Could not copy text: ', err);
				// Optionally, set an error state here to inform the user
			}
		);
	};

	const getStatusIcon = (loan: Loan) => {
		// Example status icon
		return (
			<div className="flex items-center space-x-1" aria-label="Loan Status: Active">
				<FaCheckCircle className="text-green-500 w-4 h-4" />
				<span className="text-gray-700 text-sm">Active</span>
			</div>
		);
	};

	return (
		<div className="bg-transparent">
			{loans.length > 0 ? (
				<div className="overflow-x-auto">
					<table className="min-w-full border-collapse text-sm">
						<thead>
						<tr
							className="glass-card text-gray-700 dark:text-gray-300 uppercase text-xs font-semibold tracking-wider rounded-t-2xl"
						>
							<th className="py-4 px-6 text-left rounded-tl-2xl">Amount</th>
							<th className="py-4 px-6 text-left">
								{type === 'owned' ? 'Borrower' : 'Lender'}
							</th>
							{type === 'owned' && <th className="py-4 px-6 text-left">Status</th>}
							<th className="py-4 px-6 text-left rounded-tr-2xl">Actions</th>
						</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
						{loans.map((loan) => (
							<tr key={loan.id} className="glass-card hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 rounded-2xl mb-2">
								{/* Amount */}
								<td className="py-4 px-6 text-gray-900 dark:text-white font-medium whitespace-nowrap">
									${loan.principalAmount.toLocaleString()}
								</td>

								{/* Borrower or Lender with Copy Button */}
								<td className="py-4 px-6 text-gray-900 dark:text-white flex items-center space-x-3">
									{type === 'owned' ? (
										<>
											<div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
												{loan.borrowedBy.charAt(0).toUpperCase()}
											</div>
											<span>{loan.borrowedBy}</span>
											<button
												onClick={() => handleCopyId(loan.borrowedBy)}
												className="relative text-gray-500 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
												aria-label={`Copy Borrower ID ${loan.borrowedBy}`}
											>
												{copiedLoanId === loan.borrowedBy ? (
													<FaClipboardCheck className="w-4 h-4 text-green-500" />
												) : (
													<FaCopy className="w-4 h-4" />
												)}
												{copiedLoanId === loan.borrowedBy && (
													<span className="absolute top-0 left-0 mt-8 bg-black text-white text-xs rounded py-1 px-2 z-10">
                              Copied!
                            </span>
												)}
											</button>
										</>
									) : (
										<>
											<div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
												{loan.ownedBy.charAt(0).toUpperCase()}
											</div>
											<span>{loan.ownedBy}</span>
											<button
												onClick={() => handleCopyId(loan.ownedBy)}
												className="relative text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg p-1 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
												aria-label={`Copy Lender ID ${loan.ownedBy}`}
											>
												{copiedLoanId === loan.ownedBy ? (
													<FaClipboardCheck className="w-4 h-4 text-green-500" />
												) : (
													<FaCopy className="w-4 h-4" />
												)}
												{copiedLoanId === loan.ownedBy && (
													<span className="absolute top-0 left-0 mt-8 bg-black text-white text-xs rounded py-1 px-2 z-10">
                              Copied!
                            </span>
												)}
											</button>
										</>
									)}
								</td>

								{/* Status (Only for 'owned' type) */}
								{type === 'owned' && (
									<td className="py-4 px-6 whitespace-nowrap">
										{getStatusIcon(loan)}
									</td>
								)}

								{/* Actions */}
								<td className="py-4 px-6 whitespace-nowrap">
									{type === 'owed' ? (
										<button
											onClick={() => handleMakePayment(loan.id)}
											className="btn-primary flex items-center text-xs px-3 py-1 rounded-lg hover:scale-105 transition-transform"
											aria-label={`Make payment for loan ID ${loan.id}`}
										>
											<FaMoneyCheckAlt className="mr-2 w-4 h-4" />
											<span>Make Payment</span>
										</button>
									) : (
										<span className="text-gray-400 text-sm italic">—</span>
									)}
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="glass-card p-8 text-center rounded-2xl">
					<FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
					<p className="text-gray-500 dark:text-gray-400 text-lg">No outstanding loans to display.</p>
					<p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
						{type === 'owned' ? 'You haven\'t lent any money yet.' : 'You don\'t owe any money.'}
					</p>
				</div>
			)}
		</div>
	);
};

export default OutstandingLoansTable;
