// src/models/LoanRequestAPIs.ts

import {
	onSnapshot,
	collection,
	addDoc,
	query,
	where,
	serverTimestamp,
	doc,
	deleteDoc,
} from "firebase/firestore";
import {LoanRequest, NewLoanRequest} from "./LoanInterfaces";
import {firestore} from "../../../firebaseConfig";

const db = firestore;

/**
 * Fetches all loan requests and listens for real-time updates.
 * @param callback - Function to call with the array of LoanRequests.
 * @param errorCallback - Optional function to call if an error occurs.
 * @returns A function to unsubscribe from the listener.
 */
export function fetchLoanRequests(
	callback: (loanRequests: LoanRequest[]) => void,
	errorCallback?: (error: any) => void
) {
	const loanRequestsCollection = collection(db, "loanRequests");

	return onSnapshot(
		loanRequestsCollection,
		(snapshot) => {
			const loanRequests = snapshot.docs.map((doc) => {
				const data = doc.data();

				return {
					id: doc.id,
					borrowedBy: data.borrowedBy?.id || data.borrowedBy, // Extract ID if it's a DocumentReference
					principalAmount: data.principalAmount,
					interestRate: data.interestRate,
					termWeeks: data.termWeeks,
					purpose: data.purpose,
					timestamp: data.timestamp || null, // Assign null if timestamp is missing
				} as LoanRequest;
			});

			callback(loanRequests);
		},
		(error) => {
			console.error("Error fetching loan requests:", error);
			errorCallback?.(error);
		}
	);
}

/**
 * Fetches loan requests made by the specified user and listens for real-time updates.
 * @param userId - The UID of the user.
 * @param callback - Function to call with the array of LoanRequests.
 * @param errorCallback - Optional function to call if an error occurs.
 * @returns A function to unsubscribe from the listener.
 */
export function fetchUserLoanRequests(
	userId: string,
	callback: (loanRequests: LoanRequest[]) => void,
	errorCallback?: (error: any) => void
) {
	const loanRequestsCollection = collection(db, "loanRequests");
	const qBorrowed = query(loanRequestsCollection, where("borrowedBy", "==", userId));

	return onSnapshot(
		qBorrowed,
		(snapshot) => {
			const userLoanRequests = snapshot.docs.map((doc) => {
				const data = doc.data();

				return {
					id: doc.id,
					borrowedBy: data.borrowedBy?.id || data.borrowedBy,
					principalAmount: data.principalAmount,
					interestRate: data.interestRate,
					termWeeks: data.termWeeks,
					purpose: data.purpose,
					timestamp: data.timestamp || null,
				} as LoanRequest;
			});

			callback(userLoanRequests);
		},
		(error) => {
			console.error("Error fetching user loan requests:", error);
			errorCallback?.(error);
		}
	);
}

/**
 * Uploads a new loan request to Firestore.
 * @param newLoanRequest - The NewLoanRequest object to upload.
 * @returns A promise that resolves when the loan request is added.
 */
export async function uploadLoanRequest(newLoanRequest: NewLoanRequest): Promise<void> {
	try {
		await addDoc(collection(db, "loanRequests"), {
			...newLoanRequest,
			timestamp: serverTimestamp(),
		});
		console.log("Loan request uploaded successfully.");
	} catch (error) {
		console.error("Error uploading loan request:", error);
		throw error;
	}
}

/**
 * Approves a loan request and converts it to a loan.
 * @param loanRequest - The loan request to approve.
 * @param userId - The ID of the user approving the loan.
 * @returns A promise that resolves when the loan is approved.
 */
export async function approveLoan(loanRequest: LoanRequest, userId: string): Promise<void> {
	if (!userId) {
		throw new Error("User ID is required to approve a loan.");
	}

	try {
		// Delete the loan request
		await deleteDoc(doc(collection(db, "loanRequests"), loanRequest.id));

		// Create a new loan entry
		await addDoc(collection(db, "loans"), {
			id: loanRequest.id,
			borrowedBy: loanRequest.borrowedBy,
			ownedBy: userId,
			principalAmount: loanRequest.principalAmount,
			interestRate: loanRequest.interestRate,
			termWeeks: loanRequest.termWeeks,
			paymentsMade: [],
			timestamp: serverTimestamp(),
		});

		console.log("Loan approved and updated successfully.");
	} catch (error) {
		console.error("Error approving loan:", error);
		throw error;
	}
}
