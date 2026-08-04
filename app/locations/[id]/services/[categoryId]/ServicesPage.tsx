"use client";

import Link from "next/link";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number | null;
  currency: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  partner: string;
}

interface Props {
  locationId: string;
  locationName: string;
  category: { id: number; name: string; icon: string };
  services: Service[];
}

export default function ServicesPage({ locationId, locationName, category, services }: Props) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 transition-colors duration-300"
        style={{ backgroundColor: "var(--bg-primary)" }}>

        {/* Header */}
        <div className="py-10 px-6"
          style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-5" style={{ color: "var(--text-muted)" }}>
              <Link href="/" className="hover:underline" style={{ color: "var(--accent-light)" }}>Главная</Link>
              <span>/</span>
              <Link href="/locations" className="hover:underline" style={{ color: "var(--accent-light)" }}>Локации</Link>
              <span>/</span>
              <Link href={`/locations/${locationId}`} className="hover:underline" style={{ color: "var(--accent-light)" }}>
                {locationName}
              </Link>
              <span>/</span>
              <span>{category.name}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)" }}>
                {category.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {category.name}
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  {locationName} · {services.length} {services.length === 1 ? "предложение" : services.length < 5 ? "предложения" : "предложений"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Back button */}
          <Link href={`/locations/${locationId}`}
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-70"
            style={{ color: "var(--text-muted)" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Вернуться к локации
          </Link>

          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1px dashed var(--border)" }}>
              <span className="text-5xl mb-4">{category.icon}</span>
              <p className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Услуги «{category.name}» пока не добавлены
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Партнёры скоро добавят предложения для {locationName}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {services.map((s) => (
                <div key={s.id}
                  className="rounded-2xl p-6 transition-all hover:shadow-md"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>

                  {/* Top */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.partner}</p>
                    </div>
                    {s.price != null && (
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold" style={{ color: "var(--accent-light)" }}>
                          {s.price.toLocaleString("ru-RU")}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.currency}</p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {s.description && (
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                      {s.description}
                    </p>
                  )}

                  {/* Contacts */}
                  <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                    {s.phone && (
                      <a href={`tel:${s.phone}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                        style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent-light)" }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                        </svg>
                        {s.phone}
                      </a>
                    )}
                    {s.whatsapp && (
                      <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                        style={{ backgroundColor: "rgba(37,211,102,0.1)", color: "#25d366" }}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </a>
                    )}
                    {s.telegram && (
                      <a href={`https://t.me/${s.telegram.replace("@", "")}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                        style={{ backgroundColor: "rgba(0,136,204,0.1)", color: "#0088cc" }}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-1.97 9.284c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.4 13.93l-2.95-.924c-.643-.204-.657-.643.136-.953l11.52-4.44c.537-.194 1.006.13.456.634z"/>
                        </svg>
                        Telegram
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
