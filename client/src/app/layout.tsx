'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Provider } from "react-redux";
import store from "./store"; // Adjust the path to your Redux store if necessary

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Go Fund Yourself!",
  description: "Respectfully asking you to go fund yourself",
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
        <link rel="icon" href="/favicon.ico" />
        {/* Add any other meta tags here, like OpenGraph or Twitter */}
      </head>
      
      <body className={inter.className}>
        {/* Wrap the app with Redux Provider if using Redux */}
        <Provider store={store}>
          {children}
        </Provider>

        {/* Add Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
