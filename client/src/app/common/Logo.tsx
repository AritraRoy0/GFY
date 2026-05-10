import React from "react";

const Logo: React.FC = () => {
  return (
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-white shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path d="M10 52h44" />
          <path d="M10 52 26 20" />
          <path d="M54 52 38 20" />
          <path d="M32 8 24 20h16L32 8Z" />
        </svg>
      </div>
  );
};

export default Logo;
