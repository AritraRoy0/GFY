import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import ClientProviders from "./providers/ClientProviders";
import { themeBootScript } from "./providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
	title: "GoFundYourself | Peer-to-peer lending",
	description: "A focused peer-to-peer lending workspace for borrowers and lenders.",
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#f6f8fb" },
		{ media: "(prefers-color-scheme: dark)", color: "#05070c" },
	],
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		// data-theme is rewritten before paint by the boot script, so the server value may differ.
		<html lang="en" data-theme="light" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
			</head>
			<body className="font-sans antialiased">
				<ClientProviders>
					{children}
				</ClientProviders>
				<Analytics />
			</body>
		</html>
	);
}
