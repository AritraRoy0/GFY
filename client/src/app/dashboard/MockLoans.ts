import { calculateWeeklyInstallment } from "../models/Loan";
import { Loan } from "../models/Loan";
const loans: Loan[] = [
  {
    id: "L001",
    borrowerId: "B001",
    lenderId: "L001",
    principalAmount: 5000,
    interestRate: 5,
    termWeeks: 12,
    weeklyInstallment: calculateWeeklyInstallment(5000, 5, 12),
    payments: [
      { weekNumber: 1, amount: 420 },
      { weekNumber: 2, amount: 420 },
      // Add more payments as needed
    ],
  },
  {
    id: "L002",
    borrowerId: "B002",
    lenderId: "L002",
    principalAmount: 3000,
    interestRate: 4,
    termWeeks: 12,
    weeklyInstallment: calculateWeeklyInstallment(3000, 4, 12),
    payments: [
      { weekNumber: 1, amount: 260 },
      { weekNumber: 2, amount: 260 },
      // Add more payments as needed
    ],
  },
  {
    id: "L003",
    borrowerId: "B003",
    lenderId: "L003",
    principalAmount: 7000,
    interestRate: 6,
    termWeeks: 12,
    weeklyInstallment: calculateWeeklyInstallment(7000, 6, 12),
    payments: [
      { weekNumber: 1, amount: 620 },
      { weekNumber: 2, amount: 620 },
      // Add more payments as needed
    ],
  },
  {
    id: "L004",
    borrowerId: "B004",
    lenderId: "L004",
    principalAmount: 10000,
    interestRate: 7,
    termWeeks: 12,
    weeklyInstallment: calculateWeeklyInstallment(10000, 7, 12),
    payments: [
      { weekNumber: 1, amount: 860 },
      { weekNumber: 2, amount: 860 },
      // Add more payments as needed
    ],
  },
  {
    id: "L005",
    borrowerId: "B005",
    lenderId: "L005",
    principalAmount: 2000,
    interestRate: 3,
    termWeeks: 12,
    weeklyInstallment: calculateWeeklyInstallment(2000, 3, 12),
    payments: [
      { weekNumber: 1, amount: 170 },
      { weekNumber: 2, amount: 170 },
      // Add more payments as needed
    ],
  },
  {
    id: "L006",
    borrowerId: "B006",
    lenderId: "L006",
    principalAmount: 8000,
    interestRate: 5.5,
    termWeeks: 12,
    weeklyInstallment: calculateWeeklyInstallment(8000, 5.5, 12),
    payments: [
      { weekNumber: 1, amount: 700 },
      { weekNumber: 2, amount: 700 },
      // Add more payments as needed
    ],
  },
];

export default loans;