"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  LogIn,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { RootState } from "../store";
import { approveLoan } from "../models/LoanRequestAPIs";
import LoadingSpinner from "../common/LoadingSpinner";
import { Avatar, CopyButton, PageHeader, Panel, SegmentedControl, StatCard, StatePanel } from "../common/ui";
import { ChartTooltip, useChartColors } from "../common/chartTheme";
import { formatCompactCurrency, formatCurrency, formatDate, formatPercent, shortId } from "../common/format";
import { memberName, useUserDirectory } from "../common/useUserDirectory";

const money = (value: number) => formatCurrency(value, { cents: true });

const ViewLoan: React.FC = () => {
  const router = useRouter();
  const loanRequest = useSelector((state: RootState) => state.loanRequest);
  const { user, initialized } = useSelector((state: RootState) => state.auth);
  const userId = user?.id;
  const loanId = loanRequest?.id;
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduleView, setScheduleView] = useState<"chart" | "table">("chart");
  const chartColors = useChartColors();
  const { axisTick } = chartColors;

  const members = useUserDirectory(useMemo(() => (loanRequest?.borrowedBy ? [loanRequest.borrowedBy] : []), [loanRequest?.borrowedBy]));
  const borrowerName = loanRequest?.borrowedBy ? memberName(loanRequest.borrowedBy, members[loanRequest.borrowedBy]) : "";

  const { totalRepayment, totalInterest, weeklyPayment } = useMemo(() => {
    if (!loanRequest || !loanRequest.principalAmount || !loanRequest.interestRate || !loanRequest.termWeeks) {
      return { totalRepayment: 0, totalInterest: 0, weeklyPayment: 0 };
    }

    const total = loanRequest.principalAmount * (1 + loanRequest.interestRate / 100);
    const interest = total - loanRequest.principalAmount;
    return {
      totalRepayment: Number(total.toFixed(2)),
      totalInterest: Number(interest.toFixed(2)),
      weeklyPayment: Number((total / loanRequest.termWeeks).toFixed(2)),
    };
  }, [loanRequest]);

  const weeklyPayments = useMemo(() => {
    if (!loanRequest?.termWeeks || !totalRepayment) return [];
    let cumulative = 0;

    return Array.from({ length: loanRequest.termWeeks }, (_, index) => {
      cumulative += weeklyPayment;
      return {
        week: index + 1,
        amount: weeklyPayment,
        cumulative: Number(cumulative.toFixed(2)),
        remaining: Math.max(0, Number((totalRepayment - cumulative).toFixed(2))),
      };
    });
  }, [loanRequest?.termWeeks, totalRepayment, weeklyPayment]);

  // Week 0 anchors the cumulative curve at zero.
  const chartData = useMemo(() => [{ week: 0, cumulative: 0, remaining: totalRepayment }, ...weeklyPayments], [totalRepayment, weeklyPayments]);
  const breakEvenWeek = weeklyPayments.find((row) => row.cumulative >= (loanRequest?.principalAmount ?? Infinity))?.week;

  const isValidLoanRequest = useMemo(() => {
    return Boolean(
      loanRequest?.id &&
        loanRequest.termWeeks >= 1 &&
        loanRequest.termWeeks <= 52 &&
        loanRequest.principalAmount >= 500 &&
        loanRequest.principalAmount <= 10000 &&
        loanRequest.interestRate >= 5
    );
  }, [loanRequest]);

  const isOwnRequest = Boolean(userId && loanRequest?.borrowedBy === userId);

  const handleApprove = async () => {
    if (!loanRequest || !loanId || !userId) {
      setError("Missing required loan information.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await approveLoan(loanRequest, userId);
      setApproved(true);
      setConfirmOpen(false);
      toast.success("Loan approved and funded.");
      window.setTimeout(() => router.push("/loanRequests"), 1800);
    } catch (err) {
      console.error("Failed to approve loan:", err);
      setError("Failed to approve loan. Please try again.");
      setConfirmOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => router.push("/loanRequests");

  if (!isValidLoanRequest) {
    return (
      <StatePanel
        icon={<AlertCircle />}
        tone="warning"
        title="Loan request not found"
        description="Select a request from the marketplace to review its repayment schedule and approval details."
        action={
          <Link href="/loanRequests" className="btn-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Return to marketplace
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Loan review"
        title={
          <>
            {formatCurrency(loanRequest.principalAmount)} <span className="text-ink-muted">at</span> {formatPercent(loanRequest.interestRate)}{" "}
            <span className="text-ink-muted">for</span> {loanRequest.termWeeks} weeks
          </>
        }
        description="Confirm borrower context, terms, interest, and repayment schedule before funding."
        meta={
          <>
            <span className={`badge ${approved ? "badge-accent" : "badge-success"}`}>{approved ? "Funded" : "Open request"}</span>
            <span className="badge num">#{shortId(loanRequest.id)}</span>
            {loanRequest.timestamp?.toDate && <span className="text-xs text-ink-muted">Posted {formatDate(loanRequest.timestamp.toDate())}</span>}
          </>
        }
        actions={
          <Link href="/loanRequests" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to marketplace
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start xl:grid-cols-[1fr_24rem]">
        <div className="min-w-0 space-y-6">
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard label="Total repayment" value={money(totalRepayment)} hint={`Principal + ${formatPercent(loanRequest.interestRate)} interest`} />
            <StatCard label="Lender interest" value={`+${money(totalInterest)}`} tone="positive" hint={`Earned over ${loanRequest.termWeeks} weeks`} />
            <StatCard label="Weekly installment" value={money(weeklyPayment)} tone="accent" hint={`${loanRequest.termWeeks} equal payments`} />
          </section>

          <Panel
            icon={<CalendarDays />}
            title="Repayment schedule"
            description={
              breakEvenWeek
                ? `Cumulative repayment to the lender. Principal is recovered in week ${breakEvenWeek}.`
                : "Cumulative repayment to the lender."
            }
            actions={
              <SegmentedControl
                label="Schedule view"
                value={scheduleView}
                onChange={setScheduleView}
                options={[
                  { value: "chart", label: "Chart" },
                  { value: "table", label: "Table" },
                ]}
              />
            }
          >
            {scheduleView === "chart" ? (
              <div className="h-[280px] sm:h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 16, right: 20, left: 0, bottom: 4 }}>
                    <defs>
                      <linearGradient id="fill-schedule" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartColors.series1} stopOpacity={0.16} />
                        <stop offset="100%" stopColor={chartColors.series1} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={chartColors.grid} vertical={false} />
                    <XAxis
                      dataKey="week"
                      tick={axisTick}
                      tickLine={false}
                      axisLine={{ stroke: chartColors.grid }}
                      tickFormatter={(week) => `W${week}`}
                      minTickGap={16}
                    />
                    <YAxis tick={axisTick} tickLine={false} axisLine={false} tickFormatter={formatCompactCurrency} width={64} />
                    <ReferenceLine
                      y={loanRequest.principalAmount}
                      stroke={chartColors.axis}
                      strokeOpacity={0.6}
                      label={{ value: "Principal", position: "insideTopLeft", fill: chartColors.axis, fontSize: 11, fontFamily: "var(--font-mono)" }}
                    />
                    <Tooltip
                      cursor={{ stroke: chartColors.cursor, strokeWidth: 1 }}
                      content={
                        <ChartTooltip
                          labelFormatter={(week) => (Number(week) === 0 ? "Funding day" : `Week ${week}`)}
                          valueFormatter={money}
                        />
                      }
                    />
                    <Area
                      type="linear"
                      dataKey="cumulative"
                      name="Repaid to date"
                      stroke={chartColors.series1}
                      strokeWidth={2}
                      fill="url(#fill-schedule)"
                      animationDuration={700}
                      dot={false}
                      activeDot={{ r: 4, stroke: chartColors.surface, strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="max-h-[340px] overflow-auto rounded-lg border border-line">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-surface-2">
                    <tr>
                      <th className="data-label px-4 py-2.5 font-medium">Week</th>
                      <th className="data-label px-4 py-2.5 text-right font-medium">Payment</th>
                      <th className="data-label px-4 py-2.5 text-right font-medium">Repaid to date</th>
                      <th className="data-label px-4 py-2.5 text-right font-medium">Remaining</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {weeklyPayments.map((row) => (
                      <tr key={row.week} className={row.week === breakEvenWeek ? "bg-accent/[0.06]" : undefined}>
                        <td className="num px-4 py-2.5 text-ink-2">
                          {row.week}
                          {row.week === breakEvenWeek && <span className="badge badge-accent ml-2 py-0 text-[10px]">Principal recovered</span>}
                        </td>
                        <td className="num px-4 py-2.5 text-right text-ink">{money(row.amount)}</td>
                        <td className="num px-4 py-2.5 text-right text-ink">{money(row.cumulative)}</td>
                        <td className="num px-4 py-2.5 text-right text-ink-muted">{money(row.remaining)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <Panel icon={<FileText />} title="Loan purpose" description="In the borrower's words.">
            <p className="whitespace-pre-line text-sm leading-7 text-ink-2">{loanRequest.purpose}</p>
          </Panel>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20">
          <Panel icon={<UserRound />} title="Borrower">
            <div className="flex items-center gap-3">
              <Avatar id={loanRequest.borrowedBy} name={borrowerName} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{borrowerName}</p>
                <CopyButton value={loanRequest.borrowedBy} label={`ID ${shortId(loanRequest.borrowedBy, 8)}`} className="-ml-1" />
              </div>
            </div>
            <Link href={`/profile?id=${loanRequest.borrowedBy}&type=lendee`} className="btn-secondary btn-sm mt-4 w-full">
              View borrowing history
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Panel>

          <section className="panel edge-glow p-5" aria-labelledby="decision-heading">
            <h2 id="decision-heading" className="flex items-center gap-2 text-sm font-semibold text-ink">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
              Funding decision
            </h2>

            <dl className="mt-4 space-y-3 text-sm">
              <DecisionRow label="You fund" value={formatCurrency(loanRequest.principalAmount)} />
              <DecisionRow label="You receive" value={money(totalRepayment)} />
              <DecisionRow label="Schedule" value={`${loanRequest.termWeeks} × ${money(weeklyPayment)}`} />
              <div className="flex items-center justify-between border-t border-line pt-3">
                <dt className="text-ink-2">Return</dt>
                <dd className="num font-semibold text-positive">
                  +{money(totalInterest)} <span className="text-xs font-medium text-ink-muted">({formatPercent(loanRequest.interestRate)})</span>
                </dd>
              </div>
            </dl>

            {error && (
              <div role="alert" className="mt-4 flex gap-2 rounded-lg border border-negative/30 bg-negative/10 p-3 text-xs text-negative">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </div>
            )}

            <div className="mt-5 grid gap-2">
              {approved ? (
                <div className="flex items-center justify-center gap-2 rounded-lg border border-positive/30 bg-positive/10 px-4 py-3 text-sm font-medium text-positive">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Funded. Returning to marketplace...
                </div>
              ) : initialized && !userId ? (
                <Link href="/auth?tab=login" className="btn-primary w-full">
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Sign in to fund
                </Link>
              ) : isOwnRequest ? (
                <p className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2.5 text-center text-xs text-warning">
                  This is your own request. Another member has to fund it.
                </p>
              ) : (
                <button type="button" onClick={() => setConfirmOpen(true)} disabled={loading || !userId} className="btn-primary w-full py-3">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Approve and fund loan
                </button>
              )}
              {!approved && (
                <button type="button" onClick={handleReject} className="btn-ghost w-full">
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                  Decline request
                </button>
              )}
            </div>
          </section>
        </aside>
      </div>

      <ConfirmFundingDialog
        open={confirmOpen}
        loading={loading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleApprove}
        borrowerName={borrowerName}
        principal={formatCurrency(loanRequest.principalAmount)}
        total={money(totalRepayment)}
        schedule={`${loanRequest.termWeeks} weekly payments of ${money(weeklyPayment)}`}
      />
    </div>
  );
};

function DecisionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="num font-medium text-ink">{value}</dd>
    </div>
  );
}

function ConfirmFundingDialog({
  open,
  loading,
  onCancel,
  onConfirm,
  borrowerName,
  principal,
  total,
  schedule,
}: {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  borrowerName: string;
  principal: string;
  total: string;
  schedule: string;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => confirmRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [loading, onCancel, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="scrim absolute inset-0" onClick={() => !loading && onCancel()} aria-hidden="true" />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-funding-title"
            aria-describedby="confirm-funding-description"
            className="panel edge-glow relative w-full max-w-md bg-surface p-6"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 id="confirm-funding-title" className="mt-4 text-lg font-semibold tracking-tight text-ink">
              Fund {principal} to {borrowerName}?
            </h2>
            <p id="confirm-funding-description" className="mt-2 text-sm leading-6 text-ink-2">
              You&apos;ll receive <span className="num font-medium text-ink">{total}</span> as {schedule}. The request leaves the marketplace once funded, so this can&apos;t be undone here.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={onCancel} disabled={loading} className="btn-secondary">
                Cancel
              </button>
              <button ref={confirmRef} type="button" onClick={onConfirm} disabled={loading} className="btn-primary">
                {loading ? (
                  <>
                    <LoadingSpinner size="small" label="Processing approval" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Confirm and fund
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ViewLoan;
