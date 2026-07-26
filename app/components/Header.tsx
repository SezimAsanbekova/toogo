"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import LocaleSwitcher from "./LocaleSwitcher";
import { useT } from "../i18n/useT";

type CommonT = {
  logo: { country: string };
  nav: { locations: string; howItWorks: string; services: string };
  header: { forPartners: string; login: string; menuAriaLabel: string };
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const c = useT<CommonT>("common");

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg-secondary) 92%, transparent)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--accent)" }}>
            Too<span style={{ color: "var(--accent-light)" }}>Go</span>
          </span>
          <span
            className="hidden sm:inline text-xs font-medium tracking-widest uppercase mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            {c.logo.country}
          </span>
        </Link>

        {/* Nav */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          <Link href="/locations" className="transition-colors hover:text-[var(--accent)]">
            {c.nav.locations}
          </Link>
          <a href="#how-it-works" className="transition-colors hover:text-[var(--accent)]">
            {c.nav.howItWorks}
          </a>
          <a href="#services" className="transition-colors hover:text-[var(--accent)]">
            {c.nav.services}
          </a>
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <LocaleSwitcher />
          <ThemeToggle />
          <Link
            href="/partner"
            className="text-sm font-medium px-4 py-2 rounded-full border transition-all"
            style={{ color: "var(--accent)", borderColor: "var(--accent)" }}
          >
            {c.header.forPartners}
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-white px-4 py-2 rounded-full transition-all"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {c.header.login}
          </Link>
        </div>

        {/* Mobile burger */}
        <div className="md:hidden flex items-center gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
          <button
            className="transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={c.header.menuAriaLabel}
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
        <div
          className="md:hidden px-6 py-4 flex flex-col gap-4 text-sm font-medium transition-colors"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderTop: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <Link href="/locations" onClick={() => setMobileOpen(false)}>{c.nav.locations}</Link>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)}>{c.nav.howItWorks}</a>
          <a href="#services" onClick={() => setMobileOpen(false)}>{c.nav.services}</a>
          <div className="flex gap-3 pt-2">
            <Link
              href="/partner"
              className="flex-1 text-center px-4 py-2 rounded-full border"
              style={{ color: "var(--accent)", borderColor: "var(--accent)" }}
            >
              {c.header.forPartners}
            </Link>
            <Link
              href="/admin"
              className="flex-1 text-center text-white px-4 py-2 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {c.header.login}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
