"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SEOHead from "@/components/seo-head";
import {
  Search,
  FileText,
  ArrowLeft,
  BookOpen,
  Hash,
  List,
  TrendingUp,
} from "lucide-react";
import { useState, useMemo, Suspense, useEffect, useCallback } from "react";
import { searchArticles, getTitres, getArticle } from "@/lib/constitution";
import type { SearchResult, Titre, Article } from "@/lib/constitution";

// Suggestions rapides
const QUICK_SUGGESTIONS = [
  { label: "Président de la République", keywords: "président république élection" },
  { label: "Droits fondamentaux", keywords: "droits liberté égalité" },
  { label: "Parlement", keywords: "parlement assemblée nationale sénat" },
  { label: "Justice", keywords: "justice cour tribunal magistrat" },
  { label: "Provinces", keywords: "province décentralisation" },
  { label: "Nationalité", keywords: "nationalité citoyen congolais" },
  { label: "Souveraineté", keywords: "souveraineté peuple" },
  { label: "Gouvernement", keywords: "gouvernement premier ministre ministre" },
];

type SearchMode = "all" | "keyword" | "article" | "titre";

interface SearchEntry {
  type: "article" | "titre" | "keyword";
  numero?: number;
  titre?: { numero: number; nom: string };
  article?: Article;
  extrait?: string;
  score: number;
}

