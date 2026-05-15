"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SEOHead from "@/components/seo-head";
import {
  ChevronLeft,
  BookOpen,
  FileText,
  ScrollText,
} from "lucide-react";
import { getData, romanNumeral } from "@/lib/constitution";
import type { Titre, Chapitre, Section, Article } from "@/lib/constitution";

export default function TitrePage() {
  const params = useParams();
  const titreNumero = parseInt(params.numero as string);
  const [titre, setTitre] = useState<Titre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData()
      .then((data) => {
        const found = data.titres.find((t) => t.numero === titreNumero);
        setTitre(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [titreNumero]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 animate-pulse">
        <div className="h-4 w-48 bg-rdc-blue-200 rounded mb-6" />
        <div className="h-8 w-72 bg-rdc-blue-200 rounded mb-8" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-rdc-blue-100 rounded-xl mb-4" />
        ))}
      </div>
    );
  }

  if (!titre) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-rdc-blue-500">Titre introuvable.</p>
        <Link href="/" className="text-rdc-blue-700 hover:underline mt-4 inline-block">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const totalArticles = titre.chapitres.reduce(
    (sum, ch) =>
      sum +
      ch.articles.length +
      ch.sections.reduce((s, sec) => s + sec.articles.length, 0),
    0
  );

  const allArticles = flattenArticles(titre);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-1.5 text-xs text-rdc-blue-500 mb-6">
        <Link
          href="/"
          className="hover:text-rdc-blue-700 transition-colors inline-flex items-center gap-1"
        >
          <BookOpen className="h-3 w-3" />
          Accueil
        </Link>
        <ChevronLeft className="h-3 w-3 text-rdc-blue-300 rotate-180" />
        <span className="text-rdc-blue-950 font-medium">
          Titre {romanNumeral(titre.numero)}
        </span>
      </nav>

      {/* Bande tricolore */}
      <div className="h-1 w-16 rounded-full flex overflow-hidden mb-6">
        <div className="flex-1 bg-rdc-blue-700" />
        <div className="flex-1 bg-rdc-yellow-500" />
        <div className="flex-1 bg-rdc-red-500" />
      </div>

      {/* En-tête du Titre */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-rdc-blue-500 mb-2">
          Titre {romanNumeral(titre.numero)}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-rdc-blue-950 leading-tight">
          {titre.nom}
        </h1>
        <p className="text-sm text-rdc-blue-500 mt-2">
          {totalArticles} article{totalArticles > 1 ? "s" : ""} ·{" "}
          {titre.chapitres.length} chapitre{titre.chapitres.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Raccourcis : Liste compacte des articles */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-rdc-blue-700 mb-3">
          Raccourcis vers les articles
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {allArticles.map((article) => (
            <Link
              key={article.numero}
              href={`/articles/${article.numero}`}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-rdc-blue-50 text-rdc-blue-700 hover:bg-rdc-blue-100 hover:text-rdc-blue-900 transition-colors border border-rdc-blue-100"
            >
              Art. {article.numero}
            </Link>
          ))}
        </div>
      </div>

      {/* Chapitres et articles */}
      <div className="space-y-6">
        {titre.chapitres.map((chapitre) => {
          const chArticles = chapitre.articles;
          const chSections = chapitre.sections;
          const isEmpty =
            chArticles.length === 0 &&
            chSections.every((s) => s.articles.length === 0);
          const isUnnamed = !chapitre.nom || chapitre.nom === "";

          if (isEmpty) return null;

          return (
            <div key={chapitre.numero} className="border border-rdc-blue-100 rounded-2xl overflow-hidden">
              {/* En-tête du chapitre */}
              {!isUnnamed && (
                <div className="px-5 py-3 bg-rdc-blue-50/50 border-b border-rdc-blue-100">
                  <h3 className="text-sm font-semibold text-rdc-blue-800">
                    {chapitre.nom}
                  </h3>
                </div>
              )}

              <div className="divide-y divide-rdc-blue-50">
                {/* Articles directs */}
                {chArticles.map((article) => (
                  <ArticleLink
                    key={article.numero}
                    article={article}
                    titre={titre}
                    chapitre={chapitre}
                  />
                ))}

                {/* Sections */}
                {chSections.map((section) => (
                  <div key={`sec-${section.numero}`}>
                    {section.nom && (
                      <div className="px-5 py-2 bg-rdc-blue-50/30">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-rdc-blue-500">
                          {section.nom}
                        </p>
                      </div>
                    )}
                    {section.articles.map((article) => (
                      <ArticleLink
                        key={article.numero}
                        article={article}
                        titre={titre}
                        chapitre={chapitre}
                        section={section}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation inférieure */}
      <div className="flex items-center justify-between mt-10">
        {titreNumero > 1 ? (
          <Link
            href={`/titres/${titreNumero - 1}`}
            className="flex items-center gap-1.5 text-xs text-rdc-blue-600 hover:text-rdc-blue-900 transition-colors group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <div>
              <p className="text-[10px] text-rdc-blue-400">Précédent</p>
              <p className="text-xs font-medium">
                Titre {romanNumeral(titreNumero - 1)}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        <Link
          href="/"
          className="text-[10px] text-rdc-blue-400 hover:text-rdc-blue-600 transition-colors"
        >
          ↑ Sommaire
        </Link>

        {titreNumero < 8 ? (
          <Link
            href={`/titres/${titreNumero + 1}`}
            className="flex items-center gap-1.5 text-xs text-rdc-blue-600 hover:text-rdc-blue-900 transition-colors group"
          >
            <div className="text-right">
              <p className="text-[10px] text-rdc-blue-400">Suivant</p>
              <p className="text-xs font-medium">
                Titre {romanNumeral(titreNumero + 1)}
              </p>
            </div>
            <ChevronLeft className="h-4 w-4 rotate-180 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

// Composant pour un lien d'article dans la liste
function ArticleLink({
  article,
  titre,
  chapitre,
  section,
}: {
  article: Article;
  titre: Titre;
  chapitre: Chapitre;
  section?: Section;
}) {
  return (
    <Link
      href={`/articles/${article.numero}`}
      className="flex items-start gap-3 px-5 py-3 hover:bg-rdc-blue-50/50 transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-rdc-blue-100 flex items-center justify-center shrink-0 group-hover:bg-rdc-blue-200 transition-colors mt-0.5">
        <FileText className="h-4 w-4 text-rdc-blue-700" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-rdc-blue-700">
          Article {article.numero}
        </p>
        {article.texte && (
          <p className="text-sm text-rdc-blue-900 leading-relaxed line-clamp-2 mt-0.5">
            {article.texte}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-rdc-blue-400">
            Titre {romanNumeral(titre.numero)}
          </span>
          {chapitre.nom && (
            <>
              <span className="text-[10px] text-rdc-blue-300">·</span>
              <span className="text-[10px] text-rdc-blue-400">
                {chapitre.nom}
              </span>
            </>
          )}
          {section && section.nom && (
            <>
              <span className="text-[10px] text-rdc-blue-300">·</span>
              <span className="text-[10px] text-rdc-blue-400">
                {section.nom}
              </span>
            </>
          )}
        </div>
      </div>
      <ChevronLeft className="h-4 w-4 text-rdc-blue-300 rotate-180 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

// Aplatir tous les articles d'un titre en une liste triée
function flattenArticles(titre: Titre): Article[] {
  const articles: Article[] = [];
  for (const chapitre of titre.chapitres) {
    articles.push(...chapitre.articles);
    for (const section of chapitre.sections) {
      articles.push(...section.articles);
    }
  }
  return articles.sort((a, b) => a.ordre - b.ordre);
}
