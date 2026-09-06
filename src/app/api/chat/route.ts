import { NextRequest, NextResponse } from "next/server";

// API DeepSeek (OpenAI-compatible) — remplace Ollama Cloud dont l'accès
// gratuit a été supprimé (HTTP 402/403 "requires a subscription").
// La clé est injectée via la variable d'environnement DEEPSEEK_API_KEY
// (configurée dans Easypanel) — jamais commitée dans le repo.
const LLM_API_URL = "https://api.deepseek.com/chat/completions";
const LLM_API_KEY = process.env.DEEPSEEK_API_KEY ?? "";
const LLM_MODEL = "deepseek-v4-flash";

const UNAVAILABLE_MESSAGE =
  "😔 Désolé, l'assistant n'est pas disponible pour l'instant. Prière de revenir plus tard.";

const SYSTEM_PROMPT = `Tu es un assistant spécialisé dans la Constitution de la République Démocratique du Congo.

Tu aides les utilisateurs à comprendre la Constitution de la RDC (modifiée par la Loi n° 11/002 du 20 janvier 2011).

Règles :
1. Base toujours tes réponses sur le texte de la Constitution.
2. Cite les articles pertinents quand c'est possible (ex: "Selon l'Article 1...").
3. Si tu ne connais pas la réponse, dis-le honnêtement.
4. Réponds en français clair et accessible.
5. Tu peux donner le contexte historique ou explicatif quand nécessaire.
6. Reste neutre et objectif — tu es un guide, pas un militant.
7. **LIMITATION STRICTE** : Tu ne réponds qu'aux questions sur la Constitution de la RDC, le droit constitutionnel congolais, les institutions politiques de la RDC, et l'histoire politique congolaise en lien avec la Constitution. Pour toute question hors de ce cadre, réponds : "😔 Désolé, je suis un assistant spécialisé uniquement sur la Constitution de la RDC. Je ne peux pas répondre à cette question. Pose-moi une question sur la Constitution congolaise !"
8. Ne parle pas d'autres constitutions (France, USA, etc.) sauf pour faire une comparaison brève et utile. Ne donne pas d'avis politiques personnels. Ne fais pas de prédictions. Ne donne pas de conseils juridiques engageants.

La Constitution compte 229 articles répartis en 8 titres :
- Titre I : Des dispositions générales
- Titre II : Des droits humains, des libertés fondamentales et des devoirs du citoyen
- Titre III : De l'organisation et de l'exercice du pouvoir
- Titre IV : Des provinces
- Titre V : Du pouvoir judiciaire
- Titre VI : Des institutions d'appui à la démocratie
- Titre VII : De la révision de la Constitution
- Titre VIII : Des dispositions transitoires et finales`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!LLM_API_KEY) {
      console.error(
        "Assistant API error: DEEPSEEK_API_KEY non définie (variable d'environnement manquante)"
      );
      return NextResponse.json(
        {
          choices: [
            {
              message: { role: "assistant", content: UNAVAILABLE_MESSAGE },
            },
          ],
        },
        { status: 200 }
      );
    }

    const response = await fetch(LLM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-10), // garder les 10 derniers messages
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LLM API error:", response.status, errorText);
      return NextResponse.json(
        {
          choices: [
            {
              message: { role: "assistant", content: UNAVAILABLE_MESSAGE },
            },
          ],
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Assistant API error:", error);
    return NextResponse.json(
      {
        choices: [
          {
            message: {
              role: "assistant",
              content: UNAVAILABLE_MESSAGE,
            },
          },
        ],
      },
      { status: 200 }
    );
  }
}
