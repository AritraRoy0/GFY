"use client";

// TEMPORARY visual-verification route. Renders dashboard components with mock data. Delete after screenshots.
import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bell, Briefcase } from "lucide-react";
import AppShell from "../../common/AppShell";
import { LiveDot, PageHeader, Panel, SegmentedControl } from "../../common/ui";
import SummarySection from "../../dashboard/SummarySection";
import ChartsSection from "../../dashboard/ChartsSection";
import OutstandingLoansTable from "../../dashboard/LoanTable";
import Notifications from "../../dashboard/Notifications";
import { Loan } from "../../models/LoanInterfaces";

const day = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  return date;
};

const lent: Loan[] = [
  { id: "a1b2c3d4", borrowedBy: "uidBorrowerOne", ownedBy: "me", principalAmount: 2500, interestRate: 8, termWeeks: 12, paymentsMade: [{ weekNumber: 1, amount: 225 }, { weekNumber: 2, amount: 225 }, { weekNumber: 3, amount: 225 }], timestamp: day(40) },
  { id: "e5f6g7h8", borrowedBy: "uidBorrowerTwo", ownedBy: "me", principalAmount: 4000, interestRate: 10, termWeeks: 20, paymentsMade: [{ weekNumber: 1, amount: 220 }], timestamp: day(22) },
  { id: "i9j0k1l2", borrowedBy: "uidBorrowerThree", ownedBy: "me", principalAmount: 1200, interestRate: 6, termWeeks: 8, paymentsMade: [], timestamp: day(6) },
];

const borrowed: Loan[] = [
  { id: "m3n4o5p6", borrowedBy: "me", ownedBy: "uidLenderOne", principalAmount: 1800, interestRate: 7.5, termWeeks: 10, paymentsMade: [{ weekNumber: 1, amount: 193.5 }, { weekNumber: 2, amount: 193.5 }], timestamp: day(30) },
];

const notifications = [
  { id: "n1", message: "Your loan request for $3,000 is pending review.", type: "info" as const, timestamp: day(0) },
  { id: "n2", message: "Your loan request for $750 is pending review.", type: "info" as const, timestamp: day(3) },
];

export default function PreviewDashboard() {
  const [tab, setTab] = useState<"owned" | "owed">("owned");
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          kicker={<><LiveDot />Portfolio · Preview</>}
          title={<>Welcome back, <span className="text-gradient">alexr</span>.</>}
          description="Track loans you own, loans you owe, and pending request activity in realtime."
          actions={<Link href="/loanRequests" className="btn-secondary">Browse marketplace<ArrowUpRight className="h-4 w-4" /></Link>}
        />
        <SummarySection totalOwned={7700} totalOwed={1800} totalReserves={10000} lentLoans={lent} borrowedLoans={borrowed} />
        <ChartsSection lentLoans={lent} borrowedLoans={borrowed} />
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Panel className="xl:col-span-2" icon={<Briefcase />} title="Positions" description="Loans where you are the lender."
            actions={<SegmentedControl label="Position type" value={tab} onChange={setTab} options={[{ value: "owned", label: "Lent", count: 3 }, { value: "owed", label: "Borrowed", count: 1 }]} />}>
            <OutstandingLoansTable type={tab} loans={tab === "owned" ? lent : borrowed} />
          </Panel>
          <Panel icon={<Bell />} title="Activity" description="Your open requests awaiting a lender." actions={<span className="badge badge-warning num">2 pending</span>}>
            <Notifications notifications={notifications} />
          </Panel>
        </section>
      </div>
    </AppShell>
  );
}
