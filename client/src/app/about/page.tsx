"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
import { SpotlightCard } from "../common/ui";

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" },
} as const;

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
  { label: "Better fee visibility", description: "No origination layer between the two parties.", icon: CircleDollarSign },
  { label: "Faster request review", description: "Requests go live the moment they validate.", icon: Repeat },
  { label: "Negotiable terms", description: "Borrowers set the rate and term they can carry.", icon: BadgeCheck },
  { label: "Bank-free workflow", description: "Lenders fund directly from the marketplace.", icon: Banknote },
];

const comparison = [
  { label: "Who sets the terms", traditional: "Institution", gfy: "Borrower, reviewed by lender" },
  { label: "Repayment math", traditional: "Disclosed at signing", gfy: "Visible before funding" },
  { label: "Decision path", traditional: "Internal underwriting", gfy: "Direct lender review" },
  { label: "Portfolio view", traditional: "Statements", gfy: "Realtime dashboard" },
];

export default function AboutUs() {
  return (
    <div className="app-page">
      <Header />
      <main>
        <section className="relative -mt-16 overflow-hidden pt-16">
          <div className="bg-grid mask-fade-radial pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[50rem] -translate-x-1/2 rounded-full bg-accent-2/[0.08] blur-[120px]" aria-hidden="true" />
          <div className="app-container relative py-20 sm:py-28">
            <div className="max-w-4xl animate-fade-up">
              <p className="section-kicker">About GoFundYourself</p>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-6xl">
                Peer lending works better when both sides can see <span className="text-gradient">the same details.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-ink-2 sm:text-lg sm:leading-8">
                GoFundYourself connects borrowers and lenders through a practical workflow: publish a request, review the terms, fund the loan, and monitor repayment progress.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/auth?tab=signup" className="btn-primary px-5 py-3">
                  Create account
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/loanRequests" className="btn-secondary px-5 py-3">
                  Browse loan requests
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-surface/30 py-20 sm:py-24">
          <div className="app-container">
            <motion.div {...reveal} className="max-w-3xl">
              <p className="section-kicker">Product principles</p>
              <h2 className="section-title mt-4">A calmer way to make lending decisions.</h2>
              <p className="section-copy mt-5">The interface avoids hidden steps and keeps repayment math close to the action that depends on it.</p>
            </motion.div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {principles.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.title} {...reveal} transition={{ ...reveal.transition, delay: index * 0.06 }}>
                    <SpotlightCard className="panel h-full p-6">
                      <div className="flex items-center justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong bg-canvas text-accent">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="num text-xs text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <h3 className="mt-6 font-semibold text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-ink-muted">{item.description}</p>
                    </SpotlightCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="app-container grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <motion.div {...reveal}>
              <p className="section-kicker">Why bypass banks</p>
              <h2 className="section-title mt-4">Lower friction, clearer control, faster movement.</h2>
              <p className="section-copy mt-5">
                Cutting out the traditional intermediary makes the borrower-lender relationship easier to understand. The product keeps that simplicity visible in the UI.
              </p>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {advantages.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex gap-3 rounded-lg border border-line bg-surface/50 p-4">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-positive" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-ink">{item.label}</p>
                        <p className="mt-1 text-xs leading-5 text-ink-muted">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div {...reveal} className="panel overflow-hidden">
              <div className="grid grid-cols-[1.1fr_1fr_1.2fr] border-b border-line bg-canvas/50 px-5 py-3">
                <span className="data-label">Dimension</span>
                <span className="data-label">Traditional</span>
                <span className="data-label text-accent">GoFundYourself</span>
              </div>
              <dl className="divide-y divide-line">
                {comparison.map((row) => (
                  <div key={row.label} className="grid grid-cols-[1.1fr_1fr_1.2fr] items-center gap-3 px-5 py-4 text-sm">
                    <dt className="font-medium text-ink">{row.label}</dt>
                    <dd className="text-ink-muted">{row.traditional}</dd>
                    <dd className="flex items-center gap-2 text-ink">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {row.gfy}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
