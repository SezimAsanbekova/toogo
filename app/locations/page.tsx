"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { difficultyLabel, type Difficulty } from "../data/locations";
import { useT } from "../i18n/useT";

type CatalogT = {
  catalog: {
    breadcrumbHome: string;
    breadcrumbCurrent: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    distanceLabel: string;
    distanceSuffix: string;
    resultsFound: string;
    resultsLocations: string;
    popular: string;
    details: string;
    empty: { title: string; hint: string };
  };
};

type CommonT = {
  difficulty: { easy: string; medium: string; hard: string };
};

interface DbLocation {
  id: string;
  name: string;
  region: string;
  description: string;
  altitude: number;
  distance: number;
  travelTime: string;
  difficulty: Difficulty;
  visitPrice: number;
  bestSeason: string;
  recommendations: string;
  isPopular: boolean;
  latitude: number;
  longitude: number;
  image: string;
  images: string[];
}

export default function LocationsPage() {
  return (
    <Suspense>
      <LocationsContent />
    </Suspense>
  );
}

function LocationsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [difficulty, setDiff] = useState<Difficulty | "all">("all");
  const [maxDist, setMaxDist] = useState<number>(1000);
  const [allLocations, setAllLocations] = useState<DbLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const loc = useT<CatalogT>("locations").catalog;
  const common = useT<CommonT>("common");

  // Load from DB
  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then((data) => { setAllLocations(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const DIFFICULTIES: { value: Difficulty | "all"; label: string }[] = [
    { value: "all",    label: loc.filterAll },
    { value: "easy",   label: common.difficulty.easy },
    { value: "medium", label: common.difficulty.medium },
    { value: "hard",   label: common.difficulty.hard },
  ];

  const filtered = useMemo(() => {
    return allLocations.filter((l) => {
      const matchName = l.name.toLowerCase().includes(search.toLowerCase()) ||
                        l.region.toLowerCase().includes(search.toLowerCase());
      const matchDiff = difficulty === "all" || l.difficulty === difficulty;
      const matchDist = l.distance <= maxDist;
      return matchName && matchDiff && matchDist;
    });
  }, [search, difficulty, maxDist, allLocations]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 transition-colors duration-300"
        style={{ backgroundColor: "var(--bg-primary)" }}>

        {/* Page header */}
        <div className="py-12 px-6"
          style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              <Link href="/" className="hover:underline" style={{ color: "var(--accent-light)" }}>
                {loc.breadcrumbHome}
              </Link>
              <span>/</span>
              <span>{loc.breadcrumbCurrent}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              {loc.title}
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              {allLocations.length} {loc.subtitle}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8 p-5 rounded-2xl"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>

            <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)" }}>
              <svg className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={loc.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "var(--text-primary)" }}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
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

            <div className="flex items-center gap-3">
              <span className="text-sm whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                {loc.distanceLabel} {maxDist} {loc.distanceSuffix}
              </span>
              <input type="range" min={50} max={1000} step={50} value={maxDist}
                onChange={(e) => setMaxDist(Number(e.target.value))}
                className="w-28" />
            </div>
          </div>

          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            {loc.resultsFound}{" "}
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {filtered.length}
            </span>{" "}
            {loc.resultsLocations}
          </p>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-24">
              <svg className="animate-spin w-8 h-8" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🏔️</div>
              <p className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                {loc.empty.title}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{loc.empty.hint}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((location) => (
                <Link key={location.id} href={`/locations/${location.id}`}
                  className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>

                  <div className="relative h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={location.image} alt={location.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {location.isPopular && (
                      <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#a8c97f] text-[#1a2a1a]">
                        {loc.popular}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-base leading-tight" style={{ color: "var(--text-primary)" }}>
                          {location.name}
                        </h3>
                        <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {location.region}
                        </p>
                      </div>
                      {location.difficulty && difficultyLabel[location.difficulty] && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full shrink-0"
                          style={{
                            backgroundColor: difficultyLabel[location.difficulty].bg,
                            color: difficultyLabel[location.difficulty].text,
                          }}>
                          {common.difficulty[location.difficulty]}
                        </span>
                      )}
                    </div>

                    <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                      {location.description}
                    </p>

                    <div className="flex items-center justify-between pt-3"
                      style={{ borderTop: "1px solid var(--border)" }}>
                      <div className="flex gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        {location.distance > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            {location.distance} {loc.distanceSuffix}
                          </span>
                        )}
                        {location.travelTime && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {location.travelTime}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "var(--accent-light)" }}>
                        {loc.details}
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
