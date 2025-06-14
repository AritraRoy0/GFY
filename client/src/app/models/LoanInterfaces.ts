// src/models/Loan.ts
// src/models/Loan.ts

import { Timestamp } from "firebase/firestore";

// class structure for LoanRequest data type
export interface LoanRequest {
	id: string;
	borrowedBy: string;
	principalAmount: number;
	interestRate: number; // Annual interest rate in percentage
	termWeeks: number;
	purpose: string;
	timestamp: Timestamp;
}

// class structure of client side preparation for uploading LoanRequest datatype
// subset of interface LoanRequest
export interface NewLoanRequest {
	borrowedBy: string;
	principalAmount: number;
	interestRate: number;
	termWeeks: number;
	purpose: string;
}


// class structure of payment datatype
export interface Payment {
	weekNumber: number;
	amount: number;
  }

// class structure of loan database
export interface Loan {
	id: string;
	borrowedBy: string;
	ownedBy: string;
	principalAmount: number;
	interestRate: number; // Annual interest rate in percentage
	termWeeks: number;
	paymentsMade: Payment[];
	timestamp: Date;
  }


  /**
   * Calculates the weekly installment for a loan using the amortization formula.
   * @param principalAmount - The principal amount of the loan.
   * @param annualInterestRate - The annual interest rate in percentage.
   * @param termWeeks - The loan term in weeks.
   * @returns The weekly installment amount.
   */
  export function calculateWeeklyAveragedInstallment(
	principalAmount: number,
	annualInterestRate: number,
	termWeeks: number
  ): number {
	const weeklyInterestRate = annualInterestRate / 100 / 52;
	const numerator = weeklyInterestRate * principalAmount;
	const denominator = 1 - Math.pow(1 + weeklyInterestRate, -termWeeks);
	return numerator / denominator;
  }
  