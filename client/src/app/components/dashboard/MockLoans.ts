import { calculateWeeklyInstallment } from "../../models/Loan";

const loans = [
    {
      loanId: "L001",
      borrowerId: "B001",
      lenderId: "L001",
      principalAmount: 5000,
      interestRate: 5,
      termWeeks: 52,
      weeklyInstallment: calculateWeeklyInstallment(5000, 5, 52),
      payments: [
        { weekNumber: 1, amount: 100 },
        { weekNumber: 2, amount: 100 },
        // Add more payments as needed
      ],
    },
    {
      loanId: "L002",
      borrowerId: "B002",
      lenderId: "L002",
      principalAmount: 3000,
      interestRate: 4,
      termWeeks: 26,
      weeklyInstallment: calculateWeeklyInstallment(3000, 4, 26),
      payments: [
        { weekNumber: 1, amount: 115 },
        { weekNumber: 2, amount: 115 },
        // Add more payments as needed
      ],
    },
    {
      loanId: "L003",
      borrowerId: "B003",
      lenderId: "L003",
      principalAmount: 7000,
      interestRate: 6,
      termWeeks: 78,
      weeklyInstallment: calculateWeeklyInstallment(7000, 6, 78),
      payments: [
        { weekNumber: 1, amount: 90 },
        { weekNumber: 2, amount: 90 },
        // Add more payments as needed
      ],
    },
    {
      loanId: "L004",
      borrowerId: "B004",
      lenderId: "L004",
      principalAmount: 10000,
      interestRate: 7,
      termWeeks: 104,
      weeklyInstallment: calculateWeeklyInstallment(10000, 7, 104),
      payments: [
        { weekNumber: 1, amount: 120 },
        { weekNumber: 2, amount: 120 },
        // Add more payments as needed
      ],
    },
    {
      loanId: "L005",
      borrowerId: "B005",
      lenderId: "L005",
      principalAmount: 2000,
      interestRate: 3,
      termWeeks: 13,
      weeklyInstallment: calculateWeeklyInstallment(2000, 3, 13),
      payments: [
        { weekNumber: 1, amount: 160 },
        { weekNumber: 2, amount: 160 },
        // Add more payments as needed
      ],
    },
    {
      loanId: "L006",
      borrowerId: "B006",
      lenderId: "L006",
      principalAmount: 8000,
      interestRate: 5.5,
      termWeeks: 65,
      weeklyInstallment: calculateWeeklyInstallment(8000, 5.5, 65),
      payments: [
        { weekNumber: 1, amount: 130 },
        { weekNumber: 2, amount: 130 },
        // Add more payments as needed
      ],
    },
  ];
  
  export default loans;
  