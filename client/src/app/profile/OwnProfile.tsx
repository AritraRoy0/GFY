"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  ArrowUpRight,
  CalendarDays,
  Fingerprint,
  HandCoins,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  Plus,
  WalletCards,
  Zap,
} from "lucide-react";
import AppShell from "../common/AppShell";
import { PageLoader } from "../common/LoadingSpinner";
import { CopyButton, Panel, SegmentedControl, StatCard, StatePanel } from "../common/ui";
import { formatCurrency, formatDate } from "../common/format";
import LoanSummary from "./LoanSummary";
import { InfoRow, ProfileHero, ProfileTab } from "./ProfileUI";
import { fetchBorrowedLoans, fetchLentLoans } from "../models/LoanAPIs";
import { Loan, calculateWeeklyAveragedInstallment } from "../models/LoanInterfaces";
import { RootState } from "../store";

const OwnProfile: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowedLoans, setBorrowedLoans] = useState<Loan[]>([]);
  const [lentLoans, setLentLoans] = useState<Loan[]>([]);
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const username = useSelector((state: RootState) => state.auth.user?.username);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeBorrowed = fetchBorrowedLoans(currentUser.uid, setBorrowedLoans);
    const unsubscribeLent = fetchLentLoans(currentUser.uid, setLentLoans);
    return () => {
      unsubscribeBorrowed();
      unsubscribeLent();
    };
  }, [currentUser]);

  const stats = useMemo(() => {
    const totalBorrowed = borrowedLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
    const totalLent = lentLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
    const weeklyPayments = borrowedLoans.reduce((sum, loan) => {
      return sum + calculateWeeklyAveragedInstallment(loan.principalAmount, loan.interestRate, loan.termWeeks);
    }, 0);

    return { totalBorrowed, totalLent, weeklyPayments };
  }, [borrowedLoans, lentLoans]);

  if (loading) {
    return (
      <AppShell>
        <PageLoader label="Loading profile" />
      </AppShell>
    );
  }

  if (!currentUser) {
    return (
      <AppShell>
        <StatePanel
          icon={<LockKeyhole />}
          title="Authentication required"
          description="Sign in to view your profile and loan activity."
          action={
            <Link href="/auth?tab=login" className="btn-primary">
              Sign in
            </Link>
          }
        />
      </AppShell>
    );
  }

  const displayName = username || currentUser.displayName || currentUser.email?.split("@")[0] || "Member";

  return (
    <AppShell>
      <div className="space-y-6">
        <ProfileHero
          id={currentUser.uid}
          name={displayName}
          subtitle={currentUser.email}
          role="Your profile"
          meta={[
            { label: "Member since", value: formatDate(currentUser.metadata.creationTime) },
            { label: "Last sign in", value: formatDate(currentUser.metadata.lastSignInTime) },
            { label: "Loans lent", value: <span className="num">{lentLoans.length}</span> },
            { label: "Loans borrowed", value: <span className="num">{borrowedLoans.length}</span> },
          ]}
          actions={
            <Link href="/dashboard" className="btn-secondary">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Open dashboard
            </Link>
          }
        />

        <SegmentedControl
          label="Profile sections"
          value={activeTab}
          onChange={setActiveTab}
          className="w-full sm:w-auto"
          options={[
            { value: "overview", label: "Overview" },
            { value: "loans", label: "My requests" },
          ]}
        />

        {activeTab === "overview" ? (
          <div className="space-y-4">
            <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <StatCard label="Total borrowed" value={formatCurrency(stats.totalBorrowed)} icon={<WalletCards />} tone="warning" />
              <StatCard label="Total lent" value={formatCurrency(stats.totalLent)} icon={<HandCoins />} tone="accent" />
              <StatCard label="Weekly payments" value={formatCurrency(stats.weeklyPayments)} icon={<CalendarDays />} hint="Across loans you owe" />
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <Panel icon={<Zap />} title="Quick actions">
                <div className="grid gap-2">
                  <ActionLink href="/loanRequests#composer" title="New loan request" description="Publish terms for lenders to review" icon={<Plus />} />
                  <ActionLink href="/loanRequests" title="View marketplace" description="Review and fund open requests" icon={<HandCoins />} />
                  <ActionLink href="/logout" title="Log out" description="Sign out of this device" icon={<LogOut />} danger />
                </div>
              </Panel>

              <Panel icon={<Fingerprint />} title="Account">
                <div className="grid gap-2">
                  <InfoRow icon={<Mail />} label="Email" value={currentUser.email || "Not provided"} />
                  <InfoRow
                    icon={<Fingerprint />}
                    label="Member ID"
                    value={<span className="num text-xs">{currentUser.uid}</span>}
                    action={<CopyButton value={currentUser.uid} />}
                  />
                </div>
              </Panel>
            </div>
          </div>
        ) : (
          <LoanSummary />
        )}
      </div>
    </AppShell>
  );
};

function ActionLink({
  href,
  title,
  description,
  icon,
  danger,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-lg border border-line bg-canvas/40 p-3.5 transition-colors hover:border-line-strong hover:bg-surface-2"
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong bg-surface-2 [&>svg]:h-4 [&>svg]:w-4 ${
          danger ? "text-negative" : "text-accent"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink">{title}</span>
        <span className="mt-0.5 block text-xs text-ink-muted">{description}</span>
      </span>
      <ArrowUpRight className="h-4 w-4 text-ink-faint transition-colors group-hover:text-ink" aria-hidden="true" />
    </Link>
  );
}

export default OwnProfile;
