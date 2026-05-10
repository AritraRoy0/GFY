"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { CalendarDays, HandCoins, LockKeyhole, LogOut, Plus, UserRound, WalletCards } from "lucide-react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import LoanSummary from "./LoanSummary";
import { fetchBorrowedLoans, fetchLentLoans } from "../models/LoanAPIs";
import { Loan, calculateWeeklyAveragedInstallment } from "../models/LoanInterfaces";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const OwnProfile: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowedLoans, setBorrowedLoans] = useState<Loan[]>([]);
  const [lentLoans, setLentLoans] = useState<Loan[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "loans">("overview");

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
      <div className="app-page flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-700" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="app-page flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="surface-card max-w-md p-8 text-center">
            <LockKeyhole className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-semibold text-slate-950">Authentication required</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Sign in to view your profile and loan activity.</p>
            <Link href="/auth?tab=login" className="btn-primary mt-6">
              Go to Login
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName = currentUser.displayName || currentUser.email?.split("@")[0] || "Member";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="app-page flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6 sm:py-10">
        <div className="app-container space-y-6">
          <section className="surface-card overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-950 p-6 text-white sm:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-center sm:gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-white/10 text-2xl font-semibold sm:h-20 sm:w-20 sm:text-3xl">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Your profile</p>
                    <h1 className="mt-2 break-words text-2xl font-semibold tracking-tight sm:text-3xl">{displayName}</h1>
                    <p className="mt-1 break-all text-sm text-slate-300">{currentUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:w-96">
                  <ProfileDate label="Member since" value={formatDate(currentUser.metadata.creationTime)} />
                  <ProfileDate label="Last sign in" value={formatDate(currentUser.metadata.lastSignInTime)} />
                </div>
              </div>
            </div>
          </section>

          <div className="inline-flex w-full rounded-lg border border-slate-200 bg-white p-1 shadow-sm min-[420px]:w-auto">
            {[
              { key: "overview", label: "Overview" },
              { key: "loans", label: "Loans" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as "overview" | "loans")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors min-[420px]:flex-none ${
                  activeTab === tab.key ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" ? (
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Metric title="Total borrowed" value={currency.format(stats.totalBorrowed)} icon={<WalletCards className="h-5 w-5" />} />
              <Metric title="Total lent" value={currency.format(stats.totalLent)} icon={<HandCoins className="h-5 w-5" />} />
              <Metric title="Weekly payments" value={currency.format(stats.weeklyPayments)} icon={<CalendarDays className="h-5 w-5" />} />

              <div className="surface-card p-5 md:col-span-3">
                <h2 className="text-base font-semibold text-slate-950">Quick actions</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ActionLink href="/loanRequests" title="New loan request" description="Apply for a new loan" icon={<Plus className="h-5 w-5" />} />
                  <ActionLink href="/loanRequests" title="View marketplace" description="Review open requests" icon={<HandCoins className="h-5 w-5" />} />
                  <ActionLink href="/logout" title="Logout" description="Sign out of your account" icon={<LogOut className="h-5 w-5" />} />
                </div>
              </div>
            </section>
          ) : (
            <LoanSummary />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

function ProfileDate({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/5 p-3">
      <p className="text-xs text-slate-300">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function Metric({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">{icon}</div>
      </div>
    </div>
  );
}

function ActionLink({ href, title, description, icon }: { href: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-white">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-sky-700 shadow-sm">{icon}</span>
      <span>
        <span className="block text-sm font-semibold text-slate-950">{title}</span>
        <span className="mt-1 block text-sm text-slate-500">{description}</span>
      </span>
    </Link>
  );
}

export default OwnProfile;
