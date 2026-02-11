import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "YouTube Automation AI",
  title: {
    default: "YouTube Automation AI",
    template: "%s | YouTube Automation AI",
  },
  description:
    "Discover curated guides and videos about AI-powered YouTube automation and faceless channel growth.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/logo-mark.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "YouTube Automation AI",
    title: "YouTube Automation AI",
    description:
      "Discover curated guides and videos about AI-powered YouTube automation and faceless channel growth.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YouTube Automation AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Automation AI",
    description:
      "Discover curated guides and videos about AI-powered YouTube automation and faceless channel growth.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
