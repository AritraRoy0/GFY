"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { AlertCircle, CalendarDays, ClipboardList, Hourglass, LockKeyhole, Percent } from "lucide-react";
import { fetchUserLoanRequests } from "../models/LoanRequestAPIs";
import { calculateFlatRepayment, LoanRequest } from "../models/LoanInterfaces";
import { EmptyState, Skeleton } from "../common/ui";
import { formatCurrency, formatDate, formatPercent, shortId } from "../common/format";

const LoanSummary: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLoanRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribeLoanRequests = fetchUserLoanRequests(
      currentUser.uid,
      (userLoanRequests) => {
        setLoanRequests(userLoanRequests);
        setLoading(false);
      },
      () => {
        setError("Failed to load loan requests. Please try again later.");
        setLoading(false);
      }
    );
    return () => unsubscribeLoanRequests();
  }, [currentUser]);

  const convertToDate = (timestamp: Timestamp | Date | null): Date | undefined => {
    if (timestamp instanceof Timestamp) return timestamp.toDate();
    if (timestamp instanceof Date) return timestamp;
    return undefined;
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="panel space-y-4 p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-14 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <EmptyState icon={<AlertCircle className="text-negative" />} title="Could not load requests" description={error} />;
  }

  if (!currentUser) {
    return <EmptyState icon={<LockKeyhole />} title="Log in required" description="Please log in to view your loan requests." />;
  }

  if (loanRequests.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList />}
        title="No active loan requests"
        description="Requests you create in the marketplace will appear here until a lender funds them."
        action={
          <Link href="/loanRequests#composer" className="btn-primary btn-sm">
            Create a request
          </Link>
        }
        className="py-16"
      />
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-ink">Your loan requests</h2>
          <p className="mt-0.5 text-xs text-ink-muted">Published and waiting for a lender to review.</p>
        </div>
        <span className="badge badge-warning num">{loanRequests.length} pending</span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loanRequests.map((request) => {
          const date = convertToDate(request.timestamp);
          const { weeklyPayment } = calculateFlatRepayment(request.principalAmount, request.interestRate, request.termWeeks);

          return (
            <article key={request.id} className="panel card-hover flex flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="badge badge-warning">
                  <Hourglass className="h-3 w-3" aria-hidden="true" />
                  Pending review
                </span>
                <span className="num text-xs text-ink-faint">#{shortId(request.id)}</span>
              </div>

              <p className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-ink">{formatCurrency(request.principalAmount)}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-ink-2">
                  <Percent className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  <span className="num">{formatPercent(request.interestRate)} interest</span>
                </div>
                <div className="flex items-center gap-2 text-ink-2">
                  <CalendarDays className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  <span className="num">
                    {request.termWeeks} week{request.termWeeks === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <p className="mt-4 line-clamp-3 flex-1 rounded-lg border border-line bg-canvas/40 p-3 text-sm leading-6 text-ink-2">{request.purpose}</p>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs">
                <span className="text-ink-muted">Requested {date ? formatDate(date) : "just now"}</span>
                <span className="num font-medium text-ink">{formatCurrency(weeklyPayment, { cents: true })}/wk</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default LoanSummary;
