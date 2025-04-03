import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import ClientProviders from "./providers/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

// Define Metadata for SEO
export const metadata: Metadata = {
	title: "GoFundYourself",
	description: "A peer-to-peer lending platform",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{String(metadata.title)}</title>
				<meta name="description" content={metadata.description || ""} />
				<link rel="icon" href="./icon.svg" />
				<Analytics />

				{/* Add any other meta tags here, like OpenGraph or Twitter */}
			</head>

			<body className={inter.className}>
				<ClientProviders>
					{children}
				</ClientProviders>

				{/* Add Vercel Analytics */}
				<Analytics />
			</body>
		</html>
	);
}
