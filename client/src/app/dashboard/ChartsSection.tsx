"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, LineChart as LineChartIcon } from "lucide-react";
import { Loan } from "@/app/models/LoanInterfaces";

interface ChartsSectionProps {
  lentLoans: Loan[];
  borrowedLoans: Loan[];
  totalReserves: number;
}

const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function displayDate(key: string) {
  return new Date(`${key}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function EmptyChart({ title }: { title: string }) {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-center">
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">Loan activity will appear here.</p>
    </div>
  );
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ lentLoans, borrowedLoans, totalReserves }) => {
  const lentFundsOverTime = lentLoans.reduce<Record<string, number>>((acc, loan) => {
    if (loan.timestamp) {
      const key = dateKey(new Date(loan.timestamp));
      acc[key] = (acc[key] || 0) + loan.principalAmount;
    }
    return acc;
  }, {});

  const borrowedFundsOverTime = borrowedLoans.reduce<Record<string, number>>((acc, loan) => {
    if (loan.timestamp) {
      const key = dateKey(new Date(loan.timestamp));
      acc[key] = (acc[key] || 0) + loan.principalAmount;
    }
    return acc;
  }, {});

  const allDates = Array.from(new Set([...Object.keys(lentFundsOverTime), ...Object.keys(borrowedFundsOverTime)])).sort();

  const fundsOverTimeData = allDates.map((key) => ({
    date: displayDate(key),
    lent: lentFundsOverTime[key] || 0,
    borrowed: borrowedFundsOverTime[key] || 0,
  }));

  const paymentData = [
    {
      name: "Lent",
      expected: lentLoans.reduce((sum, loan) => sum + loan.principalAmount, 0),
      received: lentLoans.reduce(
        (sum, loan) => sum + loan.paymentsMade.reduce((paymentSum, payment) => paymentSum + payment.amount, 0),
        0
      ),
    },
    {
      name: "Borrowed",
      expected: borrowedLoans.reduce((sum, loan) => sum + loan.principalAmount, 0),
      received: borrowedLoans.reduce(
        (sum, loan) => sum + loan.paymentsMade.reduce((paymentSum, payment) => paymentSum + payment.amount, 0),
        0
      ),
    },
    {
      name: "Reserves",
      expected: totalReserves,
      received: totalReserves,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <section className="surface-card p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-950">
              <LineChartIcon className="h-5 w-5 text-sky-700" aria-hidden="true" />
              Funds over time
            </h3>
            <p className="mt-1 text-sm text-slate-500">Daily loan volume by portfolio side.</p>
          </div>
        </div>
        {fundsOverTimeData.length === 0 ? (
          <EmptyChart title="No timeline data yet" />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fundsOverTimeData} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" tickLine={false} axisLine={false} tickFormatter={formatCurrency} width={72} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="lent" name="Lent" stroke="#0284C7" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="borrowed" name="Borrowed" stroke="#DC2626" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="surface-card p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-950">
              <BarChart3 className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              Payment status
            </h3>
            <p className="mt-1 text-sm text-slate-500">Expected principal compared with recorded payments.</p>
          </div>
        </div>
        {lentLoans.length === 0 && borrowedLoans.length === 0 ? (
          <EmptyChart title="No payment data yet" />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentData} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" tickLine={false} axisLine={false} tickFormatter={formatCurrency} width={72} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
                  }}
                />
                <Legend />
                <Bar dataKey="expected" name="Expected" fill="#64748B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="received" name="Recorded" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
};

export default ChartsSection;
