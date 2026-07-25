import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { LOCATIONS, difficultyLabel, seasonLabel } from "../../data/locations";

export function generateStaticParams() {
  return LOCATIONS.map((loc) => ({ id: String(loc.id) }));
}

const services = [
  { icon: "🚗", name: "Трансфер" },
  { icon: "🏠", name: "Гостевой дом" },
  { icon: "⛺", name: "Глэмпинг" },
  { icon: "🏕️", name: "Юрта" },
  { icon: "🧭", name: "Гид" },
  { icon: "🐎", name: "Конные прогулки" },
  { icon: "☕", name: "Кафе" },
  { icon: "🎒", name: "Аренда снаряжения" },
];

export default async function LocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const loc = LOCATIONS.find((l) => l.id === Number(id));
  if (!loc) notFound();

  const diff = difficultyLabel[loc.difficulty];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 transition-colors duration-300"
        style={{ backgroundColor: "var(--bg-primary)" }}>

        {/* Hero image */}
        <div className="relative h-[55vh] overflow-hidden">
          <img src={loc.images[0]} alt={loc.name}
            className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>

          {/* Back */}
          <div className="absolute top-6 left-6">
            <Link href="/locations"
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Все локации
            </Link>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-8 left-0 right-0 px-6">
            <div className="max-w-7xl mx-auto">
              {loc.isPopular && (
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#a8c97f] text-[#1a2a1a] mb-3">
                  Популярное
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{loc.name}</h1>
              <p className="text-white/70 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {loc.region}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT: main info */}
            <div className="lg:col-span-2 space-y-6">

              {/* Description */}
              <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>О локации</h2>
                <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>{loc.description}</p>
              </div>

              {/* Recommendations */}
              <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <svg className="w-5 h-5" style={{ color: "var(--accent-light)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Рекомендации
                </h2>
                <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>{loc.recommendations}</p>
              </div>

              {/* Map */}
              <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Карта</h2>
                <div className="rounded-xl overflow-hidden h-72">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${loc.longitude - 0.3}%2C${loc.latitude - 0.2}%2C${loc.longitude + 0.3}%2C${loc.latitude + 0.2}&layer=mapnik&marker=${loc.latitude}%2C${loc.longitude}`}
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--accent-light)" }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                  Построить маршрут в Google Maps
                </a>
              </div>

              {/* Partner services */}
              <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Услуги рядом</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {services.map((s) => (
                    <div key={s.name}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl text-center cursor-pointer transition-all hover:-translate-y-0.5"
                      style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: details card */}
            <div className="space-y-4">

              {/* Stats */}
              <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <h2 className="text-base font-bold mb-4" style={{ color: "var(--text-primary)" }}>Информация</h2>
                <ul className="space-y-3">
                  {[
                    {
                      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>,
                      label: "Расстояние", value: `${loc.distance} км`,
                    },
                    {
                      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>,
                      label: "Время в пути", value: loc.travelTime,
                    },
                    {
                      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>,
                      label: "Высота", value: `${loc.altitude} м`,
                    },
                    {
                      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>,
                      label: "Сезон", value: seasonLabel[loc.bestSeason],
                    },
                    {
                      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>,
                      label: "Стоимость", value: loc.visitPrice === 0 ? "Бесплатно" : `${loc.visitPrice} сом`,
                    },
                  ].map((item) => (
                    <li key={item.label} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                        {item.label}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.value}</span>
                    </li>
                  ))}
                </ul>

                {/* Difficulty badge */}
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>Сложность</span>
                    <span className="text-sm font-semibold px-3 py-1 rounded-full"
                      style={{ backgroundColor: diff.bg, color: diff.text }}>
                      {diff.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weather placeholder */}
              <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <h2 className="text-base font-bold mb-4" style={{ color: "var(--text-primary)" }}>Погода сейчас</h2>
                <div className="flex items-center gap-4">
                  <div className="text-5xl">⛅</div>
                  <div>
                    <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>+18°C</div>
                    <div className="text-sm" style={{ color: "var(--text-muted)" }}>Переменная облачность</div>
                    <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Ветер: 5 м/с</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <h2 className="text-base font-bold mb-3" style={{ color: "var(--text-primary)" }}>Теги</h2>
                <div className="flex flex-wrap gap-2">
                  {loc.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent-light)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
