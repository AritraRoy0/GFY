"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CircleDollarSign } from "lucide-react";
import { fetchLoanRequests } from "../models/LoanRequestAPIs";
import { LoanRequest } from "../models/LoanInterfaces";
import { formatCurrency, formatPercent, shortId } from "./format";
import { memberName, useUserDirectory } from "./useUserDirectory";
import { LiveDot, Skeleton } from "./ui";

const SCROLL_THRESHOLD = 6;

/** Live feed of open loan requests, styled as a market terminal. */
const LoanRequestCarousel: React.FC = () => {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const knownIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    const unsubscribe = fetchLoanRequests(
      (requests) => {
        // Highlight requests that arrive after the first snapshot.
        if (knownIds.current) {
          const arrivals = requests.filter((request) => !knownIds.current?.has(request.id)).map((request) => request.id);
          if (arrivals.length) {
            setFreshIds(new Set(arrivals));
            window.setTimeout(() => setFreshIds(new Set()), 2400);
          }
        }
        knownIds.current = new Set(requests.map((request) => request.id));
        setLoanRequests(requests);
        setLoading(false);
      },
      () => {
        setError("Live feed unavailable right now.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const sorted = useMemo(
    () => [...loanRequests].sort((a, b) => (b.timestamp?.toMillis?.() ?? 0) - (a.timestamp?.toMillis?.() ?? 0)),
    [loanRequests]
  );
  const members = useUserDirectory(useMemo(() => sorted.map((request) => request.borrowedBy), [sorted]));

  const totals = useMemo(() => {
    const volume = sorted.reduce((sum, request) => sum + request.principalAmount, 0);
    const averageRate = sorted.length ? sorted.reduce((sum, request) => sum + request.interestRate, 0) / sorted.length : 0;
    return { volume, averageRate };
  }, [sorted]);

  const scrolling = sorted.length > SCROLL_THRESHOLD;
  const rows = scrolling ? [...sorted, ...sorted] : sorted;

  return (
    <div className="overflow-hidden rounded-xl border border-line-strong bg-surface shadow-lift">
      <div className="flex items-center gap-3 border-b border-line bg-canvas/50 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        </div>
        <p className="flex-1 truncate font-mono text-[11px] text-ink-muted">gfy://marketplace/open-requests</p>
        <LiveDot label={loading ? "Connecting" : "Live"} tone={error ? "negative" : loading ? "warning" : "positive"} />
      </div>

      <div className="grid grid-cols-[4.5rem_1fr_5.5rem_3.5rem] gap-3 border-b border-line px-4 py-2 sm:grid-cols-[4.5rem_1fr_6rem_4rem_4rem_5rem]">
        {["ID", "Borrower", "Principal", "Rate"].map((label) => (
          <span key={label} className={`data-label ${label === "Principal" || label === "Rate" ? "text-right" : ""}`}>
            {label}
          </span>
        ))}
        <span className="data-label hidden text-right sm:block">Term</span>
        <span className="data-label hidden text-right sm:block">Yield</span>
      </div>

      <div className="group relative h-[22rem] overflow-hidden">
        {loading ? (
          <div className="space-y-px p-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-11" />
            ))}
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-negative">{error}</div>
        ) : sorted.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <CircleDollarSign className="h-8 w-8 text-ink-faint" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-ink">No open requests right now</p>
            <p className="mt-1 text-xs text-ink-muted">New borrower requests stream in here the moment they are published.</p>
          </div>
        ) : (
          <>
            <ul
              className={scrolling ? "animate-marquee-y group-hover:[animation-play-state:paused]" : ""}
              style={scrolling ? { animationDuration: `${sorted.length * 3.5}s` } : undefined}
              aria-label="Open loan requests"
            >
              {rows.map((request, index) => {
                const interest = (request.principalAmount * request.interestRate) / 100;
                const isFresh = freshIds.has(request.id) && index < sorted.length;
                return (
                  <li
                    key={`${request.id}-${index}`}
                    aria-hidden={index >= sorted.length ? true : undefined}
                    className={`grid grid-cols-[4.5rem_1fr_5.5rem_3.5rem] items-center gap-3 border-b border-line/60 px-4 py-3 text-sm transition-colors duration-700 hover:bg-surface-2 sm:grid-cols-[4.5rem_1fr_6rem_4rem_4rem_5rem] ${
                      isFresh ? "bg-accent/10" : ""
                    }`}
                  >
                    <span className="num text-xs text-ink-muted">#{shortId(request.id)}</span>
                    <span className="truncate text-ink-2">{memberName(request.borrowedBy, members[request.borrowedBy])}</span>
                    <span className="num text-right font-medium text-ink">{formatCurrency(request.principalAmount)}</span>
                    <span className="num text-right text-ink-2">{formatPercent(request.interestRate)}</span>
                    <span className="num hidden text-right text-ink-muted sm:block">{request.termWeeks}w</span>
                    <span className="num hidden text-right text-positive sm:block">+{formatCurrency(interest)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-surface to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" aria-hidden="true" />
          </>
        )}
      </div>

      <div className="grid grid-cols-3 divide-x divide-line border-t border-line bg-canvas/40">
        <TerminalStat label="Open" value={loading ? "--" : sorted.length.toString()} />
        <TerminalStat label="Volume" value={loading ? "--" : formatCurrency(totals.volume)} />
        <TerminalStat label="Avg rate" value={loading ? "--" : formatPercent(totals.averageRate)} />
      </div>
      <Link
        href="/loanRequests"
        className="flex items-center justify-between border-t border-line px-4 py-3 text-xs font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
      >
        Open the full marketplace
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
};

function TerminalStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <p className="data-label">{label}</p>
      <p className="num mt-1 truncate text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

export default LoanRequestCarousel;
