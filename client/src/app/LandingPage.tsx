"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Command,
  Eye,
  Fingerprint,
  HandCoins,
  LineChart,
  ReceiptText,
  Send,
  ShieldCheck,
} from "lucide-react";
import Header from "./common/Header";
import Footer from "./common/Footer";
import LoanTerminal from "./common/LoanTerminal";
import RangeField from "./common/RangeField";
import RepaymentQuote from "./common/RepaymentQuote";
import { LiveDot, SpotlightCard } from "./common/ui";
import { faqs } from "./seo/faq";

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" },
} as const;

const specs = [
  { value: "$500 – $10K", label: "Principal per request" },
  { value: "5%", label: "Minimum interest rate" },
  { value: "1 – 52 wk", label: "Weekly repayment terms" },
  { value: "0", label: "Bank intermediaries" },
];

const workflow = [
  {
    state: "Published",
    title: "Post a request",
    description: "Borrowers set amount, rate, term, and purpose. Validation runs before anything goes live.",
    icon: Send,
  },
  {
    state: "Under review",
    title: "Review the opportunity",
    description: "Lenders inspect the borrower profile, the full repayment schedule, and expected interest.",
    icon: Eye,
  },
  {
    state: "Funded",
    title: "Fund and monitor",
    description: "Approved loans move into both dashboards, where outstanding balances and repayments stay visible.",
    icon: CheckCircle2,
  },
];

