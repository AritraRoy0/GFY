import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import ClientProviders from "./providers/ClientProviders";
import { themeBootScript } from "./providers/ThemeProvider";
import { siteConfig } from "./seo/site";
import { organizationSchema, websiteSchema } from "./seo/schema";
import JsonLd from "./seo/JsonLd";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

// Defaults for every route. Canonical URLs are set per page (see seo/metadata.ts) so no page inherits "/".
export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.title,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	applicationName: siteConfig.name,
	keywords: [...siteConfig.keywords],
	authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
	creator: siteConfig.legalName,
	publisher: siteConfig.legalName,
	category: "finance",
	openGraph: {
		type: "website",
		siteName: siteConfig.name,
		locale: siteConfig.locale,
		title: siteConfig.title,
		description: siteConfig.description,
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.title,
		description: siteConfig.description,
	},
	// index/follow is the default; only richer preview permissions are declared, so noindex pages (and the 404)
	// never carry a conflicting directive.
	robots: {
		googleBot: {
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
	formatDetection: { telephone: false, email: false, address: false },
	...(googleVerification || bingVerification
		? {
				verification: {
					...(googleVerification ? { google: googleVerification } : {}),
					...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
				},
			}
		: {}),
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
				{/* Live marketplace data comes from Firestore; open the connection early. */}
				<link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
				<JsonLd data={[organizationSchema, websiteSchema]} />
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
