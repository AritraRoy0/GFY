import React, { useEffect, useState } from 'react';
import { fetchBorrowedLoans, fetchLentLoans } from '../models/LoanAPIs';
import { Loan } from '../models/LoanInterfaces';

interface OutstandingLoansTableProps {
	userId: string;
	type: 'owed' | 'owned';
}

const OutstandingLoansTable: React.FC<OutstandingLoansTableProps> = ({ userId, type }) => {
	const [loans, setLoans] = useState<Loan[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let unsubscribe: () => void;

		if (type === 'owned') {
			unsubscribe = fetchLentLoans(userId, (lentLoans) => {
				setLoans(lentLoans);
				setLoading(false);
			}, (error) => {
				console.error('Error fetching lent loans:', error);
				setLoading(false);
			});
		} else {
			unsubscribe = fetchBorrowedLoans(userId, (borrowedLoans) => {
				setLoans(borrowedLoans);
				setLoading(false);
			}, (error) => {
				console.error('Error fetching borrowed loans:', error);
				setLoading(false);
			});
		}

		return () => unsubscribe();
	}, [userId, type]);

	const handleMakePayment = (loanId: string) => {
		// Logic to handle payment (e.g., redirect to a payment page or trigger a payment flow)
		console.log(`Making payment for loan ID: ${loanId}`);
		// You can replace the console log with the actual payment logic.
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-lg max-w-full mx-auto">
			<h2 className="text-2xl font-semibold mb-6 text-gray-800">
				{type === 'owned' ? 'Loans You Own' : 'Loans You Owe'}
			</h2>
			{loading ? (
				<p className="text-gray-500">Loading...</p>
			) : loans.length > 0 ? (
				<table className="table-auto w-full text-left border-separate border-spacing-2">
					<thead className="bg-gray-100 text-sm text-gray-600">
					<tr>
						<th className="p-3 text-left">Amount</th>
						<th className="p-3 text-left">{type === 'owned' ? 'Borrower' : 'Lender'}</th>
						{type === 'owed' && <th className="p-3 text-left">Actions</th>}
					</tr>
					</thead>
					<tbody className="text-sm text-gray-700">
					{loans.map((loan) => (
						<tr key={loan.id} className="hover:bg-gray-50 transition-colors">
							<td className="p-3">${loan.principalAmount.toFixed(2)}</td>
							<td className="p-3">
								{type === 'owned' ? loan.borrowedBy : loan.ownedBy}
							</td>
							{type === 'owed' && (
								<td className="p-3">
									<button
										onClick={() => handleMakePayment(loan.id)}
										className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
									>
										Make Payment
									</button>
								</td>
							)}
						</tr>
					))}
					</tbody>
				</table>
			) : (
				<p className="text-gray-500">No outstanding loans to display.</p>
			)}
		</div>
	);
};

export default OutstandingLoansTable;
