"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTitres, preloadData, romanNumeral } from "@/lib/constitution";
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
  Landmark,
  MessageCircle,
  Sparkles,
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
    preloadData();
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

  const quickTopics = [
    { label: "Liberté d’expression", query: "liberté d'expression" },
    { label: "Article 218", query: "218" },
    { label: "Le Parlement", query: "Parlement" },
    { label: "Référendum", query: "référendum" },
  ];

  return (
    <div>
      {/* Hero éditorial V2 */}
      <section className="relative overflow-hidden bg-hero-pattern">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full border border-white/10 bg-white/5" />
        <div className="absolute -bottom-36 -left-20 h-80 w-80 rounded-full border border-rdc-yellow-400/20 bg-rdc-yellow-400/5" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/80">
              <span className="h-2 w-2 rounded-full bg-rdc-yellow-400" />
              Portail citoyen de la RDC
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] text-white md:text-6xl lg:text-7xl">
              Comprendre la Constitution
              <span className="block text-rdc-yellow-400">de la RDC.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              Le texte officiel, les articles et les explications pour connaître
              ses droits et comprendre les institutions de la République.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sections">
                <Button size="lg" className="w-full gap-2 bg-rdc-yellow-500 font-semibold text-rdc-blue-950 shadow-lg shadow-rdc-yellow-500/25 hover:bg-rdc-yellow-400 sm:w-auto">
                  <BookOpen className="h-5 w-5" /> Lire la Constitution
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/recherche">
                <Button size="lg" variant="outline" className="w-full gap-2 border-white/40 bg-white/10 font-medium text-white hover:bg-white/20 sm:w-auto">
                  <Search className="h-5 w-5" /> Rechercher un article
                </Button>
              </Link>
            </div>
            <p className="mt-5 text-xs text-white/55">Libre et gratuit · Version modifiée par la Loi n° 11/002 du 20 janvier 2011</p>
          </div>
          <div className="relative hidden md:block">
            <div className="relative mx-auto max-w-sm rotate-2 rounded-2xl border border-white/20 bg-[#f7f2e8] p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-rdc-blue-950/15 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rdc-blue-700 text-rdc-yellow-400"><BookOpen className="h-4 w-4" /></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-rdc-blue-950">Constitution RDC</span>
                </div>
                <span className="text-[10px] text-rdc-blue-500">2011</span>
              </div>
              <div className="py-10 text-center">
                <Landmark className="mx-auto mb-5 h-20 w-20 text-rdc-blue-700/80" strokeWidth={1} />
                <p className="font-serif text-2xl font-bold text-rdc-blue-950">Le droit de savoir.</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-rdc-blue-500">Lire · Comprendre · Participer</p>
              </div>
              <div className="grid grid-cols-3 border-t border-rdc-blue-950/15 pt-4 text-center text-[10px] font-semibold uppercase tracking-wider text-rdc-blue-700">
                <span>8 titres</span><span>229 articles</span><span>Recherche</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recherche par intention */}
      <section className="relative z-10 mx-auto -mt-8 max-w-4xl px-6">
        <div className="rounded-2xl border border-rdc-blue-100 bg-white p-5 shadow-xl shadow-rdc-blue-950/10 md:p-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rdc-blue-100"><Search className="h-4 w-4 text-rdc-blue-700" /></div>
            <div><h2 className="text-base font-bold text-rdc-blue-950">Que souhaitez-vous comprendre ?</h2><p className="text-xs text-rdc-blue-500">Recherchez un article, un thème ou une institution.</p></div>
          </div>
          <form action="/recherche" className="flex gap-2">
            <input name="q" aria-label="Rechercher dans la Constitution" placeholder="Ex. liberté d'expression, article 218..." className="h-11 min-w-0 flex-1 rounded-xl border border-rdc-blue-200 bg-rdc-blue-50/40 px-4 text-sm text-rdc-blue-950 outline-none transition focus:border-rdc-blue-500 focus:ring-2 focus:ring-rdc-blue-500/20" />
            <Button type="submit" className="h-11 gap-2 px-4"><Search className="h-4 w-4" /><span className="hidden sm:inline">Rechercher</span></Button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {quickTopics.map((topic) => <Link key={topic.query} href={`/recherche?q=${encodeURIComponent(topic.query)}`} className="rounded-full border border-rdc-blue-100 bg-rdc-blue-50 px-3 py-1.5 text-xs text-rdc-blue-700 transition hover:border-rdc-blue-300 hover:bg-rdc-blue-100">{topic.label}</Link>)}
          </div>
        </div>
      </section>

      {/* Fonctionnalités clés */}
      <section className="mx-auto max-w-5xl px-6 pb-14 pt-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-rdc-blue-500">Le portail en bref</p><h2 className="mt-2 text-2xl font-bold text-rdc-blue-950">Un accès simple au droit congolais</h2></div>
          <Link href="/sections" className="hidden items-center gap-1 text-xs font-semibold text-rdc-blue-700 hover:text-rdc-blue-900 sm:flex">Explorer <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BookOpen, title: "Texte officiel", text: "Consultez les 229 articles et les 8 titres." },
            { icon: Sparkles, title: "Explications simples", text: "Comprenez les notions juridiques plus facilement." },
            { icon: MessageCircle, title: "Assistant Constitution", text: "Posez vos questions sur le droit congolais." },
            { icon: Landmark, title: "Institutions", text: "Explorez les pouvoirs et leur organisation." },
          ].map((item) => <div key={item.title} className="group rounded-2xl border border-rdc-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-rdc-blue-200 hover:shadow-md"><div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-rdc-blue-50 group-hover:bg-rdc-blue-100"><item.icon className="h-5 w-5 text-rdc-blue-700" /></div><h2 className="mb-1 text-sm font-bold text-rdc-blue-950">{item.title}</h2><p className="text-xs leading-relaxed text-rdc-blue-500">{item.text}</p></div>)}
        </div>
      </section>

      {/* Préambule */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="relative">
          {/* Guillemet décoratif */}
          <div className="absolute -top-6 -left-2 text-5xl text-rdc-blue-200 font-serif leading-none select-none">
            &ldquo;
          </div>

          <div className="grid gap-6 rounded-3xl border border-rdc-blue-100 bg-rdc-blue-50/45 p-6 md:grid-cols-[0.8fr_1.6fr] md:items-center md:p-9">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-rdc-blue-500">Le texte fondateur</p><h2 className="mt-2 text-2xl font-bold text-rdc-blue-950">Le Préambule</h2><p className="mt-3 text-xs leading-relaxed text-rdc-blue-600">Les valeurs et engagements qui ouvrent la Constitution.</p><button onClick={() => setShowPreamble(true)} className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-rdc-blue-700 hover:text-rdc-blue-950">Lire le texte intégral <ChevronRight className="h-3.5 w-3.5" /></button></div>
            <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-sm md:p-7"><p className="text-sm leading-relaxed text-rdc-blue-900 md:text-base md:leading-loose">{ready ? getPreambleSummary() : ""}</p></div>
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
              <Link
                key={theme.title}
                href={`/recherche?q=${encodeURIComponent(theme.title)}`}
                className="group rounded-2xl border border-rdc-blue-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-rdc-blue-300 hover:shadow-md"
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
                <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-rdc-blue-600 opacity-0 transition-opacity group-hover:opacity-100">Explorer <ArrowRight className="h-3 w-3" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="overflow-hidden rounded-3xl bg-hero-pattern px-6 py-12 text-center md:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rdc-yellow-300">Votre portail citoyen</p>
        <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
          La Constitution, pour chaque Congolais
        </h2>
        <p className="mx-auto mb-8 mt-3 max-w-lg text-sm text-white/70">
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
            <Button variant="outline" size="lg" className="gap-2 border-white/40 bg-white/10 text-white hover:bg-white/20">
              <Search className="h-5 w-5" />
              Rechercher
            </Button>
          </Link>
        </div>

        {/* Bandeau tricolore */}
        <div className="mx-auto mt-10 flex h-1.5 w-full max-w-xs overflow-hidden rounded-full">
          <div className="flex-1 bg-rdc-blue-700" />
          <div className="flex-1 bg-rdc-yellow-500" />
          <div className="flex-1 bg-rdc-red-500" />
        </div>
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
