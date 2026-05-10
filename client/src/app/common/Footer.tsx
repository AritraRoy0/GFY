import Link from "next/link";
import { Linkedin, Twitter, Instagram } from "lucide-react";
import Logo from "./Logo";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/loanRequests", label: "Loan marketplace" },
  { href: "/auth?tab=signup", label: "Create account" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="app-container py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <p className="text-sm font-semibold text-slate-950">GoFundYourself</p>
              <p className="text-sm text-slate-500">&copy; {year} Vault Technologies LLC</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-slate-600">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-slate-950">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {[
              { icon: Twitter, label: "Twitter" },
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Instagram, label: "Instagram" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.label}
                  aria-label={item.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
