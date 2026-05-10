"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, CircleDollarSign, Percent, TrendingUp, UserRound } from "lucide-react";
import { fetchLoanRequests } from "../models/LoanRequestAPIs";
import { LoanRequest } from "../models/LoanInterfaces";

interface User {
  uid: string;
  displayName?: string;
  email?: string;
}

const LoanRequestCarousel: React.FC = () => {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = fetchLoanRequests((requests) => {
      setLoanRequests(requests);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAllUserDetails = async () => {
      const uniqueUids = Array.from(new Set(loanRequests.map((req) => req.borrowedBy)));
      const userPromises = uniqueUids.map((uid) => fetchUserDetails(uid));
      try {
        const users = await Promise.all(userPromises);
        const nextUserMap: Record<string, string> = {};
        users.forEach((user) => {
          nextUserMap[user.uid] = user.displayName || user.email || user.uid;
        });
        setUserMap(nextUserMap);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details.");
      }
    };

    if (loanRequests.length > 0) fetchAllUserDetails();
  }, [loanRequests]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-3 w-60 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-md border border-slate-200 bg-slate-50" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
        {error}
      </div>
    );
  }

  if (loanRequests.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <CircleDollarSign className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
        <p className="mt-4 text-sm font-semibold text-slate-800">No live requests yet</p>
        <p className="mt-1 text-sm text-slate-500">Published borrower requests will appear in this live view.</p>
      </div>
    );
  }

  const requests = loanRequests.length > 3 ? [...loanRequests, ...loanRequests] : loanRequests;

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">Live requests</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">Lending opportunities</h3>
        </div>
        <span className="badge">{loanRequests.length} open</span>
      </div>

      <motion.div
        className="flex gap-3"
        animate={loanRequests.length > 3 ? { x: ["0%", "-50%"] } : undefined}
        transition={loanRequests.length > 3 ? { duration: loanRequests.length * 5, repeat: Infinity, ease: "linear" } : undefined}
      >
        {requests.map((request, index) => (
          <TickerItem key={`${request.id}-${index}`} request={request} userName={userMap[request.borrowedBy]} />
        ))}
      </motion.div>
    </div>
  );
};

function TickerItem({ request, userName }: { request: LoanRequest; userName?: string }) {
  const profit = (request.principalAmount * request.interestRate) / 100;

  return (
    <article className="w-[17rem] shrink-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-700">
          <UserRound className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{userName || `User ${request.borrowedBy.slice(0, 5)}`}</p>
          <p className="text-xs text-slate-500">Borrower request</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <DataPoint icon={<CircleDollarSign className="h-4 w-4" />} label="Principal" value={`$${request.principalAmount.toLocaleString()}`} />
        <DataPoint icon={<Percent className="h-4 w-4" />} label="Interest" value={`${request.interestRate}%`} />
        <DataPoint icon={<CalendarDays className="h-4 w-4" />} label="Term" value={`${request.termWeeks} wks`} />
        <DataPoint icon={<TrendingUp className="h-4 w-4" />} label="Interest" value={`+$${profit.toLocaleString()}`} />
      </div>
    </article>
  );
}

function DataPoint({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-sky-700">{icon}</span>
      <span>
        <span className="block text-xs text-slate-500">{label}</span>
        <span className="block font-semibold text-slate-900">{value}</span>
      </span>
    </div>
  );
}

const fetchUserDetails = async (uid: string): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ uid, displayName: `User ${uid.slice(0, 5)}` });
    }, 100);
  });
};

export default LoanRequestCarousel;
