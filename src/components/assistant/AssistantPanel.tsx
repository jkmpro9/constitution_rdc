"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, MessageCircle, Loader2 } from "lucide-react";

function renderMarkdown(text: string) {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/^&gt;\\s?(.*)$/gm, '<blockquote class="border-l-2 border-rdc-blue-400 pl-2 italic text-rdc-blue-700 my-1">$1</blockquote>');

  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  html = html.replace(/^(\d+)\.\s+(.*)$/gm, '<li class="ml-4 list-decimal">$2</li>');
  html = html.replace(/^[-*]\s+(.*)$/gm, '<li class="ml-4 list-disc">$1</li>');

  html = html
    .split(/\n{2,}/)
    .map((p) => {
      p = p.trim();
      if (!p) return "";
      if (p.startsWith("<blockquote") || p.startsWith("<li")) return p;
      return `<p class="mb-2 last:mb-0">${p}</p>`;
    })
    .join("\n");

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
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-rdc-blue-200 overflow-hidden flex flex-col animate-slide-up max-h-[75vh]" role="dialog" aria-modal="true" aria-label="Assistant Constitution">
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-5 py-4 bg-gradient-to-r from-rdc-blue-700 to-rdc-blue-800 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-semibold block leading-tight">
                  Assistant Constitution
                </span>
                <span className="text-[10px] text-white/70">Assistant Constitution</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Fermer l’assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 min-h-[300px] max-h-[400px] bg-rdc-blue-50/20" aria-live="polite" aria-busy={isLoading}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === "user"
                      ? "bg-rdc-blue-100"
                      : "bg-rdc-yellow-100"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4 text-rdc-blue-700" />
                  ) : (
                    <Bot className="h-4 w-4 text-rdc-yellow-700" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-rdc-blue-700 text-white rounded-tr-md"
                      : "bg-white text-rdc-blue-900 rounded-tl-md border border-rdc-blue-100"
                  }`}
                >
                  <div
                    className={`prose prose-blue prose-sm max-w-none ${
                      msg.role === "user"
                        ? "text-white [&_strong]:text-white"
                        : "text-rdc-blue-900"
                    } [&_blockquote]:text-rdc-blue-700 [&_strong]:font-bold [&_p]:mb-2 [&_p:last-child]:mb-0 [&_li]:ml-5`}
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
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-rdc-yellow-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="h-4 w-4 text-rdc-yellow-700" />
                </div>
                <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-white border border-rdc-blue-100 text-sm flex items-center gap-2 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-rdc-blue-500" />
                  <span className="text-rdc-blue-500">Réflexion...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="shrink-0 border-t border-rdc-blue-100 bg-white px-4 py-3.5 flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pose une question sur la Constitution..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-rdc-blue-200 text-sm text-rdc-blue-950 placeholder:text-rdc-blue-400 bg-rdc-blue-50/40 focus:outline-none focus:ring-2 focus:ring-rdc-blue-500/30 focus:border-rdc-blue-500 focus:bg-white transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-rdc-blue-700 text-white hover:bg-rdc-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0"
              aria-label="Envoyer le message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
