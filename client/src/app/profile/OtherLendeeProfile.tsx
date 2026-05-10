"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { AlertCircle, CalendarDays, HandCoins, Mail, UserRound, WalletCards } from "lucide-react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { firestore } from "../../../firebaseConfig";
import { fetchBorrowedLoans, fetchLentLoans } from "../models/LoanAPIs";
import { Loan, calculateWeeklyAveragedInstallment } from "../models/LoanInterfaces";

interface LendeeProfileData {
  id: string;
  name?: string;
  email?: string;
  username?: string;
  memberSince?: string;
  lastActive?: string;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const OtherLendeeProfile: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [lendeeData, setLendeeData] = useState<LendeeProfileData | null>(null);
  const [borrowedLoans, setBorrowedLoans] = useState<Loan[]>([]);
  const [lentLoans, setLentLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "loans">("overview");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchLendeeData = async () => {
      try {
        const docRef = doc(firestore, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<LendeeProfileData, "id">;
          setLendeeData({ id, ...data });
        }
      } catch (error) {
        console.error("Error fetching lendee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLendeeData();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const unsubscribeBorrowed = fetchBorrowedLoans(id, setBorrowedLoans);
    const unsubscribeLent = fetchLentLoans(id, setLentLoans);
    return () => {
      unsubscribeBorrowed();
      unsubscribeLent();
    };
  }, [id]);

  const stats = useMemo(() => {
    const totalBorrowed = borrowedLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
    const totalLent = lentLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
    const weeklyPayments = borrowedLoans.reduce((sum, loan) => {
      return sum + calculateWeeklyAveragedInstallment(loan.principalAmount, loan.interestRate, loan.termWeeks);
    }, 0);

    return { totalBorrowed, totalLent, weeklyPayments };
  }, [borrowedLoans, lentLoans]);

  if (loading) {
    return <LoadingState />;
  }

  if (!lendeeData) {
    return <NotFoundState />;
  }

  const displayName = lendeeData.name || lendeeData.username || lendeeData.email?.split("@")[0] || "Borrower";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="app-page flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6 sm:py-10">
        <div className="app-container space-y-6">
          <ProfileHero
            label="Borrower profile"
            name={displayName}
            subtitle={lendeeData.username ? `@${lendeeData.username}` : lendeeData.email || "Public member"}
            initial={initial}
          />

          <Tabs activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === "overview" ? (
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Metric title="Total borrowed" value={currency.format(stats.totalBorrowed)} icon={<WalletCards className="h-5 w-5" />} />
              <Metric title="Total lent" value={currency.format(stats.totalLent)} icon={<HandCoins className="h-5 w-5" />} />
              <Metric title="Weekly payments" value={currency.format(stats.weeklyPayments)} icon={<CalendarDays className="h-5 w-5" />} />

              <div className="surface-card p-5 md:col-span-3">
                <h2 className="text-base font-semibold text-slate-950">Contact information</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <InfoRow icon={<Mail className="h-5 w-5" />} label="Email" value={lendeeData.email || "Not provided" } />
                  <InfoRow icon={<UserRound className="h-5 w-5" />} label="Username" value={lendeeData.username ? `@${lendeeData.username}` : "Not provided"} />
                </div>
              </div>
            </section>
          ) : (
            <section className="grid gap-4 lg:grid-cols-2">
              <LoanList title="Borrowing history" empty="No loans borrowed yet" loans={borrowedLoans} paymentLabel="payments made" />
              <LoanList title="Lending history" empty="No loans lent yet" loans={lentLoans} paymentLabel="payments received" />
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

function LoadingState() {
  return (
    <div className="app-page flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-700" />
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="app-page flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="surface-card max-w-md p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-600" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-950">Profile not found</h1>
          <p className="mt-2 text-sm text-slate-600">The requested borrower profile could not be found.</p>
          <Link href="/loanRequests" className="btn-primary mt-6">Return to marketplace</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProfileHero({ label, name, subtitle, initial }: { label: string; name: string; subtitle: string; initial: string }) {
  return (
    <section className="surface-card border-slate-200 bg-white p-5 sm:p-8">
      <div className="flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-center sm:gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-2xl font-semibold text-white sm:h-20 sm:w-20 sm:text-3xl">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="section-kicker">{label}</p>
          <h1 className="mt-2 break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{name}</h1>
          <p className="mt-1 break-all text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}

function Tabs({ activeTab, onChange }: { activeTab: "overview" | "loans"; onChange: (tab: "overview" | "loans") => void }) {
  return (
    <div className="inline-flex w-full rounded-lg border border-slate-200 bg-white p-1 shadow-sm min-[420px]:w-auto">
      {[
        { key: "overview", label: "Overview" },
        { key: "loans", label: "Loans" },
      ].map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key as "overview" | "loans")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors min-[420px]:flex-none ${
            activeTab === tab.key ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function Metric({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">{icon}</div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-sky-700 shadow-sm">{icon}</span>
      <span>
        <span className="block text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</span>
        <span className="mt-1 block break-all text-sm font-semibold text-slate-900">{value}</span>
      </span>
    </div>
  );
}

function LoanList({ title, empty, loans, paymentLabel }: { title: string; empty: string; loans: Loan[]; paymentLabel: string }) {
  return (
    <div className="surface-card p-5">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      {loans.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          {empty}
        </div>
      ) : (
        <div className="mt-4 divide-y divide-slate-100">
          {loans.map((loan) => (
            <LoanRow key={loan.id} loan={loan} paymentLabel={paymentLabel} />
          ))}
        </div>
      )}
    </div>
  );
}

function LoanRow({ loan, paymentLabel }: { loan: Loan; paymentLabel: string }) {
  const weekly = calculateWeeklyAveragedInstallment(loan.principalAmount, loan.interestRate, loan.termWeeks);
  const completed = loan.paymentsMade.length === loan.termWeeks;

  return (
    <div className="py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-950">
            {currency.format(loan.principalAmount)} <span className="text-sm font-medium text-slate-500">at {loan.interestRate}%</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {loan.termWeeks} weeks - {loan.paymentsMade.length} {paymentLabel}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold text-slate-950">{currency.format(weekly)} / week</p>
          <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${completed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
            {completed ? "Completed" : "In progress"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OtherLendeeProfile;
