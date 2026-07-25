"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LOCATIONS, difficultyLabel, seasonLabel, type Difficulty } from "../data/locations";

const DIFFICULTIES: { value: Difficulty | "all"; label: string }[] = [
  { value: "all",    label: "Все" },
  { value: "easy",   label: "Лёгкий" },
  { value: "medium", label: "Средний" },
  { value: "hard",   label: "Сложный" },
];

export default function LocationsPage() {
  return (
    <Suspense>
      <LocationsContent />
    </Suspense>
  );
}

function LocationsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch]   = useState(searchParams.get("q") ?? "");
  const [difficulty, setDiff] = useState<Difficulty | "all">("all");
  const [maxDist, setMaxDist] = useState<number>(1000);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return LOCATIONS.filter((loc) => {
      const matchName = loc.name.toLowerCase().includes(search.toLowerCase()) ||
                        loc.region.toLowerCase().includes(search.toLowerCase());
      const matchDiff = difficulty === "all" || loc.difficulty === difficulty;
      const matchDist = loc.distance <= maxDist;
      return matchName && matchDiff && matchDist;
    });
  }, [search, difficulty, maxDist]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 transition-colors duration-300"
        style={{ backgroundColor: "var(--bg-primary)" }}>

        {/* Page header */}
        <div className="py-12 px-6" style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              <Link href="/" className="hover:underline" style={{ color: "var(--accent-light)" }}>Главная</Link>
              <span>/</span>
              <span>Локации</span>
            </div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Все локации
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              {LOCATIONS.length} горных мест Кыргызстана
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8 p-5 rounded-2xl"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>

            {/* Search */}
            <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)" }}>
              <svg className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Поиск по названию или области..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "var(--text-primary)" }}
              />
            </div>

            {/* Difficulty */}
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button key={d.value}
                  onClick={() => setDiff(d.value)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: difficulty === d.value ? "var(--accent)" : "var(--bg-primary)",
                    color: difficulty === d.value ? "#fff" : "var(--text-secondary)",
                    border: `1px solid ${difficulty === d.value ? "var(--accent)" : "var(--border)"}`,
                  }}>
                  {d.label}
                </button>
              ))}
            </div>

            {/* Distance */}
            <div className="flex items-center gap-3">
              <span className="text-sm whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                До {maxDist} км
              </span>
              <input type="range" min={50} max={1000} step={50} value={maxDist}
                onChange={(e) => setMaxDist(Number(e.target.value))}
                className="w-28 accent-[var(--accent)]"
              />
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Найдено: <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{filtered.length}</span> локаций
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🏔️</div>
              <p className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Ничего не найдено</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Попробуйте изменить фильтры</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((loc) => (
                <Link key={loc.id} href={`/locations/${loc.id}`}
                  className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img src={loc.image} alt={loc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>

                    {loc.isPopular && (
                      <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#a8c97f] text-[#1a2a1a]">
                        Популярное
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
                      {loc.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-white/15 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-base leading-tight" style={{ color: "var(--text-primary)" }}>
                          {loc.name}
                        </h3>
                        <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          {loc.region}
                        </p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full shrink-0"
                        style={{ backgroundColor: difficultyLabel[loc.difficulty].bg, color: difficultyLabel[loc.difficulty].text }}>
                        {difficultyLabel[loc.difficulty].label}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                      {loc.description}
                    </p>

                    <div className="flex items-center justify-between pt-3"
                      style={{ borderTop: "1px solid var(--border)" }}>
                      <div className="flex gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                          </svg>
                          {loc.distance} км
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          {loc.travelTime}
                        </span>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "var(--accent-light)" }}>
                        Подробнее →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
