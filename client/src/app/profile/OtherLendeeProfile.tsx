"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { AlertCircle, CalendarDays, Contact, HandCoins, Mail, UserRound, WalletCards } from "lucide-react";
import AppShell from "../common/AppShell";
import { PageLoader } from "../common/LoadingSpinner";
import { Panel, SegmentedControl, StatCard, StatePanel } from "../common/ui";
import { formatCurrency } from "../common/format";
import { InfoRow, LoanHistory, ProfileHero, ProfileTab } from "./ProfileUI";
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

const breadcrumbs = [{ label: "Marketplace", href: "/loanRequests" }, { label: "Borrower profile" }];

const OtherLendeeProfile: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [lendeeData, setLendeeData] = useState<LendeeProfileData | null>(null);
  const [borrowedLoans, setBorrowedLoans] = useState<Loan[]>([]);
  const [lentLoans, setLentLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

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
    const completed = borrowedLoans.filter((loan) => loan.paymentsMade.length === loan.termWeeks).length;

    return { totalBorrowed, totalLent, weeklyPayments, completed };
  }, [borrowedLoans, lentLoans]);

  if (loading) {
    return (
      <AppShell breadcrumbs={breadcrumbs}>
        <PageLoader label="Loading profile" />
      </AppShell>
    );
  }

  if (!lendeeData) {
    return (
      <AppShell breadcrumbs={breadcrumbs}>
        <StatePanel
          icon={<AlertCircle />}
          tone="negative"
          title="Profile not found"
          description="The requested borrower profile could not be found."
          action={
            <Link href="/loanRequests" className="btn-primary">
              Return to marketplace
            </Link>
          }
        />
      </AppShell>
    );
  }

  const displayName = lendeeData.name || lendeeData.username || lendeeData.email?.split("@")[0] || "Borrower";

  return (
    <AppShell breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <ProfileHero
          id={lendeeData.id}
          name={displayName}
          subtitle={lendeeData.username ? `@${lendeeData.username}` : lendeeData.email || "Public member"}
          role="Borrower profile"
          meta={[
            { label: "Loans borrowed", value: <span className="num">{borrowedLoans.length}</span> },
            { label: "Fully repaid", value: <span className="num">{stats.completed}</span> },
            { label: "Loans lent", value: <span className="num">{lentLoans.length}</span> },
            { label: "Weekly obligations", value: <span className="num">{formatCurrency(stats.weeklyPayments)}</span> },
          ]}
        />

        <SegmentedControl
          label="Profile sections"
          value={activeTab}
          onChange={setActiveTab}
          className="w-full sm:w-auto"
          options={[
            { value: "overview", label: "Overview" },
            { value: "loans", label: "Loan history", count: borrowedLoans.length + lentLoans.length },
          ]}
        />

        {activeTab === "overview" ? (
          <div className="space-y-4">
            <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <StatCard label="Total borrowed" value={formatCurrency(stats.totalBorrowed)} icon={<WalletCards />} tone="warning" />
              <StatCard label="Total lent" value={formatCurrency(stats.totalLent)} icon={<HandCoins />} tone="accent" />
              <StatCard label="Weekly payments" value={formatCurrency(stats.weeklyPayments)} icon={<CalendarDays />} hint="Across active borrowed loans" />
            </section>

            <Panel icon={<Contact />} title="Contact information">
              <div className="grid gap-2 md:grid-cols-2">
                <InfoRow icon={<Mail />} label="Email" value={lendeeData.email || "Not provided"} />
                <InfoRow icon={<UserRound />} label="Username" value={lendeeData.username ? `@${lendeeData.username}` : "Not provided"} />
              </div>
            </Panel>
          </div>
        ) : (
          <section className="grid gap-4 xl:grid-cols-2">
            <LoanHistory title="Borrowing history" empty="No loans borrowed yet" loans={borrowedLoans} paymentLabel="payments made" />
            <LoanHistory title="Lending history" empty="No loans lent yet" loans={lentLoans} paymentLabel="payments received" />
          </section>
        )}
      </div>
    </AppShell>
  );
};

export default OtherLendeeProfile;
