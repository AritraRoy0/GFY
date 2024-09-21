// models/Loan.ts
export interface Loan {
	id: string;
	owner: string;
	principalAmount: number;
	interestRate: number;
	termWeeks: number;
	weeklyInstallment: number;
	paymentsMade: Payment[];
}

export interface Payment {
	weekNumber: number;
	amount: number;
}

export const calculateWeeklyInstallment = (
	principalAmount: number,
	interestRate: number,
	termWeeks: number
): number => {
	const totalInterest =
		principalAmount * (interestRate / 100) * (termWeeks / 52);
	const totalAmount = principalAmount + totalInterest;
	return totalAmount / termWeeks;
};
