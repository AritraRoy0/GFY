// src/models/Loan.ts

export interface Payment {
	weekNumber: number;
	amount: number;
  }
  
  export interface Loan {
	id: string;
	owner: "owned" | "owed";
	principalAmount: number;
	interestRate: number; // Annual interest rate in percentage
	termWeeks: number;
	weeklyInstallment: number;
	paymentsMade: Payment[];
  }
  
  /**
   * Calculates the weekly installment for a loan using the amortization formula.
   * @param principalAmount - The principal amount of the loan.
   * @param annualInterestRate - The annual interest rate in percentage.
   * @param termWeeks - The loan term in weeks.
   * @returns The weekly installment amount.
   */
  export function calculateWeeklyInstallment(
	principalAmount: number,
	annualInterestRate: number,
	termWeeks: number
  ): number {
	const weeklyInterestRate = annualInterestRate / 100 / 52;
	const numerator = weeklyInterestRate * principalAmount;
	const denominator = 1 - Math.pow(1 + weeklyInterestRate, -termWeeks);
	return numerator / denominator;
  }
  