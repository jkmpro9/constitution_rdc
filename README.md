# 🇨🇩 Constitution de la RDC

**Plateforme web gratuite** pour consulter la Constitution de la République Démocratique du Congo, modifiée par la Loi n° 11/002 du 20 janvier 2011.

> 👉 **[constitution-rdc.cd](https://constitution-rdc.cd)**

---

## ✨ Fonctionnalités

| | |
|---|---|
| 🔍 **Recherche intelligente** | Trouvez n'importe quel article ou mot-clé en un instant |
| 📖 **Navigation complète** | 229 articles structurés en 8 titres et 14 chapitres |
| 💬 **Assistant IA** | Posez vos questions, l'assistant DeepSeek répond en citant les articles |
| 📱 **PWA hors-ligne** | Fonctionne sans connexion internet après le premier chargement |
| 🌐 **Responsive** | Adapté mobile, tablette et desktop |
| 🎨 **Thème DRC** | Design aux couleurs du drapeau congolais 🇨🇩 |

---

## 🏗️ Stack technique

- **[Next.js 14](https://nextjs.org/)** — App Router + TypeScript
- **[Tailwind CSS](https://tailwindcss.com/)** — Styling utilitaire
- **[shadcn/ui](https://ui.shadcn.com/)** — Composants UI
- **[DeepSeek API](https://deepseek.com/)** — Assistant IA
- **[Easypanel](https://easypanel.io/)** — Hébergement (Docker)
- **[Cloudflare](https://cloudflare.com/)** — DNS + SSL

---

## 🚀 Déploiement local

```bash
# Cloner
git clone https://github.com/jkmpro9/constitution_rdc.git
cd constitution_rdc

# Installer
npm install

# Variables d'environnement
cp .env.example .env.local
# → Ajouter DEEPSEEK_API_KEY

# Lancer (dev)
npm run dev

# Build (production)
npm run build
npm start
```

---

## 📁 Structure

```
src/
├── app/
│   ├── articles/[numero]/   # Pages articles (1-229)
│   ├── titres/[numero]/     # Pages titres (1-8)
│   ├── sections/            # Vue d'ensemble
│   ├── recherche/           # Recherche
│   └── api/chat/            # API DeepSeek
├── components/
│   ├── layout/              # Header, Sidebar
│   └── assistant/           # AssistantPanel IA
└── lib/
    ├── constitution.ts      # Données + helpers
    └── preambule.ts         # Texte du préambule
```

---

## 👨‍💻 Auteur

**Jeancy Mungedi** — [COCCINELLE SARL](https://coccinelledrc.com)

---

## 📄 Licence

Ce projet est libre et gratuit. La Constitution de la RDC est un document public. L'interface et le code sont mis à disposition pour le bien commun.
