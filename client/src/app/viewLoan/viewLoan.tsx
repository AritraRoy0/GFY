"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Scale,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../store";
import { approveLoan } from "../models/LoanRequestAPIs";

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  variant: "primary" | "secondary";
  children?: React.ReactNode;
};

const money = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const ViewLoan: React.FC = () => {
  const router = useRouter();
  const loanRequest = useSelector((state: RootState) => state.loanRequest);
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;
  const loanId = loanRequest?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      };
    });
  }, [loanRequest?.termWeeks, totalRepayment, weeklyPayment]);

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

  const handleApprove = async () => {
    if (!loanRequest || !loanId || !userId) {
      setError("Missing required loan information.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await approveLoan(loanRequest, userId);
      toast.success("Loan approved successfully.");
      window.setTimeout(() => router.push("/loanRequests"), 1800);
    } catch (err) {
      console.error("Failed to approve loan:", err);
      setError("Failed to approve loan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => router.push("/loanRequests");

  if (!isValidLoanRequest) {
    return (
      <div className="app-container py-12">
        <div className="surface-card mx-auto max-w-lg p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-600" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-950">Loan request not found</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Select a request from the marketplace to review its repayment schedule and approval details.
          </p>
          <Link href="/loanRequests" className="btn-primary mt-6">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Return to Loan Requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container py-6 sm:py-10">
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} />

      <div className="mb-6">
        <Link href="/loanRequests" className="btn-ghost -ml-2">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to marketplace
        </Link>
      </div>

      <section className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-kicker">Loan Review</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Review loan request details.</h1>
          <p className="mt-2 text-sm text-slate-600">
            Confirm borrower context, terms, interest, and repayment schedule before funding.
          </p>
        </div>
        <span className="badge badge-success">Active request</span>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard title="Total repayment" value={money(totalRepayment)} helper={`${loanRequest.interestRate}% interest`} />
        <SummaryCard title="Total interest" value={money(totalInterest)} helper={`${loanRequest.termWeeks} weekly payments`} />
        <SummaryCard title="Weekly payment" value={money(weeklyPayment)} helper="Average installment" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <DetailCard
            title="Borrower"
            icon={<UserRound className="h-5 w-5" />}
            content={
              <div className="space-y-2">
                <Link
                  href={`/profile?id=${loanRequest.borrowedBy}&type=lendee`}
                  className="font-semibold text-sky-700 hover:text-sky-900"
                >
                  View borrower profile
                </Link>
                <p className="break-all text-sm text-slate-500">ID: {loanRequest.borrowedBy}</p>
              </div>
            }
          />

          <DetailCard
            title="Loan terms"
            icon={<Scale className="h-5 w-5" />}
            content={
              <dl className="grid gap-3 text-sm">
                <Term label="Principal" value={money(loanRequest.principalAmount)} />
                <Term label="Interest rate" value={`${loanRequest.interestRate}%`} />
                <Term label="Duration" value={`${loanRequest.termWeeks} weeks`} />
              </dl>
            }
          />

          <DetailCard
            title="Loan purpose"
            icon={<CircleDollarSign className="h-5 w-5" />}
            content={<p className="text-sm leading-6 text-slate-700">{loanRequest.purpose}</p>}
          />
        </div>

        <div className="surface-card p-4 sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950">
                <CalendarDays className="h-5 w-5 text-sky-700" aria-hidden="true" />
                Repayment schedule
              </h2>
              <p className="mt-1 text-sm text-slate-500">Weekly installment and cumulative repayment.</p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-sky-600" />
                Weekly
              </span>
            </div>
          </div>

          <div className="h-[300px] sm:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPayments} margin={{ top: 22, right: 8, left: -10, bottom: 18 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "Week", position: "bottom", fill: "#475569", fontSize: 12, offset: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip
                  formatter={(value: number | string) => money(Number(value))}
                  labelFormatter={(label) => `Week ${label}`}
                  contentStyle={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
                  }}
                />
                <Bar dataKey="amount" name="Weekly payment" fill="#0284C7" radius={[4, 4, 0, 0]} barSize={weeklyPayments.length > 20 ? 12 : 24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Button onClick={handleReject} variant="secondary">
          <XCircle className="h-4 w-4" aria-hidden="true" />
          Decline Request
        </Button>
        <Button onClick={handleApprove} disabled={loading || !isValidLoanRequest} variant="primary">
          {loading ? (
            "Processing Approval..."
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Approve and Fund Loan
            </>
          )}
        </Button>
      </section>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

const SummaryCard: React.FC<{ title: string; value: string; helper: string }> = ({ title, value, helper }) => (
  <div className="metric-card">
    <p className="text-sm font-medium text-slate-500">{title}</p>
    <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{value}</p>
    <p className="mt-3 text-sm text-slate-500">{helper}</p>
  </div>
);

const DetailCard: React.FC<{ title: string; icon: React.ReactNode; content: React.ReactNode }> = ({ title, icon, content }) => (
  <div className="surface-card p-5">
    <div className="mb-4 flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-50 text-sky-700">{icon}</span>
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
    </div>
    {content}
  </div>
);

const Term: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
    <dt className="text-slate-500">{label}</dt>
    <dd className="font-semibold text-slate-950">{value}</dd>
  </div>
);

const Button: React.FC<ButtonProps> = ({ onClick, disabled, variant, children }) => {
  const className = variant === "primary" ? "btn-primary w-full sm:w-auto" : "btn-secondary w-full sm:w-auto";

  return (
    <button type="button" onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  );
};

export default ViewLoan;
