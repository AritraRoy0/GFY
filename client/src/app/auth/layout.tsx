import { pageMetadata } from "../seo/metadata";

export const metadata = pageMetadata({
  title: "Sign In or Create a Free Account",
  description:
    "Create a free GoFundYourself account to post loan requests, fund peer-to-peer loans, and track repayments, or sign in to your lending dashboard.",
  path: "/auth",
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
