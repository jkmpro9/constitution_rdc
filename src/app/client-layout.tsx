"use client";

import { ReactNode, useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AssistantPanel from "@/components/assistant/AssistantPanel";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        // Vérifier les mises à jour à chaque navigation
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                // Nouveau SW installé — on recharge pour l'activer
                window.location.reload();
              }
            });
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-white">
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />
      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div id="mobile-navigation" className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation principale">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-slide-up overflow-y-auto" tabIndex={-1}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      {children}
      <AssistantPanel />
    </div>
  );
}
