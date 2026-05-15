"use client";

import { ReactNode, useEffect } from "react";
import Header from "@/components/layout/Header";
import AssistantPanel from "@/components/assistant/AssistantPanel";

export default function ClientLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {children}
      <AssistantPanel />
    </div>
  );
}
