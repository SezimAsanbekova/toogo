"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useT } from "../../i18n/useT";
import ThemeToggle from "../../components/ThemeToggle";

// ── Types ──────────────────────────────────────────────────────────────────
type Category = { id: number; name: string; icon: string | null; count: number };
type Service  = {
  id: string; title: string; status: string;
  price: number | null; currency: string | null;
  category: string; location: string; partner: string; createdAt: string;
};

// ── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  locations: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  partners: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  listings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>,
  complaints: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
  stats: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  services: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  logout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  menu: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>,
  close: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>,
  bell: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  trending: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>,
  check: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>,
  clock: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
};

// ── Nav items ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",   label: "Dashboard",         icon: Icons.dashboard },
  { id: "locations",   label: "Горные локации",     icon: Icons.locations },
  { id: "partners",    label: "Партнёры",           icon: Icons.partners },
  { id: "listings",    label: "Объявления",         icon: Icons.listings },
  { id: "services",    label: "Услуги",             icon: Icons.services },
  { id: "complaints",  label: "Жалобы",             icon: Icons.complaints },
  { id: "stats",       label: "Статистика",         icon: Icons.stats },
  { id: "settings",    label: "Настройки",          icon: Icons.settings },
];

// ── Stat cards ─────────────────────────────────────────────────────────────
const STATS = [
  { label: "Всего локаций",    value: "10",  change: "+2",  positive: true,  color: "#22c55e", bg: "rgba(34,197,94,0.1)"  },
  { label: "Партнёры",         value: "0",   change: "0",   positive: true,  color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  { label: "Объявления",       value: "0",   change: "0",   positive: true,  color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
  { label: "На модерации",     value: "0",   change: "0",   positive: false, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
];

// ── Recent activity (mock) ─────────────────────────────────────────────────
const ACTIVITY = [
  { type: "approved", text: "Объявление «Юрта у Иссык-Куля» одобрено",      time: "2 мин назад",  color: "#22c55e" },
  { type: "pending",  text: "Новое объявление от партнёра ожидает проверки", time: "15 мин назад", color: "#f59e0b" },
  { type: "approved", text: "Добавлена локация «Каньон Сказка»",             time: "1 час назад",  color: "#3b82f6" },
  { type: "pending",  text: "Регистрация нового партнёра",                   time: "3 часа назад", color: "#a855f7" },
];

// ──────────────────────────────────────────────────────────────────────────
export default function AdminDashboardClient({ email }: { email: string }) {
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Services state
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices]     = useState<Service[]>([]);
  const [svcSearch, setSvcSearch]   = useState("");
  const [svcStatus, setSvcStatus]   = useState("all");
  const [svcLoading, setSvcLoading] = useState(false);

  const fetchServices = useCallback(async (q: string, st: string) => {
    setSvcLoading(true);
    try {
      const res = await fetch(`/api/admin/services?q=${encodeURIComponent(q)}&status=${st}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
        setServices(data.services);
      }
    } finally {
      setSvcLoading(false);
    }
  }, []);

  useEffect(() => {
    if (active === "services") fetchServices(svcSearch, svcStatus);
  }, [active, svcSearch, svcStatus, fetchServices]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 flex flex-col w-64 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ backgroundColor: "var(--bg-secondary)", borderRight: "1px solid var(--border)" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <span className="text-xl font-bold" style={{ color: "var(--accent)" }}>
            Too<span style={{ color: "var(--accent-light)" }}>Go</span>
            <span className="ml-1.5 text-xs font-normal uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}>Admin</span>
          </span>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}
            style={{ color: "var(--text-muted)" }}>
            {Icons.close}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                style={{
                  backgroundColor: isActive ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent",
                  color: isActive ? "var(--accent-light)" : "var(--text-secondary)",
                }}
              >
                <span style={{ color: isActive ? "var(--accent-light)" : "var(--text-muted)" }}>
                  {item.icon}
                </span>
                {item.label}
                {item.id === "listings" && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>0</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ color: "#f87171", backgroundColor: "rgba(248,113,113,0.0)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(248,113,113,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {Icons.logout}
            Выйти
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-5 h-16 shrink-0"
          style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>

          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}
              style={{ color: "var(--text-secondary)" }}>
              {Icons.menu}
            </button>
            <div>
              <h1 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                {NAV_ITEMS.find((n) => n.id === active)?.label ?? "Dashboard"}
              </h1>
              <p className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>
                TooGo Admin Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Bell */}
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              {Icons.bell}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f59e0b]" />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2.5 pl-3" style={{ borderLeft: "1px solid var(--border)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}>
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold leading-none mb-0.5" style={{ color: "var(--text-primary)" }}>
                  Администратор
                </p>
                <p className="text-xs leading-none" style={{ color: "var(--text-muted)" }}>{email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">

          {active === "dashboard" && (
            <div className="space-y-6">

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-2xl p-5"
                    style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: s.bg }}>
                        <svg className="w-5 h-5" style={{ color: s.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: s.bg, color: s.color }}>
                        {s.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>
                      {s.value}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Bottom row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Recent activity */}
                <div className="lg:col-span-2 rounded-2xl p-5"
                  style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                  <h2 className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                    Последние действия
                  </h2>
                  <div className="space-y-3">
                    {ACTIVITY.map((a, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${a.color}18`, color: a.color }}>
                          {a.type === "approved" ? Icons.check : Icons.clock}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>{a.text}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="rounded-2xl p-5"
                  style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                  <h2 className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                    Быстрые действия
                  </h2>
                  <div className="space-y-2">
                    {[
                      { label: "Добавить локацию",   icon: Icons.locations,   color: "#22c55e" },
                      { label: "Проверить объявления", icon: Icons.listings,  color: "#f59e0b" },
                      { label: "Посмотреть партнёров", icon: Icons.partners,  color: "#3b82f6" },
                      { label: "Статистика",          icon: Icons.stats,      color: "#a855f7" },
                    ].map((q) => (
                      <button
                        key={q.label}
                        onClick={() => setActive(q.label === "Добавить локацию" ? "locations" : q.label === "Проверить объявления" ? "listings" : q.label === "Посмотреть партнёров" ? "partners" : "stats")}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-left transition-all"
                        style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = q.color)}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      >
                        <span style={{ color: q.color }}>{q.icon}</span>
                        <span style={{ color: "var(--text-secondary)" }}>{q.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Services section ── */}
          {active === "services" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Категории услуг</h2>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Управление категориями услуг партнёров</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)" }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                  Добавить категорию
                </button>
              </div>

              {/* Category cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id}
                    className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg group"
                    style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
                      {cat.icon ?? "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{cat.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{cat.count} объявлений</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent-light)" }}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {svcLoading && categories.length === 0 && (
                  <div className="col-span-4 flex justify-center py-8">
                    <div className="w-6 h-6 border-2 rounded-full animate-spin"
                      style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
                  </div>
                )}
              </div>

              {/* Services table */}
              <div className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <div className="px-5 py-4 flex items-center justify-between"
                  style={{ borderBottom: "1px solid var(--border)" }}>
                  <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Все объявления услуг</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                      style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                      <svg className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                      <input placeholder="Поиск..." className="bg-transparent outline-none text-xs w-32"
                        style={{ color: "var(--text-primary)" }}
                        value={svcSearch}
                        onChange={(e) => setSvcSearch(e.target.value)} />
                    </div>
                    <select className="px-3 py-1.5 rounded-lg text-xs outline-none"
                      style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                      value={svcStatus}
                      onChange={(e) => setSvcStatus(e.target.value)}>
                      <option value="all">Все статусы</option>
                      <option value="pending">На модерации</option>
                      <option value="approved">Одобрено</option>
                      <option value="rejected">Отклонено</option>
                    </select>
                  </div>
                </div>

                {/* Table or empty state */}
                {svcLoading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-6 h-6 border-2 rounded-full animate-spin"
                      style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
                  </div>
                ) : services.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
                      <svg className="w-7 h-7" style={{ color: "var(--accent-light)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Объявлений пока нет</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Объявления партнёров появятся здесь после регистрации</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)" }}>
                          {["Название","Категория","Локация","Партнёр","Цена","Статус","Дата"].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                              style={{ color: "var(--text-muted)" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((s) => {
                          const statusColors: Record<string, string> = {
                            pending:  "#f59e0b",
                            approved: "#22c55e",
                            rejected: "#f87171",
                            deleted:  "#94a3b8",
                          };
                          const statusLabels: Record<string, string> = {
                            pending:  "На модерации",
                            approved: "Одобрено",
                            rejected: "Отклонено",
                            deleted:  "Удалено",
                          };
                          return (
                            <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}
                              className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>{s.title}</td>
                              <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{s.category}</td>
                              <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{s.location}</td>
                              <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{s.partner}</td>
                              <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                                {s.price ? `${s.price} ${s.currency ?? "сом"}` : "—"}
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-xs font-medium px-2 py-1 rounded-full"
                                  style={{ background: `${statusColors[s.status]}18`, color: statusColors[s.status] }}>
                                  {statusLabels[s.status] ?? s.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                                {new Date(s.createdAt).toLocaleDateString("ru-RU")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Placeholder for other sections */}
          {active !== "dashboard" && active !== "services" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent-light)" }}>
                {NAV_ITEMS.find((n) => n.id === active)?.icon}
              </div>
              <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                {NAV_ITEMS.find((n) => n.id === active)?.label}
              </h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Раздел в разработке
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
