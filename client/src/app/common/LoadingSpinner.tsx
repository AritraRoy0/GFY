// components/LoadingSpinner.tsx

import { FC } from "react";

interface LoadingSpinnerProps {
	size?: "small" | "medium" | "large";
	className?: string;
	label?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
	size = "medium",
	className = "",
	label = "Loading...",
}) => {
	const sizeClasses = {
		small: "h-4 w-4",
		medium: "h-8 w-8",
		large: "h-12 w-12",
	};

	return (
		<div
			role="status"
			aria-live="polite"
			aria-label={label}
			className={`flex items-center justify-center ${className}`}
		>
			<svg
				className={`animate-spin ${sizeClasses[size]}`}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2.5" />
				<path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
			</svg>
			<span className="sr-only">{label}</span>
		</div>
	);
};

/** Full-area loader with a status line, used while a page resolves auth or data. */
export const PageLoader: FC<{ label?: string }> = ({ label = "Loading workspace" }) => (
	<div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
		<LoadingSpinner size="medium" className="text-accent" label={label} />
		<p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">{label}</p>
	</div>
);

export default LoadingSpinner;
