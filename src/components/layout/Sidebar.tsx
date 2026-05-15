"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, FileText, BookOpen, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTitres, romanNumeral } from "@/lib/constitution";
import type { Titre, Chapitre, Section, Article } from "@/lib/constitution";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [toc, setToc] = useState<Titre[] | null>(null);
  const pathname = usePathname();
  const [expandedTitres, setExpandedTitres] = useState<Set<number>>(
    new Set([1])
  );
  const [expandedChapitres, setExpandedChapitres] = useState<Set<string>>(
    new Set()
  );

  // Extraire le numéro d'article depuis l'URL
  const currentArticleNum = pathname.match(/\/articles\/(\d+)/)?.[1];

  // Charger les données
  useEffect(() => {
    getTitres()
      .then((titres) => setToc(titres))
      .catch(console.error);
  }, []);

  // Auto-expand le titre/chapitre de l'article courant
  useEffect(() => {
    if (!toc || !currentArticleNum) return;

    const currentNum = parseInt(currentArticleNum);
    for (const titre of toc) {
      for (const chapitre of titre.chapitres) {
        const hasArticle =
          chapitre.articles.some((a) => a.numero === currentNum) ||
          chapitre.sections.some((s) =>
            s.articles.some((a) => a.numero === currentNum)
          );

        if (hasArticle) {
          setExpandedTitres((prev) => new Set([...prev, titre.numero]));
          setExpandedChapitres(
            (prev) => new Set([...prev, `${titre.numero}-${chapitre.numero}`])
          );
          return;
        }
      }
    }
  }, [toc, currentArticleNum]);

  const toggleTitre = (num: number) => {
    setExpandedTitres((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const toggleChapitre = (key: string) => {
    setExpandedChapitres((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const isArticleActive = (num: number) =>
    currentArticleNum === String(num);

  if (!toc) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-5 bg-rdc-blue-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <nav className="py-4">
      {/* Lien Accueil */}
      <Link
        href="/"
        className={cn(
          "flex items-center gap-2 px-4 py-2 text-sm text-rdc-blue-700 hover:bg-rdc-blue-50 hover:text-rdc-blue-900 transition-colors mb-2",
          pathname === "/" && "bg-rdc-blue-50 text-rdc-blue-900 font-medium"
        )}
      >
        <BookOpen className="h-4 w-4 shrink-0" />
        <span>Accueil</span>
      </Link>

      {/* Titres */}
      {toc.map((titre) => {
        const totalArticles = titre.chapitres.reduce(
          (sum, ch) =>
            sum +
            ch.articles.length +
            ch.sections.reduce((s, sec) => s + sec.articles.length, 0),
          0
        );

        const isExpanded = expandedTitres.has(titre.numero);

        return (
          <div key={titre.numero} className="mb-1">
            <button
              onClick={() => toggleTitre(titre.numero)}
              className={cn(
                "w-full flex items-center gap-2 px-4 py-2 text-left text-sm transition-colors",
                "hover:bg-rdc-blue-50",
                isExpanded
                  ? "text-rdc-blue-900 font-medium bg-rdc-blue-50/80"
                  : "text-rdc-blue-700"
              )}
            >
              <ChevronRight
                className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-transform",
                  isExpanded && "rotate-90"
                )}
              />
              <span className="truncate">
                Titre {romanNumeral(titre.numero)}
              </span>
              <span className="ml-auto text-[10px] text-rdc-blue-400 shrink-0">
                {totalArticles}
              </span>
            </button>

            {isExpanded && (
              <div className="ml-3 border-l border-rdc-blue-100">
                {titre.chapitres.map((chapitre) => {
                  const chKey = `${titre.numero}-${chapitre.numero}`;
                  const isChExpanded = expandedChapitres.has(chKey);
                  const chArticles = chapitre.articles;
                  const chSections = chapitre.sections;

                  return (
                    <div key={chKey}>
                      <button
                        onClick={() => toggleChapitre(chKey)}
                        className={cn(
                          "w-full flex items-center gap-2 pl-4 pr-2 py-1.5 text-left text-xs transition-colors",
                          "hover:bg-rdc-blue-50",
                          isChExpanded
                            ? "text-rdc-blue-800 font-medium"
                            : "text-rdc-blue-500"
                        )}
                      >
                        <ChevronRight
                          className={cn(
                            "h-3 w-3 shrink-0 transition-transform",
                            isChExpanded && "rotate-90"
                          )}
                        />
                        <span className="truncate">
                          {chapitre.nom || `Chapitre ${chapitre.numero + 1}`}
                        </span>
                      </button>

                      {isChExpanded && (
                        <div className="ml-4 border-l border-rdc-blue-50">
                          {/* Articles directs du chapitre */}
                          {chArticles.map((article) => (
                            <Link
                              key={article.numero}
                              href={`/articles/${article.numero}`}
                              onClick={onClose}
                              className={cn(
                                "flex items-center gap-2 pl-4 pr-2 py-1 text-xs transition-colors",
                                isArticleActive(article.numero)
                                  ? "bg-rdc-blue-100 text-rdc-blue-900 font-medium border-l-2 border-rdc-blue-500"
                                  : "text-rdc-blue-600 hover:text-rdc-blue-800 hover:bg-rdc-blue-50"
                              )}
                            >
                              <FileText className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                Art. {article.numero}
                              </span>
                            </Link>
                          ))}

                          {/* Sections */}
                          {chSections.map((section) => (
                            <div key={`sec-${titre.numero}-${chapitre.numero}-${section.numero}`}>
                              <p className="pl-4 pr-2 py-1 text-[10px] text-rdc-blue-400 font-medium uppercase tracking-wider">
                                {section.nom}
                              </p>
                              {section.articles.map((article) => (
                                <Link
                                  key={article.numero}
                                  href={`/articles/${article.numero}`}
                                  onClick={onClose}
                                  className={cn(
                                    "flex items-center gap-2 pl-6 pr-2 py-1 text-xs transition-colors",
                                    isArticleActive(article.numero)
                                      ? "bg-rdc-blue-100 text-rdc-blue-900 font-medium border-l-2 border-rdc-blue-500"
                                      : "text-rdc-blue-600 hover:text-rdc-blue-800 hover:bg-rdc-blue-50"
                                  )}
                                >
                                  <ScrollText className="h-3 w-3 shrink-0" />
                                  <span className="truncate">
                                    Art. {article.numero}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
