"use client";

import React, { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Gauge } from "lucide-react";
import { Loan } from "@/app/models/LoanInterfaces";
import { EmptyState, Panel, SegmentedControl } from "@/app/common/ui";
import { ChartTooltip, useChartColors } from "@/app/common/chartTheme";
import { formatCompactCurrency, formatCurrency } from "@/app/common/format";

interface ChartsSectionProps {
  lentLoans: Loan[];
  borrowedLoans: Loan[];
}

// Local-calendar day key (YYYY-MM-DD), so loans group by the viewer's day rather than UTC.
function dateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function keyToTime(key: string) {
  return new Date(`${key}T00:00:00`).getTime();
}

function displayDate(key: string) {
  return new Date(`${key}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const formatTick = (ts: number) => new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });

function sumByDay(loans: Loan[]) {
  return loans.reduce<Record<string, number>>((acc, loan) => {
    if (loan.timestamp) {
      const key = dateKey(new Date(loan.timestamp));
      acc[key] = (acc[key] || 0) + loan.principalAmount;
    }
    return acc;
  }, {});
}

const sumPayments = (loans: Loan[]) =>
  loans.reduce((sum, loan) => sum + loan.paymentsMade.reduce((paymentSum, payment) => paymentSum + payment.amount, 0), 0);

const ChartsSection: React.FC<ChartsSectionProps> = ({ lentLoans, borrowedLoans }) => {
  const [view, setView] = useState<"chart" | "table">("chart");
  const chartColors = useChartColors();
  const { axisTick } = chartColors;

  // Cumulative principal by day on a true time axis. Principal lands in full on the funding day, so the
  // series is drawn as steps rather than a curve that would imply gradual inflow.
  const capitalFlow = useMemo(() => {
    const lentByDay = sumByDay(lentLoans);
    const borrowedByDay = sumByDay(borrowedLoans);
    const keys = Array.from(new Set([...Object.keys(lentByDay), ...Object.keys(borrowedByDay)])).sort();
    if (keys.length === 0) return [];

    let lent = 0;
    let borrowed = 0;
    const rows = keys.map((key) => {
      lent += lentByDay[key] || 0;
      borrowed += borrowedByDay[key] || 0;
      return { key, ts: keyToTime(key), date: displayDate(key), lent, borrowed, synthetic: false };
    });

    // Anchor at zero the day before the first loan, and carry the latest totals forward to today.
    const anchor = new Date(keyToTime(keys[0]));
    anchor.setDate(anchor.getDate() - 1);
    const anchorKey = dateKey(anchor);
    const todayKey = dateKey(new Date());
    const last = rows[rows.length - 1];
    const series = [{ key: anchorKey, ts: keyToTime(anchorKey), date: displayDate(anchorKey), lent: 0, borrowed: 0, synthetic: true }, ...rows];
    if (todayKey > last.key) {
      series.push({ ...last, key: todayKey, ts: keyToTime(todayKey), date: displayDate(todayKey), synthetic: true });
    }
    return series;
  }, [borrowedLoans, lentLoans]);

  const latest = capitalFlow[capitalFlow.length - 1];

  const repayment = {
    lentExpected: lentLoans.reduce((sum, loan) => sum + loan.principalAmount, 0),
    lentReceived: sumPayments(lentLoans),
    borrowedExpected: borrowedLoans.reduce((sum, loan) => sum + loan.principalAmount, 0),
    borrowedPaid: sumPayments(borrowedLoans),
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <Panel
        className="xl:col-span-2"
        icon={<Activity />}
        title="Capital flow"
        description="Cumulative principal lent and borrowed over time."
        actions={
          capitalFlow.length > 0 && (
            <SegmentedControl
              label="Capital flow view"
              value={view}
              onChange={setView}
              options={[
                { value: "chart", label: "Chart" },
                { value: "table", label: "Table" },
              ]}
            />
          )
        }
      >
        {capitalFlow.length === 0 ? (
          <EmptyState
            icon={<Activity />}
            title="No timeline data yet"
            description="Funded loans plot here by date as soon as they are approved."
            className="h-[280px] py-16"
          />
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Legend">
              <LegendItem color={chartColors.series1} label="Lent" value={formatCurrency(latest.lent)} />
              <LegendItem color={chartColors.series2} label="Borrowed" value={formatCurrency(latest.borrowed)} />
            </div>
            {view === "chart" ? (
              <div className="h-[260px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={capitalFlow} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fill-lent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartColors.series1} stopOpacity={0.14} />
                        <stop offset="100%" stopColor={chartColors.series1} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="fill-borrowed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartColors.series2} stopOpacity={0.12} />
                        <stop offset="100%" stopColor={chartColors.series2} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={chartColors.grid} vertical={false} />
                    <XAxis
                      dataKey="ts"
                      type="number"
                      scale="time"
                      domain={["dataMin", "dataMax"]}
                      tickFormatter={formatTick}
                      tick={axisTick}
                      tickLine={false}
                      axisLine={{ stroke: chartColors.grid }}
                      minTickGap={32}
                    />
                    <YAxis tick={axisTick} tickLine={false} axisLine={false} tickFormatter={formatCompactCurrency} width={64} />
                    <Tooltip
                      cursor={{ stroke: chartColors.cursor, strokeWidth: 1 }}
                      content={<ChartTooltip labelFormatter={(ts) => formatTick(Number(ts))} valueFormatter={(value) => formatCurrency(value)} />}
                    />
                    <Area
                      type="stepAfter"
                      dataKey="lent"
                      name="Lent"
                      stroke={chartColors.series1}
                      strokeWidth={2}
                      fill="url(#fill-lent)"
                      animationDuration={700}
                      dot={false}
                      activeDot={{ r: 4, stroke: chartColors.surface, strokeWidth: 2 }}
                    />
                    <Area
                      type="stepAfter"
                      dataKey="borrowed"
                      name="Borrowed"
                      stroke={chartColors.series2}
                      strokeWidth={2}
                      fill="url(#fill-borrowed)"
                      animationDuration={700}
                      dot={false}
                      activeDot={{ r: 4, stroke: chartColors.surface, strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="max-h-[300px] overflow-auto rounded-lg border border-line">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-surface-2">
                    <tr>
                      <th className="data-label px-4 py-2.5 font-medium">Date</th>
                      <th className="data-label px-4 py-2.5 text-right font-medium">Lent (cumulative)</th>
                      <th className="data-label px-4 py-2.5 text-right font-medium">Borrowed (cumulative)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {capitalFlow.filter((row) => !row.synthetic).map((row) => (
                      <tr key={row.key}>
                        <td className="px-4 py-2.5 text-ink-2">{row.date}</td>
                        <td className="num px-4 py-2.5 text-right text-ink">{formatCurrency(row.lent)}</td>
                        <td className="num px-4 py-2.5 text-right text-ink">{formatCurrency(row.borrowed)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Panel>

      <Panel icon={<Gauge />} title="Repayment progress" description="Recorded payments against principal.">
        {lentLoans.length === 0 && borrowedLoans.length === 0 ? (
          <EmptyState icon={<Gauge />} title="No payment data yet" description="Progress appears once you hold an active loan." className="h-[280px] py-16" />
        ) : (
          <div className="space-y-6">
            <ProgressRow
              color={chartColors.series1}
              label="Collected on loans you own"
              current={repayment.lentReceived}
              total={repayment.lentExpected}
            />
            <ProgressRow
              color={chartColors.series2}
              label="Repaid on loans you owe"
              current={repayment.borrowedPaid}
              total={repayment.borrowedExpected}
            />
            <dl className="grid grid-cols-2 gap-3 border-t border-line pt-5">
              <div>
                <dt className="data-label">Payments in</dt>
                <dd className="num mt-1 text-sm font-medium text-ink">{lentLoans.reduce((sum, loan) => sum + loan.paymentsMade.length, 0)}</dd>
              </div>
              <div>
                <dt className="data-label">Payments out</dt>
                <dd className="num mt-1 text-sm font-medium text-ink">{borrowedLoans.reduce((sum, loan) => sum + loan.paymentsMade.length, 0)}</dd>
              </div>
            </dl>
          </div>
        )}
      </Panel>
    </div>
  );
};

function LegendItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      <span className="text-xs text-ink-muted">{label}</span>
      <span className="num text-sm font-medium text-ink">{value}</span>
    </div>
  );
}

function ProgressRow({ color, label, current, total }: { color: string; label: string; current: number; total: number }) {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="flex items-center gap-2 text-xs text-ink-2">
          <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} aria-hidden="true" />
          {label}
        </p>
        <p className="num text-sm font-semibold text-ink">{percent}%</p>
      </div>
      <div
        className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-3"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
      <p className="num mt-2 text-[11px] text-ink-muted">
        {formatCurrency(current)} of {formatCurrency(total)}
      </p>
    </div>
  );
}

export default ChartsSection;
