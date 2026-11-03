"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpDown,
  CheckCircle2,
  ClipboardList,
  Hourglass,
  LayoutGrid,
  LogIn,
  PlusCircle,
  Rows3,
  Search,
  X,
} from "lucide-react";
import { uploadLoanRequest, fetchLoanRequests } from "../models/LoanRequestAPIs";
import { calculateFlatRepayment, LoanRequest, NewLoanRequest } from "../models/LoanInterfaces";
import { clearLoanRequestState, setLoanRequestState } from "../store";
import AppShell from "../common/AppShell";
import LoadingSpinner from "../common/LoadingSpinner";
import RangeField from "../common/RangeField";
import RepaymentQuote from "../common/RepaymentQuote";
import { Avatar, EmptyState, PageHeader, SegmentedControl, Skeleton, SpotlightCard, StatCard } from "../common/ui";
import { formatCurrency, formatPercent, formatRelative, shortId } from "../common/format";
import { memberName, MemberSummary, useUserDirectory } from "../common/useUserDirectory";

type Feedback = { type: "success" | "error"; message: string } | null;
type Filter = "all" | "available" | "mine";
type SortKey = "newest" | "amount-desc" | "amount-asc" | "rate-desc" | "term-asc";
type View = "grid" | "table";

const PURPOSE_MAX = 500;
const VIEW_STORAGE_KEY = "gfy.marketplace.view";

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: "newest", label: "Newest first" },
  { value: "amount-desc", label: "Largest amount" },
  { value: "amount-asc", label: "Smallest amount" },
  { value: "rate-desc", label: "Highest rate" },
  { value: "term-asc", label: "Shortest term" },
];

const requestTime = (request: LoanRequest) => request.timestamp?.toMillis?.() ?? Date.now();

const formatRequestDate = (request: LoanRequest) => {
  if (!request.timestamp) return "Just now";
  return formatRelative(request.timestamp.toDate());
};

interface FieldErrors {
  principal: string;
  interest: string;
  term: string;
  purpose: string;
}

function validateRequest(values: { principalAmount: number; interestRate: number; termWeeks: number; purpose: string }): FieldErrors {
  return {
    principal: !(values.principalAmount >= 500 && values.principalAmount <= 10000) ? "Amount must be between $500 and $10,000." : "",
    interest: !(values.interestRate >= 5) ? "Interest rate must be at least 5%." : "",
    // The review screen only accepts terms up to 52 weeks, so cap it here too.
    term: !(values.termWeeks >= 1 && values.termWeeks <= 52)
      ? "Term must be between 1 and 52 weeks."
      : !Number.isInteger(values.termWeeks)
        ? "Term must be a whole number of weeks."
        : "",
    purpose: !values.purpose.trim() ? "Add a purpose for the loan." : "",
  };
}

