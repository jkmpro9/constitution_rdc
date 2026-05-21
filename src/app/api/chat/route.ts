import { NextRequest, NextResponse } from "next/server";

const OLLAMA_API_KEY = "7cd43d6cdb4849c5b139fe0bf830d9ed.177oYbFG8GgjSb-9qpS19YVE";
const OLLAMA_API_URL = "https://ollama.com/v1/chat/completions";

const SYSTEM_PROMPT = `Tu es un assistant spécialisé dans la Constitution de la République Démocratique du Congo.

Tu aides les utilisateurs à comprendre la Constitution de la RDC (modifiée par la Loi n° 11/002 du 20 janvier 2011).

Règles :
1. Base toujours tes réponses sur le texte de la Constitution.
2. Cite les articles pertinents quand c'est possible (ex: "Selon l'Article 1...").
3. Si tu ne connais pas la réponse, dis-le honnêtement.
4. Réponds en français clair et accessible.
5. Tu peux donner le contexte historique ou explicatif quand nécessaire.
6. Reste neutre et objectif — tu es un guide, pas un militant.

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

    const response = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OLLAMA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash:cloud",
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
      console.error("Ollama Cloud API error:", response.status, errorText);
      return NextResponse.json(
        {
          choices: [
            {
              message: {
                role: "assistant",
                content:
                  "😔 Désolé, l'assistant n'est pas disponible pour l'instant. Prière de revenir plus tard.",
              },
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
              content:
                "😔 Désolé, l'assistant n'est pas disponible pour l'instant. Prière de revenir plus tard.",
            },
          },
        ],
      },
      { status: 200 }
    );
  }
}
