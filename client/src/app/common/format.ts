const currencyWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currencyCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatCurrency = (value: number, options: { cents?: boolean } = {}) =>
  (options.cents ? currencyCents : currencyWhole).format(Number.isFinite(value) ? value : 0);

/** $1.2K / $4.5M style, for axis ticks and dense stat tiles. Values under $10k stay in full. */
export const formatCompactCurrency = (value: number) =>
  Math.abs(value) < 10000 ? currencyWhole.format(value) : currencyCompact.format(value);

export const formatPercent = (value: number, digits = 1) =>
  `${Number.isInteger(value) ? value : value.toFixed(digits)}%`;

/** Short, uppercase identifier for display (e.g. #A1B2C3). */
export const shortId = (id: string, length = 6) => id.slice(0, length).toUpperCase();

export const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

export const formatDate = (value?: Date | string | null) => {
  if (!value) return "N/A";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const formatRelative = (date: Date) => {
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
};
