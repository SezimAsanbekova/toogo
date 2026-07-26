"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "../i18n/context";
import { LOCALES, LOCALE_NAMES, LOCALE_FLAGS } from "../i18n/types";

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
        style={{
          backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
        }}
      >
        <span>{LOCALE_FLAGS[locale]}</span>
        <span className="uppercase tracking-wide text-xs">{locale}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden shadow-lg z-50 min-w-[140px]"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => { setLocale(l); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{
                color: l === locale ? "var(--accent-light)" : "var(--text-primary)",
                fontWeight: l === locale ? 600 : 400,
              }}
            >
              <span>{LOCALE_FLAGS[l]}</span>
              <span>{LOCALE_NAMES[l]}</span>
              {l === locale && (
                <svg className="w-3.5 h-3.5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
