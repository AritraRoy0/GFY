"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useDispatch } from "react-redux";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Eye,
  Percent,
  Plus,
  UserRound,
} from "lucide-react";
import { uploadLoanRequest, fetchLoanRequests } from "../models/LoanRequestAPIs";
import { LoanRequest, NewLoanRequest } from "../models/LoanInterfaces";
import { clearLoanRequestState, setLoanRequestState } from "../store";
import Header from "../common/Header";
import Footer from "../common/Footer";
import LoadingSpinner from "../common/LoadingSpinner";

type Feedback = { type: "success" | "error"; message: string } | null;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatRequestDate = (request: LoanRequest) => {
  if (!request.timestamp) return "Recently added";
  return request.timestamp.toDate().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const LoanRequestForm: React.FC = () => {
  const [principalAmount, setPrincipalAmount] = useState(500);
  const [interestRate, setInterestRate] = useState(5);
  const [termWeeks, setTermWeeks] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [principalError, setPrincipalError] = useState("");
  const [interestError, setInterestError] = useState("");
  const [termError, setTermError] = useState("");
  const [purposeError, setPurposeError] = useState("");
  const [formTouched, setFormTouched] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = fetchLoanRequests((requests) => setLoanRequests(requests));
    return () => unsubscribe();
  }, []);

  const marketplaceStats = useMemo(() => {
    const availableRequests = loanRequests.filter((request) => request.borrowedBy !== currentUser?.uid);
    const totalRequested = loanRequests.reduce((sum, request) => sum + request.principalAmount, 0);
    const averageRate = loanRequests.length
      ? loanRequests.reduce((sum, request) => sum + request.interestRate, 0) / loanRequests.length
      : 0;

    return {
      available: availableRequests.length,
      totalRequested,
      averageRate,
    };
  }, [currentUser?.uid, loanRequests]);

  const validateForm = (): boolean => {
    let isValid = true;
    setFormTouched(true);

    if (principalAmount < 500 || principalAmount > 10000) {
      setPrincipalError("Amount must be between $500 and $10,000.");
      isValid = false;
    } else {
      setPrincipalError("");
    }

    if (interestRate < 5) {
      setInterestError("Interest rate must be at least 5%.");
      isValid = false;
    } else {
      setInterestError("");
    }

    if (termWeeks < 1) {
      setTermError("Term must be at least 1 week.");
      isValid = false;
    } else {
      setTermError("");
    }

    if (!purpose.trim()) {
      setPurposeError("Add a purpose for the loan.");
      isValid = false;
    } else {
      setPurposeError("");
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);

    if (!validateForm()) return;

    if (!currentUser) {
      setFeedback({ type: "error", message: "Please log in to submit a loan request." });
      return;
    }

    const newLoanRequest: NewLoanRequest = {
      borrowedBy: currentUser.uid,
      principalAmount,
      interestRate,
      termWeeks,
      purpose,
    };

    setLoading(true);
    try {
      await uploadLoanRequest(newLoanRequest);
      setPrincipalAmount(500);
      setInterestRate(5);
      setTermWeeks(1);
      setPurpose("");
      setFormTouched(false);
      setFeedback({ type: "success", message: "Loan request submitted and added to the marketplace." });
    } catch (error) {
      console.error("Error submitting loan request:", error);
      setFeedback({ type: "error", message: "There was an error submitting your loan request. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewLoan = (loan: LoanRequest) => {
    dispatch(clearLoanRequestState());
    dispatch(setLoanRequestState(loan));
    router.push("/viewLoan");
  };

  return (
    <div className="app-page flex flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-10">
        <div className="app-container space-y-6">
          <section className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-kicker">Loan Marketplace</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Create and review peer loan requests.</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Borrowers can publish structured requests. Lenders can compare amount, rate, term, and borrower context before reviewing details.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:w-[28rem]">
              <Stat label="Available" value={marketplaceStats.available.toString()} />
              <Stat label="Requested" value={currency.format(marketplaceStats.totalRequested)} />
              <Stat label="Avg. rate" value={`${marketplaceStats.averageRate.toFixed(1)}%`} />
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[24rem_1fr] lg:items-start">
            <form onSubmit={handleSubmit} className="surface-card sticky top-24 space-y-5 p-5">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950">
                  <Plus className="h-5 w-5 text-sky-700" aria-hidden="true" />
                  New loan request
                </h2>
                <p className="mt-1 text-sm text-slate-500">Set the terms lenders will evaluate.</p>
              </div>

              {feedback && (
                <div className={`flex gap-3 rounded-md border p-3 text-sm ${
                  feedback.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}>
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  <p>{feedback.message}</p>
                </div>
              )}

              <NumberField
                label="Principal amount"
                icon={<CircleDollarSign className="h-4 w-4" />}
                value={principalAmount}
                min={500}
                max={10000}
                onChange={(value) => {
                  setPrincipalAmount(value);
                  if (formTouched) validateForm();
                }}
                prefix="$"
                error={principalError}
                helper="Between $500 and $10,000"
              />

              <NumberField
                label="Interest rate"
                icon={<Percent className="h-4 w-4" />}
                value={interestRate}
                min={5}
                onChange={(value) => {
                  setInterestRate(value);
                  if (formTouched) validateForm();
                }}
                suffix="%"
                error={interestError}
                helper="Minimum 5%"
              />

              <NumberField
                label="Term"
                icon={<CalendarDays className="h-4 w-4" />}
                value={termWeeks}
                min={1}
                onChange={(value) => {
                  setTermWeeks(value);
                  if (formTouched) validateForm();
                }}
                suffix="weeks"
                error={termError}
                helper="Minimum 1 week"
              />

              <div>
                <label htmlFor="purpose" className="mb-2 block text-sm font-semibold text-slate-700">
                  Purpose
                </label>
                <textarea
                  id="purpose"
                  value={purpose}
                  onChange={(event) => {
                    setPurpose(event.target.value);
                    if (formTouched) validateForm();
                  }}
                  className={`input-field min-h-28 resize-y ${purposeError ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/15" : ""}`}
                  placeholder="Briefly describe the loan purpose..."
                  aria-invalid={Boolean(purposeError)}
                />
                {purposeError && <FieldError message={purposeError} />}
              </div>

              <button type="submit" disabled={loading || !currentUser} className="btn-primary w-full">
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    Submitting
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>

              {!currentUser && (
                <p className="rounded-md bg-amber-50 p-3 text-center text-sm font-medium text-amber-800">
                  Log in to submit a loan request.
                </p>
              )}
            </form>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">Existing requests</h2>
                  <p className="mt-1 text-sm text-slate-500">Compare open requests and review lender-side details.</p>
                </div>
              </div>

              {loanRequests.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 bg-white p-12 text-center">
                  <ClipboardList className="mx-auto h-12 w-12 text-slate-400" aria-hidden="true" />
                  <p className="mt-4 text-sm font-semibold text-slate-800">No loan requests found</p>
                  <p className="mt-1 text-sm text-slate-500">Create a request to populate the marketplace.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {loanRequests.map((request) => {
                    const isOwnRequest = currentUser?.uid === request.borrowedBy;

                    return (
                      <article key={request.id} className="surface-card p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className={`badge ${isOwnRequest ? "" : "badge-success"}`}>
                              {isOwnRequest ? "Your request" : "Available"}
                            </span>
                            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                              {currency.format(request.principalAmount)}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {request.interestRate}% interest over {request.termWeeks} week{request.termWeeks === 1 ? "" : "s"}
                            </p>
                          </div>
                          <span className="rounded-md bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-500">
                            #{request.id.slice(0, 6)}
                          </span>
                        </div>

                        <div className="mt-5 rounded-md bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Purpose</p>
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-700">{request.purpose}</p>
                        </div>

                        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                          <Detail label="Principal" value={currency.format(request.principalAmount)} />
                          <Detail label="Interest" value={`${request.interestRate}%`} />
                          <Detail label="Term" value={`${request.termWeeks} weeks`} />
                          <Detail label="Date" value={formatRequestDate(request)} />
                        </dl>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          {isOwnRequest ? (
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
                              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                              Waiting for lender review
                            </span>
                          ) : (
                            <Link
                              href={`/profile?id=${request.borrowedBy}&type=lendee`}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
                            >
                              <UserRound className="h-4 w-4" aria-hidden="true" />
                              Borrower {request.borrowedBy.slice(0, 6)}
                            </Link>
                          )}

                          {!isOwnRequest && (
                            <button type="button" onClick={() => handleReviewLoan(request)} className="btn-primary px-4 py-2">
                              <Eye className="h-4 w-4" aria-hidden="true" />
                              Review
                              <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="mt-2 flex items-center gap-1 text-sm font-medium text-red-600">
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      {message}
    </p>
  );
}

function NumberField({
  label,
  icon,
  value,
  min,
  max,
  onChange,
  prefix,
  suffix,
  error,
  helper,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max?: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  error?: string;
  helper: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">{icon}</span>
        {prefix && <span className="pointer-events-none absolute inset-y-0 left-10 flex items-center text-sm text-slate-500">{prefix}</span>}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`input-field ${prefix ? "pl-14" : "pl-10"} ${suffix ? "pr-16" : ""} ${
            error ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/15" : ""
          }`}
          aria-invalid={Boolean(error)}
        />
        {suffix && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-500">{suffix}</span>}
      </div>
      {error ? <FieldError message={error} /> : <p className="mt-2 text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

export default LoanRequestForm;
