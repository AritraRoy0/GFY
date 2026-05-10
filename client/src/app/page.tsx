"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  HandCoins,
  LockKeyhole,
  MessageSquareText,
  Scale,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import Header from "./common/Header";
import Footer from "./common/Footer";
import LoanTerminal from "./common/LoanTerminal";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  {
    title: "Direct borrower-lender terms",
    description: "Review requests, negotiate terms, and fund loans without a bank acting as the workflow owner.",
    icon: UsersRound,
  },
  {
    title: "Clear repayment visibility",
    description: "See principal, interest, weekly installments, and status before you commit to a loan.",
    icon: Scale,
  },
  {
    title: "Operational portfolio view",
    description: "Track lent capital, borrowed balances, payment activity, and pending requests from one dashboard.",
    icon: TrendingUp,
  },
  {
    title: "Private account handling",
    description: "Authenticated profiles and request states keep the product focused on verified member activity.",
    icon: LockKeyhole,
  },
];

const workflow = [
  {
    title: "Post a request",
    description: "Borrowers define amount, rate, term, and purpose with validation before publishing.",
  },
  {
    title: "Review the opportunity",
    description: "Lenders inspect the borrower profile, repayment schedule, and expected interest.",
  },
  {
    title: "Fund and monitor",
    description: "Approved loans move into the dashboard where both sides can track outstanding obligations.",
  },
];

const stats = [
  { label: "Loan amount range", value: "$500-$10k" },
  { label: "Minimum rate", value: "5%" },
  { label: "Term units", value: "Weekly" },
  { label: "Product focus", value: "P2P" },
];

function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block" aria-hidden="true">
      <div className="absolute left-1/2 top-10 h-[34rem] w-[58rem] -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="absolute right-[-8rem] top-24 w-[34rem] rounded-lg border border-slate-200 bg-white/60 p-5 shadow-sm backdrop-blur">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="h-3 w-28 rounded-full bg-slate-200" />
            <div className="mt-3 h-7 w-44 rounded bg-slate-900" />
          </div>
          <div className="h-10 w-24 rounded-md bg-emerald-100" />
        </div>
        <div className="grid gap-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="grid grid-cols-[1fr_5rem_4rem] items-center gap-3 rounded-md border border-slate-200 bg-white p-3">
              <div>
                <div className="h-3 w-32 rounded-full bg-slate-200" />
                <div className="mt-2 h-2 w-44 rounded-full bg-slate-100" />
              </div>
              <div className="h-6 rounded bg-sky-100" />
              <div className="h-6 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 left-[-6rem] w-[30rem] rounded-lg border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-slate-900" />
          <div className="h-3 w-32 rounded-full bg-slate-200" />
        </div>
        <div className="flex h-36 items-end gap-3">
          {[42, 68, 54, 84, 72, 94, 64].map((height, index) => (
            <div key={index} className="flex-1 rounded-t bg-sky-500/30" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="app-page">
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
          <HeroBackdrop />
          <div className="app-container relative py-14 sm:py-20 lg:py-28">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="max-w-3xl"
            >
              <span className="section-kicker inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Peer-to-peer lending, organized
              </span>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Lending software for people who need the terms to be clear.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                GoFundYourself gives borrowers a focused request flow and gives lenders a clean way to evaluate, approve, and monitor loans.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/auth?tab=signup" className="btn-primary w-full sm:w-auto">
                  Create account
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/loanRequests" className="btn-secondary w-full sm:w-auto">
                  View loan marketplace
                </Link>
              </div>
              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-md border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur">
                    <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
          <div className="app-container grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="section-kicker">Live Product Surface</p>
              <h2 className="section-title mt-3">A lending workspace, not a marketing funnel.</h2>
              <p className="section-copy mt-4">
                The app centers the repeated work: create requests, assess repayment math, track active loans, and keep both sides aware of status.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Request controls", icon: HandCoins },
                  { label: "Repayment schedule", icon: Timer },
                  { label: "Approval context", icon: ShieldCheck },
                  { label: "Member profiles", icon: MessageSquareText },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                      <Icon className="h-5 w-5 text-sky-700" aria-hidden="true" />
                      <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="surface-card overflow-hidden p-3 sm:p-4">
              <LoanTerminal />
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50 py-12 sm:py-16">
          <div className="app-container">
            <div className="mb-10 max-w-3xl">
              <p className="section-kicker">What Improves</p>
              <h2 className="section-title mt-3">Decision support across the full loan path.</h2>
              <p className="section-copy mt-4">
                Borrowers get a direct way to publish needs. Lenders get structured details before they fund. Everyone gets clearer portfolio visibility after approval.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="surface-card p-5">
                    <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-950">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="app-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="section-kicker">Workflow</p>
              <h2 className="section-title mt-3">From request to funded loan in three clear states.</h2>
              <p className="section-copy mt-4">
                The product is designed around the handoff between borrowers and lenders, with each screen showing the next useful action.
              </p>
            </div>
            <div className="grid gap-4">
              {workflow.map((step, index) => (
                <div key={step.title} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-950">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-12 text-white sm:py-14">
          <div className="app-container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Start with one request</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Borrow, lend, and monitor with less ambiguity.</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/auth?tab=signup" className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100 sm:w-auto">
                Create account
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/about" className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 sm:w-auto">
                Learn how it works
                <BadgeDollarSign className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
