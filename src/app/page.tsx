"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTitres, romanNumeral } from "@/lib/constitution";
import type { Titre } from "@/lib/constitution";
import {
  BookOpen,
  Search,
  Map,
  Shield,
  Scale,
  Building2,
  ArrowRight,
  ChevronRight,
  Gavel,
  ScrollText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PREAMBULE, getPreambleSummary } from "@/lib/preambule";

export default function HomePage() {
  const [toc, setToc] = useState<Titre[] | null>(null);
  const [showPreamble, setShowPreamble] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    getTitres()
      .then(setToc)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!showPreamble) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowPreamble(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [showPreamble]);

  const themes = [
    {
      icon: Scale,
      title: "Droits et Libertés",
      description: "Droits civils, politiques, économiques et sociaux",
      color: "from-rdc-blue-500 to-rdc-blue-700",
      bg: "bg-rdc-blue-50",
      iconBg: "bg-rdc-blue-100",
    },
    {
      icon: Building2,
      title: "Organisation du Pouvoir",
      description: "Exécutif, législatif, judiciaire et leurs relations",
      color: "from-rdc-red-500 to-rdc-red-700",
      bg: "bg-rdc-red-50",
      iconBg: "bg-rdc-red-100",
    },
    {
      icon: Map,
      title: "Provinces et Décentralisation",
      description: "Institutions provinciales et répartition des compétences",
      color: "from-rdc-yellow-600 to-rdc-yellow-800",
      bg: "bg-rdc-yellow-50",
      iconBg: "bg-rdc-yellow-100",
    },
    {
      icon: Shield,
      title: "Institutions d'Appui",
      description: "CENI, CSAC, Conseil Économique et Social",
      color: "from-rdc-blue-600 to-rdc-blue-800",
      bg: "bg-rdc-blue-50",
      iconBg: "bg-rdc-blue-100",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-pattern">
        {/* Motif étoilé */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-2 h-2 bg-rdc-yellow-400 rounded-full" />
          <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-rdc-yellow-400 rounded-full" />
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-rdc-yellow-400 rounded-full" />
          <div className="absolute top-60 right-1/3 w-1 h-1 bg-rdc-yellow-400 rounded-full" />
          <div className="absolute bottom-20 right-1/4 w-1.5 h-1.5 bg-rdc-yellow-400 rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
          {/* Bande drapeau */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm mb-8 border border-white/20">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-rdc-blue-300" />
              <div className="w-2 h-2 rounded-full bg-rdc-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-rdc-red-400" />
            </div>
            <span className="text-[11px] font-medium text-white/80">
              République Démocratique du Congo
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight animate-fade-in">
            Constitution de la
            <br />
            <span className="text-rdc-yellow-400">République Démocratique</span>
            <br />
            du Congo
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-3 animate-slide-up">
            La loi fondamentale, accessible à tous.
          </p>
          <p className="text-sm text-white/50 mb-10">
            Modifiée par la Loi n° 11/002 du 20 janvier 2011
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link href="/sections">
              <Button
                size="lg"
                className="bg-rdc-yellow-500 text-rdc-blue-950 hover:bg-rdc-yellow-400 font-semibold shadow-lg shadow-rdc-yellow-500/25 gap-2"
              >
                <BookOpen className="h-5 w-5" />
                Lire la Constitution
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/recherche">
              <Button
                size="lg"
                variant="outline"
                className="border-rdc-blue-700/50 bg-rdc-blue-800/40 text-rdc-yellow-300 hover:bg-rdc-blue-800/60 hover:text-rdc-yellow-200 backdrop-blur-sm gap-2 font-medium"
              >
                <Search className="h-5 w-5" />
                Rechercher un article
              </Button>
            </Link>
          </div>
        </div>

        {/* Wave separator */}
        <div className="relative h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Préambule */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="relative">
          {/* Guillemet décoratif */}
          <div className="absolute -top-6 -left-2 text-5xl text-rdc-blue-200 font-serif leading-none select-none">
            &ldquo;
          </div>

          <h2 className="text-sm font-semibold uppercase tracking-wider text-rdc-blue-500 mb-4 ml-2">
            Préambule
          </h2>
          <div className="bg-rdc-blue-50/50 border border-rdc-blue-100 rounded-2xl p-6 md:p-8">
            <p className="text-sm md:text-base text-rdc-blue-900 leading-relaxed font-serif italic">
              {ready ? getPreambleSummary() : ""}
            </p>
            <button
              onClick={() => setShowPreamble(true)}
              className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-rdc-blue-700 hover:text-rdc-blue-900 transition-colors"
            >
              Lire la suite
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Modale Préambule */}
          {showPreamble && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="preambule-title">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowPreamble(false)}
              />
              {/* Contenu */}
              <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-rdc-blue-100 animate-slide-up">
                <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-rdc-blue-100 rounded-t-2xl">
                  <h3 id="preambule-title" className="text-sm font-semibold text-rdc-blue-950 uppercase tracking-wider">
                    Préambule
                  </h3>
                  <button
                    onClick={() => setShowPreamble(false)}
                    className="p-1.5 rounded-lg hover:bg-rdc-blue-50 transition-colors text-rdc-blue-500 hover:text-rdc-blue-700"
                    aria-label="Fermer le préambule"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="px-6 py-6">
                  <p className="text-sm md:text-base text-rdc-blue-900 leading-relaxed font-serif whitespace-pre-line">
                    {PREAMBULE}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Structure — les Titres */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-rdc-blue-950 mb-3">
            Structure de la Constitution
          </h2>
          <p className="text-sm text-rdc-blue-500 max-w-lg mx-auto">
            229 articles répartis en 8 titres, couvrant l&apos;ensemble des
            institutions et des droits fondamentaux.
          </p>
        </div>

        {/* 3 colonnes stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: "Titres", value: "8", icon: BookOpen },
            { label: "Articles", value: "229", icon: ScrollText },
            { label: "Chapitres", value: "14", icon: Gavel },
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

        {/* Grille des Titres */}
        {toc && (
          <div className="grid md:grid-cols-2 gap-4">
            {toc.map((titre) => {
              const totalArticles = titre.chapitres.reduce(
                (sum, c) =>
                  sum +
                  c.articles.length +
                  c.sections.reduce((s, sec) => s + sec.articles.length, 0),
                0
              );
              return (
                <Link
                  key={titre.numero}
                  href={`/titres/${titre.numero}`}
                  className="group p-5 rounded-xl border border-rdc-blue-100 bg-white hover:bg-rdc-blue-50/50 hover:border-rdc-blue-300 transition-all hover:shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rdc-blue-100 flex items-center justify-center group-hover:bg-rdc-blue-200 transition-colors">
                        <BookOpen className="h-4 w-4 text-rdc-blue-700" />
                      </div>
                      <span className="text-xs font-semibold text-rdc-blue-500 uppercase tracking-wider">
                        Titre {romanNumeral(titre.numero)}
                      </span>
                    </div>
                    <span className="text-xs text-rdc-blue-400">
                      {totalArticles} art.
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-rdc-blue-950 group-hover:text-rdc-blue-700 transition-colors">
                    {titre.nom}
                  </h3>
                </Link>
              );
            })}
          </div>
        )}

        {/* Skeleton */}
        {!toc && (
          <div className="grid md:grid-cols-2 gap-4">
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
      </section>

      {/* Thèmes */}
      <section className="bg-rdc-blue-50/30 border-y border-rdc-blue-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-rdc-blue-950 mb-3">
              Explorez par thème
            </h2>
            <p className="text-sm text-rdc-blue-500">
              Naviguez dans les grandes thématiques de la Constitution.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <div
                key={theme.title}
                className="p-6 rounded-xl border border-rdc-blue-100 bg-white hover:shadow-md transition-all group cursor-pointer"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
                    theme.iconBg
                  )}
                >
                  <theme.icon className="h-5 w-5 text-rdc-blue-700" />
                </div>
                <h3 className="text-sm font-semibold text-rdc-blue-950 mb-1.5">
                  {theme.title}
                </h3>
                <p className="text-xs text-rdc-blue-500 leading-relaxed">
                  {theme.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-rdc-blue-950 mb-3">
          La Constitution, pour chaque Congolais
        </h2>
        <p className="text-sm text-rdc-blue-500 mb-8 max-w-lg mx-auto">
          Un outil libre, gratuit et accessible à tous pour connaître et
          comprendre la loi fondamentale de notre pays.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/sections">
            <Button size="lg" className="gap-2">
              <BookOpen className="h-5 w-5" />
              Commencer la lecture
            </Button>
          </Link>
          <Link href="/recherche">
            <Button variant="outline" size="lg" className="gap-2">
              <Search className="h-5 w-5" />
              Rechercher
            </Button>
          </Link>
        </div>

        {/* Bandeau tricolore */}
        <div className="mt-12 h-1.5 w-full max-w-xs mx-auto rounded-full flex overflow-hidden">
          <div className="flex-1 bg-rdc-blue-700" />
          <div className="flex-1 bg-rdc-yellow-500" />
          <div className="flex-1 bg-rdc-red-500" />
        </div>
      </section>

      {/* Footer / Copyright */}
      <footer className="border-t border-rdc-blue-100 bg-rdc-blue-50/30">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-xs text-rdc-blue-500">
            &copy; 2026 — Développé par{" "}
            <a
              href="https://coccinelledrc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-rdc-blue-700 hover:text-rdc-blue-900 underline underline-offset-2 transition-colors"
            >
              Jeancy Mungedi
            </a>{" "}
            — COCCINELLE SARL
          </p>
          <p className="text-[10px] text-rdc-blue-400">
            Constitution de la République Démocratique du Congo — Libre et accessible à tous
          </p>
        </div>
        {/* Mini bandeau drapeau */}
        <div className="h-1 w-full flex">
          <div className="flex-1 bg-rdc-blue-700" />
          <div className="flex-1 bg-rdc-yellow-500" />
          <div className="flex-1 bg-rdc-red-500" />
        </div>
      </footer>
    </div>
  );
}
