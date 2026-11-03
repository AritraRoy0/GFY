import Link from "next/link";
import Logo from "./Logo";

const footerColumns = [
  {
    title: "Product",
    links: [
      { href: "/loanRequests", label: "Loan marketplace" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/#calculator", label: "Repayment calculator" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/#workflow", label: "How it works" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/auth?tab=signup", label: "Create account" },
      { href: "/auth?tab=login", label: "Sign in" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-canvas">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" aria-hidden="true" />
      <div className="app-container py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <Logo size="sm" />
              <p className="text-sm font-semibold text-ink">GoFundYourself</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-ink-muted">
              Peer-to-peer lending with every term in plain sight. Borrowers publish, lenders review, both sides track repayment.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="data-label">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-2 transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Vault Technologies LLC. All rights reserved.</p>
          <p className="font-mono uppercase tracking-[0.16em]">P2P lending workspace</p>
        </div>
      </div>
    </footer>
  );
}
