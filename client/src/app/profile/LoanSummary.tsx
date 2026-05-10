"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { AlertCircle, CalendarDays, ClipboardList, LockKeyhole, Percent } from "lucide-react";
import { fetchUserLoanRequests } from "../models/LoanRequestAPIs";
import { LoanRequest } from "../models/LoanInterfaces";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

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
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="surface-card animate-pulse p-5">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="mt-4 h-8 w-40 rounded bg-slate-200" />
            <div className="mt-4 h-4 w-56 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <StateCard
        icon={<AlertCircle className="h-10 w-10 text-red-600" />}
        title="Could not load requests"
        description={error}
      />
    );
  }

  if (!currentUser) {
    return (
      <StateCard
        icon={<LockKeyhole className="h-10 w-10 text-slate-400" />}
        title="Log in required"
        description="Please log in to view your loan requests."
      />
    );
  }

  if (loanRequests.length === 0) {
    return (
      <StateCard
        icon={<ClipboardList className="h-10 w-10 text-slate-400" />}
        title="No active loan requests"
        description="Requests you create in the marketplace will appear here."
      />
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-950">Your loan requests</h2>
        <p className="mt-1 text-sm text-slate-500">Requests you have published for lender review.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loanRequests.map((request) => {
          const date = convertToDate(request.timestamp);
          const formattedDate = date
            ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "Date not available";

          return (
            <article key={request.id} className="surface-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="badge">Pending review</span>
                  <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                    {currency.format(request.principalAmount)}
                  </h3>
                </div>
                <span className="rounded-md bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-500">
                  #{request.id.slice(0, 6)}
                </span>
              </div>

              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <Percent className="h-4 w-4 text-sky-700" aria-hidden="true" />
                  {request.interestRate}% interest
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CalendarDays className="h-4 w-4 text-sky-700" aria-hidden="true" />
                  {request.termWeeks} week{request.termWeeks === 1 ? "" : "s"} term
                </div>
                <p className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">{request.purpose}</p>
              </div>

              <p className="mt-4 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
                Requested {formattedDate}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

function StateCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-4 text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default LoanSummary;
