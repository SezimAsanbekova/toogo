"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Stats {
  locations: number;
  partners: number;
  activeServices: number;
  pendingServices: number;
}

interface Props {
  email: string;
  stats: Stats;
}

interface Location {
  id: string; name: string; region: string; status: string;
  difficulty: string | null; altitude: number | null;
  is_popular: boolean; services_count: number; created_at: string;
}

interface Partner {
  id: string; full_name: string; email: string; phone: string | null;
  telegram: string | null; status: string; services_count: number;
  created_at: string; last_login: string | null;
}

interface Listing {
  id: string; title: string; description: string | null; status: string;
  price: number | null; currency: string | null; category: string;
  location: string; partner: string; partner_email: string;
  reject_reason: string | null; created_at: string;
}

interface Service {
  id: string; title: string; status: string; price: number | null;
  currency: string | null; category: string; location: string;
  partner: string; createdAt: string;
}

// ── Sidebar nav ───────────────────────────────────────────────────────────────

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { key: "locations", label: "Горные локации", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2C8.686 2 6 4.686 6 8c0 5 6 13 6 13s6-8 6-13c0-3.314-2.686-6-6-6z"/><circle cx="12" cy="8" r="2"/></svg> },
  { key: "services", label: "Услуги", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg> },
  { key: "partners", label: "Партнеры", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
  { key: "listings", label: "Объявления", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg> },
  { key: "complaints", label: "Жалобы", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg> },
  { key: "stats", label: "Статистика", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> },
  { key: "settings", label: "Настройки", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  active: "Активен", blocked: "Заблокирован",
  pending: "На модерации", approved: "Одобрен",
  rejected: "Отклонён", deleted: "Удалён",
  hidden: "Скрыт",
};

function Badge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    active:   { bg: "#0a0a0a", color: "#e0e0e0" },
    approved: { bg: "#0a0a0a", color: "#e0e0e0" },
    pending:  { bg: "#1a1500", color: "#a0850a" },
    rejected: { bg: "#1a0808", color: "#a03030" },
    deleted:  { bg: "#111", color: "#555" },
    blocked:  { bg: "#1a0808", color: "#a03030" },
    hidden:   { bg: "#111", color: "#555" },
  };
  const c = colors[status] ?? { bg: "#111", color: "#888" };
  return (
    <span className="text-[11px] font-medium px-2 py-0.5 rounded" style={{ background: c.bg, color: c.color, border: "1px solid #222" }}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold tracking-tight" style={{ color: "#fff" }}>{title}</h2>
      {sub && <p className="mt-0.5 text-sm" style={{ color: "#444" }}>{sub}</p>}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative mb-5">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" fill="none" stroke="#444" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 rounded-lg text-[13px] outline-none transition-colors"
        style={{ background: "#0a0a0a", border: "1px solid #1c1c1c", color: "#e0e0e0" }}
        onFocus={e => (e.target.style.borderColor = "#333")}
        onBlur={e => (e.target.style.borderColor = "#1c1c1c")}
      />
    </div>
  );
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1c1c1c" }}>
      <table className="w-full text-[13px]" style={{ borderCollapse: "collapse" }}>
        {children}
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#333", background: "#0a0a0a", borderBottom: "1px solid #1c1c1c" }}>
      {children}
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={"px-4 py-3 " + (className ?? "")} style={{ color: "#aaa", borderBottom: "1px solid #111" }}>
      {children}
    </td>
  );
}

function Empty() {
  return <p className="text-center py-16 text-sm" style={{ color: "#333" }}>Нет данных</p>;
}

function Loader() {
  return (
    <div className="flex items-center justify-center py-16">
      <svg className="animate-spin" width="20" height="20" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#fff" strokeWidth="3"/>
        <path className="opacity-70" fill="#fff" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  );
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
      style={{ background: active ? "#fff" : "#0a0a0a", color: active ? "#000" : "#555", border: "1px solid " + (active ? "#fff" : "#1c1c1c") }}
    >
      {label}
    </button>
  );
}

// ── Section: Locations ────────────────────────────────────────────────────────

interface LocationPhoto {
  id: string;
  image_url: string;
  is_main: boolean;
  sort_order: number;
}

// ── Photo manager (shown after location is created) ───────────────────────────