function highlightText(text: string, query: string): string {
  if (!query) return text;
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  let result = text.slice(0, 300);
  for (const word of words) {
    if (word.length < 2) continue;
    const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    result = result.replace(regex, "<mark class='bg-rdc-yellow-200 text-rdc-blue-950 px-0.5 rounded'>$1</mark>");
  }
  return result;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [toc, setToc] = useState<Titre[] | null>(null);
  const [wordResults, setWordResults] = useState<SearchResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterTitre, setFilterTitre] = useState<number | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>("all");

  // Charger les titres au montage
  useEffect(() => {
    getTitres().then(setToc).catch(() => setToc([]));
  }, []);

  // Lancer la recherche quand la query change
  useEffect(() => {
    if (query.length >= 2) {
      setIsLoading(true);
      searchArticles(query)
        .then((results) => {
          setWordResults(results.slice(0, 50));
        })
        .catch(() => setWordResults([]))
        .finally(() => setIsLoading(false));
    } else {
      setWordResults(null);
    }
  }, [query]);

  // Analyser la requête et combiner les résultats
  const results = useMemo((): SearchEntry[] => {
    const entries: SearchEntry[] = [];
    const trimmed = query.trim();

    if (!trimmed || trimmed.length < 2) return entries;

    // 1. Recherche par numéro d'article
    const articleMatch = trimmed.match(/^(\d+)$/);
    if (articleMatch) {
      const num = parseInt(articleMatch[1]);
      entries.push({
        type: "article",
        numero: num,
        score: 100,
      });
    }

    // 2. Recherche par titre
    const titreMatch = trimmed.match(/^(?:titre|Titre)\s*(\d+|[IVXLCDM]+)$/i);
    if (titreMatch) {
      let titreNum: number;
      const val = titreMatch[1];
      if (/^\d+$/.test(val)) {
        titreNum = parseInt(val);
      } else {
        const romanMap: Record<string, number> = {
          I: 1, II: 2, III: 3, IV: 4, V: 5,
          VI: 6, VII: 7, VIII: 8, IX: 9, X: 10,
        };
        titreNum = romanMap[val.toUpperCase()] || 0;
      }
      if (toc?.find((t) => t.numero === titreNum)) {
        entries.push({
          type: "titre",
          numero: titreNum,
          score: 90,
        });
      }
    }

    // 3. Recherche par mot-clé dans les titres (nom du titre)
    if (toc && trimmed.length >= 3) {
      const lower = trimmed.toLowerCase();
      for (const t of toc) {
        if (t.nom.toLowerCase().includes(lower)) {
          entries.push({
            type: "titre",
            numero: t.numero,
            titre: { numero: t.numero, nom: t.nom },
            score: 70,
          });
        }
      }
    }

    // 4. Résultats de recherche plein texte
    if (wordResults) {
      for (const r of wordResults) {
        entries.push({
          type: "keyword",
          article: r.article,
          titre: { numero: r.titreNumero, nom: r.titreNom },
          extrait: r.article.contenu.slice(0, 200),
          score: 50,
        });
      }
    }

    // Trier par score
    return entries.sort((a, b) => b.score - a.score);
  }, [query, wordResults, toc]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim().length >= 1) {
      const url = new URL(window.location.href);
      url.searchParams.set("q", searchInput.trim());
      window.location.href = url.toString();
    }
  };

  const handleQuickSearch = (keywords: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("q", keywords);
    window.location.href = url.toString();
  };

  // Filtrer par mode
  const filteredResults = useMemo(() => {
    if (searchMode === "article") return results.filter((r) => r.type === "article");
    if (searchMode === "titre") return results.filter((r) => r.type === "titre");
    if (searchMode === "keyword") return results.filter((r) => r.type === "keyword");
    return results;
  }, [results, searchMode]);

  const hasDirectMatch = results.some((r) => r.type === "article" || r.type === "titre");

  return (
    <>
      <SEOHead
        title={`${query ? `${query} — ` : ""}Recherche | Constitution RDC`}
        description="Recherchez dans les 229 articles de la Constitution de la République Démocratique du Congo par mot-clé, numéro d'article ou titre."
      />
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-rdc-blue-500 hover:text-rdc-blue-700 mb-4"
          >
            <ArrowLeft className="h-3 w-3" />
            Retour à l'accueil
          </Link>
          <h1 className="text-2xl font-bold text-rdc-blue-950">Recherche</h1>
        </div>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rdc-blue-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher par mot-clé, numéro d'article (ex: 15), ou titre (ex: Titre 3)..."
            autoFocus
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-rdc-blue-200 bg-rdc-blue-50/50 text-base text-rdc-blue-950 placeholder:text-rdc-blue-400 focus:outline-none focus:ring-2 focus:ring-rdc-blue-500/30 focus:border-rdc-blue-500 transition-all"
          />
        </form>

        {/* Résultats */}
        {query && query.trim().length >= 2 && (
          <>
            {/* Barre de filtres par type de résultat */}
            {hasDirectMatch && wordResults && wordResults.length > 0 && (
              <div className="flex gap-1 p-1 rounded-xl bg-rdc-blue-50 border border-rdc-blue-100 mb-6">
                <button
                  onClick={() => setSearchMode("all")}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    searchMode === "all"
                      ? "bg-white text-rdc-blue-900 shadow-sm"
                      : "text-rdc-blue-500 hover:text-rdc-blue-700"
                  }`}
                >
                  Tout ({results.length})
                </button>
                <button
                  onClick={() => setSearchMode("article")}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    searchMode === "article"
                      ? "bg-white text-rdc-blue-900 shadow-sm"
                      : "text-rdc-blue-500 hover:text-rdc-blue-700"
                  }`}
                >
                  Articles
                </button>
                <button
                  onClick={() => setSearchMode("titre")}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    searchMode === "titre"
                      ? "bg-white text-rdc-blue-900 shadow-sm"
                      : "text-rdc-blue-500 hover:text-rdc-blue-700"
                  }`}
                >
                  Titres
                </button>
                <button
                  onClick={() => setSearchMode("keyword")}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    searchMode === "keyword"
                      ? "bg-white text-rdc-blue-900 shadow-sm"
                      : "text-rdc-blue-500 hover:text-rdc-blue-700"
                  }`}
                >
                  Mots-clés
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-rdc-blue-100 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rdc-blue-100 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="h-4 w-48 bg-rdc-blue-200 rounded mb-2" />
                        <div className="h-3 w-full bg-rdc-blue-100 rounded mb-1" />
                        <div className="h-3 w-3/4 bg-rdc-blue-100 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredResults.length > 0 ? (
              <>
                <p className="text-xs text-rdc-blue-500 mb-4">
                  {filteredResults.length} résultat{filteredResults.length > 1 ? "s" : ""} pour &quot;{query}&quot;
                </p>

                <div className="space-y-2">
                  {filteredResults.map((entry, idx) => {
                    if (entry.type === "article") {
                      return (
                        <Link
                          key={`article-${entry.numero}`}
                          href={`/articles/${entry.numero}`}
                          className="block p-4 rounded-xl border border-rdc-blue-200 bg-gradient-to-r from-rdc-blue-50 to-white hover:from-rdc-blue-100 hover:border-rdc-blue-300 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rdc-blue-700 flex items-center justify-center shrink-0">
                              <Hash className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-rdc-blue-500 uppercase tracking-wider">
                                Accès direct
                              </p>
                              <p className="text-base font-bold text-rdc-blue-950">
                                Article {entry.numero}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    }

                    if (entry.type === "titre") {
                      const t = toc?.find((t) => t.numero === entry.numero);
                      const totalArts = t?.chapitres.reduce(
                        (s, ch) =>
                          s +
                          ch.articles.length +
                          ch.sections.reduce((s2, sec) => s2 + sec.articles.length, 0),
                        0
                      );

                      return (
                        <Link
                          key={`titre-${entry.numero}`}
                          href={`/titres/${entry.numero}`}
                          className="block p-4 rounded-xl border border-rdc-blue-200 bg-gradient-to-r from-rdc-yellow-50 to-white hover:from-rdc-yellow-100 hover:border-rdc-yellow-300 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rdc-yellow-500 flex items-center justify-center shrink-0">
                              <List className="h-5 w-5 text-rdc-blue-950" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-rdc-yellow-700 uppercase tracking-wider">
                                Titre {entry.numero}
                              </p>
                              <p className="text-sm font-bold text-rdc-blue-950">
                                {entry.titre?.nom || t?.nom || `Titre ${entry.numero}`}
                              </p>
                              {totalArts && (
                                <p className="text-[10px] text-rdc-blue-500 mt-0.5">
                                  {totalArts} articles · {t?.chapitres.length || 0} chapitres
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    }

                    if (entry.type === "keyword" && entry.article) {
                      return (
                        <Link
                          key={`kw-${entry.article.numero}-${idx}`}
                          href={`/articles/${entry.article.numero}`}
                          className="block p-4 rounded-xl border border-rdc-blue-100 bg-white hover:bg-rdc-blue-50/50 hover:border-rdc-blue-300 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-rdc-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                              <FileText className="h-4 w-4 text-rdc-blue-700" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-semibold text-rdc-blue-950 mb-1">
                                Article {entry.article.numero}
                                {entry.article.texte ? ` — ${entry.article.texte}` : ""}
                              </h3>
                              <p className="text-xs text-rdc-blue-600 leading-relaxed line-clamp-3"
                                 dangerouslySetInnerHTML={{ __html: highlightText(entry.article.contenu, query) }}
                              />
                              <div className="flex items-center gap-2 mt-2 text-[10px] text-rdc-blue-400">
                                <span>Titre {entry.titre?.numero || "?"}</span>
                                {entry.titre?.nom && (
                                  <>
                                    <span>·</span>
                                    <span className="truncate">{entry.titre.nom}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    }

                    return null;
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="h-8 w-8 text-rdc-blue-300 mx-auto mb-3" />
                <p className="text-sm text-rdc-blue-500">
                  Aucun résultat pour votre recherche.
                </p>
                <p className="text-xs text-rdc-blue-400 mt-1">
                  Essayez avec d&apos;autres mots-clés, ou tapez un numéro d&apos;article (ex: &quot;15&quot;).
                </p>
              </div>
            )}
          </>
        )}

        {/* Suggestions rapides */}
        {(!query || query.length < 2) && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-rdc-blue-500" />
              <h2 className="text-sm font-semibold text-rdc-blue-700">
                Suggestions de recherche
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleQuickSearch(s.keywords)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-rdc-blue-50 text-rdc-blue-700 hover:bg-rdc-blue-100 hover:text-rdc-blue-900 transition-colors border border-rdc-blue-100"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-rdc-blue-50/50 border border-rdc-blue-100">
              <h3 className="text-sm font-semibold text-rdc-blue-950 mb-3">
                Comment chercher ?
              </h3>
              <div className="space-y-3 text-xs text-rdc-blue-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-rdc-blue-100 flex items-center justify-center shrink-0">
                    <Hash className="h-3 w-3 text-rdc-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium text-rdc-blue-800">Par numéro d&apos;article</p>
                    <p>Tapez &quot;15&quot; pour accéder directement à l&apos;Article 15</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-rdc-yellow-100 flex items-center justify-center shrink-0">
                    <List className="h-3 w-3 text-rdc-yellow-700" />
                  </div>
                  <div>
                    <p className="font-medium text-rdc-blue-800">Par titre</p>
                    <p>Tapez &quot;Titre 3&quot; ou &quot;dispositions générales&quot; pour trouver un titre</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-rdc-blue-100 flex items-center justify-center shrink-0">
                    <Search className="h-3 w-3 text-rdc-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium text-rdc-blue-800">Par mot-clé</p>
                    <p>Cherchez &quot;président&quot;, &quot;droits&quot;, &quot;parlement&quot; dans le texte des 229 articles</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <BookOpen className="h-10 w-10 text-rdc-blue-300 mx-auto mb-4" />
              <p className="text-sm text-rdc-blue-500">
                Tapez au moins 2 caractères pour lancer la recherche.
              </p>
            </div>
          </div>
        )}

        {/* Filtres par Titre (plein texte uniquement) */}
        {wordResults && wordResults.length > 0 && searchMode === "keyword" && (
          <div className="flex flex-wrap gap-2 mb-6 mt-6">
            <span className="text-[10px] font-medium text-rdc-blue-500 uppercase tracking-wider self-center mr-1">
              Filtrer :
            </span>
            <button
              onClick={() => setFilterTitre(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterTitre === null
                  ? "bg-rdc-blue-700 text-white"
                  : "bg-rdc-blue-100 text-rdc-blue-600 hover:bg-rdc-blue-200"
              }`}
            >
              Tous
            </button>
            {toc?.map((t) => (
              <button
                key={t.numero}
                onClick={() => setFilterTitre(t.numero)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterTitre === t.numero
                    ? "bg-rdc-blue-700 text-white"
                    : "bg-rdc-blue-100 text-rdc-blue-600 hover:bg-rdc-blue-200"
                }`}
              >
                Titre {t.numero}
              </button>
            ))}
          </div>
        )}

        {/* Message résultats filtrés */}
        {wordResults && wordResults.length > 0 && searchMode === "keyword" && (
          <p className="text-[10px] text-rdc-blue-400 mb-4">
            {filterTitre
              ? `Résultats du Titre ${filterTitre} uniquement.`
              : "Tous les résultats."}
          </p>
        )}
      </div>
    </>
  );
}

export default function RecherchePage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-6 py-10 animate-pulse"><div className="h-8 w-48 bg-rdc-blue-200 rounded mb-6" /><div className="h-12 w-full bg-rdc-blue-100 rounded-xl" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
