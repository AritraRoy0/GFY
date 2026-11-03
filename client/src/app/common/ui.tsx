"use client";

import React, { useCallback, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

/* ------------------------------------------------------------------ */
/* Page & panel scaffolding                                            */
/* ------------------------------------------------------------------ */

export function PageHeader({
  kicker,
  title,
  description,
  actions,
  meta,
}: {
  kicker?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 pb-2 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {kicker && <p className="section-kicker">{kicker}</p>}
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-[2rem] sm:leading-tight">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-2">{description}</p>}
        {meta && <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">{actions}</div>}
    </header>
  );
}

export function Panel({
  title,
  description,
  icon,
  actions,
  children,
  className,
  bodyClassName,
  as: Component = "section",
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  as?: "section" | "div" | "article" | "aside";
}) {
  return (
    <Component className={cx("panel", className)}>
      {(title || actions) && (
        <div className="panel-header">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line-strong bg-surface-2 text-ink-2 [&>svg]:h-3.5 [&>svg]:w-3.5">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
              {description && <p className="mt-0.5 text-xs leading-5 text-ink-muted">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cx("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </Component>
  );
}

/* ------------------------------------------------------------------ */
/* Figures                                                             */
/* ------------------------------------------------------------------ */

type Tone = "neutral" | "accent" | "positive" | "negative" | "warning";

const toneText: Record<Tone, string> = {
  neutral: "text-ink-2",
  accent: "text-accent",
  positive: "text-positive",
  negative: "text-negative",
  warning: "text-warning",
};

const toneFill: Record<Tone, string> = {
  neutral: "bg-ink-muted",
  accent: "bg-accent",
  positive: "bg-positive",
  negative: "bg-negative",
  warning: "bg-warning",
};

export function StatCard({
  label,
  value,
  icon,
  hint,
  tone = "neutral",
  chip,
  footer,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  hint?: React.ReactNode;
  tone?: Tone;
  chip?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="metric-card group">
      <div
        className={cx(
          "pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-[0.08] blur-2xl transition-opacity group-hover:opacity-[0.16]",
          toneFill[tone]
        )}
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="data-label">{label}</p>
          {chip}
        </div>
        {icon && <span className={cx("[&>svg]:h-4 [&>svg]:w-4", toneText[tone])}>{icon}</span>}
      </div>
      <p className="relative mt-3 text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-[1.75rem]">{value}</p>
      {hint && <div className="relative mt-1.5 text-xs text-ink-muted">{hint}</div>}
      {footer && <div className="relative mt-4 border-t border-line pt-3">{footer}</div>}
    </div>
  );
}

export function Meter({ value, max, tone = "accent", className }: { value: number; max: number; tone?: Tone; className?: string }) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      className={cx("h-1.5 overflow-hidden rounded-full bg-surface-3", className)}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className={cx("h-full rounded-full transition-[width] duration-700", toneFill[tone])} style={{ width: `${percent}%` }} />
    </div>
  );
}

export function LiveDot({ tone = "positive", label }: { tone?: Tone; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className={cx("absolute inline-flex h-full w-full animate-pulse-ring rounded-full", toneFill[tone])} />
        <span className={cx("relative inline-flex h-2 w-2 rounded-full", toneFill[tone])} />
      </span>
      {label && <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink-2">{label}</span>}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Identity                                                            */
/* ------------------------------------------------------------------ */

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

const avatarSizes = {
  xs: "h-6 w-6 text-[10px] rounded-md",
  sm: "h-8 w-8 text-xs rounded-lg",
  md: "h-10 w-10 text-sm rounded-lg",
  lg: "h-16 w-16 text-2xl rounded-xl",
  xl: "h-20 w-20 text-3xl rounded-2xl",
};

/** Deterministic gradient avatar so the same member always gets the same mark. */
export function Avatar({ id, name, size = "sm" }: { id: string; name?: string; size?: keyof typeof avatarSizes }) {
  const hue = 165 + (hashString(id || "x") % 130);
  const initial = (name || id || "?").trim().charAt(0).toUpperCase();
  return (
    <span
      className={cx("relative flex shrink-0 items-center justify-center font-semibold text-white ring-1 ring-inset ring-white/15", avatarSizes[size])}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 52%), hsl(${hue + 35} 65% 38%))` }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("relative overflow-hidden rounded-lg border border-dashed border-line-strong px-6 py-10 text-center", className)}>
      <div className="bg-dots mask-fade-radial pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong bg-surface-2 text-ink-muted [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </span>
        <p className="mt-4 text-sm font-semibold text-ink">{title}</p>
        {description && <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-ink-muted">{description}</p>}
        {action && <div className="mt-5 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

/** Centered full-width message for auth gates, errors, and not-found states. */
export function StatePanel({
  icon,
  tone = "neutral",
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  tone?: Tone;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="panel edge-glow w-full max-w-md p-8 text-center">
        <span
          className={cx(
            "mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-line-strong bg-surface-2 [&>svg]:h-5 [&>svg]:w-5",
            toneText[tone]
          )}
        >
          {icon}
        </span>
        <h1 className="mt-5 text-xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-2 text-sm leading-6 text-ink-2">{description}</p>}
        {action && <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">{action}</div>}
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cx("relative overflow-hidden rounded-md bg-surface-2", className)} aria-hidden="true">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-ink/[0.05] to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: Array<{ value: T; label: React.ReactNode; count?: number }>;
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={cx("inline-flex rounded-lg border border-line bg-canvas/60 p-0.5", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              active ? "bg-elevated text-ink shadow-panel" : "text-ink-muted hover:text-ink"
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={cx("num rounded px-1 text-[10px]", active ? "bg-accent/15 text-accent" : "bg-surface-2 text-ink-muted")}>
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function CopyButton({ value, label = "Copy", className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Could not copy to clipboard:", error);
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={copy}
      className={cx(
        "inline-flex items-center gap-1 rounded px-1 py-0.5 font-mono text-[10.5px] text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink",
        className
      )}
      aria-label={`${label}: ${value}`}
    >
      {copied ? <Check className="h-3 w-3 text-positive" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

/** Card with a soft highlight that follows the pointer. */
export function SpotlightCard({ children, className, as: Component = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "article" }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <Component ref={ref} onMouseMove={handleMove} className={cx("group/spot relative overflow-hidden", className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 0%), rgb(var(--c-accent) / 0.07), transparent 45%)" }}
        aria-hidden="true"
      />
      {children}
    </Component>
  );
}
