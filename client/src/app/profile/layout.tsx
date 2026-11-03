import { pageMetadata } from "../seo/metadata";

// Member profiles include personal details, so they are never indexed.
export const metadata = pageMetadata({
  title: "Member Profile",
  description: "GoFundYourself member profile and lending history.",
  path: "/profile",
  noIndex: true,
});

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
