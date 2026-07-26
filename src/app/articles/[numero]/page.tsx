"use client";
import { useEffect, useState } from "react";
import { getData, romanNumeral } from "@/lib/constitution";
import type { Article, Titre, Chapitre, Section } from "@/lib/constitution";
import { useParams } from "next/navigation";
import SEOHead from "@/components/seo-head";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  List,
} from "lucide-react";

interface EnrichedArticle extends Article {
  titre?: {
    numero: number;
    nom: string;
  };
  chapitre?: {
    numero: number;
    nom: string;
  };
  section?: {
    numero: number;
    nom: string;
  };
  prevArticle?: { numero: number } | null;
  nextArticle?: { numero: number } | null;
}

export default function ArticlePage() {
  const params = useParams();
  const numero = parseInt(params.numero as string);
  const [article, setArticle] = useState<EnrichedArticle | undefined | null>(
    undefined
  );
  const [titre, setTitre] = useState<Titre | null>(null);
  const [allTitreArticles, setAllTitreArticles] = useState<
    { numero: number; texte: string }[]
  >([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getData();
        if (cancelled) return;

        let foundArticle: Article | null = null;
        let foundTitre: Titre | null = null;
        let foundChapitre: Chapitre | null = null;
        let foundSection: Section | null = null;

        const allArticles: {
          article: Article;
          titre: Titre;
          chapitre: Chapitre;
          section: Section | null;
        }[] = [];

        for (const t of data.titres) {
          for (const ch of t.chapitres) {
            for (const a of ch.articles) {
              const entry = { article: a, titre: t, chapitre: ch, section: null as Section | null };
              allArticles.push(entry);
              if (a.numero === numero) {
                foundArticle = a;
                foundTitre = t;
                foundChapitre = ch;
                foundSection = null;
              }
            }
            for (const sec of ch.sections) {
              for (const a of sec.articles) {
                const entry = { article: a, titre: t, chapitre: ch, section: sec };
                allArticles.push(entry);
                if (a.numero === numero) {
                  foundArticle = a;
                  foundTitre = t;
                  foundChapitre = ch;
                  foundSection = sec;
                }
              }
            }
          }
        }

        if (!foundArticle || !foundTitre) {
          setArticle(null);
          return;
        }

        setTitre(foundTitre);

        // Tous les articles du titre pour la sidebar / selecteur
        const titreArticles: { numero: number; texte: string }[] = [];
        for (const ch of foundTitre.chapitres) {
          for (const a of ch.articles) {
            titreArticles.push({ numero: a.numero, texte: a.texte });
          }
          for (const sec of ch.sections) {
            for (const a of sec.articles) {
              titreArticles.push({ numero: a.numero, texte: a.texte });
            }
          }
        }
        setAllTitreArticles(titreArticles);

        // Prev/next dans le titre seulement
        const currentIndex = titreArticles.findIndex(
          (a) => a.numero === numero
        );
        const prevArticle =
          currentIndex > 0
            ? { numero: titreArticles[currentIndex - 1].numero }
            : null;
        const nextArticle =
          currentIndex < titreArticles.length - 1
            ? { numero: titreArticles[currentIndex + 1].numero }
            : null;

        setArticle({
          ...foundArticle,
          titre: { numero: foundTitre.numero, nom: foundTitre.nom },
          chapitre: foundChapitre
            ? { numero: foundChapitre.numero, nom: foundChapitre.nom }
            : undefined,
          section: foundSection
            ? { numero: foundSection.numero, nom: foundSection.nom }
            : undefined,
          prevArticle,
          nextArticle,
        });
      } catch {
        if (!cancelled) setArticle(null);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [numero]);

  if (article === undefined) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 animate-pulse">
        <div className="h-4 w-64 bg-rdc-blue-200 rounded mb-6" />
        <div className="h-8 w-48 bg-rdc-blue-200 rounded mb-4" />
        <div className="h-4 w-full bg-rdc-blue-100 rounded mb-2" />
        <div className="h-4 w-5/6 bg-rdc-blue-100 rounded mb-2" />
        <div className="h-4 w-4/6 bg-rdc-blue-100 rounded" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-rdc-blue-500">Article non trouvé.</p>
        <Link href="/">
          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all border border-rdc-blue-200 bg-white hover:bg-rdc-blue-50 text-rdc-blue-900 h-9 rounded-lg px-4 mt-4">
            Retour à l'accueil
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <SEOHead
        title={`Article ${article.numero}${article.titre ? ` — ${article.titre.nom}` : ""} | Constitution RDC`}
        description="Article de la Constitution de la République Démocratique du Congo"
        ogImage="/favicon.svg"
      />
      {/* Fil d'Ariane complet et cliquable */}
      <div className="px-4 pt-6 pb-0 sm:px-6">
        <nav className="mb-4 flex items-center gap-1 text-xs text-rdc-blue-500">
          <Link
            href="/"
            className="hover:text-rdc-blue-700 transition-colors inline-flex items-center gap-1 shrink-0"
          >
            <BookOpen className="h-3 w-3" />
            Accueil
          </Link>
          {article.titre && (
            <>
              <ChevronRight className="h-3 w-3 text-rdc-blue-300 shrink-0" />
              <Link
                href={`/titres/${article.titre.numero}`}
                className="hover:text-rdc-blue-700 hover:underline transition-colors shrink-0"
              >
                Titre {romanNumeral(article.titre.numero)}
              </Link>
            </>
          )}
          {article.chapitre && article.chapitre.numero > 0 && (
            <>
              <ChevronRight className="h-3 w-3 text-rdc-blue-300 shrink-0" />
              <Link
                href={`/titres/${article.titre?.numero}#ch-${article.chapitre.numero}`}
                className="hover:text-rdc-blue-700 hover:underline transition-colors shrink-0"
              >
                Ch. {article.chapitre.numero}
              </Link>
            </>
          )}
          {article.section && (
            <>
              <ChevronRight className="h-3 w-3 text-rdc-blue-300 shrink-0" />
              <span className="text-rdc-blue-600 truncate max-w-[120px]">
                {article.section.nom}
              </span>
            </>
          )}
          <ChevronRight className="h-3 w-3 text-rdc-blue-300 shrink-0" />
          <span className="text-rdc-blue-950 font-medium shrink-0">
            Article {article.numero}
          </span>
        </nav>

        {/* Bande tricolore */}
        <div className="h-1 w-16 rounded-full flex overflow-hidden mb-6">
          <div className="flex-1 bg-rdc-blue-700" />
          <div className="flex-1 bg-rdc-yellow-500" />
          <div className="flex-1 bg-rdc-red-500" />
        </div>
      </div>

      <div className="flex gap-6 px-4 sm:px-6 pb-10">
        {/* Desktop: Sidebar gauche avec tous les articles du titre */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-3 px-2">
              <List className="h-4 w-4 text-rdc-blue-600" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rdc-blue-600">
                Titre {article.titre && romanNumeral(article.titre.numero)}
              </span>
            </div>
            <div className="space-y-0.5 max-h-[70vh] overflow-y-auto pr-2">
              {allTitreArticles.map((a) => (
                <Link
                  key={a.numero}
                  href={`/articles/${a.numero}`}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    a.numero === article.numero
                      ? "bg-rdc-blue-100 text-rdc-blue-900 font-semibold border-l-2 border-rdc-blue-600"
                      : "text-rdc-blue-600 hover:bg-rdc-blue-50 hover:text-rdc-blue-800 border-l-2 border-transparent"
                  }`}
                >
                  <FileText className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    Art. {a.numero}
                    {a.texte ? ` — ${a.texte}` : ""}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Article principal */}
        <div className="flex-1 min-w-0">
          {/* Mobile: Navigateur d'articles */}
          <div className="lg:hidden mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-rdc-blue-200 bg-white text-xs text-rdc-blue-700 hover:bg-rdc-blue-50 transition-colors"
              >
                <List className="h-4 w-4" />
                <span>
                  Article {article.numero} / {allTitreArticles.length}
                </span>
              </button>

              {/* Prev/Next sur mobile */}
              <div className="flex gap-1 ml-auto">
                {article.prevArticle ? (
                  <Link
                    href={`/articles/${article.prevArticle.numero}`}
                    className="p-2 rounded-lg border border-rdc-blue-200 text-rdc-blue-600 hover:bg-rdc-blue-50 transition-colors"
                    title={`Article ${article.prevArticle.numero}`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="p-2 rounded-lg border border-rdc-blue-100 text-rdc-blue-300 opacity-40">
                    <ChevronLeft className="h-4 w-4" />
                  </div>
                )}
                {article.nextArticle ? (
                  <Link
                    href={`/articles/${article.nextArticle.numero}`}
                    className="p-2 rounded-lg border border-rdc-blue-200 text-rdc-blue-600 hover:bg-rdc-blue-50 transition-colors"
                    title={`Article ${article.nextArticle.numero}`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="p-2 rounded-lg border border-rdc-blue-100 text-rdc-blue-300 opacity-40">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Dropdown liste des articles du titre (mobile) */}
            {sidebarOpen && (
              <div className="mt-2 border border-rdc-blue-200 rounded-xl bg-white shadow-lg overflow-hidden">
                <div className="py-1 max-h-60 overflow-y-auto">
                  {allTitreArticles.map((a) => (
                    <Link
                      key={a.numero}
                      href={`/articles/${a.numero}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                        a.numero === article.numero
                          ? "bg-rdc-blue-100 text-rdc-blue-900 font-semibold"
                          : "text-rdc-blue-600 hover:bg-rdc-blue-50"
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      <span>Article {a.numero}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contenu de l'article */}
          <div className="rounded-2xl border border-rdc-blue-100 bg-white p-5 pb-24 shadow-sm sm:p-6 md:p-8 md:pb-24">
            <header className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-rdc-blue-950">
                Article {article.numero}
              </h1>
              {article.texte && (
                <p className="mt-1 text-sm text-rdc-blue-500 italic">
                  {article.texte}
                </p>
              )}
            </header>

            <div className="prose prose-blue max-w-none font-serif text-[1rem] leading-[1.85] text-rdc-blue-900 sm:text-justify md:text-[1.05rem]">
              {(() => {
                const text = article.contenu;
                
                // Repère les items de liste: nombre + . ou ° précédé d'espace ou début
                const pattern = /(?:(?<=[\s])|(?<=^))(\d+)[°.]\s*/g;
                const matches: { index: number; num: string; end: number }[] = [];
                let m;
                while ((m = pattern.exec(text)) !== null) {
                  matches.push({ index: m.index, num: m[1], end: m.index + m[0].length });
                }
                
                if (matches.length < 2) {
                  return <p>{text}</p>;
                }
                
                // Intro = tout avant le premier match
                const intro = text.slice(0, matches[0].index).trim();
                
                // Détecter les groupes de listes (resets de numérotation)
                const groupBounds: { startIdx: number; endIdx: number }[] = [];
                let gStart = 0;
                let prevNum = parseInt(matches[0].num);
                for (let i = 1; i < matches.length; i++) {
                  const curr = parseInt(matches[i].num);
                  if (curr <= prevNum && prevNum > 1) {
                    groupBounds.push({ startIdx: gStart, endIdx: i });
                    gStart = i;
                  }
                  prevNum = curr;
                }
                groupBounds.push({ startIdx: gStart, endIdx: matches.length });
                
                // Extraire les items pour chaque groupe
                const groups = groupBounds.map(({ startIdx, endIdx }) => {
                  const items: string[] = [];
                  for (let i = startIdx; i < endIdx; i++) {
                    const contentStart = matches[i].end;
                    const contentEnd = i < endIdx - 1 ? matches[i + 1].index : text.length;
                    const itemText = text.slice(contentStart, contentEnd).trim().replace(/[;:]\s*$/, '');
                    items.push(itemText);
                  }
                  return items;
                });
                
                return (
                  <>
                    {intro && <p className="mb-3 text-justify leading-relaxed md:text-lg">{intro}</p>}
                    {groups.map((items, gi) => (
                      <ol key={gi} className="list-none pl-0 space-y-2 mb-4 last:mb-0">
                        {items.map((item, ii) => (
                          <li key={ii} className="flex gap-2 leading-relaxed text-justify text-base md:text-lg">
                            <span className="font-semibold text-rdc-blue-700 shrink-0 min-w-[1.5rem] text-right select-none">
                              {ii + 1}.
                            </span>
                            <span className="text-rdc-blue-900">{item}</span>
                          </li>
                        ))}
                      </ol>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Navigation inférieure - Changement de titre */}
          <div className="flex items-center justify-between mt-6 gap-4">
            <div className="flex-1">
              {article.titre && article.titre.numero > 1 ? (
                <Link
                  href={`/titres/${article.titre.numero - 1}`}
                  className="flex items-center gap-1.5 text-xs text-rdc-blue-600 hover:text-rdc-blue-900 transition-colors group"
                >
                  <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                  <div className="text-left">
                    <p className="text-[10px] text-rdc-blue-400">Titre précédent</p>
                    <p className="text-xs font-medium">
                      Titre {romanNumeral(article.titre.numero - 1)}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>

            <Link
              href={`/titres/${article.titre?.numero || ""}`}
              className="text-[10px] text-rdc-blue-400 hover:text-rdc-blue-600 transition-colors text-center shrink-0"
            >
              ↑ Titre{" "}
              {article.titre ? romanNumeral(article.titre.numero) : ""}
            </Link>

            <div className="flex-1 flex justify-end">
              {article.titre && article.titre.numero < 8 ? (
                <Link
                  href={`/titres/${article.titre.numero + 1}`}
                  className="flex items-center gap-1.5 text-xs text-rdc-blue-600 hover:text-rdc-blue-900 transition-colors group"
                >
                  <div className="text-right">
                    <p className="text-[10px] text-rdc-blue-400">Titre suivant</p>
                    <p className="text-xs font-medium">
                      Titre {romanNumeral(article.titre.numero + 1)}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
