import { pageMetadata } from "../seo/metadata";

// Personal portfolio data: kept out of search results.
export const metadata = pageMetadata({
  title: "Dashboard",
  description: "Your GoFundYourself portfolio: loans you own, loans you owe, and pending request activity.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
