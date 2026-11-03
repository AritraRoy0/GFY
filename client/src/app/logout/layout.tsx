import { pageMetadata } from "../seo/metadata";

export const metadata = pageMetadata({
  title: "Signing Out",
  path: "/logout",
  noIndex: true,
});

export default function LogoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
