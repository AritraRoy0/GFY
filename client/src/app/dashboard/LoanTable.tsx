"use client";

import React, { useState } from "react";
import { CheckCircle2, ClipboardCheck, Copy, FileText, WalletCards } from "lucide-react";
import { Loan } from "../models/LoanInterfaces";

interface OutstandingLoansTableProps {
  userId: string;
  type: "owed" | "owned";
  loans: Loan[];
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const OutstandingLoansTable: React.FC<OutstandingLoansTableProps> = ({ type, loans }) => {
  const [copiedLoanId, setCopiedLoanId] = useState<string | null>(null);

  const handleMakePayment = (loanId: string) => {
    console.log(`Making payment for loan ID: ${loanId}`);
  };

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedLoanId(id);
      window.setTimeout(() => setCopiedLoanId(null), 2000);
    } catch (error) {
      console.error("Could not copy loan participant ID:", error);
    }
  };

  if (loans.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <FileText className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
        <p className="mt-4 text-sm font-semibold text-slate-800">No outstanding loans</p>
        <p className="mt-1 text-sm text-slate-500">
          {type === "owned" ? "Funded loans will show up here." : "Borrowed loans will show up here."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="py-3 pr-4">Amount</th>
            <th className="px-4 py-3">{type === "owned" ? "Borrower" : "Lender"}</th>
            <th className="px-4 py-3">Status</th>
            <th className="py-3 pl-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loans.map((loan) => {
            const participantId = type === "owned" ? loan.borrowedBy : loan.ownedBy;
            const participantLabel = `${participantId.slice(0, 10)}${participantId.length > 10 ? "..." : ""}`;
            const paidAmount = loan.paymentsMade.reduce((sum, payment) => sum + payment.amount, 0);
            const paidPercent = loan.principalAmount > 0 ? Math.min(100, Math.round((paidAmount / loan.principalAmount) * 100)) : 0;

            return (
              <tr key={loan.id} className="align-middle">
                <td className="py-4 pr-4 font-semibold text-slate-950">{currency.format(loan.principalAmount)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-700">
                      {participantId.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800">{participantLabel}</p>
                      <button
                        type="button"
                        onClick={() => handleCopyId(participantId)}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-sky-700"
                        aria-label={`Copy participant ID ${participantId}`}
                      >
                        {copiedLoanId === participantId ? (
                          <ClipboardCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {copiedLoanId === participantId ? "Copied" : "Copy ID"}
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="badge badge-success">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Active
                  </span>
                  <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${paidPercent}%` }} />
                  </div>
                </td>
                <td className="py-4 pl-4 text-right">
                  {type === "owed" ? (
                    <button
                      type="button"
                      onClick={() => handleMakePayment(loan.id)}
                      className="btn-secondary px-3 py-2 text-xs"
                      aria-label={`Make payment for loan ID ${loan.id}`}
                    >
                      <WalletCards className="h-4 w-4" aria-hidden="true" />
                      Pay
                    </button>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OutstandingLoansTable;
