/**
 * Single source of truth for SEO-facing site facts. Canonical URLs, the sitemap, robots.txt, structured data,
 * and social cards all derive from here, so production URLs stay consistent even on preview deployments.
 */
export const siteConfig = {
  name: "GoFundYourself",
  legalName: "Vault Technologies LLC",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://gofundyourselfinc.com").replace(/\/+$/, ""),
  title: "GoFundYourself | Peer-to-Peer Lending Marketplace",
  tagline: "Peer-to-peer lending with every term in plain sight.",
  description:
    "Peer-to-peer lending marketplace. Post loan requests from $500 to $10,000, compare rates and terms, and track weekly repayments in real time.",
  keywords: [
    "peer-to-peer lending",
    "P2P lending",
    "P2P loans",
    "peer to peer loans",
    "personal loans",
    "borrow money",
    "lend money",
    "loan marketplace",
    "crowdlending",
    "social lending",
    "small personal loan",
    "loan repayment calculator",
    "weekly loan repayment",
    "GoFundYourself",
  ],
  locale: "en_US",
  language: "en-US",
  themeColor: "#0e7490",
  loanRange: { min: 500, max: 10000, minRate: 5, maxTermWeeks: 52 },
} as const;

export const absoluteUrl = (path = "/") => new URL(path, `${siteConfig.url}/`).toString();
