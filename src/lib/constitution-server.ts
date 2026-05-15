import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "public", "data.json");

export interface Article {
  numero: number;
  texte: string;
  contenu: string;
  ordre: number;
}

export interface Section {
  numero: number;
  nom: string;
  ordre: number;
  articles: Article[];
}

export interface Chapitre {
  numero: number;
  nom: string;
  ordre: number;
  sections: Section[];
  articles: Article[];
}

export interface Titre {
  numero: number;
  nom: string;
  ordre: number;
  chapitres: Chapitre[];
}

export interface ConstitutionData {
  titres: Titre[];
}

let _cachedData: ConstitutionData | null = null;

export function getConstitutionData(): ConstitutionData {
  if (_cachedData) return _cachedData;
  const raw = fs.readFileSync(dataPath, "utf-8");
  _cachedData = JSON.parse(raw) as ConstitutionData;
  return _cachedData;
}

export function findArticle(
  numero: number
): {
  article: Article;
  titre: Titre;
  chapitre: Chapitre;
  section: Section | null;
} | null {
  const data = getConstitutionData();
  for (const t of data.titres) {
    for (const ch of t.chapitres) {
      for (const a of ch.articles) {
        if (a.numero === numero)
          return { article: a, titre: t, chapitre: ch, section: null };
      }
      for (const sec of ch.sections) {
        for (const a of sec.articles) {
          if (a.numero === numero)
            return { article: a, titre: t, chapitre: ch, section: sec };
        }
      }
    }
  }
  return null;
}

export function getArticleDescription(article: Article, maxLen = 160): string {
  // Prendre le début du contenu comme description
  const clean = article.contenu
    .replace(/\s+/g, " ")
    .replace(/\d+[°.]\s*/g, "")
    .trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", maxLen)) + "...";
}

export function getRomanNumeral(num: number): string {
  if (num === 1) return "Ier";
  const numerals: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let remaining = num;
  let result = "";
  for (const [value, symbol] of numerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}
