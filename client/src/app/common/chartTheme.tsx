"use client";

import React, { useMemo } from "react";
import { useTheme } from "../providers/ThemeProvider";

/**
 * Chart colors per theme. Each series pair was checked with the dataviz palette validator (lightness band,
 * chroma, CVD separation, contrast) against its own surface: #ffffff for light, #0b0f17 for dark.
 * SVG presentation attributes do not resolve CSS variables, so the values live here as literals.
 */
const palettes = {
  light: {
    series1: "#2a78d6",
    series2: "#eb6834",
    surface: "#ffffff",
    grid: "#e8edf3",
    axis: "#64748b",
    cursor: "#cbd5e1",
  },
  dark: {
    series1: "#3987e5",
    series2: "#d95926",
    surface: "#0b0f17",
    grid: "#1a2130",
    axis: "#768294",
    cursor: "#2c3548",
  },
} as const;

export function useChartColors() {
  const { theme } = useTheme();
  return useMemo(() => {
    const colors = palettes[theme];
    return {
      ...colors,
      axisTick: { fill: colors.axis, fontSize: 11, fontFamily: "var(--font-mono)" },
    };
  }, [theme]);
}

interface TooltipEntry {
  name?: string | number;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

/** Tooltip shared by all charts. Text stays in ink tokens; a swatch carries series identity. */
export function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  labelFormatter?: (label: string | number) => string;
  valueFormatter: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[10rem] rounded-lg border border-line-strong bg-surface/95 px-3 py-2.5 shadow-lift backdrop-blur">
      {label !== undefined && <p className="data-label mb-2">{labelFormatter ? labelFormatter(label) : label}</p>}
      <ul className="space-y-1.5">
        {payload.map((entry) => (
          <li key={String(entry.dataKey)} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-2 text-ink-2">
              <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: entry.color }} aria-hidden="true" />
              {entry.name}
            </span>
            <span className="num font-medium text-ink">{valueFormatter(Number(entry.value))}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
