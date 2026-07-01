import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "The Skate Map — Discover the Best Skateboarding Spots Worldwide",
    template: "%s | The Skate Map",
  },

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

  openGraph: {
    title: "The Skate Map — Discover the Best Skateboarding Spots Worldwide",
    description:
      "Explore skateparks, hidden street spots, and local skateboarding communities around the world. Find, save, and share the best places to skate.",
    url: siteUrl,
    siteName: "The Skate Map",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "The Skate Map",
    description:
      "Explore skateparks, hidden street spots, and local skateboarding communities around the world.",
    images: ["/og-image.png"],
  },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} antialiased bg-gradient-custom`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "The Skate Map",
              "url": siteUrl,
              "image": `${siteUrl}/og-image.png`,
              "description":
                "Explore skateparks, hidden street spots, and local skateboarding communities around the world. Find, save, and share the best places to skate."
            }),
          }}
        />
      </head>
      <body className="">
        {children}
      </body>
    </html>
  );
}