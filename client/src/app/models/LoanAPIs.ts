import { firestore } from "../../../firebaseConfig";
import { collection, query, where, onSnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Loan } from './LoanInterfaces';

const db = firestore;

/**
 * Maps a Firestore loan document to a Loan. `timestamp` is a Firestore Timestamp (set via serverTimestamp)
 * and is converted to a Date; it can be briefly null while a server timestamp is pending.
 */
function toLoan(doc: QueryDocumentSnapshot<DocumentData>): Loan {
	const data = doc.data();
	return {
		id: doc.id,
		borrowedBy: data.borrowedBy,
		ownedBy: data.ownedBy,
		principalAmount: data.principalAmount,
		interestRate: data.interestRate,
		termWeeks: data.termWeeks,
		paymentsMade: data.paymentsMade ?? [],
		timestamp: data.timestamp?.toDate?.() ?? null,
	} as Loan;
}

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
			callback(snapshot.docs.map(toLoan));
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
			callback(snapshot.docs.map(toLoan));
		},
		(error) => {
			console.error('Error fetching lent loans:', error);
			errorCallback?.(error);
		}
	);

	return unsubscribe;
}

/**
 * Fetches all loans from the Firestore 'loans' collection.
 * Provides real-time updates through Firestore's onSnapshot listener.
 *
 * @param callback - Function to handle the array of Loan objects.
 * @param errorCallback - Optional function to handle errors.
 * @returns A function to unsubscribe from the Firestore listener.
 */
export function fetchLoans(
	callback: (loans: Loan[]) => void,
	errorCallback?: (error: any) => void
) {
	const loansCollection = collection(db, 'loans');
	const q = query(loansCollection); // No filters applied

	const unsubscribe = onSnapshot(
		q,
		(snapshot) => {
			callback(snapshot.docs.map(toLoan));
		},
		(error) => {
			console.error('Error fetching all loans:', error);
			if (errorCallback) {
				errorCallback(error);
			}
		}
	);

	return unsubscribe;
}
