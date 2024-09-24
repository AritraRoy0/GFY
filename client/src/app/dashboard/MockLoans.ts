// MockLoans.ts
import { calculateWeeklyInstallment, Loan } from "../models/Loan";

const loans: Loan[] = [
  {
    id: "L001",
    owner: "owned",
    principalAmount: 5000,
    interestRate: 5,
    termWeeks: 12,
    weeklyInstallment: calculateWeeklyInstallment(5000, 5, 12),
    paymentsMade: [
      { weekNumber: 1, amount: 420 },
      { weekNumber: 2, amount: 420 },
      // Add more payments as needed
    ],
  },
  {
    id: "L002",
    owner: "owned",
    principalAmount: 10000,
    interestRate: 10,
    termWeeks: 12,
    weeklyInstallment: calculateWeeklyInstallment(10000, 10, 24),
    paymentsMade: [
      { weekNumber: 1, amount: 840 },
      { weekNumber: 2, amount: 840 },
      // Add more payments as needed
    ],
  },
  {
    id: "L003",
    owner: "owned",
    principalAmount: 15000,
    interestRate: 15,
    termWeeks: 12,
    weeklyInstallment: calculateWeeklyInstallment(15000, 15, 36),
    paymentsMade: [
      { weekNumber: 1, amount: 1260 },
      { weekNumber: 2, amount: 1260 },
      // Add more payments as needed
    ],
  },
  {
    id: "L004",
    owner: "owed",
    principalAmount: 20000,
    interestRate: 8,
    termWeeks: 12,
    weeklyInstallment: calculateWeeklyInstallment(20000, 8, 48),
    paymentsMade: [
      { weekNumber: 1, amount: 1680 },
      { weekNumber: 2, amount: 1680 },
      // Add more payments as needed
    ],
  },
];

export default loans;
