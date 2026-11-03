"use client";

import React from "react";
import { calculateFlatRepayment } from "../models/LoanInterfaces";
import { formatCurrency, formatPercent, pluralize } from "./format";

interface RepaymentQuoteProps {
  principal: number;
  rate: number;
  termWeeks: number;
  /** "compact" drops the hero figure for tight spaces like the request form. */
  variant?: "full" | "compact";
}

/** Live quote using the same flat-rate math lenders see on the review screen. */
export default function RepaymentQuote({ principal, rate, termWeeks, variant = "full" }: RepaymentQuoteProps) {
  const valid = principal > 0 && rate >= 0 && termWeeks > 0;
  const { totalRepayment, totalInterest, weeklyPayment } = valid
    ? calculateFlatRepayment(principal, rate, termWeeks)
    : { totalRepayment: 0, totalInterest: 0, weeklyPayment: 0 };
  const principalShare = totalRepayment > 0 ? (principal / totalRepayment) * 100 : 100;

  return (
    <div aria-live="polite">
      {variant === "full" && (
        <div>
          <p className="data-label">Weekly installment</p>
          <p className="mt-2 text-5xl font-semibold tracking-[-0.03em] text-ink sm:text-6xl">
            {formatCurrency(weeklyPayment, { cents: true })}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            for {pluralize(valid ? termWeeks : 0, "week")} at {formatPercent(valid ? rate : 0)} flat interest
          </p>
        </div>
      )}

      <div className={variant === "full" ? "mt-8" : ""}>
        {/* Segmented bar: principal vs interest share of the total repayment. */}
        <div
          className="flex h-2 gap-0.5 overflow-hidden rounded-full"
          role="img"
          aria-label={`Principal ${formatCurrency(principal)}, interest ${formatCurrency(totalInterest, { cents: true })}`}
        >
          <div className="rounded-full bg-ink-faint transition-[width] duration-500" style={{ width: `${principalShare}%` }} />
          {totalInterest > 0 && <div className="flex-1 rounded-full bg-accent" />}
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-3">
          <QuoteFigure swatch="bg-ink-faint" label="Principal" value={formatCurrency(valid ? principal : 0)} />
          <QuoteFigure swatch="bg-accent" label="Interest" value={formatCurrency(totalInterest, { cents: true })} />
          <QuoteFigure label="Total" value={formatCurrency(totalRepayment, { cents: true })} strong />
        </dl>
        {variant === "compact" && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-accent/20 bg-accent/[0.06] px-3 py-2.5">
            <span className="text-xs text-ink-2">Weekly installment</span>
            <span className="num text-sm font-semibold text-ink">{formatCurrency(weeklyPayment, { cents: true })}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function QuoteFigure({ label, value, swatch, strong }: { label: string; value: string; swatch?: string; strong?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-[11px] text-ink-muted">
        {swatch && <span className={`h-2 w-2 rounded-sm ${swatch}`} aria-hidden="true" />}
        {label}
      </dt>
      <dd className={`num mt-1 truncate text-sm ${strong ? "font-semibold text-ink" : "font-medium text-ink-2"}`}>{value}</dd>
    </div>
  );
}
