"use client";

import Link from "next/link";
import { useT } from "../i18n/useT";
import { difficultyLabel } from "../data/locations";
import { useAllLocationsTranslated } from "../i18n/useLocationData";

type PopularT = {
  popularLocations: { badge: string; title: string; subtitle: string; allLocations: string; details: string };
};

export default function PopularLocations() {
  const t = useT<PopularT>("landing");
  const p = t.popularLocations;
  const allLocations = useAllLocationsTranslated();
  const popular = allLocations.filter((l) => l.isPopular);

  return (
    <section id="locations" className="py-24 transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3"
              style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent-light)" }}>
              {p.badge}
            </span>
            <h2 className="text-4xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
              {p.title}
            </h2>
            <p className="mt-2 text-base" style={{ color: "var(--text-secondary)" }}>{p.subtitle}</p>
          </div>
          <Link href="/locations"
            className="self-start sm:self-auto text-sm font-medium flex items-center gap-1 transition-colors"
            style={{ color: "var(--accent-light)" }}>
            {p.allLocations}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popular.map((loc) => (
            <Link key={loc.id} href={`/locations/${loc.id}`}
              className="group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--card-shadow)", border: "1px solid var(--border)" }}>

              <div className="relative h-56 overflow-hidden">
                <img src={loc.image} alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                  {loc.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-white/15 backdrop-blur-sm text-white px-2.5 py-1 rounded-full border border-white/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{loc.name}</h3>
                    <p className="text-sm mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {loc.region}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                    style={{ backgroundColor: difficultyLabel[loc.difficulty].bg, color: difficultyLabel[loc.difficulty].text }}>
                    {difficultyLabel[loc.difficulty].label}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      {loc.distance} км
                    </span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--accent-light)" }}>
                    {p.details} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
