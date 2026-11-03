/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

// Design tokens live as RGB triplets in globals.css so every color supports opacity modifiers.
const token = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: token("--c-canvas"),
        surface: {
          DEFAULT: token("--c-surface"),
          2: token("--c-surface-2"),
          3: token("--c-surface-3"),
        },
        line: {
          DEFAULT: token("--c-line"),
          strong: token("--c-line-strong"),
        },
        ink: {
          DEFAULT: token("--c-ink"),
          2: token("--c-ink-2"),
          muted: token("--c-muted"),
          faint: token("--c-faint"),
        },
        accent: {
          DEFAULT: token("--c-accent"),
          strong: token("--c-accent-strong"),
          2: token("--c-accent-2"),
        },
        "on-accent": token("--c-on-accent"),
        elevated: token("--c-elevated"),
        positive: token("--c-positive"),
        negative: token("--c-negative"),
        warning: token("--c-warning"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        // Theme-specific values live in globals.css.
        panel: "var(--shadow-panel)",
        lift: "var(--shadow-lift)",
        glow: "0 0 0 1px rgb(var(--c-accent) / 0.35), 0 8px 32px -8px rgb(var(--c-accent) / 0.45)",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        paused: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "marquee-y": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "80%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        scroll: "scroll linear infinite",
        paused: "paused 0s linear infinite",
        "marquee-y": "marquee-y 40s linear infinite",
        shimmer: "shimmer 1.6s infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.2, 0.6, 0.4, 1) infinite",
        "fade-up": "fade-up 0.4s ease-out both",
        scan: "scan 6s linear infinite",
      },
    },
  },
  plugins: [],
};
