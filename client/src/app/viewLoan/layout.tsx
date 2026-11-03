import { pageMetadata } from "../seo/metadata";

// The review screen depends on in-app state (the selected request), so it has no indexable content.
export const metadata = pageMetadata({
  title: "Review Loan Request",
  description: "Review a loan request's terms and repayment schedule before funding.",
  path: "/viewLoan",
  noIndex: true,
});

export default function ViewLoanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
