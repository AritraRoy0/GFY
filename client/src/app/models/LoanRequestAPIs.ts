// src/models/LoanRequestAPIs.ts

import {
	onSnapshot,
	collection,
	addDoc,
	query,
	where,
	serverTimestamp,
	Timestamp,
} from "firebase/firestore";
import { LoanRequest, NewLoanRequest } from "./LoanInterfaces"; // Ensure the correct path
import { firestore } from "../../../firebaseConfig"; // Adjust the path as necessary

const db = firestore;

/**
 * Fetches all loan requests and listens for real-time updates.
 * @param callback - Function to call with the array of LoanRequests.
 * @returns A function to unsubscribe from the listener.
 */
export function fetchLoanRequests(
	callback: (loanRequests: LoanRequest[]) => void
) {
	const loanRequestsCollection = collection(db, "loanRequests");

	return onSnapshot(loanRequestsCollection, (snapshot) => {
		const loanRequests: LoanRequest[] = snapshot.docs.map((doc) => {
			const data = doc.data();

			let borrowedBy = data.borrowedBy;

			// If borrowedBy is a DocumentReference, extract its ID
			if (borrowedBy && typeof borrowedBy === "object" && "id" in borrowedBy) {
				borrowedBy = borrowedBy.id;
			}

			// Ensure timestamp is a Firestore Timestamp object or Date
			let timestampField: Timestamp | Date | null = null;
			if (data.timestamp instanceof Timestamp) {
				timestampField = data.timestamp;
			} else if (data.timestamp instanceof Date) {
				// This scenario shouldn't occur if serverTimestamp() is used correctly
				timestampField = data.timestamp;
			}
			// If timestamp is missing or invalid, leave it as null

			return {
				id: doc.id,
				borrowedBy: borrowedBy,
				principalAmount: data.principalAmount,
				interestRate: data.interestRate,
				termWeeks: data.termWeeks,
				purpose: data.purpose,
				timestamp: timestampField,
			} as LoanRequest;
		});

		callback(loanRequests);
	});
}

/**
 * Fetches loan requests made by the specified user and listens for real-time updates.
 * @param userId - The UID of the user.
 * @param callback - Function to call with the array of LoanRequests.
 * @returns A function to unsubscribe from the listener.
 */
export function fetchUserLoanRequests(
	userId: string,
	callback: (loanRequests: LoanRequest[]) => void
) {
	const loanRequestsCollection = collection(db, "loanRequests");
	const qBorrowed = query(loanRequestsCollection, where("borrowedBy", "==", userId));

	const unsubscribe = onSnapshot(qBorrowed, (snapshot) => {
		const userLoanRequests: LoanRequest[] = snapshot.docs.map((doc) => {
			const data = doc.data();

			let borrowedBy = data.borrowedBy;

			// If borrowedBy is a DocumentReference, extract its ID
			if (borrowedBy && typeof borrowedBy === "object" && "id" in borrowedBy) {
				borrowedBy = borrowedBy.id;
			}

			// Ensure timestamp is a Firestore Timestamp object or Date
			let timestampField: Timestamp | Date | null = null;
			if (data.timestamp instanceof Timestamp) {
				timestampField = data.timestamp;
			} else if (data.timestamp instanceof Date) {
				// This scenario shouldn't occur if serverTimestamp() is used correctly
				timestampField = data.timestamp;
			}
			// If timestamp is missing or invalid, leave it as null

			return {
				id: doc.id,
				borrowedBy: borrowedBy,
				principalAmount: data.principalAmount,
				interestRate: data.interestRate,
				termWeeks: data.termWeeks,
				purpose: data.purpose,
				timestamp: timestampField,
			} as LoanRequest;
		});

		callback(userLoanRequests);
	});

	return () => {
		unsubscribe();
	};
}

/**
 * Uploads a new loan request to Firestore.
 * @param newLoanRequest - The NewLoanRequest object to upload.
 * @returns A promise that resolves when the loan request is added.
 */
export async function uploadLoanRequest(
	newLoanRequest: NewLoanRequest
): Promise<void> {
	const loanRequestsCollection = collection(db, "loanRequests");

	try {
		await addDoc(loanRequestsCollection, {
			borrowedBy: newLoanRequest.borrowedBy,
			principalAmount: newLoanRequest.principalAmount,
			interestRate: newLoanRequest.interestRate,
			termWeeks: newLoanRequest.termWeeks,
			purpose: newLoanRequest.purpose,
			timestamp: serverTimestamp(), // Set timestamp server-side
		});
		console.log("Loan request uploaded successfully.");
	} catch (error) {
		console.error("Error uploading loan request:", error);
		throw error; // Rethrow to handle in the component
	}
}
