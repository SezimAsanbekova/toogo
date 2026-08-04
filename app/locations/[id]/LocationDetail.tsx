"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { difficultyLabel } from "../../data/locations";
import { useT } from "../../i18n/useT";

type DetailT = {
  detail: {
    backButton: string;
    popular: string;
    aboutTitle: string;
    recommendationsTitle: string;
    mapTitle: string;
    mapRouteLink: string;
    servicesNearby: string;
    infoTitle: string;
    infoDistance: string;
    infoTravelTime: string;
    infoAltitude: string;
    infoSeason: string;
    infoPrice: string;
    infoFree: string;
    infoPriceSuffix: string;
    infoAltitudeSuffix: string;
    infoDistanceSuffix: string;
    infoDifficulty: string;
    weatherTitle: string;
    weatherCondition: string;
    weatherWind: string;
    weatherWindSuffix: string;
    tagsTitle: string;
    services: string[];
  };
};

type CommonT = {
  difficulty: { easy: string; medium: string; hard: string };
  season: { spring: string; summer: string; autumn: string; winter: string; all_year: string };
};

// Иконки по названию категории (fallback если в БД нет emoji)
const CATEGORY_ICONS: Record<string, string> = {
  "Гиды":             "🧭",
  "Трансфер":         "🚗",
  "Жильё":            "🏠",
  "Юрта":             "⛺",
  "Кемпинг":          "🏕️",
  "Конные прогулки":  "🐎",
  "Кафе":             "☕",
  "Снаряжение":       "🎒",
  "Фотограф":         "📸",
  "Лодки":            "🚣",
  "Лыжи":             "⛷️",
  "Скалолазание":     "🧗",
  "Рыбалка":          "🎣",
  "Квадроцикл":       "🏍️",
  "Вертолёт":         "🚁",
};

interface DbService {
  id: string;
  title: string;
  category: string;
  categoryIcon: string;
  price: number | null;
  currency: string;
  partner: string;
  phone: string;
  telegram: string;
}

interface DbCategory {
  id: number;
  name: string;
  icon: string;
}

interface DbLocation {
  id: string;
  name: string;
  region: string;
  description: string;
  altitude: number;
  distance: number;
  travelTime: string;
  difficulty: "easy" | "medium" | "hard";
  visitPrice: number;
  bestSeason: string;
  recommendations: string;
  isPopular: boolean;
  latitude: number;
  longitude: number;
  image: string;
  images: string[];
  services: DbService[];
}

