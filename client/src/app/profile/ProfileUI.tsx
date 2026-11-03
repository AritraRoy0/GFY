"use client";

import React from "react";
import { History } from "lucide-react";
import { Loan, calculateWeeklyAveragedInstallment } from "../models/LoanInterfaces";
import { Avatar, CopyButton, EmptyState, Meter, Panel } from "../common/ui";
import { formatCurrency, formatPercent, shortId } from "../common/format";

export type ProfileTab = "overview" | "loans";

/** Identity banner shared by own and public profiles. */
export function ProfileHero({
  id,
  name,
  subtitle,
  role,
  meta,
  actions,
}: {
  id: string;
  name: string;
  subtitle?: React.ReactNode;
  role: string;
  meta?: Array<{ label: string; value: React.ReactNode }>;
  actions?: React.ReactNode;
}) {
  return (
    <section className="panel overflow-hidden">
      <div className="relative h-28 overflow-hidden border-b border-line sm:h-32">
        <div className="bg-grid absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="absolute -top-16 left-1/4 h-48 w-96 rounded-full bg-accent/15 blur-[80px]" aria-hidden="true" />
        <div className="absolute -top-10 right-0 h-40 w-72 rounded-full bg-accent-2/15 blur-[70px]" aria-hidden="true" />
        <span className="absolute right-4 top-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-muted">{role}</span>
      </div>
      <div className="px-5 pb-6 sm:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {/* Only the avatar overlaps the banner; the name stays clear of the banner edge. */}
            <div className="-mt-10 self-start rounded-2xl bg-surface p-1 sm:-mt-12">
              <Avatar id={id} name={name} size="xl" />
            </div>
            <div className="min-w-0 sm:pt-4">
              <h1 className="break-words text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">{name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
                {subtitle && <span className="break-all">{subtitle}</span>}
                <CopyButton value={id} label={`ID ${shortId(id, 8)}`} className="-ml-1" />
              </div>
            </div>
          </div>
          {actions && <div className="flex shrink-0 flex-col gap-2 sm:flex-row">{actions}</div>}
        </div>

        {meta && meta.length > 0 && (
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {meta.map((item) => (
              <div key={item.label} className="bg-surface px-4 py-3">
                <dt className="data-label">{item.label}</dt>
                <dd className="mt-1 truncate text-sm font-medium text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

export function InfoRow({ icon, label, value, action }: { icon: React.ReactNode; label: string; value: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line bg-canvas/40 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-surface-2 text-accent [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="data-label block">{label}</span>
        <span className="mt-1 block break-all text-sm font-medium text-ink">{value}</span>
      </span>
      {action}
    </div>
  );
}

export function LoanHistory({ title, empty, loans, paymentLabel }: { title: string; empty: string; loans: Loan[]; paymentLabel: string }) {
  return (
    <Panel icon={<History />} title={title} description={`${loans.length} loan${loans.length === 1 ? "" : "s"} on record`} bodyClassName="p-0">
      {loans.length === 0 ? (
        <div className="p-4 sm:p-5">
          <EmptyState icon={<History />} title={empty} />
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {loans.map((loan) => (
            <LoanHistoryRow key={loan.id} loan={loan} paymentLabel={paymentLabel} />
          ))}
        </ul>
      )}
    </Panel>
  );
}

function LoanHistoryRow({ loan, paymentLabel }: { loan: Loan; paymentLabel: string }) {
  const weekly = calculateWeeklyAveragedInstallment(loan.principalAmount, loan.interestRate, loan.termWeeks);
  const completed = loan.paymentsMade.length === loan.termWeeks;

  return (
    <li className="px-4 py-4 transition-colors hover:bg-surface-2/40 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold text-ink">
            {formatCurrency(loan.principalAmount)} <span className="num text-xs font-medium text-ink-muted">at {formatPercent(loan.interestRate)}</span>
          </p>
          <p className="num mt-1 text-xs text-ink-muted">
            {loan.termWeeks} weeks · {loan.paymentsMade.length} {paymentLabel}
          </p>
        </div>
        <div className="flex items-center gap-4 sm:text-right">
          <div className="w-28">
            <Meter value={loan.paymentsMade.length} max={loan.termWeeks} tone={completed ? "positive" : "accent"} />
            <p className="num mt-1.5 text-[11px] text-ink-muted">{formatCurrency(weekly)} / week</p>
          </div>
          <span className={`badge ${completed ? "badge-success" : "badge-warning"}`}>{completed ? "Completed" : "In progress"}</span>
        </div>
      </div>
    </li>
  );
}
