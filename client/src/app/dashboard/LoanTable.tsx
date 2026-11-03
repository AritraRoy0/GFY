"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { FileText, WalletCards } from "lucide-react";
import { toast } from "react-toastify";
import { Loan } from "../models/LoanInterfaces";
import { Avatar, CopyButton, EmptyState, Meter } from "../common/ui";
import { formatCurrency, formatDate, formatPercent, shortId } from "../common/format";
import { memberName, useUserDirectory } from "../common/useUserDirectory";

interface OutstandingLoansTableProps {
  type: "owed" | "owned";
  loans: Loan[];
}

function loanProgress(loan: Loan) {
  const paidAmount = loan.paymentsMade.reduce((sum, payment) => sum + payment.amount, 0);
  const paidPercent = loan.principalAmount > 0 ? Math.min(100, Math.round((paidAmount / loan.principalAmount) * 100)) : 0;
  return { paidAmount, paidPercent };
}

const OutstandingLoansTable: React.FC<OutstandingLoansTableProps> = ({ type, loans }) => {
  const counterpartyIds = useMemo(() => loans.map((loan) => (type === "owned" ? loan.borrowedBy : loan.ownedBy)), [loans, type]);
  const members = useUserDirectory(counterpartyIds);
  const counterpartyRole = type === "owned" ? "Borrower" : "Lender";
  const profileType = type === "owned" ? "lendee" : "lender";

  const handleMakePayment = (loanId: string) => {
    console.log(`Making payment for loan ID: ${loanId}`);
    toast.info("Payment processing isn't connected yet. No money has moved.");
  };

  if (loans.length === 0) {
    return (
      <EmptyState
        icon={<FileText />}
        title={type === "owned" ? "No loans funded yet" : "No borrowed loans"}
        description={type === "owned" ? "Loans you fund from the marketplace show up here." : "Approved requests you borrowed against show up here."}
        action={
          <Link href={type === "owned" ? "/loanRequests" : "/loanRequests#composer"} className="btn-secondary btn-sm">
            {type === "owned" ? "Browse open requests" : "Create a request"}
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {loans.map((loan) => {
          const participantId = type === "owned" ? loan.borrowedBy : loan.ownedBy;
          const name = memberName(participantId, members[participantId]);
          const { paidAmount, paidPercent } = loanProgress(loan);

          return (
            <article key={loan.id} className="rounded-lg border border-line bg-canvas/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="num text-[11px] text-ink-faint">#{shortId(loan.id)}</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight text-ink">{formatCurrency(loan.principalAmount)}</p>
                  <p className="num mt-0.5 text-xs text-ink-muted">
                    {formatPercent(loan.interestRate)} · {loan.termWeeks}w
                  </p>
                </div>
                <span className={`badge ${paidPercent >= 100 ? "badge-success" : "badge-accent"}`}>{paidPercent >= 100 ? "Repaid" : "Active"}</span>
              </div>

              <Link href={`/profile?id=${participantId}&type=${profileType}`} className="mt-4 flex items-center gap-3 rounded-md">
                <Avatar id={participantId} name={name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="data-label">{counterpartyRole}</p>
                  <p className="truncate text-sm font-medium text-ink">{name}</p>
                </div>
              </Link>

              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-[11px] text-ink-muted">
                  <span className="num">{formatCurrency(paidAmount)} repaid</span>
                  <span className="num">{paidPercent}%</span>
                </div>
                <Meter value={paidPercent} max={100} tone={paidPercent >= 100 ? "positive" : "accent"} />
              </div>

              {type === "owed" && (
                <button
                  type="button"
                  onClick={() => handleMakePayment(loan.id)}
                  className="btn-secondary btn-sm mt-4 w-full"
                  aria-label={`Make payment for loan ID ${loan.id}`}
                >
                  <WalletCards className="h-3.5 w-3.5" aria-hidden="true" />
                  Make payment
                </button>
              )}
            </article>
          );
        })}
      </div>

      <div className="-mx-4 hidden overflow-x-auto sm:-mx-5 md:block">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-y border-line bg-canvas/40">
              <th className="data-label py-2.5 pl-4 pr-3 font-medium sm:pl-5">{counterpartyRole}</th>
              <th className="data-label px-3 py-2.5 text-right font-medium">Principal</th>
              <th className="data-label px-3 py-2.5 text-right font-medium">Terms</th>
              <th className="data-label px-3 py-2.5 font-medium">Repaid</th>
              <th className="data-label hidden px-3 py-2.5 font-medium 2xl:table-cell">Opened</th>
              <th className="data-label py-2.5 pl-3 pr-4 text-right font-medium sm:pr-5">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loans.map((loan) => {
              const participantId = type === "owned" ? loan.borrowedBy : loan.ownedBy;
              const name = memberName(participantId, members[participantId]);
              const { paidPercent } = loanProgress(loan);

              return (
                <tr key={loan.id} className="transition-colors hover:bg-surface-2/50">
                  <td className="py-3 pl-4 pr-3 sm:pl-5">
                    <div className="flex items-center gap-3">
                      <Avatar id={participantId} name={name} size="sm" />
                      <div className="min-w-0">
                        <Link
                          href={`/profile?id=${participantId}&type=${profileType}`}
                          className="block max-w-[12rem] truncate font-medium text-ink hover:text-accent"
                        >
                          {name}
                        </Link>
                        <CopyButton value={participantId} label={`ID ${shortId(participantId)}`} className="-ml-1" />
                      </div>
                    </div>
                  </td>
                  <td className="num px-3 py-3 text-right font-medium text-ink">{formatCurrency(loan.principalAmount)}</td>
                  <td className="num whitespace-nowrap px-3 py-3 text-right text-xs text-ink-2">
                    {formatPercent(loan.interestRate)} <span className="text-ink-faint">·</span> {loan.termWeeks}w
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <Meter className="w-16 lg:w-20" value={paidPercent} max={100} tone={paidPercent >= 100 ? "positive" : "accent"} />
                      <span className="num w-9 text-xs text-ink-muted">{paidPercent}%</span>
                    </div>
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-ink-muted 2xl:table-cell">
                    {loan.timestamp ? formatDate(loan.timestamp) : "Pending"}
                  </td>
                  <td className="py-3 pl-3 pr-4 text-right sm:pr-5">
                    {type === "owed" ? (
                      <button
                        type="button"
                        onClick={() => handleMakePayment(loan.id)}
                        className="btn-secondary btn-sm"
                        aria-label={`Make payment for loan ID ${loan.id}`}
                      >
                        <WalletCards className="h-3.5 w-3.5" aria-hidden="true" />
                        Pay
                      </button>
                    ) : (
                      <span className={`badge ${paidPercent >= 100 ? "badge-success" : "badge-accent"}`}>{paidPercent >= 100 ? "Repaid" : "Active"}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OutstandingLoansTable;
