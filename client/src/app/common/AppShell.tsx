"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  HandCoins,
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Plus,
  Search,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { Avatar, LiveDot } from "./ui";
import { openCommandPalette, useModifierKeyLabel } from "./CommandPalette";
import { RootState } from "../store";

interface Crumb {
  label: string;
  href?: string;
}

const workspaceNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/loanRequests", label: "Marketplace", icon: HandCoins },
  { href: "/profile", label: "Profile", icon: UserRound },
];

const resourceNav = [
  { href: "/about", label: "About", icon: Info },
  { href: "/", label: "Home", icon: Home },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`) || (href === "/loanRequests" && pathname === "/viewLoan");
}

/** Workspace layout: persistent sidebar on desktop, drawer on mobile, sticky top bar with breadcrumbs. */
export default function AppShell({
  children,
  breadcrumbs,
  actions,
}: {
  children: React.ReactNode;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const modKey = useModifierKeyLabel();

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const crumbs = breadcrumbs ?? defaultCrumbs(pathname);

  return (
    <div className="app-page lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-canvas/85 backdrop-blur-xl lg:flex" aria-label="Workspace">
        <SidebarContent pathname={pathname} modKey={modKey} />
      </aside>

      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="scrim absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              className="relative flex h-full w-72 max-w-[85vw] border-r border-line bg-canvas"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="absolute right-3 top-3.5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-2 hover:text-ink"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent pathname={pathname} modKey={modKey} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-canvas/75 backdrop-blur-xl">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="lg:hidden" aria-label="GoFundYourself home">
              <Logo size="sm" />
            </Link>

            <nav aria-label="Breadcrumb" className="hidden min-w-0 flex-1 sm:block">
              <ol className="flex items-center gap-1.5 text-sm">
                <li className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">Workspace</li>
                {crumbs.map((crumb, index) => {
                  const last = index === crumbs.length - 1;
                  return (
                    <li key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
                      {crumb.href && !last ? (
                        <Link href={crumb.href} className="truncate text-ink-muted transition-colors hover:text-ink">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className={`truncate ${last ? "font-medium text-ink" : "text-ink-muted"}`} aria-current={last ? "page" : undefined}>
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              {actions}
              <ThemeToggle />
              <button
                type="button"
                onClick={openCommandPalette}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface/60 text-ink-2 hover:border-line-strong hover:text-ink lg:hidden"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
              <Link href="/loanRequests#composer" className="btn-primary h-9 px-3 py-0 text-xs sm:text-sm">
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">New request</span>
                <span className="sm:hidden">New</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</div>
        </main>

        <footer className="border-t border-line px-4 py-4 text-xs text-ink-faint sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[90rem] flex-col justify-between gap-2 sm:flex-row">
            <span>&copy; {new Date().getFullYear()} Vault Technologies LLC</span>
            <span className="font-mono uppercase tracking-[0.16em]">GoFundYourself workspace</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SidebarContent({ pathname, modKey }: { pathname: string; modKey: string }) {
  const { user, initialized } = useSelector((state: RootState) => state.auth);
  const displayName = user?.username || user?.email?.split("@")[0] || "Member";

  return (
    <div className="flex w-full flex-col">
      <div className="flex h-14 items-center gap-2.5 border-b border-line px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size="sm" />
          <span className="text-sm font-semibold tracking-tight text-ink">GoFundYourself</span>
        </Link>
      </div>

      <div className="px-3 pt-4">
        <button
          type="button"
          onClick={openCommandPalette}
          className="flex h-9 w-full items-center gap-2 rounded-lg border border-line bg-surface/60 px-3 text-xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
        >
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="flex-1 text-left">Search or jump to...</span>
          <span className="kbd">{modKey} K</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Sidebar">
        <NavSection title="Workspace" items={workspaceNav} pathname={pathname} />
        <NavSection title="Resources" items={resourceNav} pathname={pathname} className="mt-6" />
      </nav>

      <div className="space-y-3 border-t border-line p-3">
        <div className="rounded-lg border border-line bg-surface/50 px-3 py-2" title="Workspace data streams live from the database">
          <LiveDot label="Realtime sync" />
        </div>

        {!initialized ? (
          <div className="h-[52px] animate-pulse rounded-lg bg-surface-2" />
        ) : user ? (
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
            <Avatar id={user.id} name={displayName} size="sm" />
            <Link href="/profile" className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{displayName}</p>
              <p className="truncate text-xs text-ink-muted">{user.email}</p>
            </Link>
            <Link
              href="/logout"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-2 hover:text-negative"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link href="/auth?tab=login" className="btn-secondary px-2 py-2 text-xs">
              <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
              Sign in
            </Link>
            <Link href="/auth?tab=signup" className="btn-primary px-2 py-2 text-xs">
              <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
              Join
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function NavSection({
  title,
  items,
  pathname,
  className = "",
}: {
  title: string;
  items: Array<{ href: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
  pathname: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="data-label px-3 pb-2">{title}</p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-surface-2 text-ink" : "text-ink-muted hover:bg-surface/80 hover:text-ink"
                }`}
              >
                {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent shadow-[0_0_12px_rgb(var(--c-accent))]" aria-hidden="true" />}
                <Icon className={`h-4 w-4 ${active ? "text-accent" : "text-ink-faint group-hover:text-ink-2"}`} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function defaultCrumbs(pathname: string): Crumb[] {
  const match = [...workspaceNav, ...resourceNav].find((item) => item.href !== "/" && pathname.startsWith(item.href));
  return match ? [{ label: match.label, href: match.href }] : [];
}
