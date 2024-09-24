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
   * Function to calculate weekly installment using the formula for an installment loan
   * @param principal - Principal amount of the loan
   * @param annualInterestRate - Annual interest rate in percentage
   * @param termWeeks - Term of the loan in weeks
   * @returns Weekly installment amount
   */
  export const calculateWeeklyInstallment = (
	principal: number,
	annualInterestRate: number,
	termWeeks: number
  ): number => {
	const weeklyInterestRate = annualInterestRate / 52 / 100;
	const installment =
	  (principal * weeklyInterestRate) /
	  (1 - Math.pow(1 + weeklyInterestRate, -termWeeks));
	return parseFloat(installment.toFixed(2));
  };
  