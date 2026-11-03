"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { AlertCircle, CheckCircle2, Contact, Fingerprint, HandCoins, Mail, Star, Timer } from "lucide-react";
import AppShell from "../common/AppShell";
import { PageLoader } from "../common/LoadingSpinner";
import { CopyButton, Panel, SegmentedControl, StatCard, StatePanel } from "../common/ui";
import { formatCurrency } from "../common/format";
import { InfoRow, LoanHistory, ProfileHero, ProfileTab } from "./ProfileUI";
import { firestore } from "../../../firebaseConfig";
import { fetchLentLoans } from "../models/LoanAPIs";
import { Loan } from "../models/LoanInterfaces";

interface LenderProfileData {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  rating?: number;
  memberSince?: string;
  lastActive?: string;
}

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Lender profile" }];

const OtherLenderProfile: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [lenderData, setLenderData] = useState<LenderProfileData | null>(null);
  const [lentLoans, setLentLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

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
    return (
      <AppShell breadcrumbs={breadcrumbs}>
        <PageLoader label="Loading profile" />
      </AppShell>
    );
  }

  if (!lenderData) {
    return (
      <AppShell breadcrumbs={breadcrumbs}>
        <StatePanel
          icon={<AlertCircle />}
          tone="negative"
          title="Profile not found"
          description="The requested lender profile could not be found."
          action={
            <Link href="/loanRequests" className="btn-primary">
              Return to marketplace
            </Link>
          }
        />
      </AppShell>
    );
  }

  const displayName = lenderData.name || lenderData.username || lenderData.email?.split("@")[0] || "Lender";
  const rating = lenderData.rating ?? 0;

  return (
    <AppShell breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <ProfileHero
          id={lenderData.id}
          name={displayName}
          subtitle={
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-warning">
                <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                <span className="num">{rating.toFixed(1)}</span>
                <span className="sr-only">rating</span>
              </span>
              {lenderData.email || "Public member"}
            </span>
          }
          role="Lender profile"
          meta={[
            { label: "Capital lent", value: <span className="num">{formatCurrency(stats.totalLent)}</span> },
            { label: "Active loans", value: <span className="num">{stats.activeLoans}</span> },
            { label: "Completed", value: <span className="num">{stats.completedLoans}</span> },
            { label: "Rating", value: <span className="num">{rating.toFixed(1)} / 5</span> },
          ]}
          actions={
            <Link href={`/loanRequests?lenderId=${lenderData.id}#composer`} className="btn-primary">
              <HandCoins className="h-4 w-4" aria-hidden="true" />
              Request a loan
            </Link>
          }
        />

        <SegmentedControl
          label="Profile sections"
          value={activeTab}
          onChange={setActiveTab}
          className="w-full sm:w-auto"
          options={[
            { value: "overview", label: "Overview" },
            { value: "loans", label: "Lending history", count: lentLoans.length },
          ]}
        />

        {activeTab === "overview" ? (
          <div className="space-y-4">
            <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <StatCard label="Total amount lent" value={formatCurrency(stats.totalLent)} icon={<HandCoins />} tone="accent" />
              <StatCard label="Completed loans" value={stats.completedLoans} icon={<CheckCircle2 />} tone="positive" />
              <StatCard label="Active loans" value={stats.activeLoans} icon={<Timer />} tone="warning" />
            </section>

            <Panel icon={<Contact />} title="Contact">
              <div className="grid gap-2 md:grid-cols-2">
                <InfoRow icon={<Mail />} label="Email" value={lenderData.email || "Not provided"} />
                <InfoRow
                  icon={<Fingerprint />}
                  label="Member ID"
                  value={<span className="num text-xs">{lenderData.id}</span>}
                  action={<CopyButton value={lenderData.id} />}
                />
              </div>
            </Panel>
          </div>
        ) : (
          <LoanHistory title="Lending history" empty="No loans lent yet" loans={lentLoans} paymentLabel="payments received" />
        )}
      </div>
    </AppShell>
  );
};

export default OtherLenderProfile;