export default function LandingPage() {
  return (
    <div className="app-page">
      <Header />

      <main>
        <Hero />
        <SpecStrip />
        <Platform />
        <Calculator />
        <Workflow />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative -mt-16 overflow-hidden pt-16">
      <div className="bg-grid mask-fade-radial pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px]" aria-hidden="true" />

      <div className="app-container relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:py-28">
        {/* No entrance animation on the headline: it is the largest contentful paint, so it renders immediately. */}
        <div>
          <Link
            href="/loanRequests"
            className="group inline-flex items-center gap-3 rounded-full border border-line-strong bg-surface/70 py-1 pl-3 pr-1.5 text-xs text-ink-2 backdrop-blur transition-colors hover:border-accent/40"
          >
            <LiveDot label="Live" />
            <span className="h-3 w-px bg-line-strong" aria-hidden="true" />
            Open requests stream in realtime
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-3 text-ink-muted transition-colors group-hover:bg-accent group-hover:text-on-accent">
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </span>
          </Link>

          <h1 className="mt-7 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[4.5rem]">
            Peer-to-peer lending with <span className="text-gradient">every term</span> in plain sight.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-ink-2 sm:text-lg sm:leading-8">
            GoFundYourself gives borrowers a focused request flow and gives lenders a precise way to evaluate, fund, and monitor loans. No bank in the middle.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth?tab=signup" className="btn-primary px-5 py-3">
              Create free account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/loanRequests" className="btn-secondary px-5 py-3">
              Explore marketplace
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            {["Flat-rate math", "Weekly schedules", "Realtime dashboards"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-accent/15 via-transparent to-accent-2/15 blur-2xl" aria-hidden="true" />
          <div className="relative">
            <LoanTerminal />
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecStrip() {
  return (
    <section className="border-y border-line bg-surface/40" aria-label="Platform parameters">
      <div className="app-container">
        <dl className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {specs.map((spec, index) => (
            <div
              key={spec.label}
              className={`px-2 py-7 sm:px-6 ${index % 2 === 1 ? "border-l border-line lg:border-l-0" : ""} ${index < 2 ? "border-b border-line lg:border-b-0" : ""}`}
            >
              <dt className="data-label">{spec.label}</dt>
              <dd className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Platform() {
  return (
    <section id="platform" className="scroll-mt-20 py-20 sm:py-28">
      <div className="app-container">
        <motion.div {...reveal} className="max-w-3xl">
          <p className="section-kicker">Platform</p>
          <h2 className="section-title mt-4">Built for the repeated work of lending.</h2>
          <p className="section-copy mt-5">
            Every screen keeps the decision-critical numbers next to the action that depends on them: amount, rate, schedule, and who is on the other side.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 lg:grid-cols-6">
          <motion.div {...reveal} className="lg:col-span-4">
            <SpotlightCard className="panel h-full p-6 sm:p-8">
              <BentoHeading icon={<HandCoins />} title="Structured requests" description="Borrowers publish amount, rate, term, and purpose through validated fields. Lenders compare like-for-like." />
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Principal", value: "$2,500", fill: 22 },
                  { label: "Interest", value: "8.0%", fill: 10 },
                  { label: "Term", value: "12 weeks", fill: 23 },
                ].map((field) => (
                  <div key={field.label} className="rounded-lg border border-line bg-canvas/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ink-muted">{field.label}</span>
                      <span className="num text-sm font-medium text-ink">{field.value}</span>
                    </div>
                    <div className="mt-4 h-1 rounded-full bg-surface-3">
                      <div className="h-1 rounded-full bg-accent" style={{ width: `${field.fill}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </motion.div>

          <motion.div {...reveal} className="lg:col-span-2">
            <SpotlightCard className="panel h-full p-6 sm:p-8">
              <BentoHeading icon={<ReceiptText />} title="Repayment math, upfront" description="Total repayment, interest, and the weekly installment before anyone commits." />
              <div className="mt-8 rounded-lg border border-line bg-canvas/60 p-4">
                <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
                  <div className="w-[92%] rounded-full bg-ink-faint" />
                  <div className="flex-1 rounded-full bg-accent" />
                </div>
                <div className="mt-3 flex justify-between text-xs">
                  <span className="text-ink-muted">Weekly</span>
                  <span className="num font-medium text-ink">$225.00</span>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          <motion.div {...reveal} className="lg:col-span-2">
            <SpotlightCard className="panel h-full p-6 sm:p-8">
              <BentoHeading icon={<LineChart />} title="Portfolio telemetry" description="Capital lent, debt owed, and repayment progress, streamed live." />
              <svg viewBox="0 0 240 64" className="mt-8 h-16 w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" style={{ stopColor: "rgb(var(--c-accent))", stopOpacity: 0.25 }} />
                    <stop offset="100%" style={{ stopColor: "rgb(var(--c-accent))", stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <path d="M0 52 L30 46 L60 48 L90 34 L120 38 L150 24 L180 28 L210 14 L240 10 L240 64 L0 64 Z" fill="url(#spark-fill)" />
                <path d="M0 52 L30 46 L60 48 L90 34 L120 38 L150 24 L180 28 L210 14 L240 10" fill="none" stroke="currentColor" className="text-accent" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="240" cy="10" r="3.5" strokeWidth="2" className="fill-accent stroke-surface" />
              </svg>
            </SpotlightCard>
          </motion.div>

          <motion.div {...reveal} className="lg:col-span-2">
            <SpotlightCard className="panel h-full p-6 sm:p-8">
              <BentoHeading icon={<Fingerprint />} title="Authenticated members" description="Every request and loan is tied to a signed-in member with a public profile and history." />
              <div className="mt-8 flex items-center gap-2 rounded-lg border border-line bg-canvas/60 px-4 py-3">
                <ShieldCheck className="h-4 w-4 text-positive" aria-hidden="true" />
                <span className="num text-xs text-ink-2">session.verified</span>
                <span className="ml-auto badge badge-success">OK</span>
              </div>
            </SpotlightCard>
          </motion.div>

          <motion.div {...reveal} className="lg:col-span-2">
            <SpotlightCard className="panel h-full p-6 sm:p-8">
              <BentoHeading icon={<Command />} title="Keyboard-first" description="Jump to any page or action from anywhere with the command palette." />
              <div className="mt-8 flex items-center gap-2">
                <span className="kbd h-8 min-w-8 px-2 text-xs">Ctrl</span>
                <span className="text-ink-faint">+</span>
                <span className="kbd h-8 min-w-8 px-2 text-xs">K</span>
                <span className="ml-3 text-xs text-ink-muted">or Cmd + K on Mac</span>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BentoHeading({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="relative">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong bg-surface-2 text-accent [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <h3 className="mt-5 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink-muted">{description}</p>
    </div>
  );
}

function Calculator() {
  const [principal, setPrincipal] = useState(2500);
  const [rate, setRate] = useState(8);
  const [term, setTerm] = useState(12);

  const safePrincipal = Number.isFinite(principal) ? principal : 0;
  const safeRate = Number.isFinite(rate) ? rate : 0;
  const safeTerm = Number.isFinite(term) ? term : 0;
  const postHref = `/loanRequests?amount=${safePrincipal}&rate=${safeRate}&term=${safeTerm}#composer`;

  return (
    <section id="calculator" className="scroll-mt-20 border-y border-line bg-surface/30 py-20 sm:py-28">
      <div className="app-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div {...reveal}>
          <p className="section-kicker">Repayment calculator</p>
          <h2 className="section-title mt-4">Model a loan before you post it.</h2>
          <p className="section-copy mt-5">
            Same flat-rate math lenders see on the review screen. Tune the terms, then carry them straight into a new request.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ink-2">
            {["Interest applies once over the full term", "Installments are split evenly by week", "Values carry into the request form"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...reveal} className="panel edge-glow overflow-hidden">
          <div className="grid md:grid-cols-[1fr_1.1fr]">
            <div className="space-y-6 border-b border-line p-6 md:border-b-0 md:border-r sm:p-8">
              <RangeField id="calc-principal" label="Principal" value={principal} min={500} max={10000} step={100} onChange={setPrincipal} prefix="$" helper="$500 to $10,000" inputMax={10000} />
              <RangeField id="calc-rate" label="Interest rate" value={rate} min={5} max={36} step={0.5} onChange={setRate} suffix="%" helper="Minimum 5%" />
              <RangeField id="calc-term" label="Term" value={term} min={1} max={52} onChange={setTerm} suffix="wk" helper="1 to 52 weeks" inputMax={52} />
            </div>
            <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
              <RepaymentQuote principal={safePrincipal} rate={safeRate} termWeeks={safeTerm} />
              <Link href={postHref} className="btn-primary w-full">
                Post a request with these terms
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section id="workflow" className="scroll-mt-20 py-20 sm:py-28">
      <div className="app-container">
        <motion.div {...reveal} className="max-w-3xl">
          <p className="section-kicker">Workflow</p>
          <h2 className="section-title mt-4">From request to funded loan in three states.</h2>
          <p className="section-copy mt-5">Each screen shows the next useful action for whoever is holding the handoff.</p>
        </motion.div>

        <ol className="relative mt-14 grid gap-4 lg:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-[2.15rem] hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent lg:block" aria-hidden="true" />
          {workflow.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.li key={step.title} {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }} className="relative">
                <SpotlightCard className="panel h-full bg-surface p-6">
                  <div className="flex items-center justify-between">
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong bg-canvas text-accent">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="num text-xs text-ink-faint">[{String(index + 1).padStart(2, "0")}]</span>
                  </div>
                  <span className="badge badge-accent mt-6 font-mono uppercase tracking-[0.12em]">{step.state}</span>
                  <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{step.description}</p>
                </SpotlightCard>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line bg-surface/30 py-20 sm:py-28" aria-labelledby="faq-heading">
      <div className="app-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <motion.div {...reveal} className="lg:sticky lg:top-24">
          <p className="section-kicker">FAQ</p>
          <h2 id="faq-heading" className="section-title mt-4">
            Peer-to-peer lending, answered.
          </h2>
          <p className="section-copy mt-5">
            How borrowing and lending work on GoFundYourself, from posting a request to tracking repayments.
          </p>
          <Link href="/about" className="btn-secondary mt-8">
            Learn more about the platform
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Native <details> keeps every answer in the server-rendered HTML for readers and crawlers. */}
        <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="group" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 text-left transition-colors hover:bg-surface-2/60 sm:px-6 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[15px] font-semibold text-ink">{faq.question}</h3>
                <ChevronDown className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 text-sm leading-7 text-ink-2 sm:px-6">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="pb-20 sm:pb-28">
      <div className="app-container">
        <motion.div {...reveal} className="panel edge-glow relative overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="bg-grid mask-fade-radial pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[100px]" aria-hidden="true" />
          <div className="relative">
            <p className="section-kicker justify-center">Start with one request</p>
            <h2 className="section-title mx-auto mt-4 max-w-2xl">Borrow, lend, and monitor with less ambiguity.</h2>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/auth?tab=signup" className="btn-primary px-5 py-3">
                Create free account
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/about" className="btn-secondary px-5 py-3">
                Learn how it works
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
