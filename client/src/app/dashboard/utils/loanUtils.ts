// src/utils/loanUtils.ts

import { Loan, Payment } from "../../models/Loan";

/**
 * Interface representing the structure of weekly data.
 */
export interface WeeklyData {
  week: number;
  projectedIncoming: number;
  projectedPayouts: number;
  net: number;
}

/**
 * Calculates the total principal amount of loans owned.
 * @param loans - Array of Loan objects.
 * @returns Total principal amount owned.
 */
export const calculateTotalOwned = (loans: Loan[]): number => {
  return loans
    .filter((loan) => loan.owner === "owned")
    .reduce((acc, loan) => acc + loan.principalAmount, 0);
};

/**
 * Calculates the total principal amount of loans owed.
 * @param loans - Array of Loan objects.
 * @returns Total principal amount owed.
 */
export const calculateTotalOwed = (loans: Loan[]): number => {
  return loans
    .filter((loan) => loan.owner === "owed")
    .reduce((acc, loan) => acc + loan.principalAmount, 0);
};

/**
 * Calculates the net credit (Total Owned - Total Owed).
 * @param totalOwned - Total loans owned.
 * @param totalOwed - Total loans owed.
 * @returns Net credit.
 */
export const calculateNetCredit = (
  totalOwned: number,
  totalOwed: number
): number => {
  return totalOwned - totalOwed;
};

/**
 * Aggregates all loan summary metrics.
 * @param loans - Array of Loan objects.
 * @returns An object containing all summary metrics.
 */
export interface LoanSummary {
  totalOwned: number;
  totalOwed: number;
  netCredit: number;
}

export const getLoanSummary = (loans: Loan[]): LoanSummary => {
  const totalOwned = calculateTotalOwned(loans);
  const totalOwed = calculateTotalOwed(loans);
  const netCredit = calculateNetCredit(totalOwned, totalOwed );


  return {
    totalOwned,
    totalOwed,
    netCredit,
  };
};
