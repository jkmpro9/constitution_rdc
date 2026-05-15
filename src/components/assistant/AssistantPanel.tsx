"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, MessageCircle, Loader2 } from "lucide-react";

function renderMarkdown(text: string) {
  // Échapper les balises HTML
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Citations en bloc (> texte)
  html = html.replace(/^&gt;\s?(.*)$/gm, '<blockquote class="border-l-2 border-rdc-blue-400 pl-2 italic text-rdc-blue-700 my-1">$1</blockquote>');

  // Gras **texte**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italique *texte*
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Listes numérotées (1. texte)
  html = html.replace(/^(\d+)\.\s+(.*)$/gm, '<li class="ml-4 list-decimal">$2</li>');

  // Listes à puces (- texte ou * texte)
  html = html.replace(/^[-*]\s+(.*)$/gm, '<li class="ml-4 list-disc">$1</li>');

  // Sauts de ligne doubles → paragraphe
  html = html
    .split(/\n{2,}/)
    .map((p) => {
      p = p.trim();
      if (!p) return "";
      // Si le paragraphe est déjà un blockquote ou du HTML de liste, ne pas l'envelopper
      if (p.startsWith("<blockquote") || p.startsWith("<li")) return p;
      return `<p class="mb-2 last:mb-0">${p}</p>`;
    })
    .join("\n");

  // Sauts de ligne simples → <br />
  html = html.replace(/\n/g, "<br />");

  return html;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AssistantPanel({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Bonjour ! Je suis l'assistant Constitution RDC. Pose-moi des questions sur la Constitution congolaise, ses articles, ou son fonctionnement.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;

      if (reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Désolé, je n'ai pas pu traiter ta demande. Réessaie.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Erreur de connexion. Vérifie que le serveur est en marche.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Bubble flottante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-rdc-blue-700 text-white shadow-lg shadow-rdc-blue-700/30 hover:bg-rdc-blue-800 transition-all hover:scale-105 flex items-center justify-center"
        aria-label="Assistant Constitution"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Panneau de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-rdc-blue-100 overflow-hidden flex flex-col animate-slide-up max-h-[70vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-rdc-blue-700 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="text-sm font-semibold">
                Assistant Constitution
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-rdc-blue-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[350px] max-h-[450px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user"
                      ? "bg-rdc-blue-100"
                      : "bg-rdc-yellow-100"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-3.5 w-3.5 text-rdc-blue-700" />
                  ) : (
                    <Bot className="h-3.5 w-3.5 text-rdc-yellow-700" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-rdc-blue-700 text-white rounded-tr-sm"
                      : "bg-rdc-blue-50 text-rdc-blue-900 rounded-tl-sm"
                  }`}
                >
                  <div
                    className="prose prose-blue prose-sm max-w-none text-rdc-blue-900 [&_blockquote]:text-rdc-blue-700 [&_strong]:font-bold [&_p]:mb-2 [&_p:last-child]:mb-0 [&_li]:ml-5"
                    dangerouslySetInnerHTML={{
                      __html: msg.role === "assistant"
                        ? renderMarkdown(msg.content)
                        : msg.content,
                    }}
                  />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-rdc-yellow-100 flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5 text-rdc-yellow-700" />
                </div>
                <div className="max-w-[80%] px-3 py-2 rounded-xl bg-rdc-blue-50 text-xs flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-rdc-blue-500" />
                  Réflexion...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="border-t border-rdc-blue-100 p-3 flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pose une question sur la Constitution..."
              className="flex-1 px-3 py-2 rounded-lg border border-rdc-blue-200 text-xs text-rdc-blue-950 placeholder:text-rdc-blue-400 focus:outline-none focus:ring-2 focus:ring-rdc-blue-500/30 focus:border-rdc-blue-500 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-lg bg-rdc-blue-700 text-white hover:bg-rdc-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
