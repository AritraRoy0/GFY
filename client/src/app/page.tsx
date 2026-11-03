import LandingPage from "./LandingPage";
import JsonLd from "./seo/JsonLd";
import { faqs } from "./seo/faq";
import { pageMetadata } from "./seo/metadata";
import { organizationId, websiteId } from "./seo/schema";
import { absoluteUrl, siteConfig } from "./seo/site";

export const metadata = pageMetadata({ path: "/" });

const structuredData = [
  {
    "@type": "WebApplication",
    "@id": absoluteUrl("/#app"),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    isPartOf: { "@id": websiteId },
    publisher: { "@id": organizationId },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Publish peer-to-peer loan requests from $500 to $10,000",
      "Flat-rate repayment calculator with weekly installments",
      "Live loan marketplace with search, filters, and sorting",
      "Full repayment schedule before funding",
      "Realtime portfolio dashboard for lenders and borrowers",
    ],
  },
  {
    "@type": "FAQPage",
    "@id": absoluteUrl("/#faq"),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];

export default function Page() {
  return (
    <>
      <JsonLd data={structuredData} />
      <LandingPage />
    </>
  );
}
