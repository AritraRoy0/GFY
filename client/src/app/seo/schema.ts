import { absoluteUrl, siteConfig } from "./site";

// Stable @id values let separate JSON-LD blocks reference the same entities.
export const organizationId = absoluteUrl("/#organization");
export const websiteId = absoluteUrl("/#website");

export const organizationSchema = {
  "@type": "Organization",
  "@id": organizationId,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: absoluteUrl("/"),
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/logo.png"),
    width: 512,
    height: 512,
  },
  description: siteConfig.description,
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": websiteId,
  name: siteConfig.name,
  url: absoluteUrl("/"),
  description: siteConfig.description,
  inLanguage: siteConfig.language,
  publisher: { "@id": organizationId },
};

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
