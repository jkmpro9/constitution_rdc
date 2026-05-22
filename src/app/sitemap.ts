import { getConstitutionData } from "@/lib/constitution-server";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const data = getConstitutionData();
  const baseUrl = "https://constitution-rdc.cd";

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sections`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  // Chaque titre
  for (const t of data.titres) {
    entries.push({
      url: `${baseUrl}/titres/${t.numero}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });

    // Chaque article dans ce titre
    for (const ch of t.chapitres) {
      for (const a of ch.articles) {
        entries.push({
          url: `${baseUrl}/articles/${a.numero}`,
          lastModified: new Date(),
          changeFrequency: "yearly",
          priority: 0.6,
        });
      }
      for (const sec of ch.sections) {
        for (const a of sec.articles) {
          entries.push({
            url: `${baseUrl}/articles/${a.numero}`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.6,
          });
        }
      }
    }
  }

  return entries;
}
