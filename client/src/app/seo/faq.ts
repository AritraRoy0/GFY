/**
 * Landing page FAQ. Rendered visibly on the page and as FAQPage structured data from the same source,
 * so the markup always matches what visitors can read.
 */
export const faqs: Array<{ question: string; answer: string }> = [
  {
    question: "What is peer-to-peer lending?",
    answer:
      "Peer-to-peer (P2P) lending connects people who want to borrow with people who want to lend, without a bank acting as the middleman. On GoFundYourself, borrowers publish a loan request with their own amount, rate, and term, and other members review and fund it directly.",
  },
  {
    question: "How much can I borrow, and for how long?",
    answer:
      "Each loan request can be between $500 and $10,000, with a minimum interest rate of 5% and a repayment term from 1 to 52 weeks. Borrowers choose the terms; lenders decide whether to fund them.",
  },
  {
    question: "How are repayments calculated?",
    answer:
      "GoFundYourself uses flat-rate interest: the rate is applied once to the principal, and the total is split into equal weekly payments. For example, $2,500 at 8% over 12 weeks is $2,700 in total, or $225 per week. The repayment calculator shows the exact figures before you post.",
  },
  {
    question: "Who funds the loans?",
    answer:
      "Other GoFundYourself members. Lenders browse the loan marketplace, review each borrower's profile, purpose, and full repayment schedule, and approve the requests they want to fund.",
  },
  {
    question: "How do I track a loan after it is funded?",
    answer:
      "Funded loans appear on both the borrower's and the lender's dashboard, with principal, terms, repayment progress, and outstanding balances updating in real time.",
  },
  {
    question: "Does it cost anything to create an account?",
    answer:
      "No. Creating a GoFundYourself account is free, and you can explore the marketplace and the repayment calculator before signing up.",
  },
];
