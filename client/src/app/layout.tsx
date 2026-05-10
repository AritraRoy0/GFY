import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import ClientProviders from "./providers/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "GoFundYourself | Peer-to-peer lending",
	description: "A focused peer-to-peer lending workspace for borrowers and lenders.",
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>
				<ClientProviders>
					{children}
				</ClientProviders>
				<Analytics />
			</body>
		</html>
	);
}
