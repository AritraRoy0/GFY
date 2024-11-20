import {
	onSnapshot,
	collection,
	addDoc,
	query,
	where,
} from "firebase/firestore";
import { LoanRequest, Loan } from "./LoanInterfaces";
import { firestore } from "./../../../firebaseConfig";
const db = firestore;

/**
 * Fetches loan requests and listens for real-time updates.
 * @param callback - Function to call with the array of LoanRequests.
 * @returns A function to unsubscribe from the listener.
 */

export function fetchLoanRequests(
	callback: (loanRequests: LoanRequest[]) => void
) {
	const loanRequestsCollection = collection(db, "loanRequests");
	return onSnapshot(loanRequestsCollection, async (snapshot) => {
		const loanRequests: LoanRequest[] = [];

		for (const doc of snapshot.docs) {
			const data = doc.data();

			let borrowedBy = data.borrowedBy;

			// If borrowedBy is a DocumentReference, get its ID or fetch user data
			if (borrowedBy && typeof borrowedBy === "object" && "id" in borrowedBy) {
				// Option A: Get the UID from the DocumentReference
				borrowedBy = borrowedBy.id;

				// Option B (Optional): Fetch user data if you need more details
				// const userDoc = await getDoc(borrowedBy);
				// borrowedBy = userDoc.exists() ? userDoc.data().displayName : "Unknown User";
			}

			loanRequests.push({
				id: doc.id,
				borrowedBy: borrowedBy,
				principalAmount: data.principalAmount,
				interestRate: data.interestRate,
				termWeeks: data.termWeeks,
				purpose: data.purpose,
				timestamp: new Date(data.timestamp),
			});
		}

		callback(loanRequests);
	});
}

/**
 * Uploads a single loan request to Firestore.
 * @param loanRequest - The LoanRequest object to upload.
 * @returns A promise that resolves when the loan request is added.
 */
export async function uploadLoanRequest(
	loanRequest: LoanRequest
): Promise<void> {
	const loanRequestsCollection = collection(db, "loanRequests");
	try {
		await addDoc(loanRequestsCollection, loanRequest);
		console.log("Loan request uploaded successfully.");
	} catch (error) {
		console.error("Error uploading loan request:", error);
	}
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

      return {
        id: doc.id,
        borrowedBy: data.borrowedBy,
        principalAmount: data.principalAmount,
        interestRate: data.interestRate,
        termWeeks: data.termWeeks,
        purpose: data.purpose,
        timestamp: new Date(data.timestamp) ? new Date(data.timestamp) : new Date(data.timestamp),
      } as LoanRequest;
    });

    callback(userLoanRequests);
  });

  return () => {
    unsubscribe();
  };
}
