"use client";

import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import AssistantPanel from "@/components/assistant/AssistantPanel";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {children}
      <AssistantPanel />
    </div>
  );
}
