"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { AlertCircle, ArrowUpRight, Bell, Briefcase, LockKeyhole, RefreshCcw } from "lucide-react";
import { RootState } from "../store";
import AppShell from "../common/AppShell";
import { PageLoader } from "../common/LoadingSpinner";
import { LiveDot, PageHeader, Panel, SegmentedControl, StatePanel } from "../common/ui";
import Notifications from "./Notifications";
import OutstandingLoansTable from "./LoanTable";
import SummarySection from "./SummarySection";
import ChartsSection from "./ChartsSection";
import { fetchBorrowedLoans, fetchLentLoans } from "@/app/models/LoanAPIs";
import { fetchUserLoanRequests } from "@/app/models/LoanRequestAPIs";
import { Loan, LoanRequest } from "@/app/models/LoanInterfaces";

export default function DashboardPage() {
  const { user, initialized } = useSelector((state: RootState) => state.auth);
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
  const [loaded, setLoaded] = useState({ lent: false, borrowed: false, requests: false });
  const [error, setError] = useState<string | null>(null);
  const [positionsTab, setPositionsTab] = useState<"owned" | "owed">("owned");

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = fetchLentLoans(
      userId,
      (loans) => {
        setLentLoans(loans);
        setLoaded((value) => ({ ...value, lent: true }));
      },
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
      (loans) => {
        setBorrowedLoans(loans);
        setLoaded((value) => ({ ...value, borrowed: true }));
      },
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
      return;
    }

    const unsubscribe = fetchUserLoanRequests(
      userId,
      (loanRequests: LoanRequest[]) => {
        const requestNotifications = loanRequests.map((request) => ({
          id: `loan_${request.id}`,
          message: `Your loan request for $${request.principalAmount.toLocaleString()} is pending review.`,
          type: "info" as const,
          timestamp: request.timestamp?.toDate?.() ?? new Date(),
        }));

        setNotifications(requestNotifications);
        setLoaded((value) => ({ ...value, requests: true }));
      },
      (err) => {
        console.error("Error fetching user loan requests:", err);
        setError("Failed to load notifications.");
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

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  if (!initialized || (userId && !error && !(loaded.lent && loaded.borrowed && loaded.requests))) {
    return (
      <AppShell>
        <PageLoader label="Syncing portfolio" />
      </AppShell>
    );
  }

  if (!userId) {
    return (
      <AppShell>
        <StatePanel
          icon={<LockKeyhole />}
          title="Sign in to view your dashboard"
          description="Your portfolio overview, loan activity, and notifications are tied to your account."
          action={
            <>
              <Link href="/auth?tab=login" className="btn-primary">
                Sign in
              </Link>
              <Link href="/auth?tab=signup" className="btn-secondary">
                Create account
              </Link>
            </>
          }
        />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <StatePanel
          icon={<AlertCircle />}
          tone="negative"
          title="Dashboard unavailable"
          description={error}
          action={
            <button type="button" onClick={() => window.location.reload()} className="btn-secondary">
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Retry
            </button>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          kicker={
            <>
              <LiveDot />
              Portfolio · {today}
            </>
          }
          title={<>Welcome back{user?.username ? <>, <span className="text-gradient">{user.username}</span></> : ""}.</>}
          description="Track loans you own, loans you owe, and pending request activity in realtime."
          actions={
            <Link href="/loanRequests" className="btn-secondary">
              Browse marketplace
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        <SummarySection
          totalOwned={totals.totalOwned}
          totalOwed={totals.totalOwed}
          totalReserves={totals.totalReserves}
          lentLoans={lentLoans}
          borrowedLoans={borrowedLoans}
        />

        <ChartsSection lentLoans={lentLoans} borrowedLoans={borrowedLoans} />

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Panel
            className="xl:col-span-2"
            icon={<Briefcase />}
            title="Positions"
            description={positionsTab === "owned" ? "Loans where you are the lender." : "Loans where you are the borrower."}
            actions={
              <SegmentedControl
                label="Position type"
                value={positionsTab}
                onChange={setPositionsTab}
                options={[
                  { value: "owned", label: "Lent", count: lentLoans.length },
                  { value: "owed", label: "Borrowed", count: borrowedLoans.length },
                ]}
              />
            }
          >
            <OutstandingLoansTable type={positionsTab} loans={positionsTab === "owned" ? lentLoans : borrowedLoans} />
          </Panel>

          <Panel
            icon={<Bell />}
            title="Activity"
            description="Requests awaiting a lender."
            actions={notifications.length > 0 && <span className="badge badge-warning num">{notifications.length} pending</span>}
            bodyClassName="max-h-[28rem] overflow-y-auto p-4 sm:p-5"
          >
            <Notifications notifications={notifications} />
          </Panel>
        </section>
      </div>
    </AppShell>
  );
}
