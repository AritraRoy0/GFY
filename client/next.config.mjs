/** @type {import('next').NextConfig} */
const nextConfig = {
	poweredByHeader: false,

	// Friendly URLs people type or link to, pointed at the real routes.
	async redirects() {
		return [
			{ source: "/marketplace", destination: "/loanRequests", permanent: true },
			{ source: "/loans", destination: "/loanRequests", permanent: true },
			{ source: "/login", destination: "/auth?tab=login", permanent: false },
			{ source: "/signin", destination: "/auth?tab=login", permanent: false },
			{ source: "/signup", destination: "/auth?tab=signup", permanent: false },
			{ source: "/register", destination: "/auth?tab=signup", permanent: false },
		];
	},

	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{ key: "X-Frame-Options", value: "SAMEORIGIN" },
					{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
				],
			},
		];
	},
};

export default nextConfig;
