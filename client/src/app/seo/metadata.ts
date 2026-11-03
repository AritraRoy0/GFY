import type { Metadata } from "next";
import { siteConfig } from "./site";

interface PageMetadataOptions {
  /** Page title without the site suffix; the root layout's template appends " | GoFundYourself". */
  title?: string;
  description?: string;
  /** Path for the canonical URL and og:url, e.g. "/about". */
  path: string;
  keywords?: string[];
  /** Keep the page out of search results while still letting crawlers follow its links. */
  noIndex?: boolean;
}

/**
 * Per-route metadata. Next.js replaces (rather than merges) `openGraph` and `twitter` objects from parent
 * layouts, so every route builds complete objects here. Social images come from the nearest
 * `opengraph-image.tsx` file convention and are added automatically.
 */
export function pageMetadata({ title, description = siteConfig.description, path, keywords, noIndex }: PageMetadataOptions): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;

  return {
    ...(title ? { title } : {}),
    description,
    ...(keywords ? { keywords: [...keywords, ...siteConfig.keywords] } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url: path,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: true,
            googleBot: { index: false, follow: true },
          },
        }
      : {}),
  };
}
