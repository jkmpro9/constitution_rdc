"use client";

import SEOHead from "@/components/seo-head";
import { useEffect, useState } from "react";
import Link from "next/link";
import SEOHead from "@/components/seo-head";
import {
  BookOpen,
  ScrollText,
  Gavel,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import SEOHead from "@/components/seo-head";
import { getTitres, romanNumeral } from "@/lib/constitution";
import type { Titre } from "@/lib/constitution";

export default function SectionsPage() {
  const [toc, setToc] = useState<Titre[] | null>(null);

  useEffect(() => {
    getTitres().then(setToc).catch(console.error);
  }, []);

  return (
      <SEOHead
        title="Constitution de la RDC"
        description="Consultez la Constitution de la République Démocratique du Congo. Navigation par titres, chapitres et articles."
      />
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-rdc-blue-500 hover:text-rdc-blue-700 mb-4"
        >
          <ChevronRight className="h-3 w-3 rotate-180" />
          Retour à l'accueil
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-rdc-blue-950">
          Constitution de la RDC
        </h1>
        <p className="text-sm text-rdc-blue-500 mt-1">
          229 articles répartis en 8 titres
        </p>
      </div>

      {/* Bande tricolore */}
      <div className="h-1 w-16 rounded-full flex overflow-hidden mb-8">
        <div className="flex-1 bg-rdc-blue-700" />
        <div className="flex-1 bg-rdc-yellow-500" />
        <div className="flex-1 bg-rdc-red-500" />
      </div>

      {/* Stats */}
      {toc && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Titres", value: toc.length, icon: BookOpen },
            {
              label: "Articles",
              value: toc.reduce(
                (s, t) =>
                  s +
                  t.chapitres.reduce(
                    (s2, ch) =>
                      s2 +
                      ch.articles.length +
                      ch.sections.reduce(
                        (s3, sec) => s3 + sec.articles.length,
                        0
                      ),
                    0
                  ),
                0
              ),
              icon: ScrollText,
            },
            {
              label: "Chapitres",
              value: toc.reduce((s, t) => s + t.chapitres.length, 0),
              icon: Gavel,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-rdc-blue-50/50 border border-rdc-blue-100"
            >
              <stat.icon className="h-5 w-5 text-rdc-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-rdc-blue-900">
                {stat.value}
              </p>
              <p className="text-xs text-rdc-blue-500">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Squelette */}
      {!toc && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-rdc-blue-100 bg-rdc-blue-50/30 animate-pulse"
            >
              <div className="h-4 w-20 bg-rdc-blue-200 rounded mb-3" />
              <div className="h-5 w-3/4 bg-rdc-blue-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Grille des Titres */}
      {toc && (
        <div className="space-y-3">
          {toc.map((titre) => {
            const totalArticles = titre.chapitres.reduce(
              (sum, ch) =>
                sum +
                ch.articles.length +
                ch.sections.reduce((s, sec) => s + sec.articles.length, 0),
              0
            );

            return (
      <SEOHead
        title="Constitution de la RDC"
        description="Consultez la Constitution de la République Démocratique du Congo. Navigation par titres, chapitres et articles."
      />
              <Link
                key={titre.numero}
                href={`/titres/${titre.numero}`}
                className="group flex items-center gap-4 p-5 rounded-xl border border-rdc-blue-100 bg-white hover:bg-rdc-blue-50/50 hover:border-rdc-blue-300 transition-all hover:shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-rdc-blue-100 flex items-center justify-center shrink-0 group-hover:bg-rdc-blue-200 transition-colors">
                  <BookOpen className="h-6 w-6 text-rdc-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-rdc-blue-500 uppercase tracking-wider">
                      Titre {romanNumeral(titre.numero)}
                    </span>
                    <span className="text-[10px] text-rdc-blue-400">
                      {totalArticles} art.
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-rdc-blue-950 group-hover:text-rdc-blue-700 transition-colors line-clamp-1">
                    {titre.nom}
                  </h3>
                </div>
                <ArrowRight className="h-5 w-5 text-rdc-blue-300 group-hover:text-rdc-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>
      )}

      {/* Pied de page */}
      <div className="mt-12 text-center">
        <div className="h-1.5 w-full max-w-xs mx-auto rounded-full flex overflow-hidden">
          <div className="flex-1 bg-rdc-blue-700" />
          <div className="flex-1 bg-rdc-yellow-500" />
          <div className="flex-1 bg-rdc-red-500" />
        </div>
      </div>
    </div>
  );
}
