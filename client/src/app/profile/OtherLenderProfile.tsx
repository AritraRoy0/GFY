"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { AlertCircle, CheckCircle2, HandCoins, Mail, MessageSquareText, Star, Timer, UserRound } from "lucide-react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { firestore } from "../../../firebaseConfig";
import { fetchLentLoans } from "../models/LoanAPIs";
import { Loan, calculateWeeklyAveragedInstallment } from "../models/LoanInterfaces";

interface LenderProfileData {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  rating?: number;
  memberSince?: string;
  lastActive?: string;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const OtherLenderProfile: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [lenderData, setLenderData] = useState<LenderProfileData | null>(null);
  const [lentLoans, setLentLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "loans">("overview");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchLenderData = async () => {
      try {
        const docRef = doc(firestore, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<LenderProfileData, "id">;
          setLenderData({ id, ...data });
        }
      } catch (error) {
        console.error("Error fetching lender data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLenderData();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = fetchLentLoans(id, setLentLoans);
    return () => unsubscribe();
  }, [id]);

  const stats = useMemo(() => {
    const totalLent = lentLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
    const completedLoans = lentLoans.filter((loan) => loan.paymentsMade.length === loan.termWeeks).length;
    const activeLoans = lentLoans.filter((loan) => loan.paymentsMade.length < loan.termWeeks).length;

    return { totalLent, completedLoans, activeLoans };
  }, [lentLoans]);

  if (loading) {
    return <LoadingState />;
  }

  if (!lenderData) {
    return <NotFoundState />;
  }

  const displayName = lenderData.name || lenderData.username || lenderData.email?.split("@")[0] || "Lender";
  const initial = displayName.charAt(0).toUpperCase();
  const rating = lenderData.rating ?? 0;

  return (
    <div className="app-page flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6 sm:py-10">
        <div className="app-container space-y-6">
          <section className="surface-card p-5 sm:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-center sm:gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-2xl font-semibold text-white sm:h-20 sm:w-20 sm:text-3xl">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="section-kicker">Lender profile</p>
                  <h1 className="mt-2 break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{displayName}</h1>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1 text-amber-600">
                      <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                      {rating.toFixed(1)}
                    </span>
                    <span className="break-all">{lenderData.email || "Public member"}</span>
                  </div>
                </div>
              </div>
              <Link href={`/loanRequests?lenderId=${lenderData.id}`} className="btn-secondary w-full md:w-auto">
                <HandCoins className="h-4 w-4" aria-hidden="true" />
                Request Loan
              </Link>
            </div>
          </section>

          <Tabs activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === "overview" ? (
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Metric title="Total amount lent" value={currency.format(stats.totalLent)} icon={<HandCoins className="h-5 w-5" />} />
              <Metric title="Completed loans" value={stats.completedLoans.toString()} icon={<CheckCircle2 className="h-5 w-5" />} />
              <Metric title="Active loans" value={stats.activeLoans.toString()} icon={<Timer className="h-5 w-5" />} />

              <div className="surface-card p-5 md:col-span-3">
                <h2 className="text-base font-semibold text-slate-950">Contact and actions</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <InfoRow icon={<Mail className="h-5 w-5" />} label="Email" value={lenderData.email || "Not provided"} />
                  <InfoRow icon={<MessageSquareText className="h-5 w-5" />} label="Message" value="Messaging route available from profile links" />
                </div>
              </div>
            </section>
          ) : (
            <section className="surface-card p-5">
              <h2 className="text-base font-semibold text-slate-950">Lending history</h2>
              {lentLoans.length === 0 ? (
                <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  No loans lent yet.
                </div>
              ) : (
                <div className="mt-4 divide-y divide-slate-100">
                  {lentLoans.map((loan) => (
                    <LoanRow key={loan.id} loan={loan} />
                  ))}
                </div>
              )}
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
          <p className="mt-2 text-sm text-slate-600">The requested lender profile could not be found.</p>
          <Link href="/loanRequests" className="btn-primary mt-6">Return to marketplace</Link>
        </div>
      </main>
      <Footer />
    </div>
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
        <span className="mt-1 block text-sm font-semibold text-slate-900">{value}</span>
      </span>
    </div>
  );
}

function LoanRow({ loan }: { loan: Loan }) {
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
            {loan.termWeeks} weeks - {loan.paymentsMade.length} payments received
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

export default OtherLenderProfile;
