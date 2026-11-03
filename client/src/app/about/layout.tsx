import JsonLd from "../seo/JsonLd";
import { pageMetadata } from "../seo/metadata";
import { breadcrumbSchema, organizationId, websiteId } from "../seo/schema";
import { absoluteUrl } from "../seo/site";

const description =
  "How GoFundYourself makes peer-to-peer lending transparent: direct borrower-lender agreements, upfront repayment math, and no bank in the middle.";

export const metadata = pageMetadata({
  title: "About — Transparent Peer-to-Peer Lending",
  description,
  path: "/about",
  keywords: ["how peer-to-peer lending works", "bank-free lending", "transparent loan terms"],
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          {
            "@type": "AboutPage",
            "@id": absoluteUrl("/about#page"),
            url: absoluteUrl("/about"),
            name: "About GoFundYourself",
            description,
            isPartOf: { "@id": websiteId },
            about: { "@id": organizationId },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
