import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const BASE_URL = "https://constitution-rdc.cd";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Constitution de la RDC",
  description:
    "Consultez la Constitution de la République Démocratique du Congo modifiée par la Loi n° 11/002 du 20 janvier 2011. Texte intégral, révision constitutionnelle, articles, titres et assistant IA.",
  keywords: [
    "Constitution RDC",
    "Constitution République Démocratique du Congo",
    "révision constitution RDC",
    "changement constitution RDC",
    "loi fondamentale RDC",
    "Droit congolais",
    "article 218 constitution RDC",
    "référendum RDC",
    "procédure révision constitutionnelle RDC",
    "loi 11/002 du 20 janvier 2011",
    "textes juridiques RDC",
    "cour constitutionnelle RDC",
    "assemblée nationale RDC",
    "constitution congolaise pdf",
    "modifier constitution RDC 2026",
  ],
  openGraph: {
    title: "Constitution de la RDC — Texte intégral & Révision Constitutionnelle",
    description:
      "Consultez l'intégralité de la Constitution de la RDC. Articles, titres, révision constitutionnelle, référendum — le texte fondamental accessible à tous.",
    type: "website",
    locale: "fr_FR",
    siteName: "Constitution RDC",
    url: BASE_URL,
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
    canonical: BASE_URL,
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
        {/* Canonical URL */}
        <link rel="canonical" href={BASE_URL} />

        {/* Schema.org — Site Web */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Constitution RDC",
              url: BASE_URL,
              description:
                "Constitution de la République Démocratique du Congo — texte intégral, révision constitutionnelle, articles et assistant IA.",
              inLanguage: "fr",
              isAccessibleForFree: true,
              publisher: {
                "@type": "Organization",
                name: "Constitution RDC",
              },
            }),
          }}
        />

        {/* OpenGraph / Twitter / Meta sociaux */}
        <meta property="og:title" content="Constitution de la RDC — Texte intégral & Révision Constitutionnelle" />
        <meta property="og:description" content="Consultez l'intégralité de la Constitution de la RDC. Articles, titres, révision constitutionnelle, référendum." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="Constitution RDC" />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:image" content={`${BASE_URL}/og-image.svg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Constitution de la RDC — Texte intégral & Révision Constitutionnelle" />
        <meta name="twitter:description" content="Consultez l'intégralité de la Constitution de la RDC. Articles, titres, révision constitutionnelle, référendum." />
        {/* Umami Analytics */}
        <script defer src="https://apps-umami.fpys2z.easypanel.host/script.js" data-website-id="91d09627-b5eb-41d5-a64e-b05dcd28c37a"></script>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
