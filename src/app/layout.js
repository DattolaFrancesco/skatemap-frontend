import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SkateSpot — Discover the Best Skateboarding Spots Worldwide",

  description:
    "Explore skateparks, hidden street spots, and local skateboarding communities around the world. Find, save, and share the best places to skate.",

  keywords: [
    "skateboarding",
    "skate spots",
    "skateparks",
    "street skating",
    "skate map",
    "urban skateboarding",
    "skate community",
    "BMX spots",
    "scooter spots",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
