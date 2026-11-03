import React, { useId } from "react";

const Logo: React.FC<{ size?: "sm" | "md" }> = ({ size = "md" }) => {
  // Unique per instance: a gradient defined inside a display:none subtree (e.g. the hidden desktop sidebar)
  // doesn't paint for other elements that reference the same id.
  const gradientId = `gfy-logo-stroke-${useId().replace(/:/g, "")}`;
  const box = size === "sm" ? "h-7 w-7 rounded-md" : "h-9 w-9 rounded-lg";
  const glyph = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className={`relative flex shrink-0 items-center justify-center bg-gradient-to-br from-accent/40 via-line-strong to-accent-2/40 p-px ${box}`}>
      <div className={`flex h-full w-full items-center justify-center bg-canvas ${size === "sm" ? "rounded-[5px]" : "rounded-[7px]"}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={glyph}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              {/* style (not the attribute) so the theme's CSS variables resolve */}
              <stop style={{ stopColor: "rgb(var(--c-grad-1))" }} />
              <stop offset="1" style={{ stopColor: "rgb(var(--c-grad-3))" }} />
            </linearGradient>
          </defs>
          <g stroke={`url(#${gradientId})`}>
            <path d="M10 52h44" />
            <path d="M10 52 26 20" />
            <path d="M54 52 38 20" />
            <path d="M32 8 24 20h16L32 8Z" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Logo;
