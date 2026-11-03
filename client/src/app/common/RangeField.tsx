"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface RangeFieldProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  helper?: string;
  error?: string;
  /** Upper bound for typed values when it differs from the slider's max (e.g. no hard cap). */
  inputMax?: number;
}

/** Slider paired with an exact-value input. The slider covers the common range; the input accepts precise values. */
export default function RangeField({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  prefix,
  suffix,
  helper,
  error,
  inputMax,
}: RangeFieldProps) {
  const sliderValue = Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
  const fill = ((sliderValue - min) / (max - min)) * 100;
  const describedBy = error ? `${id}-error` : helper ? `${id}-helper` : undefined;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-xs font-medium text-ink-2">
          {label}
        </label>
        <div
          className={`flex h-8 items-center rounded-md border bg-canvas/60 px-2 transition-colors focus-within:border-accent/70 focus-within:ring-2 focus-within:ring-accent/10 ${
            error ? "border-negative/60" : "border-line-strong"
          }`}
        >
          {prefix && <span className="num text-xs text-ink-muted">{prefix}</span>}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            value={Number.isFinite(value) ? value : ""}
            min={min}
            max={inputMax}
            step={step}
            onChange={(event) => onChange(event.target.value === "" ? NaN : Number(event.target.value))}
            className="num w-16 bg-transparent text-right text-sm font-medium text-ink outline-none focus-visible:outline-none"
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
          {suffix && <span className="num ml-1 text-xs text-ink-muted">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(event) => onChange(Number(event.target.value))}
        className="range mt-3"
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
        aria-label={`${label} slider`}
        aria-describedby={describedBy}
      />
      <div className="mt-1.5 flex items-center justify-between">
        {error ? (
          <p id={`${id}-error`} className="flex items-center gap-1 text-xs font-medium text-negative">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {error}
          </p>
        ) : (
          <p id={`${id}-helper`} className="text-[11px] text-ink-faint">
            {helper}
          </p>
        )}
      </div>
    </div>
  );
}
