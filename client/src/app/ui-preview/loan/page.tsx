"use client";

// TEMPORARY visual-verification route. Seeds a mock request into redux and renders the review screen. Delete after screenshots.
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Timestamp } from "firebase/firestore";
import AppShell from "../../common/AppShell";
import ViewLoan from "../../viewLoan/viewLoan";
import { setLoanRequestState } from "../../store";

export default function PreviewLoan() {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    dispatch(
      setLoanRequestState({
        id: "q7r8s9t0u1",
        borrowedBy: "uidBorrowerOne",
        principalAmount: 2500,
        interestRate: 8,
        termWeeks: 12,
        purpose: "Replacing the compressor on my food truck before the spring season. Revenue from weekend events covers the weekly installment.",
        timestamp: Timestamp.fromDate(new Date(Date.now() - 2 * 86400000)),
      })
    );
    setReady(true);
  }, [dispatch]);

  return (
    <AppShell breadcrumbs={[{ label: "Marketplace", href: "/loanRequests" }, { label: "Request #Q7R8S9" }]}>
      {ready && <ViewLoan />}
    </AppShell>
  );
}
