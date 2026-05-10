"use client";

import React from "react";
import { ArrowDownRight, ArrowUpRight, Landmark, TrendingDown, TrendingUp } from "lucide-react";
import { Loan } from "@/app/models/LoanInterfaces";

interface SummarySectionProps {
  totalOwned: number;
  totalOwed: number;
  totalReserves: number;
  lentLoans: Loan[];
  borrowedLoans: Loan[];
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function calculateTrend(loans: Loan[]): { value: number; isPositive: boolean } {
  if (loans.length === 0) return { value: 0, isPositive: true };

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

  const currentMonthTotal = loans.reduce((sum, loan) => {
    const loanDate = new Date(loan.timestamp);
    return loanDate >= lastMonth ? sum + loan.principalAmount : sum;
  }, 0);

  const previousMonthTotal = loans.reduce((sum, loan) => {
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

const SummaryCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  helper: string;
  trend?: { value: number; isPositive: boolean };
}> = ({ title, value, icon, helper, trend }) => {
  const TrendIcon = trend?.isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white">
          {icon}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-sm text-slate-500">{helper}</p>
        {trend && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            trend.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}>
            <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
};

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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard
        title="Loans owed to you"
        value={currency.format(totalOwned)}
        icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />}
        trend={trends.owned}
        helper={`${lentLoans.length} active lent loan${lentLoans.length === 1 ? "" : "s"}`}
      />
      <SummaryCard
        title="Available reserves"
        value={currency.format(totalReserves)}
        icon={<Landmark className="h-5 w-5" aria-hidden="true" />}
        helper="Demo reserve balance"
      />
      <SummaryCard
        title="Loans you owe"
        value={currency.format(totalOwed)}
        icon={<TrendingDown className="h-5 w-5" aria-hidden="true" />}
        trend={trends.owed}
        helper={`${borrowedLoans.length} active borrowed loan${borrowedLoans.length === 1 ? "" : "s"}`}
      />
    </div>
  );
};

export default SummarySection;
