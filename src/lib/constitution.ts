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
  preambule: string;
  titres: Titre[];
}

let cachedData: ConstitutionData | null = null;

/**
 * Charge et parse le fichier JSON de la Constitution depuis `/data.json`.
 * Utilise un cache interne pour éviter les appels réseau répétés.
 */
export async function getData(): Promise<ConstitutionData> {
  if (cachedData !== null) {
    return cachedData;
  }

  const response = await fetch("/data.json");

  if (!response.ok) {
    throw new Error(
      `Impossible de charger la Constitution: ${response.status} ${response.statusText}`,
    );
  }

  const data: ConstitutionData = await response.json();
  cachedData = data;
  return data;
}

/**
 * Retourne la liste de tous les titres de la Constitution.
 */
export async function getTitres(): Promise<Titre[]> {
  const data = await getData();
  return data.titres;
}

/**
 * Parcourt l'arbre complet (titres → chapitres → sections → articles)
 * et retourne l'article correspondant au numéro donné, ou `null` si introuvable.
 */
export async function getArticle(numero: number): Promise<Article | null> {
  const data = await getData();

  for (const titre of data.titres) {
    for (const chapitre of titre.chapitres) {
      // Articles directement dans le chapitre
      for (const article of chapitre.articles) {
        if (article.numero === numero) {
          return article;
        }
      }

      // Articles dans les sections du chapitre
      for (const section of chapitre.sections) {
        for (const article of section.articles) {
          if (article.numero === numero) {
            return article;
          }
        }
      }
    }
  }

  return null;
}

/**
 * Recherche full-text dans les champs `texte` et `contenu` de tous les articles.
 * La recherche est insensible à la casse et aux accents (normalisation NFKD).
 * Retourne les articles correspondants avec leur numéro de titre et de chapitre.
 */
export interface SearchResult {
  article: Article;
  titreNumero: number;
  titreNom: string;
  chapitreNumero: number;
  chapitreNom: string;
}

/**
 * Recherche full-text dans le texte et le contenu de tous les articles.
 * Insensible à la casse et aux accents.
 */
export async function searchArticles(query: string): Promise<SearchResult[]> {
  const data = await getData();
  const normalizedQuery = normalize(query);
  const results: SearchResult[] = [];

  for (const titre of data.titres) {
    for (const chapitre of titre.chapitres) {
      // Articles directement dans le chapitre
      for (const article of chapitre.articles) {
        if (matchesQuery(article, normalizedQuery)) {
          results.push({
            article,
            titreNumero: titre.numero,
            titreNom: titre.nom,
            chapitreNumero: chapitre.numero,
            chapitreNom: chapitre.nom,
          });
        }
      }

      // Articles dans les sections du chapitre
      for (const section of chapitre.sections) {
        for (const article of section.articles) {
          if (matchesQuery(article, normalizedQuery)) {
            results.push({
              article,
              titreNumero: titre.numero,
              titreNom: titre.nom,
              chapitreNumero: chapitre.numero,
              chapitreNom: chapitre.nom,
            });
          }
        }
      }
    }
  }

  return results;
}

/**
 * Normalise une chaîne : minuscules, élimine les accents et autres diacritiques.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Vérifie si la requête normalisée apparaît dans le texte ou le contenu de l'article.
 */
function matchesQuery(article: Article, normalizedQuery: string): boolean {
  const normalizedTexte = normalize(article.texte);
  const normalizedContenu = normalize(article.contenu);
  return (
    normalizedTexte.includes(normalizedQuery) ||
    normalizedContenu.includes(normalizedQuery)
  );
}

/**
 * Convertit un nombre en chiffre romain.
 * Cas particulier : 1 → "Ier", sinon "I", "II", "III", etc.
 * Supporte les valeurs de 1 à 3999.
 */
export function romanNumeral(num: number): string {
  if (num < 1 || num > 3999) {
    throw new Error(
      `Le nombre ${num} est en dehors de la plage supportée (1-3999)`,
    );
  }

  const numerals: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
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

  if (num === 1) {
    return "Ier";
  }

  return result;
}
