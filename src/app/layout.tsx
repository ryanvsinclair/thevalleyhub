import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";

import { getSiteUrl } from "@/lib/seo/site";

import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const defaultDescription =
  "Independent community resource for The Valley, Dubai. Not affiliated with Emaar Properties.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Valley",
    template: "%s · Valley",
  },
  description: defaultDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Valley",
    description: defaultDescription,
    url: siteUrl,
    siteName: "Valley",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Valley",
    description: defaultDescription,
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
      className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
