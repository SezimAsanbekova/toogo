"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={{ backgroundColor: "color-mix(in srgb, var(--bg-secondary) 92%, transparent)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--accent)" }}>
            Too<span style={{ color: "var(--accent-light)" }}>Go</span>
          </span>
          <span className="hidden sm:inline text-xs font-medium tracking-widest uppercase mt-1" style={{ color: "var(--text-muted)" }}>
            Кыргызстан
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          <a href="#locations" className="transition-colors hover:text-[var(--accent)]">Локации</a>
          <a href="#how-it-works" className="transition-colors hover:text-[var(--accent)]">Как это работает</a>
          <a href="#services" className="transition-colors hover:text-[var(--accent)]">Услуги</a>
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/partner"
            className="text-sm font-medium px-4 py-2 rounded-full border transition-all"
            style={{ color: "var(--accent)", borderColor: "var(--accent)" }}
          >
            Партнёрам
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-white px-4 py-2 rounded-full transition-all"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Войти
          </Link>
        </div>

        {/* Mobile burger */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            className="transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-4 text-sm font-medium transition-colors"
          style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border)", color: "var(--text-secondary)" }}
        >
          <a href="#locations" onClick={() => setMobileOpen(false)}>Локации</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)}>Как это работает</a>
          <a href="#services" onClick={() => setMobileOpen(false)}>Услуги</a>
          <div className="flex gap-3 pt-2">
            <Link href="/partner" className="flex-1 text-center px-4 py-2 rounded-full border"
              style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
              Партнёрам
            </Link>
            <Link href="/admin" className="flex-1 text-center text-white px-4 py-2 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}>
              Войти
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
