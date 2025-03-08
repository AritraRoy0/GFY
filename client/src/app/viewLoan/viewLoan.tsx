"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { RootState, AppDispatch } from "../store";
import { Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import { approveLoan } from "../models/LoanRequestAPIs";
import {
  ClockIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  variant: "primary" | "secondary";
  children?: React.ReactNode;
};

const ViewLoan: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const loanRequest = useSelector((state: RootState) => state.loanRequest);
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;
  const loanId = loanRequest?.id;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Loan calculations
  const { totalRepayment, totalInterest } = useMemo(() => {
    if (!loanRequest || !loanRequest.principalAmount || !loanRequest.interestRate) 
      return { totalRepayment: 0, totalInterest: 0 };
    
    const total = loanRequest.principalAmount * (1 + loanRequest.interestRate / 100);
    return {
      totalRepayment: Number(total.toFixed(2)),
      totalInterest: Number((total - loanRequest.principalAmount).toFixed(2))
    };
  }, [loanRequest]);

  // Weekly payments with cumulative tracking
  const weeklyPayments = useMemo(() => {
    if (!loanRequest || !loanRequest.termWeeks || !totalRepayment) return [];
    const weeklyPayment = totalRepayment / loanRequest.termWeeks;
    let cumulative = 0;

    return Array.from({ length: loanRequest.termWeeks }, (_, i) => {
      cumulative += weeklyPayment;
      return {
        week: i + 1,
        amount: Number(weeklyPayment.toFixed(2)),
        cumulative: Number(cumulative.toFixed(2))
      };
    });
  }, [loanRequest, totalRepayment]);

  // Validation
  const isValidLoanRequest = useMemo(() => {
    return loanRequest &&
      loanRequest.termWeeks >= 1 &&
      loanRequest.termWeeks <= 52 &&
      loanRequest.principalAmount >= 500 &&
      loanRequest.principalAmount <= 10000 &&
      loanRequest.interestRate >= 5;
  }, [loanRequest]);

  useEffect(() => {
    if (loanId) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    }
  }, [loanId]);

  const handleApprove = async () => {
    if (!loanRequest || !loanId || !userId) {
      setError("Missing required loan information");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await approveLoan(loanRequest, userId);
      toast.success("Loan approved successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => router.push("/loanRequests"), 3000);
    } catch (err) {
      setError("Failed to approve loan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => router.push("/loanRequests");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">Week {label}</p>
          <p className="text-sm text-indigo-600">
            Payment: <span className="font-medium">${payload[0].value}</span>
          </p>
          <p className="text-sm text-gray-500">
            Cumulative: ${payload[0].payload.cumulative}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  if (!loanRequest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-6 bg-red-50 rounded-xl text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-600">Loan request not found</h2>
          <p className="text-gray-600 mt-2">Please check the loan ID and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ToastContainer />
      
      {/* Header */}
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CurrencyDollarIcon className="h-8 w-8 text-indigo-600" />
          Loan Request Details
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Repayment"
          value={`$${totalRepayment.toLocaleString()}`}
          trend="positive"
          percentage={loanRequest.interestRate}
        />
        <SummaryCard
          title="Total Interest"
          value={`$${totalInterest.toLocaleString()}`}
          trend="neutral"
          description={`${loanRequest.termWeeks} weekly payments`}
        />
        <SummaryCard
          title="Weekly Payment"
          value={`$${(totalRepayment / loanRequest.termWeeks).toFixed(2)}`}
          trend="negative"
          description="Average per week"
        />
      </div>

      {/* Loan Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailCard
          label="Borrower Information"
          value={
            <div className="space-y-2">
              <Link
                href={`/profile?id=${loanRequest.borrowedBy}&type=lendee`}
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
              >
                <UserCircleIcon className="h-5 w-5" />
                View Borrower Profile
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                Member since 2023 • 4 previous loans
              </p>
            </div>
          }
          icon={<UserCircleIcon className="h-6 w-6 text-indigo-600" />}
        />
        
        <DetailCard
          label="Loan Terms"
          value={
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Principal:</span>
                <span className="font-medium">${loanRequest.principalAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Interest Rate:</span>
                <span className="font-medium">{loanRequest.interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium">{loanRequest.termWeeks} weeks</span>
              </div>
            </div>
          }
          icon={<ScaleIcon className="h-6 w-6 text-indigo-600" />}
        />

        <div className="md:col-span-2">
          <DetailCard
            label="Loan Purpose"
            value={<p className="text-gray-700 leading-relaxed">{loanRequest.purpose}</p>}
            icon={<ClockIcon className="h-6 w-6 text-indigo-600" />}
            full
          />
        </div>
      </div>

      {/* Repayment Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4 md:mb-0">
            <CalendarIcon className="h-6 w-6 text-indigo-600" />
            Repayment Schedule Breakdown
          </h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Weekly Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-indigo-100 rounded-full"></div>
              <span className="text-sm text-gray-600">Cumulative</span>
            </div>
          </div>
        </div>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyPayments}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fill: "#4B5563" }}
                tickLine={{ stroke: "#E5E7EB" }}
                label={{
                  value: "Weeks",
                  position: "bottom",
                  fill: "#4B5563",
                  fontSize: 14,
                }}
              />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tick={{ fill: "#4B5563" }}
                tickLine={{ stroke: "#E5E7EB" }}
                label={{
                  value: "Payment Amount",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#4B5563",
                  fontSize: 14,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                radius={[4, 4, 0, 0]}
                barSize={24}
              >
                <LabelList
                  dataKey="amount"
                  position="top"
                  formatter={(value: number) => `$${value.toFixed(0)}`}
                  className="text-xs fill-gray-500"
                />
                {weeklyPayments.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`rgba(99, 102, 241, ${0.6 + (index * 0.4) / weeklyPayments.length})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end border-t pt-8">
        <Button
          onClick={handleApprove}
          disabled={loading || !isValidLoanRequest}
          variant="primary"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Processing Approval...
            </div>
          ) : (
            <>
              <CheckCircleIcon className="h-5 w-5" />
              Approve and Fund Loan
            </>
          )}
        </Button>
        <Button onClick={handleReject} variant="secondary">
          <XCircleIcon className="h-5 w-5" />
          Decline Request
        </Button>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard: React.FC<{
  title: string;
  value: string;
  trend: "positive" | "negative" | "neutral";
  percentage?: number;
  description?: string;
}> = ({ title, value, trend, percentage, description }) => {
  const trendColors = {
    positive: "bg-green-100 text-green-800",
    negative: "bg-red-100 text-red-800",
    neutral: "bg-blue-100 text-blue-800"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>
        {percentage && (
          <span className={`${trendColors[trend]} px-3 py-1 rounded-full text-sm font-medium`}>
            {trend === 'positive' && '+'}{percentage}%
          </span>
        )}
      </div>
    </div>
  );
};

// Detail Card Component
const DetailCard: React.FC<{
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  full?: boolean;
}> = ({ label, value, icon, full }) => (
  <div className={`flex items-start gap-4 p-6 bg-white rounded-lg border border-gray-100 ${full ? "col-span-2" : ""}`}>
    <div className="bg-indigo-50 p-3 rounded-lg">{icon}</div>
    <div className="flex-1">
      <dt className="text-sm font-medium text-gray-500 mb-2">{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  </div>
);

// Button Component
const Button: React.FC<ButtonProps> = ({ onClick, disabled, variant, children }) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-70 disabled:hover:bg-indigo-600",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300 disabled:opacity-70",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ViewLoan;