export default function LocationDetail({ loc, allCategories }: { loc: DbLocation; allCategories: DbCategory[] }) {
  const t = useT<DetailT>("locations").detail;
  const common = useT<CommonT>("common");
  const diff = difficultyLabel[loc.difficulty] ?? difficultyLabel.easy;

  const SEASON_LABELS: Record<string, string> = {
    spring: common.season.spring,
    summer: common.season.summer,
    autumn: common.season.autumn,
    winter: common.season.winter,
    all_year: common.season.all_year,
  };

  const infoRows = [
    ...(loc.distance > 0 ? [{
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>,
      label: t.infoDistance,
      value: `${loc.distance} ${t.infoDistanceSuffix}`,
    }] : []),
    ...(loc.travelTime ? [{
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>,
      label: t.infoTravelTime,
      value: loc.travelTime,
    }] : []),
    ...(loc.altitude > 0 ? [{
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>,
      label: t.infoAltitude,
      value: `${loc.altitude} ${t.infoAltitudeSuffix}`,
    }] : []),
    ...(loc.bestSeason ? [{
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>,
      label: t.infoSeason,
      value: SEASON_LABELS[loc.bestSeason] ?? loc.bestSeason,
    }] : []),
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>,
      label: t.infoPrice,
      value: loc.visitPrice === 0 ? t.infoFree : `${loc.visitPrice} ${t.infoPriceSuffix}`,
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 transition-colors duration-300"
        style={{ backgroundColor: "var(--bg-primary)" }}>

        {/* Hero */}
        <div className="relative h-[55vh] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={loc.images[0]} alt={loc.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute top-6 left-6">
            <Link href="/locations"
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.backButton}
            </Link>
          </div>

          <div className="absolute bottom-8 left-0 right-0 px-6">
            <div className="max-w-7xl mx-auto">
              {loc.isPopular && (
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#a8c97f] text-[#1a2a1a] mb-3">
                  {t.popular}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{loc.name}</h1>
              <p className="text-white/70 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {loc.region}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">

              {loc.description && (
                <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                  <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>{t.aboutTitle}</h2>
                  <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>{loc.description}</p>
                </div>
              )}

              {loc.recommendations && (
                <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                  <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <svg className="w-5 h-5" style={{ color: "var(--accent-light)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t.recommendationsTitle}
                  </h2>
                  <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>{loc.recommendations}</p>
                </div>
              )}

              {/* Map */}
              {loc.latitude !== 0 && loc.longitude !== 0 && (
                <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                  <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>{t.mapTitle}</h2>
                  <div className="rounded-xl overflow-hidden h-72">
                    <iframe
                      width="100%" height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${loc.longitude - 0.3}%2C${loc.latitude - 0.2}%2C${loc.longitude + 0.3}%2C${loc.latitude + 0.2}&layer=mapnik&marker=${loc.latitude}%2C${loc.longitude}`}
                    />
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: "var(--accent-light)" }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    {t.mapRouteLink}
                  </a>
                </div>
              )}

              {/* Service categories + location services */}
              <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <h2 className="text-lg font-bold mb-5" style={{ color: "var(--text-primary)" }}>{t.servicesNearby}</h2>

                {/* All categories grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                  {allCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/locations/${loc.id}/services/${cat.id}`}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                      style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs font-medium leading-tight" style={{ color: "var(--text-secondary)" }}>{cat.name}</span>
                    </Link>
                  ))}
                </div>

                {/* Divider */}
                <div className="mb-5" style={{ borderTop: "1px solid var(--border)" }} />

                {loc.services.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {loc.services.map((s) => (
                      <div key={s.id}
                        className="flex items-start gap-3 p-4 rounded-xl"
                        style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl"
                          style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
                          {s.categoryIcon || CATEGORY_ICONS[s.category] || "🏔️"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{s.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.category}</p>
                          <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{s.partner}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {s.price != null && (
                            <p className="text-sm font-bold" style={{ color: "var(--accent-light)" }}>
                              {s.price.toLocaleString("ru-RU")} {s.currency}
                            </p>
                          )}
                          {s.phone && (
                            <a href={`tel:${s.phone}`}
                              className="text-[11px] mt-1 flex items-center gap-1 justify-end hover:opacity-70"
                              style={{ color: "var(--text-muted)" }}>
                              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                              </svg>
                              {s.phone}
                            </a>
                          )}
                          {s.telegram && (
                            <a href={`https://t.me/${s.telegram.replace("@","")}`}
                              target="_blank" rel="noopener noreferrer"
                              className="text-[11px] mt-0.5 flex items-center gap-1 justify-end hover:opacity-70"
                              style={{ color: "var(--text-muted)" }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-1.97 9.284c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.4 13.93l-2.95-.924c-.643-.204-.657-.643.136-.953l11.52-4.44c.537-.194 1.006.13.456.634z"/>
                              </svg>
                              {s.telegram}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">

              {/* Info */}
              <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <h2 className="text-base font-bold mb-4" style={{ color: "var(--text-primary)" }}>{t.infoTitle}</h2>
                <ul className="space-y-3">
                  {infoRows.map((row) => (
                    <li key={row.label} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{row.icon}</svg>
                        {row.label}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{row.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>{t.infoDifficulty}</span>
                    <span className="text-sm font-semibold px-3 py-1 rounded-full"
                      style={{ backgroundColor: diff.bg, color: diff.text }}>
                      {common.difficulty[loc.difficulty]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Photo gallery */}
              {loc.images.length > 1 && (
                <div className="p-4 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                  <h2 className="text-base font-bold mb-3" style={{ color: "var(--text-primary)" }}>Фотографии</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {loc.images.slice(1, 5).map((img, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={img} alt="" className="rounded-lg w-full h-20 object-cover" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