const LoanRequestForm: React.FC = () => {
  const [principalAmount, setPrincipalAmount] = useState(500);
  const [interestRate, setInterestRate] = useState(5);
  const [termWeeks, setTermWeeks] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({ principal: "", interest: "", term: "", purpose: "" });
  const [formTouched, setFormTouched] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [requestsLoaded, setRequestsLoaded] = useState(false);

  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<View>("grid");
  const searchRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthResolved(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = fetchLoanRequests(
      (requests) => {
        setLoanRequests(requests);
        setRequestsLoaded(true);
      },
      () => setRequestsLoaded(true)
    );
    return () => unsubscribe();
  }, []);

  // Prefill from the landing page calculator (?amount=&rate=&term=) and restore the preferred view.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amount = Number(params.get("amount"));
    const rate = Number(params.get("rate"));
    const term = Number(params.get("term"));
    if (amount >= 500 && amount <= 10000) setPrincipalAmount(amount);
    if (rate >= 5) setInterestRate(rate);
    if (Number.isInteger(term) && term >= 1 && term <= 52) setTermWeeks(term);

    try {
      const storedView = window.localStorage.getItem(VIEW_STORAGE_KEY);
      if (storedView === "grid" || storedView === "table") setView(storedView);
    } catch {
      // Storage can be unavailable (private mode); the default view is fine.
    }
  }, []);

  // "/" focuses the search box, like most data tools.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (formTouched) setErrors(validateRequest({ principalAmount, interestRate, termWeeks, purpose }));
  }, [formTouched, principalAmount, interestRate, termWeeks, purpose]);

  const changeView = (next: View) => {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, next);
    } catch {
      // Ignore storage failures; the choice still applies for this visit.
    }
  };

  const members = useUserDirectory(useMemo(() => loanRequests.map((request) => request.borrowedBy), [loanRequests]));

  const marketplaceStats = useMemo(() => {
    const availableRequests = loanRequests.filter((request) => request.borrowedBy !== currentUser?.uid);
    const totalRequested = loanRequests.reduce((sum, request) => sum + request.principalAmount, 0);
    const averageRate = loanRequests.length
      ? loanRequests.reduce((sum, request) => sum + request.interestRate, 0) / loanRequests.length
      : 0;

    return {
      available: availableRequests.length,
      mine: loanRequests.length - availableRequests.length,
      totalRequested,
      averageRate,
    };
  }, [currentUser?.uid, loanRequests]);

  const visibleRequests = useMemo(() => {
    const terms = search.trim().toLowerCase();
    const filtered = loanRequests.filter((request) => {
      const isOwn = request.borrowedBy === currentUser?.uid;
      if (filter === "available" && isOwn) return false;
      if (filter === "mine" && !isOwn) return false;
      if (!terms) return true;
      const haystack = `${request.purpose} ${request.id} ${memberName(request.borrowedBy, members[request.borrowedBy])}`.toLowerCase();
      return haystack.includes(terms);
    });

    const sorters: Record<SortKey, (a: LoanRequest, b: LoanRequest) => number> = {
      newest: (a, b) => requestTime(b) - requestTime(a),
      "amount-desc": (a, b) => b.principalAmount - a.principalAmount,
      "amount-asc": (a, b) => a.principalAmount - b.principalAmount,
      "rate-desc": (a, b) => b.interestRate - a.interestRate,
      "term-asc": (a, b) => a.termWeeks - b.termWeeks,
    };
    return filtered.sort(sorters[sortKey]);
  }, [currentUser?.uid, filter, loanRequests, members, search, sortKey]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    setFormTouched(true);

    const nextErrors = validateRequest({ principalAmount, interestRate, termWeeks, purpose });
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

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
      toast.success("Request published to the marketplace.");
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

  const hasFilters = filter !== "all" || search.trim() !== "";

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          kicker="Live requests"
          title="Peer-to-peer loan marketplace."
          description="Borrowers publish structured requests. Lenders compare amount, rate, term, and borrower context before reviewing the full schedule."
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Open requests" value={requestsLoaded ? loanRequests.length : "--"} hint="Live across the marketplace" />
          <StatCard label="Available to fund" value={requestsLoaded ? marketplaceStats.available : "--"} tone="accent" hint="Excludes your own requests" />
          <StatCard label="Requested volume" value={requestsLoaded ? formatCurrency(marketplaceStats.totalRequested) : "--"} hint="Total open principal" />
          <StatCard label="Average rate" value={requestsLoaded ? formatPercent(marketplaceStats.averageRate) : "--"} tone="positive" hint="Mean across open requests" />
        </div>

        <section className="grid gap-6 lg:grid-cols-[23rem_1fr] lg:items-start xl:grid-cols-[25rem_1fr]">
          <form
            id="composer"
            onSubmit={handleSubmit}
            noValidate
            className="panel edge-glow order-last scroll-mt-20 lg:sticky lg:top-20 lg:order-none lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
          >
            <div className="panel-header">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
                  <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-ink">New loan request</h2>
                  <p className="mt-0.5 text-xs text-ink-muted">Set the terms lenders will evaluate.</p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-4 sm:p-5">
              {feedback && (
                <div
                  role={feedback.type === "error" ? "alert" : "status"}
                  className={`flex gap-2 rounded-lg border p-3 text-xs ${
                    feedback.type === "success" ? "border-positive/30 bg-positive/10 text-positive" : "border-negative/30 bg-negative/10 text-negative"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  <p>{feedback.message}</p>
                </div>
              )}

              <RangeField
                id="principal"
                label="Principal amount"
                value={principalAmount}
                min={500}
                max={10000}
                step={100}
                inputMax={10000}
                onChange={setPrincipalAmount}
                prefix="$"
                error={errors.principal}
                helper="$500 to $10,000"
              />
              <RangeField
                id="interest"
                label="Interest rate"
                value={interestRate}
                min={5}
                max={36}
                step={0.5}
                onChange={setInterestRate}
                suffix="%"
                error={errors.interest}
                helper="Minimum 5%, applied once over the term"
              />
              <RangeField
                id="term"
                label="Term"
                value={termWeeks}
                min={1}
                max={52}
                inputMax={52}
                onChange={setTermWeeks}
                suffix="wk"
                error={errors.term}
                helper="1 to 52 weeks"
              />

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="purpose" className="text-xs font-medium text-ink-2">
                    Purpose
                  </label>
                  <span className={`num text-[10.5px] ${purpose.length > PURPOSE_MAX * 0.9 ? "text-warning" : "text-ink-faint"}`}>
                    {purpose.length}/{PURPOSE_MAX}
                  </span>
                </div>
                <textarea
                  id="purpose"
                  value={purpose}
                  maxLength={PURPOSE_MAX}
                  onChange={(event) => setPurpose(event.target.value)}
                  className={`input-field min-h-24 resize-none text-sm ${errors.purpose ? "input-error" : ""}`}
                  placeholder="What is the loan for, and how will it be repaid?"
                  aria-invalid={Boolean(errors.purpose)}
                  aria-describedby={errors.purpose ? "purpose-error" : undefined}
                />
                {errors.purpose && <FieldError id="purpose-error" message={errors.purpose} />}
              </div>

              <div className="rounded-lg border border-line bg-canvas/50 p-4">
                <p className="data-label mb-3">Repayment preview</p>
                <RepaymentQuote
                  principal={Number.isFinite(principalAmount) ? principalAmount : 0}
                  rate={Number.isFinite(interestRate) ? interestRate : 0}
                  termWeeks={Number.isFinite(termWeeks) ? termWeeks : 0}
                  variant="compact"
                />
              </div>

              {authResolved && !currentUser ? (
                <div className="space-y-2">
                  <Link href="/auth?tab=login" className="btn-primary w-full">
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    Sign in to publish
                  </Link>
                  <p className="text-center text-[11px] text-ink-muted">You can explore terms without an account.</p>
                </div>
              ) : (
                <button type="submit" disabled={loading || !currentUser} className="btn-primary w-full py-3">
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" label="Submitting" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      Publish request
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <section className="min-w-0 space-y-4" aria-labelledby="requests-heading">
            <div className="flex flex-col gap-3">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 id="requests-heading" className="text-base font-semibold text-ink">
                    Open requests
                  </h2>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {requestsLoaded ? (
                      <>
                        Showing <span className="num text-ink-2">{visibleRequests.length}</span> of{" "}
                        <span className="num text-ink-2">{loanRequests.length}</span>
                      </>
                    ) : (
                      "Connecting to live feed..."
                    )}
                  </p>
                </div>
                <SegmentedControl
                  label="Layout"
                  value={view}
                  onChange={changeView}
                  className="hidden md:inline-flex"
                  options={[
                    { value: "grid", label: <><LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" /><span className="sr-only">Grid</span></> },
                    { value: "table", label: <><Rows3 className="h-3.5 w-3.5" aria-hidden="true" /><span className="sr-only">Table</span></> },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface/60 p-2 2xl:flex-row 2xl:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search purpose, borrower, or ID"
                    className="h-9 w-full rounded-lg border border-transparent bg-canvas/60 pl-9 pr-16 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent/50 focus-visible:outline-none"
                    aria-label="Search requests"
                  />
                  {search ? (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-ink-muted hover:bg-surface-3 hover:text-ink"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <span className="kbd absolute right-2 top-1/2 -translate-y-1/2">/</span>
                  )}
                </div>
                <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:justify-between">
                  <SegmentedControl
                    label="Filter requests"
                    value={filter}
                    onChange={setFilter}
                    className="min-[420px]:flex-none"
                    options={[
                      { value: "all", label: "All", count: loanRequests.length },
                      { value: "available", label: "Available", count: marketplaceStats.available },
                      { value: "mine", label: "Mine", count: marketplaceStats.mine },
                    ]}
                  />
                  <div className="relative">
                    <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
                    <select
                      value={sortKey}
                      onChange={(event) => setSortKey(event.target.value as SortKey)}
                      className="h-9 w-full appearance-none rounded-lg border border-line bg-canvas/60 pl-8 pr-3 text-xs font-medium text-ink-2 outline-none transition-colors hover:border-line-strong focus:border-accent/50"
                      aria-label="Sort requests"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-surface-2">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {!requestsLoaded ? (
              <div className="grid grid-cols-1 gap-4 min-[1400px]:grid-cols-2">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="panel space-y-4 p-5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                ))}
              </div>
            ) : visibleRequests.length === 0 ? (
              <EmptyState
                icon={<ClipboardList />}
                title={hasFilters ? "No requests match these filters" : "No loan requests yet"}
                description={hasFilters ? "Try a different search or filter." : "Publish the first request to populate the marketplace."}
                action={
                  hasFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setFilter("all");
                        setSearch("");
                      }}
                      className="btn-secondary btn-sm"
                    >
                      Clear filters
                    </button>
                  )
                }
                className="py-16"
              />
            ) : view === "table" ? (
              <RequestTable requests={visibleRequests} members={members} currentUserId={currentUser?.uid} onReview={handleReviewLoan} />
            ) : (
              <div className="grid grid-cols-1 gap-4 min-[1400px]:grid-cols-2">
                {visibleRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    member={members[request.borrowedBy]}
                    isOwnRequest={currentUser?.uid === request.borrowedBy}
                    onReview={handleReviewLoan}
                  />
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </AppShell>
  );
};

function RequestCard({
  request,
  member,
  isOwnRequest,
  onReview,
}: {
  request: LoanRequest;
  member?: MemberSummary;
  isOwnRequest: boolean;
  onReview: (request: LoanRequest) => void;
}) {
  const { totalRepayment, totalInterest, weeklyPayment } = calculateFlatRepayment(request.principalAmount, request.interestRate, request.termWeeks);
  const name = memberName(request.borrowedBy, member);

  return (
    <SpotlightCard as="article" className="panel card-hover flex flex-col p-5">
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="num text-xs text-ink-faint">#{shortId(request.id)}</span>
          <span className={`badge ${isOwnRequest ? "badge-warning" : "badge-success"}`}>{isOwnRequest ? "Your request" : "Available"}</span>
        </div>
        <span className="num text-[11px] text-ink-muted">{formatRequestDate(request)}</span>
      </div>

      <div className="relative mt-4">
        <p className="text-3xl font-semibold tracking-[-0.03em] text-ink">{formatCurrency(request.principalAmount)}</p>
        <p className="num mt-1 text-xs text-ink-muted">
          {formatPercent(request.interestRate)} interest · {request.termWeeks} week{request.termWeeks === 1 ? "" : "s"}
        </p>
      </div>

      <dl className="relative mt-5 grid grid-cols-3 divide-x divide-line rounded-lg border border-line bg-canvas/50">
        <CardMetric label="Weekly" value={formatCurrency(weeklyPayment, { cents: true })} />
        <CardMetric label="Total" value={formatCurrency(totalRepayment)} />
        <CardMetric label="Yield" value={`+${formatCurrency(totalInterest)}`} positive />
      </dl>

      <p className="relative mt-4 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-ink-2">{request.purpose}</p>

      <div className="relative mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        {isOwnRequest ? (
          <span className="inline-flex items-center gap-2 text-xs font-medium text-warning">
            <Hourglass className="h-3.5 w-3.5" aria-hidden="true" />
            Waiting for lender review
          </span>
        ) : (
          <Link href={`/profile?id=${request.borrowedBy}&type=lendee`} className="group/borrower flex min-w-0 items-center gap-2.5">
            <Avatar id={request.borrowedBy} name={name} size="xs" />
            <span className="truncate text-xs font-medium text-ink-2 group-hover/borrower:text-accent">{name}</span>
          </Link>
        )}

        {!isOwnRequest && (
          <button type="button" onClick={() => onReview(request)} className="btn-primary btn-sm w-full sm:w-auto">
            Review terms
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </SpotlightCard>
  );
}

function CardMetric({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="min-w-0 px-3 py-2.5">
      <dt className="data-label">{label}</dt>
      <dd className={`num mt-1 truncate text-sm font-medium ${positive ? "text-positive" : "text-ink"}`}>{value}</dd>
    </div>
  );
}

function RequestTable({
  requests,
  members,
  currentUserId,
  onReview,
}: {
  requests: LoanRequest[];
  members: Record<string, MemberSummary>;
  currentUserId?: string;
  onReview: (request: LoanRequest) => void;
}) {
  return (
    <div className="panel overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/40">
            <th className="data-label py-3 pl-5 pr-3 font-medium">Request</th>
            <th className="data-label px-3 py-3 font-medium">Borrower</th>
            <th className="data-label px-3 py-3 text-right font-medium">Principal</th>
            <th className="data-label px-3 py-3 text-right font-medium">Terms</th>
            <th className="data-label hidden px-3 py-3 text-right font-medium 2xl:table-cell">Weekly</th>
            <th className="data-label px-3 py-3 text-right font-medium">Yield</th>
            <th className="data-label hidden px-3 py-3 font-medium 2xl:table-cell">Posted</th>
            <th className="py-3 pl-3 pr-5">
              <span className="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {requests.map((request) => {
            const isOwn = request.borrowedBy === currentUserId;
            const name = memberName(request.borrowedBy, members[request.borrowedBy]);
            const { totalInterest, weeklyPayment } = calculateFlatRepayment(request.principalAmount, request.interestRate, request.termWeeks);
            return (
              <tr key={request.id} className="transition-colors hover:bg-surface-2/50">
                <td className="max-w-[12rem] py-3 pl-5 pr-3">
                  <p className="num text-xs text-ink-faint">#{shortId(request.id)}</p>
                  <p className="truncate text-xs text-ink-2" title={request.purpose}>
                    {request.purpose}
                  </p>
                </td>
                <td className="px-3 py-3">
                  {isOwn ? (
                    <span className="badge badge-warning">You</span>
                  ) : (
                    <Link href={`/profile?id=${request.borrowedBy}&type=lendee`} className="flex items-center gap-2 hover:text-accent">
                      <Avatar id={request.borrowedBy} name={name} size="xs" />
                      <span className="max-w-[7rem] truncate text-xs font-medium text-ink-2">{name}</span>
                    </Link>
                  )}
                </td>
                <td className="num px-3 py-3 text-right font-medium text-ink">{formatCurrency(request.principalAmount)}</td>
                <td className="num whitespace-nowrap px-3 py-3 text-right text-xs text-ink-2">
                  {formatPercent(request.interestRate)} <span className="text-ink-faint">·</span> {request.termWeeks}w
                </td>
                <td className="num hidden px-3 py-3 text-right text-ink-2 2xl:table-cell">{formatCurrency(weeklyPayment, { cents: true })}</td>
                <td className="num px-3 py-3 text-right text-positive">+{formatCurrency(totalInterest)}</td>
                <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-ink-muted 2xl:table-cell">{formatRequestDate(request)}</td>
                <td className="py-3 pl-3 pr-5 text-right">
                  {!isOwn && (
                    <button
                      type="button"
                      onClick={() => onReview(request)}
                      className="btn-secondary h-8 w-8 p-0"
                      aria-label={`Review request #${shortId(request.id)}`}
                      title="Review terms"
                    >
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-negative">
      <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
      {message}
    </p>
  );
}

export default LoanRequestForm;
