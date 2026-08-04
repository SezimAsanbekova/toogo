"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────

interface Service {
  id: string;
  title: string;
  status: string;
  price: number | null;
  currency: string;
  category: string;
  categoryIcon: string;
  location: string;
  reject_reason: string | null;
  created_at: string;
}

interface Props {
  email: string;
  user: {
    full_name: string;
    email: string;
    phone: string;
    telegram: string;
    member_since: string;
  };
  initialServices: Service[];
  categories: { id: number; name: string; icon: string }[];
  locations: { id: string; name: string; region: string }[];
}

// ── Helpers ───────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  pending: "На модерации",
  approved: "Одобрено",
  rejected: "Отклонено",
  deleted: "Удалено",
};

const STATUS_COLOR: Record<string, { color: string; bg: string }> = {
  pending:  { color: "#a08020", bg: "#1a1500" },
  approved: { color: "#40a040", bg: "#0a150a" },
  rejected: { color: "#a04040", bg: "#150a0a" },
  deleted:  { color: "#555",    bg: "#111"    },
};

const NAV = [
  { key: "dashboard", label: "Dashboard",
    icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { key: "services", label: "Мои услуги",
    icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg> },
  { key: "add", label: "Добавить услугу",
    icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg> },
  { key: "profile", label: "Профиль",
    icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

// ── Main component ─────────────────────────────────────────────────────────

export default function PartnerDashboardClient({ email, user, initialServices, categories, locations }: Props) {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [services, setServices] = useState<Service[]>(initialServices);

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await fetch("/api/partner/logout", { method: "POST" }); }
    finally { router.push("/partner/login"); }
  };

  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить услугу?")) return;
    setDeleting(id);
    const res = await fetch(`/api/partner/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
    setDeleting(null);
  };

  const counts = {
    total: services.length,
    pending: services.filter(s => s.status === "pending").length,
    approved: services.filter(s => s.status === "approved").length,
    rejected: services.filter(s => s.status === "rejected").length,
  };

  // ── Add service form ────────────────────────────────────────────────────

  function AddServiceForm() {
    const [form, setForm] = useState({ title: "", description: "", category_id: "", location_id: "", price: "", currency: "KGS", phone: user.phone ?? "", telegram: user.telegram ?? "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");
    const [done, setDone] = useState(false);

    const inputCls = "w-full px-3 py-2.5 rounded-lg text-[13px] outline-none transition-colors";
    const inputStyle = { background: "#0d0d0d", border: "1px solid #1c1c1c", color: "#e0e0e0" };
    const F = (k: keyof typeof form) => ({
      value: form[k],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value })),
      className: inputCls,
      style: inputStyle,
      onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => (e.target.style.borderColor = "#333"),
      onBlur:  (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => (e.target.style.borderColor = "#1c1c1c"),
    });

    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.title || !form.category_id || !form.location_id) { setErr("Заполните обязательные поля"); return; }
      setSaving(true); setErr("");
      const res = await fetch("/api/partner/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { setErr("Ошибка сохранения"); setSaving(false); return; }
      const created = await res.json();
      setServices(prev => [{
        id: created.id,
        title: form.title,
        status: "pending",
        price: form.price ? Number(form.price) : null,
        currency: form.currency,
        category: categories.find(c => c.id === Number(form.category_id))?.name ?? "",
        categoryIcon: categories.find(c => c.id === Number(form.category_id))?.icon ?? "",
        location: locations.find(l => l.id === form.location_id)?.name ?? "",
        reject_reason: null,
        created_at: new Date().toISOString(),
      }, ...prev]);
      setDone(true);
      setSaving(false);
    };

    if (done) return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#0a1a0a" }}>
          <svg width="24" height="24" fill="none" stroke="#40a040" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <p className="text-white font-semibold">Услуга отправлена на модерацию</p>
        <p className="text-sm" style={{ color: "#444" }}>Администратор рассмотрит заявку в ближайшее время</p>
        <div className="flex gap-3 mt-2">
          <button onClick={() => { setDone(false); setForm({ title: "", description: "", category_id: "", location_id: "", price: "", currency: "KGS", phone: user.phone ?? "", telegram: user.telegram ?? "" }); }}
            className="px-4 py-2 rounded-lg text-[13px] font-medium" style={{ background: "#0d0d0d", color: "#888", border: "1px solid #1c1c1c" }}>
            Добавить ещё
          </button>
          <button onClick={() => setActiveKey("services")}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold" style={{ background: "#fff", color: "#000" }}>
            Мои услуги
          </button>
        </div>
      </div>
    );

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white tracking-tight">Добавить услугу</h2>
          <p className="mt-0.5 text-sm" style={{ color: "#444" }}>Заявка будет отправлена на проверку администратору</p>
        </div>
        <form onSubmit={submit} className="max-w-xl space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Название *</label>
            <input {...F("title")} placeholder="Конная прогулка по ущелью" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Категория *</label>
              <select {...F("category_id")} className={inputCls} style={inputStyle}>
                <option value="">Выберите категорию</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Локация *</label>
              <select {...F("location_id")} className={inputCls} style={inputStyle}>
                <option value="">Выберите локацию</option>
                {locations.map(l => <option key={l.id} value={l.id}>{l.name} — {l.region}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Цена</label>
              <input {...F("price")} type="number" placeholder="1500" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Валюта</label>
              <select {...F("currency")} className={inputCls} style={inputStyle}>
                <option value="KGS">KGS — сом</option>
                <option value="USD">USD — доллар</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Телефон</label>
              <input {...F("phone")} type="tel" placeholder="+996 700 000000" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Telegram</label>
              <input {...F("telegram")} placeholder="@username" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Описание</label>
            <textarea {...F("description")} rows={4} placeholder="Опишите вашу услугу подробно…" className={inputCls} style={inputStyle} />
          </div>
          {err && <p className="text-[12px]" style={{ color: "#a05050" }}>{err}</p>}
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 rounded-lg text-[13px] font-semibold disabled:opacity-50"
            style={{ background: "#fff", color: "#000" }}>
            {saving ? "Отправка…" : "Отправить на модерацию"}
          </button>
        </form>
      </div>
    );
  }

  // ── Render section ────────────────────────────────────────────────────

  function renderContent() {
    if (activeKey === "add") return <AddServiceForm />;

    if (activeKey === "services") return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Мои услуги</h2>
            <p className="mt-0.5 text-sm" style={{ color: "#444" }}>{services.length} объявлений</p>
          </div>
          <button onClick={() => setActiveKey("add")}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold"
            style={{ background: "#fff", color: "#000" }}>
            + Добавить
          </button>
        </div>
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-xl" style={{ background: "#0d0d0d", border: "1px solid #1c1c1c" }}>
            <p className="text-sm font-medium" style={{ color: "#555" }}>У вас пока нет услуг</p>
            <button onClick={() => setActiveKey("add")} className="mt-3 px-4 py-2 rounded-lg text-[13px] font-semibold" style={{ background: "#fff", color: "#000" }}>Добавить первую</button>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map(s => {
              const sc = STATUS_COLOR[s.status] ?? STATUS_COLOR.deleted;
              return (
                <div key={s.id} className="rounded-xl p-5" style={{ background: "#0d0d0d", border: "1px solid #1c1c1c" }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ background: "#111" }}>
                        {s.categoryIcon || "🏔️"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-white truncate">{s.title}</p>
                        <p className="text-[12px] mt-0.5" style={{ color: "#444" }}>{s.category} · {s.location}</p>
                        {s.price && <p className="text-[12px] mt-0.5" style={{ color: "#666" }}>{s.price.toLocaleString("ru-RU")} {s.currency}</p>}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium px-2 py-1 rounded shrink-0" style={{ background: sc.bg, color: sc.color, border: "1px solid #222" }}>
                      {STATUS_LABEL[s.status] ?? s.status}
                    </span>
                  </div>
                  {s.reject_reason && (
                    <p className="text-[12px] mt-3 px-3 py-2 rounded" style={{ background: "#150a0a", color: "#888", border: "1px solid #2a1010" }}>
                      Причина отказа: {s.reject_reason}
                    </p>
                  )}
                  {s.status !== "deleted" && (
                    <div className="mt-3 flex justify-end" style={{ borderTop: "1px solid #111", paddingTop: "12px" }}>
                      <button
                        disabled={deleting === s.id}
                        onClick={() => handleDelete(s.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-40"
                        style={{ background: "#150a0a", color: "#a05050", border: "1px solid #2a1010" }}
                      >
                        {deleting === s.id ? (
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                        ) : (
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          </svg>
                        )}
                        {deleting === s.id ? "Удаление…" : "Удалить"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );

    if (activeKey === "profile") return (
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white tracking-tight">Профиль</h2>
          <p className="mt-0.5 text-sm" style={{ color: "#444" }}>Ваши контактные данные</p>
        </div>
        <div className="max-w-md space-y-3">
          {[
            { label: "Имя", value: user.full_name },
            { label: "Email", value: user.email },
            { label: "Телефон", value: user.phone || "—" },
            { label: "Telegram", value: user.telegram || "—" },
            { label: "Партнёр с", value: new Date(user.member_since).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "#0d0d0d", border: "1px solid #1c1c1c" }}>
              <span className="text-[12px]" style={{ color: "#444" }}>{row.label}</span>
              <span className="text-[13px] font-medium text-white">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    );

    // Dashboard home
    return (
      <>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white tracking-tight">
            Добро пожаловать, {user.full_name.split(" ")[0]}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "#444" }}>Управляйте своими услугами в одном месте</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Всего",          value: counts.total },
            { label: "На модерации",   value: counts.pending },
            { label: "Одобрено",       value: counts.approved },
            { label: "Отклонено",      value: counts.rejected },
          ].map(c => (
            <div key={c.label} className="rounded-xl p-5 flex flex-col justify-between" style={{ background: "#0d0d0d", border: "1px solid #1c1c1c", minHeight: "110px" }}>
              <p className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "#333" }}>{c.label}</p>
              <p className="text-3xl font-bold text-white tracking-tight">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Recent services */}
        <p className="text-[11px] font-medium uppercase tracking-widest mb-3" style={{ color: "#2a2a2a" }}>Последние услуги</p>
        {services.length === 0 ? (
          <div className="rounded-xl p-10 flex flex-col items-center justify-center text-center" style={{ background: "#0d0d0d", border: "1px dashed #1c1c1c" }}>
            <p className="text-sm" style={{ color: "#444" }}>Вы ещё не добавили ни одной услуги</p>
            <button onClick={() => setActiveKey("add")}
              className="mt-4 px-5 py-2.5 rounded-lg text-[13px] font-semibold"
              style={{ background: "#fff", color: "#000" }}>
              + Добавить услугу
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {services.slice(0, 5).map(s => {
              const sc = STATUS_COLOR[s.status] ?? STATUS_COLOR.deleted;
              return (
                <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "#0d0d0d", border: "1px solid #1c1c1c" }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-base">{s.categoryIcon || "🏔️"}</span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-white truncate">{s.title}</p>
                      <p className="text-[11px]" style={{ color: "#444" }}>{s.location}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded shrink-0 ml-3" style={{ background: sc.bg, color: sc.color, border: "1px solid #222" }}>
                    {STATUS_LABEL[s.status]}
                  </span>
                </div>
              );
            })}
            {services.length > 5 && (
              <button onClick={() => setActiveKey("services")} className="w-full py-2.5 rounded-xl text-[12px] font-medium transition-colors" style={{ background: "#0d0d0d", color: "#444", border: "1px solid #1c1c1c" }}>
                Посмотреть все ({services.length})
              </button>
            )}
          </div>
        )}
      </>
    );
  }

  const activeLabel = NAV.find(n => n.key === activeKey)?.label ?? "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080808", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 lg:hidden" style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={["fixed lg:static inset-y-0 left-0 z-30 w-52 shrink-0 flex flex-col transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"].join(" ")}
        style={{ background: "#000", borderRight: "1px solid #1c1c1c" }}>

        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: "1px solid #1c1c1c" }}>
          <Link href="/">
            <span className="text-sm font-semibold tracking-tight text-white">TooGo</span>
            <span className="text-sm font-normal" style={{ color: "#333" }}> / партнёр</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-px overflow-y-auto">
          {NAV.map(({ key, label, icon }) => {
            const active = activeKey === key;
            return (
              <button key={key}
                onClick={() => { setActiveKey(key); setSidebarOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-[9px] rounded-md text-[13px] font-medium transition-colors text-left"
                style={{ background: active ? "#fff" : "transparent", color: active ? "#000" : "#555" }}>
                <span style={{ color: active ? "#000" : "#444" }}>{icon}</span>
                <span className="flex-1">{label}</span>
                {key === "services" && counts.pending > 0 && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: active ? "#000" : "#1a1500", color: active ? "#fff" : "#a08020" }}>
                    {counts.pending}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="px-2 py-3 space-y-px" style={{ borderTop: "1px solid #1c1c1c" }}>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md" style={{ background: "#0a0a0a" }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: "#1c1c1c", color: "#fff" }}>
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-white truncate">{user.full_name}</p>
              <p className="text-[10px]" style={{ color: "#333" }}>Партнёр</p>
            </div>
          </div>
          <button onClick={handleLogout} disabled={loggingOut}
            className="w-full flex items-center gap-2.5 px-3 py-[9px] rounded-md text-[13px] font-medium transition-colors text-left disabled:opacity-50"
            style={{ color: "#444" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.background = "#111"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#444"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
            {loggingOut
              ? <svg className="w-[15px] h-[15px] animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              : <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            }
            Выход
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3.5 shrink-0" style={{ background: "#000", borderBottom: "1px solid #1c1c1c" }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-md" style={{ color: "#555" }} onClick={() => setSidebarOpen(true)}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <span className="text-sm font-medium text-white">{activeLabel}</span>
          </div>
          <span className="text-xs" style={{ color: "#333" }}>{email}</span>
        </header>

        <main className="flex-1 overflow-y-auto p-7" style={{ background: "#080808" }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
