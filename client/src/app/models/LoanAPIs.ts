import { firestore } from "../../../firebaseConfig";
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Loan } from './LoanInterfaces';

const db = firestore;

export function fetchBorrowedLoans(
	userId: string,
	callback: (loans: Loan[]) => void,
	errorCallback?: (error: any) => void
) {
	const loansCollection = collection(db, 'loans');
	const qBorrowed = query(loansCollection, where('borrowedBy', '==', userId));

	const unsubscribe = onSnapshot(
		qBorrowed,
		(snapshot) => {
			const borrowedLoans = snapshot.docs.map((doc) => {
				const data = doc.data();
				return {
					id: doc.id,
					borrowedBy: data.borrowedBy,
					ownedBy: data.ownedBy,
					principalAmount: data.principalAmount,
					interestRate: data.interestRate,
					termWeeks: data.termWeeks,
					paymentsMade: data.paymentsMade,
				} as Loan;
			});
			callback(borrowedLoans);
		},
		(error) => {
			console.error('Error fetching borrowed loans:', error);
			errorCallback?.(error);
		}
	);

	return unsubscribe;
}

export function fetchLentLoans(
	userId: string,
	callback: (loans: Loan[]) => void,
	errorCallback?: (error: any) => void
) {
	const loansCollection = collection(db, 'loans');
	const qLent = query(loansCollection, where('ownedBy', '==', userId));

	const unsubscribe = onSnapshot(
		qLent,
		(snapshot) => {
			const lentLoans = snapshot.docs.map((doc) => {
				const data = doc.data();
				return {
					id: doc.id,
					borrowedBy: data.borrowedBy,
					ownedBy: data.ownedBy,
					principalAmount: data.principalAmount,
					interestRate: data.interestRate,
					termWeeks: data.termWeeks,
					paymentsMade: data.paymentsMade,
				} as Loan;
			});
			callback(lentLoans);
		},
		(error) => {
			console.error('Error fetching lent loans:', error);
			errorCallback?.(error);
		}
	);

	return unsubscribe;
}
