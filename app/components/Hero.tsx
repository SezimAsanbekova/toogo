"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT } from "../i18n/useT";
import { useAllLocationsTranslated } from "../i18n/useLocationData";

type HeroT = {
  hero: {
    badge: string;
    title1: string; title2: string; title3: string;
    subtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    randomPick: string;
    scrollHint: string;
    searchEmpty: string;
    searchCount: string;
    searchCountSuffix: string;
    stats: { locations: string; regions: string; partners: string; tourists: string };
  };
};

export default function Hero() {
  const [query, setQuery] = useState("");
  const [open, setOpen]   = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useT<HeroT>("landing");
  const h = t.hero;
  const allLocations = useAllLocationsTranslated();

  const filtered = allLocations.filter((loc) =>
    loc.name.toLowerCase().includes(query.toLowerCase()) ||
    loc.region.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = () => {
    router.push(`/locations${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  const handleRandomPick = () => {
    const random = allLocations[Math.floor(Math.random() * allLocations.length)];
    setQuery(random.name);
    setOpen(false);
  };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const STATS = [
    { value: "50+",  label: h.stats.locations },
    { value: "7",    label: h.stats.regions },
    { value: "200+", label: h.stats.partners },
    { value: "10K+", label: h.stats.tourists },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 dark:from-black/85 dark:via-black/70 dark:to-black/90" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="max-w-3xl">

          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/70 text-xs font-medium px-3 py-1.5 rounded-full mb-8 border border-white/15 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a8c97f] animate-pulse" />
            {h.badge}
          </span>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8 uppercase">
            {h.title1}
            <br />
            <span className="text-[#a8c97f]">{h.title2}</span>
            <br />
            {h.title3}
          </h1>

          <p className="text-base md:text-lg text-white/60 leading-relaxed mb-10 max-w-md">
            {h.subtitle}
          </p>

          {/* Search */}
          <div className="max-w-xl mb-8" ref={wrapperRef}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="flex items-center rounded-2xl px-5 py-4 gap-3 border border-white/20 bg-white/10 backdrop-blur-md dark:bg-black/30 dark:border-white/10">
                  <svg className="w-5 h-5 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={query}
                    placeholder={h.searchPlaceholder}
                    className="flex-1 outline-none bg-transparent text-white placeholder-white/40 text-base"
                    onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => { if (query) setOpen(true); }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                  />
                  {query && (
                    <button
                      onClick={() => { setQuery(""); setOpen(false); }}
                      className="text-white/40 hover:text-white/70 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Dropdown */}
                {open && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden shadow-2xl z-50"
                    style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                  >
                    {filtered.length === 0 ? (
                      <div className="px-5 py-4 text-sm" style={{ color: "var(--text-muted)" }}>
                        {h.searchEmpty}
                      </div>
                    ) : (
                      <ul>
                        {filtered.map((loc, i) => (
                          <li key={loc.id}>
                            <button
                              className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                              onClick={() => { setQuery(loc.name); setOpen(false); }}
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
                              >
                                <svg className="w-4 h-4" style={{ color: "var(--accent-light)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{loc.name}</p>
                                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{loc.region}</p>
                              </div>
                            </button>
                            {i < filtered.length - 1 && (
                              <div className="mx-5" style={{ borderBottom: "1px solid var(--border)" }} />
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div
                      className="px-5 py-2.5 border-t text-xs"
                      style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                    >
                      {filtered.length} {h.searchCount} {allLocations.length} {h.searchCountSuffix}
                    </div>
                  </div>
                )}
              </div>

              <button
                className="font-semibold px-8 py-4 rounded-2xl transition-all text-white hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "var(--accent)" }}
                onClick={handleSearch}
              >
                {h.searchButton}
              </button>
            </div>
          </div>

          {/* Random pick */}
          <button
            onClick={handleRandomPick}
            className="group flex items-center gap-3 border border-white/20 hover:border-white/40 text-white/70 hover:text-white px-6 py-3 rounded-full transition-all text-sm"
          >
            <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {h.randomPick}
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-10 mt-20 pt-8 border-t border-white/15">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-bold text-white tracking-tight">{stat.value}</div>
              <div className="text-xs text-white/40 mt-1 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-[10px] tracking-widest uppercase">{h.scrollHint}</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-bounce" />
      </div>
    </section>
  );
}
