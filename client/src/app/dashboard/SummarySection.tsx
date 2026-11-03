"use client";

import React from "react";
import { ArrowDownRight, ArrowUpRight, Landmark, Scale, TrendingDown, TrendingUp } from "lucide-react";
import { Loan } from "@/app/models/LoanInterfaces";
import { StatCard } from "@/app/common/ui";
import { formatCurrency, pluralize } from "@/app/common/format";

interface SummarySectionProps {
  totalOwned: number;
  totalOwed: number;
  totalReserves: number;
  lentLoans: Loan[];
  borrowedLoans: Loan[];
}

function calculateTrend(loans: Loan[]): { value: number; isPositive: boolean } {
  if (loans.length === 0) return { value: 0, isPositive: true };

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

  const currentMonthTotal = loans.reduce((sum, loan) => {
    if (!loan.timestamp) return sum;
    const loanDate = new Date(loan.timestamp);
    return loanDate >= lastMonth ? sum + loan.principalAmount : sum;
  }, 0);

  const previousMonthTotal = loans.reduce((sum, loan) => {
    if (!loan.timestamp) return sum;
    const loanDate = new Date(loan.timestamp);
    return loanDate < lastMonth && loanDate >= previousMonth ? sum + loan.principalAmount : sum;
  }, 0);

  if (previousMonthTotal === 0) return { value: 0, isPositive: true };

  const percentageChange = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
  return {
    value: Math.round(percentageChange),
    isPositive: percentageChange >= 0,
  };
}

function TrendChip({ trend, upIsGood }: { trend: { value: number; isPositive: boolean }; upIsGood: boolean }) {
  if (trend.value === 0) return null;
  const Icon = trend.isPositive ? ArrowUpRight : ArrowDownRight;
  const good = trend.isPositive === upIsGood;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-mono text-[10.5px] font-medium ${
        good ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
      }`}
      title="Change in new principal vs. the previous 30 days"
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {Math.abs(trend.value)}%
    </span>
  );
}

const SummarySection: React.FC<SummarySectionProps> = ({
  totalOwned,
  totalOwed,
  totalReserves,
  lentLoans,
  borrowedLoans,
}) => {
  const trends = {
    owned: calculateTrend(lentLoans),
    owed: calculateTrend(borrowedLoans),
  };
  const projectedInterest = lentLoans.reduce((sum, loan) => sum + (loan.principalAmount * loan.interestRate) / 100, 0);
  const netPosition = totalOwned - totalOwed;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Capital lent"
        value={formatCurrency(totalOwned)}
        icon={<TrendingUp />}
        tone="accent"
        chip={<TrendChip trend={trends.owned} upIsGood />}
        hint={
          <>
            {pluralize(lentLoans.length, "active loan")}
            {projectedInterest > 0 && <span className="text-positive"> · +{formatCurrency(projectedInterest)} projected interest</span>}
          </>
        }
      />
      <StatCard
        label="Outstanding debt"
        value={formatCurrency(totalOwed)}
        icon={<TrendingDown />}
        tone="warning"
        chip={<TrendChip trend={trends.owed} upIsGood={false} />}
        hint={pluralize(borrowedLoans.length, "active borrowed loan")}
      />
      <StatCard
        label="Net position"
        value={
          <span className={netPosition < 0 ? "text-negative" : undefined}>
            {netPosition > 0 ? "+" : ""}
            {formatCurrency(netPosition)}
          </span>
        }
        icon={<Scale />}
        tone={netPosition < 0 ? "negative" : "positive"}
        hint="Capital lent minus debt owed"
      />
      <StatCard
        label="Reserves"
        value={formatCurrency(totalReserves)}
        icon={<Landmark />}
        chip={<span className="badge px-1.5 py-0 font-mono text-[10px] uppercase tracking-wider">Demo</span>}
        hint="Placeholder balance, not connected to a bank"
      />
    </div>
  );
};

export default SummarySection;
