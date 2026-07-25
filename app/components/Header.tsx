"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#3d5a3e] tracking-tight">
            Too<span className="text-[#7a9e5f]">Go</span>
          </span>
          <span className="hidden sm:inline text-xs text-stone-400 font-medium tracking-widest uppercase mt-1">
            Кыргызстан
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <a href="#locations" className="hover:text-[#3d5a3e] transition-colors">Локации</a>
          <a href="#how-it-works" className="hover:text-[#3d5a3e] transition-colors">Как это работает</a>
          <a href="#services" className="hover:text-[#3d5a3e] transition-colors">Услуги</a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/partner"
            className="text-sm font-medium text-[#3d5a3e] border border-[#3d5a3e] px-4 py-2 rounded-full hover:bg-[#3d5a3e] hover:text-white transition-all"
          >
            Партнёрам
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-white bg-[#3d5a3e] px-4 py-2 rounded-full hover:bg-[#2d4330] transition-all"
          >
            Войти
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-stone-600"
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-6 py-4 flex flex-col gap-4 text-sm font-medium text-stone-600">
          <a href="#locations" onClick={() => setMobileOpen(false)} className="hover:text-[#3d5a3e]">Локации</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="hover:text-[#3d5a3e]">Как это работает</a>
          <a href="#services" onClick={() => setMobileOpen(false)} className="hover:text-[#3d5a3e]">Услуги</a>
          <div className="flex gap-3 pt-2">
            <Link href="/partner" className="flex-1 text-center text-[#3d5a3e] border border-[#3d5a3e] px-4 py-2 rounded-full">
              Партнёрам
            </Link>
            <Link href="/admin" className="flex-1 text-center text-white bg-[#3d5a3e] px-4 py-2 rounded-full">
              Войти
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
