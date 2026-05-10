"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { AlertCircle, Bell, HandCoins, RefreshCcw, UserRound, UsersRound } from "lucide-react";
import { RootState } from "../store";
import Header from "../common/Header";
import Footer from "../common/Footer";
import LoadingSpinner from "../common/LoadingSpinner";
import Notifications from "./Notifications";
import OutstandingLoansTable from "./LoanTable";
import SummarySection from "./SummarySection";
import ChartsSection from "./ChartsSection";
import { fetchBorrowedLoans, fetchLentLoans } from "@/app/models/LoanAPIs";
import { fetchUserLoanRequests } from "@/app/models/LoanRequestAPIs";
import { Loan, LoanRequest } from "@/app/models/LoanInterfaces";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id || null;

  const [lentLoans, setLentLoans] = useState<Loan[]>([]);
  const [borrowedLoans, setBorrowedLoans] = useState<Loan[]>([]);
  const [notifications, setNotifications] = useState<
    {
      id: string;
      message: string;
      type: "info";
      timestamp: Date;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = fetchLentLoans(
      userId,
      (loans) => setLentLoans(loans),
      (err) => {
        console.error("Error fetching lent loans:", err);
        setError("Failed to load lent loans.");
      }
    );

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = fetchBorrowedLoans(
      userId,
      (loans) => setBorrowedLoans(loans),
      (err) => {
        console.error("Error fetching borrowed loans:", err);
        setError("Failed to load borrowed loans.");
      }
    );

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const unsubscribe = fetchUserLoanRequests(
      userId,
      (loanRequests: LoanRequest[]) => {
        const requestNotifications = loanRequests.map((request) => ({
          id: `loan_${request.id}`,
          message: `Your loan request for $${request.principalAmount.toLocaleString()} is pending review.`,
          type: "info" as const,
          timestamp: request.timestamp.toDate(),
        }));

        setNotifications(requestNotifications);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching user loan requests:", err);
        setError("Failed to load notifications.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const totals = useMemo(() => {
    return {
      totalOwned: lentLoans.reduce((sum, loan) => sum + loan.principalAmount, 0),
      totalOwed: borrowedLoans.reduce((sum, loan) => sum + loan.principalAmount, 0),
      totalReserves: 10000,
    };
  }, [borrowedLoans, lentLoans]);

  if (loading) {
    return (
      <div className="app-page flex flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="surface-card p-8 text-center">
            <LoadingSpinner size="large" className="mb-4" />
            <p className="text-sm font-semibold text-slate-700">Loading dashboard data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="app-page flex flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="surface-card max-w-md p-8 text-center">
            <UserRound className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-semibold text-slate-950">Sign in to view your dashboard</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your portfolio overview, loan activity, and notifications are tied to your account.
            </p>
            <Link href="/auth?tab=login" className="btn-primary mt-6">
              Go to Login
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-page flex flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="surface-card max-w-md p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-600" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-semibold text-slate-950">Dashboard unavailable</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
            <button type="button" onClick={() => window.location.reload()} className="btn-secondary mt-6">
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-page flex flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-10">
        <div className="app-container space-y-6">
          <section className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Welcome back{user?.username ? `, ${user.username}` : ""}.
              </h1>
              <p className="mt-2 text-sm text-slate-600">Track loans you own, loans you owe, and pending request activity.</p>
            </div>
            <Link href="/loanRequests" className="btn-primary">
              <HandCoins className="h-4 w-4" aria-hidden="true" />
              New or Review Loan
            </Link>
          </section>

          <SummarySection
            totalOwned={totals.totalOwned}
            totalOwed={totals.totalOwed}
            totalReserves={totals.totalReserves}
            lentLoans={lentLoans}
            borrowedLoans={borrowedLoans}
          />

          <ChartsSection
            lentLoans={lentLoans}
            borrowedLoans={borrowedLoans}
            totalReserves={totals.totalReserves}
          />

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="surface-card p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950">
                    <UsersRound className="h-5 w-5 text-sky-700" aria-hidden="true" />
                    Loans you own
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">Loans where you are the lender.</p>
                </div>
              </div>
              <OutstandingLoansTable userId={userId} type="owned" loans={lentLoans} />
            </div>

            <div className="surface-card p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950">
                    <UserRound className="h-5 w-5 text-red-600" aria-hidden="true" />
                    Loans you owe
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">Loans where you are the borrower.</p>
                </div>
              </div>
              <OutstandingLoansTable userId={userId} type="owed" loans={borrowedLoans} />
            </div>
          </section>

          <section className="surface-card p-5">
            <div className="mb-2 flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-600" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">Recent notifications</h2>
            </div>
            <Notifications notifications={notifications} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
