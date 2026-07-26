"use client";

import { useT } from "../i18n/useT";

const ICONS = [
  <svg key="1" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  <svg key="2" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
  <svg key="3" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  <svg key="4" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
];

type HowT = {
  howItWorks: {
    badge: string; title: string; subtitle: string;
    steps: { title: string; description: string }[];
  };
};

export default function HowItWorks() {
  const t = useT<HowT>("landing");
  const h = t.howItWorks;

  return (
    <section id="how-it-works" className="py-24 transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent-light)" }}>
            {h.badge}
          </span>
          <h2 className="text-4xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
            {h.title}
          </h2>
          <p className="mt-3 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            {h.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {h.steps.map((step, i) => (
            <div key={i} className="relative group">
              {i < h.steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(100%-16px)] w-full h-px z-0"
                  style={{ backgroundColor: "var(--border)" }} />
              )}
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-all group-hover:scale-105"
                  style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent-light)" }}>
                  {ICONS[i]}
                </div>
                <span className="text-xs font-bold tracking-widest uppercase mb-2 block"
                  style={{ color: "var(--text-muted)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
