// MockLoans.ts
import { calculateWeeklyInstallment, Loan } from "../models/Loan";

// Mock data for 4 loans
const loans: Loan[] = [
  {
    id: "L001",
    owner: "owned",
    principalAmount: 5000,
    interestRate: 5, // 5% annual interest
    termWeeks: 12, // 12-week loan term
    weeklyInstallment: calculateWeeklyInstallment(5000, 5, 12),
    paymentsMade: [
      { weekNumber: 1, amount: 430 },
      { weekNumber: 2, amount: 430 },
      { weekNumber: 3, amount: 430 },
    ],
  },
  {
    id: "L002",
    owner: "owned",
    principalAmount: 10000,
    interestRate: 7, // 7% annual interest
    termWeeks: 12, // 12-week loan term
    weeklyInstallment: calculateWeeklyInstallment(10000, 7, 12),
    paymentsMade: [
      { weekNumber: 1, amount: 860 },
      { weekNumber: 2, amount: 860 },
      { weekNumber: 3, amount: 860 },
      { weekNumber: 4, amount: 860 },
    ],
  },
  {
    id: "L003",
    owner: "owned",
    principalAmount: 20000,
    interestRate: 10, // 10% annual interest
    termWeeks: 12, // 12-week loan term
    weeklyInstallment: calculateWeeklyInstallment(20000, 10, 12),
    paymentsMade: [
      { weekNumber: 1, amount: 1750 },
      { weekNumber: 2, amount: 1750 },
      { weekNumber: 3, amount: 1750 },
      { weekNumber: 4, amount: 1750 },
      { weekNumber: 5, amount: 1750 },
    ],
  },
  {
    id: "L004",
    owner: "owed",
    principalAmount: 15000,
    interestRate: 8, // 8% annual interest
    termWeeks: 12, // 12-week loan term
    weeklyInstallment: calculateWeeklyInstallment(15000, 8, 12),
    paymentsMade: [
      { weekNumber: 1, amount: 1380 },
      { weekNumber: 2, amount: 1380 },
      { weekNumber: 3, amount: 1380 },
      { weekNumber: 4, amount: 1380 },
    ],
  },
];

export default loans;
