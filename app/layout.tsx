import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "./components/BookingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
  title: {
    default: "Car Rental UAE",
    template: "%s | Car Rental UAE"
  },
  description: "Book rental cars across the UAE with flexible pickup & return locations, promo codes, and door delivery.",
  keywords: [
    "car rental",
    "UAE",
    "rent a car",
    "dubai car hire",
    "abu dhabi car rental",
    "monthly car rental",
    "airport pickup"
  ],
  authors: [{ name: "Car Rental Team" }],
  creator: "Car Rental Team",
  publisher: "Car Rental UAE",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: "Car Rental UAE",
    description: "Book rental cars across the UAE with flexible pickup & return locations, promo codes, and door delivery.",
    url: "https://www.example.com/",
    siteName: "Car Rental UAE",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BookingProvider>
          {children}
        </BookingProvider>
      </body>
    </html>
  );
}
