import JsonLd from "../seo/JsonLd";
import { pageMetadata } from "../seo/metadata";
import { breadcrumbSchema, websiteId } from "../seo/schema";
import { absoluteUrl } from "../seo/site";

const description =
  "Browse open peer-to-peer loan requests from $500 to $10,000. Compare amount, interest rate, term, and lender yield, or post your own loan request in minutes.";

export const metadata = pageMetadata({
  title: "Loan Marketplace — Open P2P Loan Requests",
  description,
  path: "/loanRequests",
  keywords: ["loan requests", "invest in personal loans", "lend to individuals", "post a loan request"],
});

export default function LoanRequestsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          {
            "@type": "CollectionPage",
            "@id": absoluteUrl("/loanRequests#page"),
            url: absoluteUrl("/loanRequests"),
            name: "GoFundYourself loan marketplace",
            description,
            isPartOf: { "@id": websiteId },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Loan marketplace", path: "/loanRequests" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
