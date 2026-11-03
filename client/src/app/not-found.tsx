import Link from "next/link";
import { ArrowLeft, HandCoins } from "lucide-react";
import Logo from "./common/Logo";

export default function NotFound() {
  return (
    <main className="app-page relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="bg-grid mask-fade-radial pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Error 404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">This route doesn&apos;t exist.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-ink-2">
          The page may have moved, or the link is incomplete. Head back to the workspace or browse open loan requests.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back home
          </Link>
          <Link href="/loanRequests" className="btn-primary">
            <HandCoins className="h-4 w-4" aria-hidden="true" />
            Open marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}
