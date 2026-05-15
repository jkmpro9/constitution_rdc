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
    icon: "/favicon.ico",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
