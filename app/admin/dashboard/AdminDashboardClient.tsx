"use client";

import { useRouter } from "next/navigation";
import { useT } from "../../i18n/useT";
import LocaleSwitcher from "../../components/LocaleSwitcher";
import ThemeToggle from "../../components/ThemeToggle";

type AdminT = {
  dashboard: { title: string; welcome: string; logout: string };
};

export default function AdminDashboardClient({ email }: { email: string }) {
  const router = useRouter();
  const t = useT<AdminT>("admin").dashboard;

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  const stats = [
    { label: "Локации", value: "10", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    )},
    { label: "Партнёры", value: "0", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    )},
    { label: "Объявления", value: "0", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    )},
    { label: "На модерации", value: "0", icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Header */}
      <header className="sticky top-0 z-40 px-6 h-16 flex items-center justify-between"
        style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
        <span className="text-xl font-bold" style={{ color: "var(--accent)" }}>
          Too<span style={{ color: "var(--accent-light)" }}>Go</span>
          <span className="text-xs font-normal ml-2" style={{ color: "var(--text-muted)" }}>Admin</span>
        </span>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <ThemeToggle />

          {/* User info */}
          <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: "var(--accent)" }}>
              {email[0].toUpperCase()}
            </div>
            {email}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all"
            style={{
              color: "#f87171",
              backgroundColor: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.2)",
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span className="hidden sm:inline">{t.logout}</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            {t.title}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {t.welcome}, <span style={{ color: "var(--accent-light)" }}>{email}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label}
              className="p-5 rounded-2xl"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent-light)" }}>
                {s.icon}
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>{s.value}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Sections placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {["Модерация объявлений", "Управление локациями"].map((title) => (
            <div key={title} className="p-6 rounded-2xl"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
              <h2 className="text-base font-bold mb-4" style={{ color: "var(--text-primary)" }}>{title}</h2>
              <div className="text-center py-10" style={{ color: "var(--text-muted)" }}>
                <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                <p className="text-sm">Нет данных</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
