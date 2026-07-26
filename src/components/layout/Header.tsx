"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";


interface HeaderProps {
  onToggleAssistant?: () => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleAssistant, sidebarOpen, onToggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rdc-blue-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo + bouton menu mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-rdc-blue-50 text-rdc-blue-700"
            aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={sidebarOpen}
            aria-controls="mobile-navigation"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Étoile du drapeau */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rdc-blue-700 group-hover:bg-rdc-blue-800 transition-colors">
              <Star className="h-4 w-4 text-rdc-yellow-400 fill-rdc-yellow-400" />
            </div>
            <div className="hidden sm:block">
              <span className="block text-sm font-bold text-rdc-blue-950 leading-tight">
                Constitution RDC
              </span>
              <p className="text-[10px] text-rdc-blue-500 leading-tight">
                République Démocratique du Congo
              </p>
            </div>
          </Link>
        </div>

        {/* Barre de recherche (desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rdc-blue-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-rdc-blue-200 bg-rdc-blue-50/50 text-sm text-rdc-blue-950 placeholder:text-rdc-blue-400 focus:outline-none focus:ring-2 focus:ring-rdc-blue-500/30 focus:border-rdc-blue-500 transition-all"
            />
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search mobile */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-rdc-blue-50 text-rdc-blue-700"
            aria-label="Rechercher"
          >
            <Search className="h-5 w-5" />
          </button>


        </div>
      </div>

      {/* Barre de recherche mobile */}
      {searchOpen && (
        <div className="md:hidden border-t border-rdc-blue-100 px-4 py-3 bg-white animate-fade-in">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rdc-blue-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-rdc-blue-200 bg-rdc-blue-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-rdc-blue-500/30"
            />
          </form>
        </div>
      )}

      {/* Bandeau tricolore RDC */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-rdc-blue-700" />
        <div className="flex-1 bg-rdc-yellow-500" />
        <div className="flex-1 bg-rdc-red-500" />
      </div>
    </header>
  );
}
