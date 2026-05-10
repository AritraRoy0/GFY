"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BadgeCheck,
  CircleDollarSign,
  Handshake,
  LockKeyhole,
  ReceiptText,
  Repeat,
  Scale,
} from "lucide-react";
import Header from "../common/Header";
import Footer from "../common/Footer";

const principles = [
  {
    title: "Transparent terms",
    description: "Every request surfaces principal, rate, term, repayment math, and borrower context before action.",
    icon: ReceiptText,
  },
  {
    title: "Direct agreements",
    description: "Borrowers and lenders work from the same facts instead of a hidden approval process.",
    icon: Handshake,
  },
  {
    title: "Portfolio clarity",
    description: "Active loans, pending requests, and outstanding obligations stay visible after approval.",
    icon: Scale,
  },
  {
    title: "Verified account flow",
    description: "Authentication, user profiles, and controlled request states keep the product focused.",
    icon: LockKeyhole,
  },
];

const advantages = [
  { label: "Better fee visibility", icon: CircleDollarSign },
  { label: "Faster request review", icon: Repeat },
  { label: "Negotiable terms", icon: BadgeCheck },
  { label: "Bank-free workflow", icon: Banknote },
];

export default function AboutUs() {
  return (
    <div className="app-page">
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="app-container py-16 sm:py-20">
            <div className="max-w-4xl">
              <p className="section-kicker">About GoFundYourself</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Peer lending works better when both sides can see the same details.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                GoFundYourself connects borrowers and lenders through a practical workflow: publish a request, review the terms, fund the loan, and monitor repayment progress.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/auth?tab=signup" className="btn-primary">
                  Create account
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/loanRequests" className="btn-secondary">
                  Browse loan requests
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50 py-16">
          <div className="app-container">
            <div className="mb-10 max-w-3xl">
              <p className="section-kicker">Product Principles</p>
              <h2 className="section-title mt-3">A calmer way to make lending decisions.</h2>
              <p className="section-copy mt-4">
                The interface avoids hidden steps and keeps repayment math close to the action that depends on it.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {principles.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="surface-card p-5">
                    <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="app-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="section-kicker">Why Bypass Banks</p>
              <h2 className="section-title mt-3">Lower friction, clearer control, and faster movement.</h2>
              <p className="section-copy mt-4">
                Cutting out the traditional intermediary can make the borrower-lender relationship easier to understand. The product keeps that simplicity visible in the UI.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {advantages.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-emerald-700 shadow-sm">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
