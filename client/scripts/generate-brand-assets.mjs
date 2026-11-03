/**
 * Generates the static social-share images and PNG icons:
 *
 *   src/app/opengraph-image.png (+ .alt.txt)                 Open Graph / Twitter card for "/" and fallback for all pages
 *   src/app/about/opengraph-image.png (+ .alt.txt)           Card for /about
 *   src/app/loanRequests/opengraph-image.png (+ .alt.txt)    Card for /loanRequests
 *   src/app/apple-icon.png                                    180px iOS touch icon
 *   public/logo.png, public/icon-192.png                      Structured-data logo and manifest icons
 *
 * Static files are served instantly from the CDN (no serverless cold starts for social crawlers).
 * Re-run after changing copy or branding:  npm run generate:assets
 */
import path from "node:path";
import { syncBuiltinESMExports } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import React from "react";

if (process.platform === "win32") {
  // The @vercel/og build bundled with Next 14 resolves its own assets with path.join(import.meta.url, ...),
  // which yields an invalid file URL on Windows. Joining file: URLs with posix semantics produces a valid one.
  const nativeJoin = path.join;
  path.join = (...parts) => (typeof parts[0] === "string" && parts[0].startsWith("file:") ? path.posix.join(...parts) : nativeJoin(...parts));
  syncBuiltinESMExports();
}

const { ImageResponse } = await import("next/dist/compiled/@vercel/og/index.node.js");

const h = React.createElement;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fontDir = path.join(root, "scripts", "brand-assets", "fonts");
const host = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gofundyourselfinc.com").host;

const fonts = [
  { name: "Inter", data: await readFile(path.join(fontDir, "Inter-Medium.ttf")), weight: 500, style: "normal" },
  { name: "Inter", data: await readFile(path.join(fontDir, "Inter-Bold.ttf")), weight: 700, style: "normal" },
  { name: "JetBrains Mono", data: await readFile(path.join(fontDir, "JetBrainsMono-Medium.ttf")), weight: 500, style: "normal" },
];

const colors = {
  canvas: "#05070c",
  surface: "#0b0f17",
  surface2: "#111621",
  lineStrong: "#2c3548",
  ink: "#e8edf5",
  ink2: "#a8b3c4",
  muted: "#768294",
  accent: "#22d3ee",
  positive: "#34d399",
};

function brandMark(size) {
  return h(
    "svg",
    { width: size, height: size, viewBox: "0 0 64 64", fill: "none" },
    h(
      "defs",
      null,
      h(
        "linearGradient",
        { id: "mark", x1: "0", y1: "0", x2: "64", y2: "64", gradientUnits: "userSpaceOnUse" },
        h("stop", { offset: "0", stopColor: "#67e8f9" }),
        h("stop", { offset: "1", stopColor: "#818cf8" })
      )
    ),
    h(
      "g",
      { stroke: "url(#mark)", strokeWidth: "5", strokeLinecap: "round", strokeLinejoin: "round" },
      h("path", { d: "M10 52h44" }),
      h("path", { d: "M10 52 26 20" }),
      h("path", { d: "M54 52 38 20" }),
      h("path", { d: "M32 8 24 20h16L32 8Z" })
    )
  );
}

