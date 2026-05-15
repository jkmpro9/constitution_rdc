import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Constitution de la RDC",
  description:
    "Consultez la Constitution de la République Démocratique du Congo modifiée par la Loi n° 11/002 du 20 janvier 2011. Recherche, navigation et assistant IA.",
  keywords: [
    "Constitution RDC",
    "Constitution République Démocratique du Congo",
    "Droit congolais",
    "Loi fondamentale RDC",
    "Textes juridiques RDC",
  ],
  openGraph: {
    title: "Constitution de la RDC",
    description:
      "La Constitution de la République Démocratique du Congo, accessible à tous.",
    type: "website",
    locale: "fr_FR",
    siteName: "Constitution RDC",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    languages: {
      fr: "/",
    },
  },
  other: {
    "application-name": "Constitution RDC",
    "apple-mobile-web-app-title": "Constitution RDC",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* OpenGraph / Twitter / Meta sociaux — injectés côté serveur pour les crawlers */}
        <meta property="og:title" content="Constitution de la RDC" />
        <meta property="og:description" content="La Constitution de la République Démocratique du Congo, accessible à tous." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="Constitution RDC" />
        <meta property="og:url" content="https://constitution-rdc.cd" />
        <meta property="og:image" content="https://constitution-rdc.cd/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Constitution de la RDC" />
        <meta name="twitter:description" content="La Constitution de la République Démocratique du Congo, accessible à tous." />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
