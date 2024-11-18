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
 * Calculates the total amount to be paid for a loan, including interest.
 * @param loan - A single Loan object.
 * @returns Total amount to be paid for the loan.
 */
export const calculateTotalAmountToBePaid = (loan: Loan): number => {
  return loan.weeklyInstallment * loan.termWeeks;
};

/**
 * Calculates the total amount to be paid for owned loans.
 * @param loans - Array of Loan objects.
 * @returns Total amount to be paid for owned loans.
 */
export const calculateTotalAmountToBePaidOwned = (loans: Loan[]): number => {
  return loans
    .filter((loan) => loan.owner === "owned")
    .reduce((acc, loan) => acc + loan.weeklyInstallment * loan.termWeeks, 0);
};

/**
 * Calculates the total amount to be paid for owed loans.
 * @param loans - Array of Loan objects.
 * @returns Total amount to be paid for owed loans.
 */
export const calculateTotalAmountToBePaidOwed = (loans: Loan[]): number => {
  return loans
    .filter((loan) => loan.owner === "owed")
    .reduce((acc, loan) => acc + loan.weeklyInstallment * loan.termWeeks, 0);
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
 * Calculates the total reserves (sum of all interests).
 * @param loans - Array of Loan objects.
 * @returns Total reserves.
 */
export const calculateTotalReserves = (loans: Loan[]): number => {
  return loans.reduce((acc, loan) => {
    const totalPayment = loan.weeklyInstallment * loan.termWeeks;
    return acc + (totalPayment - loan.principalAmount);
  }, 0);
};

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

/**
 * Interface representing the structure of cumulative weekly data.
 */
export interface CumulativeWeeklyData {
  week: number;
  cumulativeIncoming: number;
  cumulativePayouts: number;
  cumulativeNet: number;
}

/**
 * Calculates cumulative weekly data for loans.
 * @param loans - Array of Loan objects.
 * @returns Array of CumulativeWeeklyData objects.
 */
export const calculateCumulativeWeeklyData = (loans: Loan[]): CumulativeWeeklyData[] => {
  if (!loans || loans.length === 0) {
    return [];
  }

  const maxTermWeeks = Math.max(...loans.map((loan) => loan.termWeeks));
  const weeks = Array.from({ length: maxTermWeeks }, (_, i) => i + 1);

  const cumulativeData: CumulativeWeeklyData[] = weeks.map((week) => ({
    week,
    cumulativeIncoming: 0,
    cumulativePayouts: 0,
    cumulativeNet: 0,
  }));

  let totalIncoming = 0;
  let totalPayouts = 0;

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
        cumulativeData[week - 1].cumulativeIncoming += paymentAmount;
        totalIncoming += paymentAmount;
      } else if (loan.owner === "owed") {
        cumulativeData[week - 1].cumulativePayouts += paymentAmount;
        totalPayouts += paymentAmount;
      }
    });
  });

  // Calculate cumulative sums
  cumulativeData.forEach((data, index) => {
    if (index > 0) {
      data.cumulativeIncoming += cumulativeData[index - 1].cumulativeIncoming;
      data.cumulativePayouts += cumulativeData[index - 1].cumulativePayouts;
    }
    data.cumulativeNet = data.cumulativeIncoming - data.cumulativePayouts;
  });

  return cumulativeData;
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
  totalInterestExpected: number;
  totalInterestToPay: number;
  totalAmountToBePaidOwned: number;
  totalAmountToBePaidOwed: number;
  averageInterestRateOwned: number;
  averageInterestRateOwed: number;
  totalReserves: number;
}

export const getLoanSummary = (loans: Loan[]): LoanSummary => {
  const totalOwned = calculateTotalOwned(loans);
  const totalOwed = calculateTotalOwed(loans);
  const netCredit = calculateNetCredit(totalOwned, totalOwed);
  const totalInterestExpected = calculateTotalInterestExpected(loans);
  const totalInterestToPay = calculateTotalInterestToPay(loans);
  const totalAmountToBePaidOwned = calculateTotalAmountToBePaidOwned(loans);
  const totalAmountToBePaidOwed = calculateTotalAmountToBePaidOwed(loans);
  const averageInterestRateOwned = calculateAverageInterestRateOwned(loans);
  const averageInterestRateOwed = calculateAverageInterestRateOwed(loans);
  const totalReserves = calculateTotalReserves(loans);

  return {
    totalOwned,
    totalOwed,
    netCredit,
    totalInterestExpected,
    totalInterestToPay,
    totalAmountToBePaidOwned,
    totalAmountToBePaidOwed,
    averageInterestRateOwned,
    averageInterestRateOwed,
    totalReserves,
  };
};
