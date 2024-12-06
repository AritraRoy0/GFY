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
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
				{type === 'owned' ? (
					<>
						<FaUserFriends className="text-gray-600 w-5 h-5" />
						<span>Loans You Own</span>
					</>
				) : (
					<>
						<FaUser className="text-gray-600 w-5 h-5" />
						<span>Loans You Owe</span>
					</>
				)}
			</h2>

			{loans.length > 0 ? (
				<div className="overflow-x-auto">
					<table className="min-w-full border-collapse text-sm">
						<thead>
						<tr
							className={`${
								type === 'owned' ? 'bg-gray-200' : 'bg-gray-100'
							} text-gray-800 uppercase text-xs font-semibold tracking-wider`}
						>
							<th className="py-3 px-4 text-left">Amount</th>
							<th className="py-3 px-4 text-left">
								{type === 'owned' ? 'Borrower' : 'Lender'}
							</th>
							{type === 'owned' && <th className="py-3 px-4 text-left">Status</th>}
							<th className="py-3 px-4 text-left">Actions</th>
						</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
						{loans.map((loan) => (
							<tr key={loan.id} className="hover:bg-gray-50 transition-colors">
								{/* Amount */}
								<td className="py-3 px-4 text-gray-800 font-medium whitespace-nowrap">
									${loan.principalAmount.toLocaleString()}
								</td>

								{/* Borrower or Lender with Copy Button */}
								<td className="py-3 px-4 text-gray-800 flex items-center space-x-2">
									{type === 'owned' ? (
										<>
											<FaUserFriends className="text-gray-500 w-4 h-4" />
											<span>{loan.borrowedBy}</span>
											<button
												onClick={() => handleCopyId(loan.borrowedBy)}
												className="relative text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
												aria-label={`Copy Borrower ID ${loan.borrowedBy}`}
											>
												{copiedLoanId === loan.borrowedBy ? (
													<FaClipboardCheck className="w-4 h-4 text-green-500" />
												) : (
													<FaCopy className="w-4 h-4" />
												)}
												{copiedLoanId === loan.borrowedBy && (
													<span className="absolute top-0 left-0 mt-6 bg-black text-white text-xs rounded py-1 px-2">
                              Copied!
                            </span>
												)}
											</button>
										</>
									) : (
										<>
											<FaUser className="text-gray-500 w-4 h-4" />
											<span>{loan.ownedBy}</span>
											<button
												onClick={() => handleCopyId(loan.ownedBy)}
												className="relative text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
												aria-label={`Copy Lender ID ${loan.ownedBy}`}
											>
												{copiedLoanId === loan.ownedBy ? (
													<FaClipboardCheck className="w-4 h-4 text-green-500" />
												) : (
													<FaCopy className="w-4 h-4" />
												)}
												{copiedLoanId === loan.ownedBy && (
													<span className="absolute top-0 left-0 mt-6 bg-black text-white text-xs rounded py-1 px-2">
                              Copied!
                            </span>
												)}
											</button>
										</>
									)}
								</td>

								{/* Status (Only for 'owned' type) */}
								{type === 'owned' && (
									<td className="py-3 px-4 whitespace-nowrap">
										{getStatusIcon(loan)}
									</td>
								)}

								{/* Actions */}
								<td className="py-3 px-4 whitespace-nowrap">
									{type === 'owed' ? (
										<button
											onClick={() => handleMakePayment(loan.id)}
											className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
				<p className="text-gray-500">No outstanding loans to display.</p>
			)}
		</div>
	);
};

export default OutstandingLoansTable;