function ogCard({ eyebrow, title, subtitle }) {
  const chip = (label) =>
    h(
      "div",
      {
        key: label,
        style: {
          display: "flex",
          padding: "10px 18px",
          borderRadius: 12,
          border: `1px solid ${colors.lineStrong}`,
          backgroundColor: "rgba(17, 22, 33, 0.85)",
          fontSize: 20,
          fontWeight: 500,
          color: colors.ink,
        },
      },
      label
    );

  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 72px",
        backgroundColor: colors.canvas,
        backgroundImage:
          "radial-gradient(circle at 12% 0%, rgba(34, 211, 238, 0.22), transparent 42%), radial-gradient(circle at 100% 100%, rgba(129, 140, 248, 0.2), transparent 45%)",
        color: colors.ink,
        fontFamily: "Inter",
      },
    },
    // Hairline grid
    h("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        backgroundImage:
          "linear-gradient(to right, rgba(44, 53, 72, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(44, 53, 72, 0.45) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      },
    }),
    // Header row
    h(
      "div",
      { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
      h(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 18 } },
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              border: "2px solid rgba(103, 232, 249, 0.35)",
              backgroundColor: colors.surface,
            },
          },
          brandMark(38)
        ),
        h("span", { style: { fontSize: 34, fontWeight: 700, letterSpacing: -0.5 } }, "GoFundYourself")
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 18px",
            borderRadius: 999,
            border: `1px solid ${colors.lineStrong}`,
            backgroundColor: "rgba(11, 15, 23, 0.8)",
            fontFamily: "JetBrains Mono",
            fontSize: 18,
            letterSpacing: 3,
            color: colors.ink2,
          },
        },
        h("div", { style: { width: 10, height: 10, borderRadius: 999, backgroundColor: colors.positive } }),
        "LIVE MARKETPLACE"
      )
    ),
    // Headline block
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", maxWidth: 980 } },
      h("span", { style: { fontFamily: "JetBrains Mono", fontSize: 22, letterSpacing: 5, color: colors.accent } }, eyebrow.toUpperCase()),
      // Long headlines step down a size so the card never wraps to three lines.
      h("span", { style: { marginTop: 22, fontSize: title.length > 48 ? 60 : 70, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2.5 } }, title),
      h("span", { style: { marginTop: 24, fontSize: 28, fontWeight: 500, lineHeight: 1.4, color: colors.ink2 } }, subtitle)
    ),
    // Footer row
    h(
      "div",
      { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
      h("div", { style: { display: "flex", gap: 14 } }, chip("$500 – $10K loans"), chip("From 5% interest"), chip("1 – 52 week terms")),
      h("span", { style: { fontFamily: "JetBrains Mono", fontSize: 20, color: colors.muted } }, host)
    )
  );
}

function brandIcon(size) {
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.canvas,
        backgroundImage: "radial-gradient(circle at 30% 20%, rgba(34, 211, 238, 0.25), transparent 60%)",
      },
    },
    brandMark(Math.round(size * 0.62))
  );
}

async function render(element, width, height, outPath) {
  const response = new ImageResponse(element, { width, height, fonts });
  const buffer = Buffer.from(await response.arrayBuffer());
  const target = path.join(root, outPath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, buffer);
  console.log(`  ${outPath}  (${width}x${height}, ${(buffer.length / 1024).toFixed(0)} KB)`);
}

const cards = [
  {
    dir: "src/app",
    alt: "GoFundYourself — peer-to-peer lending with every term in plain sight",
    eyebrow: "Peer-to-peer lending",
    title: "Borrow and lend with every term in plain sight.",
    subtitle: "Post loan requests, compare rates, fund loans directly, and track weekly repayments in real time.",
  },
  {
    dir: "src/app/about",
    alt: "About GoFundYourself — transparent peer-to-peer lending",
    eyebrow: "About GoFundYourself",
    title: "Both sides of every loan see the same details.",
    subtitle: "Direct agreements, transparent repayment math, and a realtime portfolio view.",
  },
  {
    dir: "src/app/loanRequests",
    alt: "GoFundYourself loan marketplace — open peer-to-peer loan requests",
    eyebrow: "Loan marketplace",
    title: "Open peer-to-peer loan requests, updated live.",
    subtitle: "Compare amount, rate, term, and lender yield, then review the full repayment schedule.",
  },
];

console.log("Generating brand assets:");
for (const card of cards) {
  await render(ogCard(card), 1200, 630, `${card.dir}/opengraph-image.png`);
  await writeFile(path.join(root, card.dir, "opengraph-image.alt.txt"), `${card.alt}\n`);
}
await render(brandIcon(180), 180, 180, "src/app/apple-icon.png");
await render(brandIcon(192), 192, 192, "public/icon-192.png");
await render(brandIcon(512), 512, 512, "public/logo.png");
console.log("Done.");
