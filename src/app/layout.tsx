import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { getPublicSiteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getPublicSiteUrl();
const siteDescription =
  "HealthNook helps local organizations create, explain, promote, and track community health events and resources.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "HealthNook",
  description: siteDescription,
  openGraph: {
    description: siteDescription,
    siteName: "HealthNook",
    title: "HealthNook",
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    description: siteDescription,
    title: "HealthNook",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
