import { collection, addDoc } from "firebase/firestore";
import { firestore } from "./../../../firebaseConfig";
export interface Payment {
	weekNumber: number;
	amount: number;
}

export interface Loan {
	id: string;
	ownedBy: string;
	borrowedBy: string;
	principalAmount: number;
	interestRate: number; // Annual interest rate in percent
	termWeeks: number;
	weeklyInstallment: number;
	paymentsMade: Payment[];
}

/**
 * Calculates the weekly installment for a loan.
 * @param principal - The principal loan amount.
 * @param annualInterestRate - The annual interest rate (in percent).
 * @param termWeeks - The loan term in weeks.
 * @returns The weekly installment amount.
 */
export function calculateWeeklyInstallment(
	principal: number,
	annualInterestRate: number,
	termWeeks: number
): number {
	// Convert annual interest rate to weekly interest rate
	const weeklyInterestRate = annualInterestRate / 52 / 100;

	if (weeklyInterestRate === 0) {
		// If interest rate is zero, simply divide principal by term
		return parseFloat((principal / termWeeks).toFixed(2));
	}

	// Calculate weekly installment using the annuity formula
	const numerator = principal * weeklyInterestRate;
	const denominator = 1 - Math.pow(1 + weeklyInterestRate, -termWeeks);
	const installment = numerator / denominator;

	return parseFloat(installment.toFixed(2)); // Round to 2 decimal places
}

/**
 * Uploads a custom loan to the Firestore database.
 * @param loan - The loan object to upload.
 */
async function uploadLoan(loan: Loan) {
	try {
        const db = firestore;
		const loansCollection = collection(db, "loans");
		const docRef = await addDoc(loansCollection, loan);
		console.log("Loan added with ID:", docRef.id);
	} catch (error) {
		console.error("Error adding loan:", error);
	}
}
