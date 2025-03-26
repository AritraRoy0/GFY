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
            Payment: <span className="font-medium">${payload[0].value.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-500">
            Cumulative: ${payload[0].payload.cumulative.toFixed(2)}
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
        <div className="p-8 bg-red-50 rounded-xl text-center shadow-sm">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Loan request not found</h2>
          <p className="text-gray-600 mt-2 mb-4">Please check the loan ID and try again</p>
          <button 
            onClick={() => router.push("/loanRequests")}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Loan Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ToastContainer />
      {/* Header */}
      <div className="pb-8 border-b border-gray-200 bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg">
          <div className="flex items-center gap-4 rounded-lg">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <CurrencyDollarIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Loan Request Details</h1>
              <p className="text-sm text-gray-500 mt-1">Review and manage loan request information</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-full shadow-sm">
              Active Request
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Repayment"
          value={`$${totalRepayment.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
          trend="positive"
          percentage={loanRequest.interestRate}
        />
        <SummaryCard
          title="Total Interest"
          value={`$${totalInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
          trend="neutral"
          description={`${loanRequest.termWeeks} weekly payments`}
        />
        <SummaryCard
          title="Weekly Payment"
          value={`$${(totalRepayment / loanRequest.termWeeks).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
          trend="negative"
          description="Average per week"
        />
      </div>

      {/* Loan Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailCard
          label="Borrower Information"
          value={
            <div className="space-y-3">
              <Link
                href={`/profile?id=${loanRequest.borrowedBy}&type=lendee`}
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 transition-colors"
              >
                <UserCircleIcon className="h-5 w-5" />
                View Borrower Profile
              </Link>
              <p className="text-sm text-gray-600 mt-1">
                Member since 2023 • 4 previous loans
              </p>
            </div>
          }
          icon={<UserCircleIcon className="h-6 w-6 text-indigo-600" />}
        />
        
        <DetailCard
          label="Loan Terms"
          value={
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Principal:</span>
                <span className="font-medium text-gray-900">${loanRequest.principalAmount?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Interest Rate:</span>
                <span className="font-medium text-gray-900">{loanRequest.interestRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-900">{loanRequest.termWeeks} weeks</span>
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
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4 md:mb-0">
            <CalendarIcon className="h-6 w-6 text-indigo-600" />
            Repayment Schedule Breakdown
          </h2>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-indigo-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Weekly Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-indigo-200 rounded-full"></div>
              <span className="text-sm text-gray-600">Cumulative</span>
            </div>
          </div>
        </div>
        <div className="h-[400px] sm:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyPayments}
              margin={{ top: 20, right: 30, left: 30, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="week"
                tick={{ fill: "#4B5563", fontSize: 12 }}
                tickLine={{ stroke: "#E5E7EB" }}
                axisLine={{ stroke: "#E5E7EB" }}
                label={{
                  value: "Weeks",
                  position: "bottom",
                  fill: "#4B5563",
                  fontSize: 14,
                  offset: 20
                }}
              />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tick={{ fill: "#4B5563", fontSize: 12 }}
                tickLine={{ stroke: "#E5E7EB" }}
                axisLine={{ stroke: "#E5E7EB" }}
                label={{
                  value: "Payment Amount",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#4B5563",
                  fontSize: 14,
                  offset: -15
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                radius={[6, 6, 0, 0]}
                barSize={weeklyPayments.length > 20 ? 12 : 24}
              >
                <LabelList
                  dataKey="amount"
                  position="top"
                  formatter={(value: number) => `$${value.toFixed(0)}`}
                  fill="#6366F1"
                  fontSize={10}
                  offset={5}
                />
                {weeklyPayments.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`rgba(99, 102, 241, ${0.7 + (index * 0.3) / weeklyPayments.length})`}
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
          onClick={handleReject}
          variant="secondary"
        >
          <XCircleIcon className="h-5 w-5" />
          Decline Request
        </Button>
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
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>
        {percentage && (
          <span className={`${trendColors[trend]} px-3 py-1 rounded-full text-sm font-medium shadow-sm`}>
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
  <div className={`flex items-start gap-4 p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${full ? "col-span-2" : ""}`}>
    <div className="bg-indigo-50 p-3 rounded-lg shadow-sm flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <dt className="text-sm font-medium text-gray-500 mb-2">{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  </div>
);

// Button Component
const Button: React.FC<ButtonProps> = ({ onClick, disabled, variant, children }) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-70 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300 disabled:opacity-70 disabled:cursor-not-allowed",
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