function PhotoManager({ locationId }: { locationId: string }) {
  const [photos, setPhotos] = useState<LocationPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlMode, setUrlMode] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useState<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/location-photos?location_id=${locationId}`);
    setPhotos(await res.json());
    setLoading(false);
  }, [locationId]);

  useEffect(() => { void load(); }, [load]);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("location_id", locationId);
    fd.append("is_main", photos.length === 0 ? "true" : "false");
    const res = await fetch("/api/admin/location-photos", { method: "POST", body: fd });
    if (!res.ok) setErr("Ошибка загрузки");
    else await load();
    setUploading(false);
    e.target.value = "";
  };

  const addUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setUploading(true); setErr("");
    const res = await fetch("/api/admin/location-photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location_id: locationId, image_url: urlInput.trim(), is_main: photos.length === 0 }),
    });
    if (!res.ok) setErr("Ошибка сохранения");
    else { setUrlInput(""); await load(); }
    setUploading(false);
  };

  const setMain = async (id: string) => {
    await fetch("/api/admin/location-photos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, location_id: locationId }),
    });
    await load();
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/location-photos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  };

  return (
    <div className="mt-5 pt-5" style={{ borderTop: "1px solid #1c1c1c" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: "#333" }}>
          Фотографии локации
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setUrlMode(false)}
            className="text-[11px] px-2.5 py-1 rounded transition-colors"
            style={{ background: !urlMode ? "#fff" : "#111", color: !urlMode ? "#000" : "#555", border: "1px solid " + (!urlMode ? "#fff" : "#222") }}
          >
            Загрузить файл
          </button>
          <button
            type="button"
            onClick={() => setUrlMode(true)}
            className="text-[11px] px-2.5 py-1 rounded transition-colors"
            style={{ background: urlMode ? "#fff" : "#111", color: urlMode ? "#000" : "#555", border: "1px solid " + (urlMode ? "#fff" : "#222") }}
          >
            По URL
          </button>
        </div>
      </div>

      {/* Upload area */}
      {!urlMode ? (
        <label
          className="flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer transition-colors"
          style={{ background: "#060606", border: "1px dashed #222", padding: "24px", minHeight: "80px" }}
          onDragOver={e => e.preventDefault()}
        >
          {uploading ? (
            <svg className="animate-spin" width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#fff" strokeWidth="3"/>
              <path className="opacity-70" fill="#fff" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : (
            <>
              <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              <span className="text-[12px]" style={{ color: "#444" }}>Нажмите или перетащите файл</span>
              <span className="text-[11px]" style={{ color: "#2a2a2a" }}>JPG, PNG, WebP до 10 МБ</span>
            </>
          )}
          <input
            ref={el => { fileRef[1](el); }}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={uploadFile}
            disabled={uploading}
          />
        </label>
      ) : (
        <form onSubmit={addUrl} className="flex gap-2">
          <input
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="flex-1 px-3 py-2 rounded-lg text-[13px] outline-none"
            style={{ background: "#0a0a0a", border: "1px solid #1c1c1c", color: "#e0e0e0" }}
            onFocus={e => (e.target.style.borderColor = "#333")}
            onBlur={e => (e.target.style.borderColor = "#1c1c1c")}
          />
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold disabled:opacity-50"
            style={{ background: "#fff", color: "#000" }}
          >
            {uploading ? "…" : "Добавить"}
          </button>
        </form>
      )}

      {err && <p className="text-[12px] mt-2" style={{ color: "#a05050" }}>{err}</p>}

      {/* Photo grid */}
      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
          {photos.map(p => (
            <div key={p.id} className="relative group rounded-lg overflow-hidden" style={{ aspectRatio: "4/3", background: "#111" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image_url}
                alt=""
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              {p.is_main && (
                <span className="absolute top-1.5 left-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "#fff", color: "#000" }}>
                  Главное
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.7)" }}>
                {!p.is_main && (
                  <button
                    type="button"
                    onClick={() => setMain(p.id)}
                    title="Сделать главным"
                    className="text-[10px] px-2 py-1 rounded font-medium"
                    style={{ background: "#fff", color: "#000" }}
                  >
                    Главное
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  title="Удалить"
                  className="text-[10px] px-2 py-1 rounded font-medium"
                  style={{ background: "#1a0808", color: "#bf6f6f", border: "1px solid #3a1a1a" }}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && photos.length === 0 && (
        <p className="text-[12px] mt-3" style={{ color: "#2a2a2a" }}>Фото ещё не добавлены</p>
      )}
    </div>
  );
}

interface Region { id: number; name: string; }

const EMPTY_LOC = { name: "", region_id: "", description: "", altitude: "", distance_km: "", travel_time: "", difficulty: "", visit_price: "", best_season: "", recommendations: "", is_popular: false, status: "active" };

function SectionLocations() {
  const [data, setData] = useState<Location[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_LOC);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [createdId, setCreatedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [locRes, regRes] = await Promise.all([
      fetch(`/api/admin/locations?q=${encodeURIComponent(q)}&status=${status}`),
      fetch("/api/admin/locations?type=regions"),
    ]);
    setData(await locRes.json());
    setRegions(await regRes.json());
    setLoading(false);
  }, [q, status]);

  useEffect(() => { void load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.region_id) { setErr("Заполните название и регион"); return; }
    setSaving(true); setErr("");
    const res = await fetch("/api/admin/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) { setErr("Ошибка сохранения"); setSaving(false); return; }
    const created = await res.json();
    setForm(EMPTY_LOC);
    setCreatedId(created.id);
    await load();
    setSaving(false);
  };

  const DIFF: Record<string, string> = { easy: "Лёгкий", medium: "Средний", hard: "Сложный" };

  const inputCls = "w-full px-3 py-2 rounded-lg text-[13px] outline-none transition-colors";
  const inputStyle = { background: "#0a0a0a", border: "1px solid #1c1c1c", color: "#e0e0e0" };
  const F = (k: keyof typeof form) => ({
    value: form[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value })),
    className: inputCls,
    style: inputStyle,
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => (e.target.style.borderColor = "#333"),
    onBlur:  (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => (e.target.style.borderColor = "#1c1c1c"),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight" style={{ color: "#fff" }}>Горные локации</h2>
          <p className="mt-0.5 text-sm" style={{ color: "#444" }}>Все горные места Кыргызстана</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setErr(""); }}
          className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
          style={{ background: showForm ? "#111" : "#fff", color: showForm ? "#555" : "#000", border: "1px solid " + (showForm ? "#222" : "#fff") }}>
          {showForm ? "Отмена" : "+ Добавить"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl p-6 mb-6 space-y-4" style={{ background: "#0a0a0a", border: "1px solid #1c1c1c" }}>
          <p className="text-[12px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#333" }}>Новая локация</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Название *</label>
              <input {...F("name")} placeholder="Ала-Арча" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Регион *</label>
              <select {...F("region_id")} className={inputCls} style={inputStyle}>
                <option value="">Выберите регион</option>
                {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Высота (м)</label>
              <input {...F("altitude")} type="number" placeholder="3500" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Расстояние (км)</label>
              <input {...F("distance_km")} type="number" placeholder="40" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Время в пути</label>
              <input {...F("travel_time")} placeholder="1.5 часа" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Сложность</label>
              <select {...F("difficulty")} className={inputCls} style={inputStyle}>
                <option value="">Не указана</option>
                <option value="easy">Лёгкий</option>
                <option value="medium">Средний</option>
                <option value="hard">Сложный</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Цена посещения</label>
              <input {...F("visit_price")} type="number" placeholder="500" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Лучший сезон</label>
              <select {...F("best_season")} className={inputCls} style={inputStyle}>
                <option value="">Не указан</option>
                <option value="spring">Весна</option>
                <option value="summer">Лето</option>
                <option value="autumn">Осень</option>
                <option value="winter">Зима</option>
                <option value="all_year">Круглый год</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Описание</label>
            <textarea {...F("description")} rows={3} placeholder="Описание локации…" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Рекомендации</label>
            <textarea {...F("recommendations")} rows={2} placeholder="Что взять с собой…" className={inputCls} style={inputStyle} />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_popular} onChange={e => setForm(f => ({ ...f, is_popular: e.target.checked }))}
                className="w-4 h-4 rounded" style={{ accentColor: "#fff" }} />
              <span className="text-[13px]" style={{ color: "#888" }}>Популярное место</span>
            </label>
          </div>
          {err && <p className="text-[12px]" style={{ color: "#a05050" }}>{err}</p>}
          {!createdId ? (
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 rounded-lg text-[13px] font-semibold disabled:opacity-50"
              style={{ background: "#fff", color: "#000" }}>
              {saving ? "Сохранение…" : "Добавить локацию"}
            </button>
          ) : (
            <div className="rounded-lg px-4 py-3 flex items-center gap-2" style={{ background: "#0a1a0a", border: "1px solid #1a3a1a" }}>
              <svg width="14" height="14" fill="none" stroke="#6fbf6f" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
              <span className="text-[13px]" style={{ color: "#6fbf6f" }}>Локация создана. Добавьте фотографии ниже.</span>
            </div>
          )}
          {createdId && <PhotoManager locationId={createdId} />}
          {createdId && (
            <button type="button" onClick={() => { setCreatedId(null); setShowForm(false); }}
              className="mt-3 px-4 py-2 rounded-lg text-[13px] font-medium"
              style={{ background: "#111", color: "#555", border: "1px solid #222" }}>
              Готово
            </button>
          )}
        </form>
      )}

      <SearchBar value={q} onChange={setQ} placeholder="Поиск по названию…" />
      <div className="flex gap-2 mb-5">
        {["all","active","hidden"].map(s => (
          <FilterBtn key={s} label={s === "all" ? "Все" : s === "active" ? "Активные" : "Скрытые"} active={status === s} onClick={() => setStatus(s)} />
        ))}
      </div>
      {loading ? <Loader /> : data.length === 0 ? <Empty /> : (
        <TableWrap>
          <thead><tr><Th>Название</Th><Th>Регион</Th><Th>Высота</Th><Th>Сложность</Th><Th>Услуг</Th><Th>Статус</Th></tr></thead>
          <tbody>
            {data.map(l => (
              <tr key={l.id}>
                <Td><span style={{ color: "#e0e0e0", fontWeight: 500 }}>{l.name}</span>{l.is_popular && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#111", color: "#666" }}>Popular</span>}</Td>
                <Td>{l.region}</Td>
                <Td>{l.altitude ? `${l.altitude} м` : "—"}</Td>
                <Td>{l.difficulty ? DIFF[l.difficulty] ?? l.difficulty : "—"}</Td>
                <Td>{l.services_count}</Td>
                <Td><Badge status={l.status} /></Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}

// ── Section: Services ─────────────────────────────────────────────────────────

const EMPTY_SVC = { title: "", description: "", partner_id: "", location_id: "", category_id: "", price: "", currency: "KGS", phone: "", whatsapp: "", telegram: "" };

function SectionServices() {
  const [data, setData] = useState<{ categories: { id: number; name: string; count: number }[]; services: Service[] }>({ categories: [], services: [] });
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [showCatForm, setShowCatForm] = useState(false);
  const [catName, setCatName] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/services?q=${encodeURIComponent(q)}&status=${status}`);
    setData(await res.json());
    setLoading(false);
  }, [q, status]);

  useEffect(() => { void load(); }, [load]);

  const inputCls = "w-full px-3 py-2 rounded-lg text-[13px] outline-none transition-colors";
  const inputStyle = { background: "#0a0a0a", border: "1px solid #1c1c1c", color: "#e0e0e0" };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => (e.target.style.borderColor = "#333");
  const onBlur  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => (e.target.style.borderColor = "#1c1c1c");

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) { setErr("Введите название категории"); return; }
    setSaving(true); setErr("");
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "category", name: catName }),
    });
    setCatName(""); setShowCatForm(false);
    await load(); setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight" style={{ color: "#fff" }}>Услуги</h2>
          <p className="mt-0.5 text-sm" style={{ color: "#444" }}>Категории и список всех услуг партнёров</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowCatForm(!showCatForm); setErr(""); }}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
            style={{ background: showCatForm ? "#111" : "#fff", color: showCatForm ? "#555" : "#000", border: "1px solid " + (showCatForm ? "#222" : "#fff") }}>
            {showCatForm ? "Отмена" : "+ Категория"}
          </button>
        </div>
      </div>

      {showCatForm && (
        <form onSubmit={handleAddCategory} className="rounded-xl p-5 mb-5 flex gap-3 items-end" style={{ background: "#0a0a0a", border: "1px solid #1c1c1c" }}>
          <div className="flex-1">
            <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Название категории *</label>
            <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Гиды, Трансфер…"
              className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <button type="submit" disabled={saving}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold disabled:opacity-50"
            style={{ background: "#fff", color: "#000" }}>
            {saving ? "…" : "Добавить"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {data.categories.map(c => (
          <div key={c.id} className="rounded-xl p-4" style={{ background: "#0a0a0a", border: "1px solid #1c1c1c" }}>
            <p className="text-2xl font-bold" style={{ color: "#fff" }}>{c.count}</p>
            <p className="text-[12px] mt-1" style={{ color: "#444" }}>{c.name}</p>
          </div>
        ))}
      </div>
      <SearchBar value={q} onChange={setQ} placeholder="Поиск по услугам…" />
      <div className="flex gap-2 mb-5">
        {["all","pending","approved","rejected"].map(s => (
          <FilterBtn key={s} label={s === "all" ? "Все" : STATUS_LABELS[s]} active={status === s} onClick={() => setStatus(s)} />
        ))}
      </div>
      {loading ? <Loader /> : data.services.length === 0 ? <Empty /> : (
        <TableWrap>
          <thead><tr><Th>Название</Th><Th>Категория</Th><Th>Локация</Th><Th>Партнёр</Th><Th>Цена</Th><Th>Статус</Th></tr></thead>
          <tbody>
            {data.services.map(s => (
              <tr key={s.id}>
                <Td><span style={{ color: "#e0e0e0", fontWeight: 500 }}>{s.title}</span></Td>
                <Td>{s.category}</Td>
                <Td>{s.location}</Td>
                <Td>{s.partner}</Td>
                <Td>{s.price ? `${s.price} ${s.currency ?? ""}` : "—"}</Td>
                <Td><Badge status={s.status} /></Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}

// ── Section: Partners ─────────────────────────────────────────────────────────

const EMPTY_PARTNER = { full_name: "", email: "", password: "", phone: "", whatsapp: "", telegram: "" };

function SectionPartners() {
  const [data, setData] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [toggling, setToggling] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_PARTNER);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/partners?q=${encodeURIComponent(q)}&status=${status}`);
    setData(await res.json());
    setLoading(false);
  }, [q, status]);

  useEffect(() => { void load(); }, [load]);

  const toggle = async (id: string, current: string) => {
    setToggling(id);
    await fetch("/api/admin/partners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: current === "active" ? "blocked" : "active" }),
    });
    await load();
    setToggling(null);
  };

  const inputCls = "w-full px-3 py-2 rounded-lg text-[13px] outline-none transition-colors";
  const inputStyle = { background: "#0a0a0a", border: "1px solid #1c1c1c", color: "#e0e0e0" };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "#333");
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "#1c1c1c");
  const F = (k: keyof typeof form, type = "text", placeholder = "") => ({
    type,
    placeholder,
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value })),
    className: inputCls,
    style: inputStyle,
    onFocus,
    onBlur,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) { setErr("Заполните имя, email и пароль"); return; }
    setSaving(true); setErr("");
    const res = await fetch("/api/admin/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.status === 409) { setErr("Пользователь с таким email уже существует"); setSaving(false); return; }
    if (!res.ok) { setErr("Ошибка сохранения"); setSaving(false); return; }
    setForm(EMPTY_PARTNER); setShowForm(false);
    await load(); setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight" style={{ color: "#fff" }}>Партнеры</h2>
          <p className="mt-0.5 text-sm" style={{ color: "#444" }}>Все зарегистрированные партнёры</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setErr(""); }}
          className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
          style={{ background: showForm ? "#111" : "#fff", color: showForm ? "#555" : "#000", border: "1px solid " + (showForm ? "#222" : "#fff") }}
        >
          {showForm ? "Отмена" : "+ Добавить"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl p-6 mb-6 space-y-4" style={{ background: "#0a0a0a", border: "1px solid #1c1c1c" }}>
          <p className="text-[12px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#333" }}>Новый партнёр</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Полное имя *</label>
              <input {...F("full_name", "text", "Иван Иванов")} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Email *</label>
              <input {...F("email", "email", "partner@example.com")} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Пароль *</label>
              <input {...F("password", "password", "Минимум 8 символов")} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Телефон</label>
              <input {...F("phone", "tel", "+996 700 000000")} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>WhatsApp</label>
              <input {...F("whatsapp", "tel", "+996 700 000000")} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-1.5" style={{ color: "#444" }}>Telegram</label>
              <input {...F("telegram", "text", "@username")} />
            </div>
          </div>
          {err && <p className="text-[12px]" style={{ color: "#a05050" }}>{err}</p>}
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 rounded-lg text-[13px] font-semibold disabled:opacity-50"
            style={{ background: "#fff", color: "#000" }}>
            {saving ? "Сохранение…" : "Добавить партнёра"}
          </button>
        </form>
      )}

      <SearchBar value={q} onChange={setQ} placeholder="Поиск по имени или email…" />
      <div className="flex gap-2 mb-5">
        {["all","active","blocked"].map(s => (
          <FilterBtn key={s} label={s === "all" ? "Все" : STATUS_LABELS[s]} active={status === s} onClick={() => setStatus(s)} />
        ))}
      </div>
      {loading ? <Loader /> : data.length === 0 ? <Empty /> : (
        <TableWrap>
          <thead><tr><Th>Имя</Th><Th>Email</Th><Th>Telegram</Th><Th>Услуг</Th><Th>Статус</Th><Th>Действие</Th></tr></thead>
          <tbody>
            {data.map(p => (
              <tr key={p.id}>
                <Td><span style={{ color: "#e0e0e0", fontWeight: 500 }}>{p.full_name}</span></Td>
                <Td>{p.email}</Td>
                <Td>{p.telegram ?? "—"}</Td>
                <Td>{p.services_count}</Td>
                <Td><Badge status={p.status} /></Td>
                <Td>
                  <button
                    disabled={toggling === p.id}
                    onClick={() => toggle(p.id, p.status)}
                    className="text-[12px] px-3 py-1 rounded transition-colors disabled:opacity-40"
                    style={{ background: "#111", color: p.status === "active" ? "#888" : "#e0e0e0", border: "1px solid #222" }}
                  >
                    {toggling === p.id ? "…" : p.status === "active" ? "Заблокировать" : "Разблокировать"}
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}

// ── Section: Listings (moderation) ───────────────────────────────────────────

function SectionListings() {
  const [data, setData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("pending");
  const [acting, setActing] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/listings?q=${encodeURIComponent(q)}&status=${status}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [q, status]);

  useEffect(() => { void load(); }, [load]);

  const act = async (id: string, action: string, comment?: string) => {
    setActing(id);
    await fetch("/api/admin/listings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, comment }),
    });
    setRejectId(null);
    setRejectComment("");
    await load();
    setActing(null);
  };

  return (
    <div>
      <SectionHeader title="Объявления" sub="Модерация заявок партнёров" />
      <SearchBar value={q} onChange={setQ} placeholder="Поиск по объявлениям…" />
      <div className="flex gap-2 mb-5">
        {["pending","approved","rejected","all"].map(s => (
          <FilterBtn key={s} label={s === "all" ? "Все" : STATUS_LABELS[s]} active={status === s} onClick={() => setStatus(s)} />
        ))}
      </div>
      {loading ? <Loader /> : data.length === 0 ? <Empty /> : (
        <div className="space-y-3">
          {data.map(item => (
            <div key={item.id} className="rounded-xl p-5" style={{ background: "#0a0a0a", border: "1px solid #1c1c1c" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-semibold" style={{ color: "#fff" }}>{item.title}</span>
                    <Badge status={item.status} />
                  </div>
                  <p className="text-[12px] mb-2" style={{ color: "#444" }}>
                    {item.category} · {item.location} · {item.partner}
                    {item.price ? ` · ${item.price} ${item.currency ?? ""}` : ""}
                  </p>
                  {item.description && (
                    <p className="text-[12px] line-clamp-2" style={{ color: "#555" }}>{item.description}</p>
                  )}
                  {item.reject_reason && (
                    <p className="text-[12px] mt-2 px-3 py-2 rounded" style={{ background: "#110a0a", color: "#888", border: "1px solid #1a0808" }}>
                      Причина отказа: {item.reject_reason}
                    </p>
                  )}
                </div>
                {item.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      disabled={acting === item.id}
                      onClick={() => act(item.id, "approve")}
                      className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors disabled:opacity-40"
                      style={{ background: "#0f1f0f", color: "#6fbf6f", border: "1px solid #1a3a1a" }}
                    >
                      {acting === item.id ? "…" : "Одобрить"}
                    </button>
                    <button
                      disabled={acting === item.id}
                      onClick={() => { setRejectId(item.id); setRejectComment(""); }}
                      className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors disabled:opacity-40"
                      style={{ background: "#1a0808", color: "#bf6f6f", border: "1px solid #3a1a1a" }}
                    >
                      Отклонить
                    </button>
                  </div>
                )}
              </div>
              {rejectId === item.id && (
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid #1c1c1c" }}>
                  <textarea
                    value={rejectComment}
                    onChange={e => setRejectComment(e.target.value)}
                    placeholder="Причина отказа (необязательно)…"
                    rows={2}
                    className="w-full px-3 py-2 rounded text-[13px] outline-none resize-none mb-3"
                    style={{ background: "#111", border: "1px solid #222", color: "#e0e0e0" }}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => act(item.id, "reject", rejectComment)} className="px-3 py-1.5 rounded text-[12px] font-medium" style={{ background: "#1a0808", color: "#bf6f6f", border: "1px solid #3a1a1a" }}>Подтвердить отказ</button>
                    <button onClick={() => setRejectId(null)} className="px-3 py-1.5 rounded text-[12px] font-medium" style={{ background: "#111", color: "#555", border: "1px solid #222" }}>Отмена</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section: Complaints ───────────────────────────────────────────────────────

function SectionComplaints() {
  return (
    <div>
      <SectionHeader title="Жалобы" sub="Раздел в разработке" />
      <div className="rounded-xl p-12 flex flex-col items-center justify-center text-center" style={{ background: "#0a0a0a", border: "1px solid #1c1c1c" }}>
        <svg width="32" height="32" fill="none" stroke="#333" strokeWidth="1.4" strokeLinecap="round" viewBox="0 0 24 24" className="mb-4">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
        </svg>
        <p className="text-sm font-medium" style={{ color: "#555" }}>Раздел жалоб будет доступен в следующей версии</p>
        <p className="text-[12px] mt-1" style={{ color: "#333" }}>Функционал находится в разработке</p>
      </div>
    </div>
  );
}

// ── Section: Stats ────────────────────────────────────────────────────────────

function SectionStats({ stats }: { stats: Stats }) {
  const rows = [
    { label: "Всего локаций",          value: stats.locations },
    { label: "Активных партнёров",     value: stats.partners },
    { label: "Одобренных объявлений",  value: stats.activeServices },
    { label: "Ожидают модерации",      value: stats.pendingServices },
  ];

  return (
    <div>
      <SectionHeader title="Статистика" sub="Общие показатели платформы TooGo" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {rows.map(r => (
          <div key={r.label} className="rounded-xl p-6 flex items-center justify-between" style={{ background: "#0a0a0a", border: "1px solid #1c1c1c" }}>
            <span className="text-[13px]" style={{ color: "#555" }}>{r.label}</span>
            <span className="text-2xl font-bold tracking-tight" style={{ color: "#fff" }}>{r.value.toLocaleString("ru-RU")}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-6" style={{ background: "#0a0a0a", border: "1px solid #1c1c1c" }}>
        <p className="text-[12px] font-semibold uppercase tracking-widest mb-4" style={{ color: "#333" }}>Распределение объявлений</p>
        {[
          { label: "Одобрено",  value: stats.activeServices,  total: stats.activeServices + stats.pendingServices },
          { label: "На модерации", value: stats.pendingServices, total: stats.activeServices + stats.pendingServices },
        ].map(bar => {
          const pct = bar.total > 0 ? Math.round((bar.value / bar.total) * 100) : 0;
          return (
            <div key={bar.label} className="mb-4">
              <div className="flex justify-between mb-1.5">
                <span className="text-[12px]" style={{ color: "#555" }}>{bar.label}</span>
                <span className="text-[12px]" style={{ color: "#444" }}>{bar.value} · {pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#111" }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#fff" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Section: Settings ─────────────────────────────────────────────────────────

function SectionSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ ADMIN_TELEGRAM_BOT_TOKEN: "", ADMIN_TELEGRAM_USER_ID: "" });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(d => {
        setForm({
          ADMIN_TELEGRAM_BOT_TOKEN: d.ADMIN_TELEGRAM_BOT_TOKEN ?? "",
          ADMIN_TELEGRAM_USER_ID: d.ADMIN_TELEGRAM_USER_ID ?? "",
        });
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <SectionHeader title="Настройки" sub="Конфигурация платформы" />
      <div className="max-w-lg space-y-4">
        {[
          { key: "ADMIN_TELEGRAM_BOT_TOKEN", label: "Telegram Bot Token", placeholder: "123456:ABC-DEF…" },
          { key: "ADMIN_TELEGRAM_USER_ID",   label: "Telegram User ID",   placeholder: "123456789" },
        ].map(field => (
          <div key={field.key}>
            <label className="block text-[12px] font-medium mb-2 uppercase tracking-wider" style={{ color: "#444" }}>{field.label}</label>
            <input
              type="text"
              value={form[field.key as keyof typeof form]}
              onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              className="w-full px-4 py-2.5 rounded-lg text-[13px] outline-none transition-colors"
              style={{ background: "#0a0a0a", border: "1px solid #1c1c1c", color: "#e0e0e0" }}
              onFocus={e => (e.target.style.borderColor = "#333")}
              onBlur={e => (e.target.style.borderColor = "#1c1c1c")}
            />
          </div>
        ))}
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-50"
          style={{ background: "#fff", color: "#000" }}
        >
          {saving ? "Сохранение…" : saved ? "Сохранено" : "Сохранить"}
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminDashboardClient({ email, stats }: Props) {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await fetch("/api/admin/logout", { method: "POST" }); }
    finally { router.push("/admin"); }
  };

  const statCards = [
    { label: "Локаций",       value: stats.locations,       sub: "горных мест"  },
    { label: "Партнеров",     value: stats.partners,        sub: "активных"     },
    { label: "Объявлений",    value: stats.activeServices,  sub: "активных"     },
    { label: "На модерации",  value: stats.pendingServices, sub: "ожидают"      },
  ];

  const activeLabel = NAV.find(n => n.key === activeKey)?.label ?? "Dashboard";

  function renderContent() {
    switch (activeKey) {
      case "locations":  return <SectionLocations />;
      case "services":   return <SectionServices />;
      case "partners":   return <SectionPartners />;
      case "listings":   return <SectionListings />;
      case "complaints": return <SectionComplaints />;
      case "stats":      return <SectionStats stats={stats} />;
      case "settings":   return <SectionSettings />;
      default: return (
        <>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "#fff" }}>Добро пожаловать</h2>
            <p className="mt-1 text-sm" style={{ color: "#444" }}>Актуальная статистика платформы TooGo</p>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-10">
            {statCards.map(card => (
              <div key={card.label} className="rounded-xl p-6 flex flex-col justify-between" style={{ background: "#0a0a0a", border: "1px solid #1c1c1c", minHeight: "140px" }}>
                <p className="text-[12px] font-medium uppercase tracking-widest" style={{ color: "#333" }}>{card.label}</p>
                <div>
                  <p className="text-4xl font-bold tracking-tight" style={{ color: "#fff" }}>{card.value.toLocaleString("ru-RU")}</p>
                  <p className="text-[11px] mt-1" style={{ color: "#444" }}>{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mb-5">
            <span className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "#2a2a2a" }}>Быстрые действия</span>
            <div className="flex-1 h-px" style={{ background: "#111" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "listings",  label: "Модерация",  sub: `${stats.pendingServices} заявок ожидают` },
              { key: "locations", label: "Локации",    sub: "Управление местами" },
              { key: "partners",  label: "Партнеры",   sub: "Управление партнёрами" },
            ].map(action => (
              <button
                key={action.key}
                onClick={() => setActiveKey(action.key)}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-colors"
                style={{ background: "#0a0a0a", border: "1px solid #1c1c1c" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#333")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#1c1c1c")}
              >
                <div>
                  <p className="text-[13px] font-medium" style={{ color: "#fff" }}>{action.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "#444" }}>{action.sub}</p>
                </div>
                <svg width="14" height="14" fill="none" stroke="#333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            ))}
          </div>
        </>
      );
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#000", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {sidebarOpen && (
        <div className="fixed inset-0 z-20 lg:hidden" style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={["fixed lg:static inset-y-0 left-0 z-30 w-52 shrink-0 flex flex-col transition-transform duration-300", sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"].join(" ")}
        style={{ background: "#000", borderRight: "1px solid #1c1c1c" }}
      >
        <div className="px-5 py-5" style={{ borderBottom: "1px solid #1c1c1c" }}>
          <span className="text-sm font-semibold tracking-tight" style={{ color: "#fff" }}>TooGo</span>
          <span className="text-sm font-normal" style={{ color: "#333" }}> / admin</span>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-px overflow-y-auto">
          {NAV.map(({ key, label, icon }) => {
            const active = activeKey === key;
            const badge = key === "complaints" ? "3" : key === "listings" && stats.pendingServices > 0 ? String(stats.pendingServices) : null;
            return (
              <button
                key={key}
                onClick={() => { setActiveKey(key); setSidebarOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-[9px] rounded-md text-[13px] font-medium transition-colors text-left"
                style={{ background: active ? "#fff" : "transparent", color: active ? "#000" : "#555" }}
              >
                <span style={{ color: active ? "#000" : "#444" }}>{icon}</span>
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: active ? "#000" : "#1c1c1c", color: active ? "#fff" : "#888" }}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-2 py-3 space-y-px" style={{ borderTop: "1px solid #1c1c1c" }}>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md" style={{ background: "#0a0a0a" }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: "#1c1c1c", color: "#fff" }}>
              {email.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium truncate" style={{ color: "#e0e0e0" }}>{email}</p>
              <p className="text-[10px]" style={{ color: "#333" }}>Администратор</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-2.5 px-3 py-[9px] rounded-md text-[13px] font-medium transition-colors text-left"
            style={{ color: "#444" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.background = "#111"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#444"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
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
            <span className="text-sm font-medium" style={{ color: "#fff" }}>{activeLabel}</span>
          </div>
          <span className="text-xs" style={{ color: "#333" }}>{email}</span>
        </header>

        <main className="flex-1 overflow-y-auto p-8" style={{ background: "#000" }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
