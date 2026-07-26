"use client";

import { useT } from "../i18n/useT";

const SERVICE_ICONS = [
  <svg key="car" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17H5a2 2 0 01-2-2V9a2 2 0 012-2h11l3 4v4a2 2 0 01-2 2h-1m-7 0a2 2 0 104 0m-4 0a2 2 0 114 0" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 9h11" /></svg>,
  <svg key="house" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  <svg key="frame" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L2 19h20L12 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19v-5h4v5" /></svg>,
  <svg key="globe" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v20M2 12h20" /></svg>,
  <svg key="yurt" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17c0 0 2-6 9-6s9 6 9 6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17h18M12 11V7" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17v2m10-2v2" /><ellipse cx="12" cy="7" rx="5" ry="2" strokeWidth={1.5} /></svg>,
  <svg key="pin" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  <svg key="horse" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-1-4-3-1 1-3 3-1 2-4h4l1 3 3 2-1 3-3 1-1 4H9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l-2 4m8-4l2 4" /></svg>,
  <svg key="box" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  <svg key="coffee" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 13V5a4 4 0 018 0v8" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 13h12l-1.5 6H7.5L6 13z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 5h2a1 1 0 011 1v3a1 1 0 01-1 1h-2" /></svg>,
  <svg key="star" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
];

type ServicesT = {
  services: {
    badge: string; title1: string; title2: string;
    description: string; cta: string;
    items: { name: string; desc: string }[];
  };
};

export default function Services() {
  const t = useT<ServicesT>("landing");
  const s = t.services;

  return (
    <section id="services" className="py-24 transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-2/5 shrink-0">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3"
              style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent-light)" }}>
              {s.badge}
            </span>
            <h2 className="text-4xl font-bold leading-tight mb-4" style={{ color: "var(--text-primary)" }}>
              {s.title1}<br />{s.title2}
            </h2>
            <p className="leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
              {s.description}
            </p>
            <button className="font-semibold px-7 py-3.5 rounded-full transition-all text-white hover:opacity-90"
              style={{ backgroundColor: "var(--accent)" }}>
              {s.cta}
            </button>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {s.items.map((item, i) => (
              <div key={item.name}
                className="group rounded-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent-light)" }}>
                  {SERVICE_ICONS[i]}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{item.name}</p>
                  <p className="text-xs leading-snug mt-0.5" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
