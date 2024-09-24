// src/utils/loanUtils.ts

import { Loan, Payment } from "../../models/Loan";

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
 * Calculates the total expected interest from loans owned.
 * @param loans - Array of Loan objects.
 * @returns Total interest expected.
 */
export const calculateTotalInterestExpected = (loans: Loan[]): number => {
  return loans
    .filter((loan) => loan.owner === "owned")
    .reduce((acc, loan) => {
      const totalPayment = loan.weeklyInstallment * loan.termWeeks;
      return acc + (totalPayment - loan.principalAmount);
    }, 0);
};

/**
 * Calculates the total interest to pay on loans owed.
 * @param loans - Array of Loan objects.
 * @returns Total interest to pay.
 */
export const calculateTotalInterestToPay = (loans: Loan[]): number => {
  return loans
    .filter((loan) => loan.owner === "owed")
    .reduce((acc, loan) => {
      const totalPayment = loan.weeklyInstallment * loan.termWeeks;
      return acc + (totalPayment - loan.principalAmount);
    }, 0);
};

/**
 * Calculates the average interest rate for loans owned.
 * @param loans - Array of Loan objects.
 * @returns Average interest rate owned.
 */
export const calculateAverageInterestRateOwned = (loans: Loan[]): number => {
  const ownedLoans = loans.filter((loan) => loan.owner === "owned");
  if (ownedLoans.length === 0) return 0;
  const totalInterestRate = ownedLoans.reduce(
    (acc, loan) => acc + loan.interestRate,
    0
  );
  return totalInterestRate / ownedLoans.length;
};

/**
 * Calculates the average interest rate for loans owed.
 * @param loans - Array of Loan objects.
 * @returns Average interest rate owed.
 */
export const calculateAverageInterestRateOwed = (loans: Loan[]): number => {
  const owedLoans = loans.filter((loan) => loan.owner === "owed");
  if (owedLoans.length === 0) return 0;
  const totalInterestRate = owedLoans.reduce(
    (acc, loan) => acc + loan.interestRate,
    0
  );
  return totalInterestRate / owedLoans.length;
};

/**
 * Calculates the total reserves.
 * @param loans - Array of Loan objects.
 * @returns Total reserves.
 */
export const calculateTotalReserves = (loans: Loan[]): number => {
  return loans.reduce((acc, loan) => {
    const totalPayment = loan.weeklyInstallment * loan.termWeeks;
    return acc + (totalPayment - loan.principalAmount);
  }, 0);
}


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
 * Calculates weekly data for loans.
 * @param loans - Array of Loan objects.
 * @returns Array of WeeklyData objects.
 */
export const calculateWeeklyData = (loans: Loan[]): WeeklyData[] => {
  if (!loans || loans.length === 0) {
    return [];
  }

  const maxTermWeeks = Math.max(...loans.map((loan) => loan.termWeeks));
  const weeks = Array.from({ length: maxTermWeeks }, (_, i) => i + 1);

  const weeklyData: WeeklyData[] = weeks.map((week) => ({
    week,
    projectedIncoming: 0,
    projectedPayouts: 0,
    net: 0,
  }));

  loans.forEach((loan) => {
    weeks.forEach((week) => {
      if (week > loan.termWeeks) return;

      // Find if a payment was made in this week
      const paymentMade: Payment | undefined = loan.paymentsMade.find(
        (payment) => payment.weekNumber === week
      );

      // Use the payment made or the scheduled installment
      const paymentAmount = paymentMade ? paymentMade.amount : loan.weeklyInstallment;

      if (loan.owner === "owned") {
        weeklyData[week - 1].projectedIncoming += paymentAmount;
      } else if (loan.owner === "owed") {
        weeklyData[week - 1].projectedPayouts += paymentAmount;
      }
    });
  });

  weeklyData.forEach((data) => {
    data.net = data.projectedIncoming - data.projectedPayouts;
  });

  return weeklyData;
};
