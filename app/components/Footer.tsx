"use client";

import { useT } from "../i18n/useT";

type FooterT = {
  footer: {
    description: string;
    serviceTitle: string; partnersTitle: string;
    serviceLinks: { allLocations: string; search: string; filters: string; favorites: string };
    partnerLinks: { register: string; myListings: string; forAdmins: string };
    copyright: string; country: string;
  };
};

export default function Footer() {
  const t = useT<FooterT>("common");
  const f = t.footer;

  return (
    <footer className="py-16 transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              Too<span style={{ color: "var(--accent-light)" }}>Go</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-secondary)" }}>
              {f.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>
              {f.serviceTitle}
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              {[
                { label: f.serviceLinks.allLocations, href: "/locations" },
                { label: f.serviceLinks.search,       href: "/locations" },
                { label: f.serviceLinks.filters,      href: "/locations" },
                { label: f.serviceLinks.favorites,    href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="transition-colors hover:text-[var(--accent-light)]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>
              {f.partnersTitle}
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li><a href="/partner" className="transition-colors hover:text-[var(--accent-light)]">{f.partnerLinks.register}</a></li>
              <li><a href="/partner" className="transition-colors hover:text-[var(--accent-light)]">{f.partnerLinks.myListings}</a></li>
              <li><a href="/admin"   className="transition-colors hover:text-[var(--accent-light)]">{f.partnerLinks.forAdmins}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
          <p className="text-xs">{f.copyright}</p>
          <p className="text-xs">{f.country}</p>
        </div>
      </div>
    </footer>
  );
}
