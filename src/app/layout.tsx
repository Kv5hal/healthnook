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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "HealthNook | Community health access platform",
  description:
    "Publish health events and resources, explain information in plain language, generate outreach, and track community impact with HealthNook.",
  openGraph: {
    description:
      "Publish health events and resources, explain information in plain language, generate outreach, and track community impact with HealthNook.",
    siteName: "HealthNook",
    title: "HealthNook | Community health access platform",
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    description:
      "Publish health events and resources, explain information in plain language, generate outreach, and track community impact with HealthNook.",
    title: "HealthNook | Community health access platform",
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
