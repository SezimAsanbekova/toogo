"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Service {
  id: string; title: string; status: string;
  price: number | null; currency: string;
  category: string; categoryIcon: string;
  location: string; reject_reason: string | null; created_at: string;
}
interface Props {
  email: string;
  user: { full_name: string; email: string; phone: string; telegram: string; member_since: string; };
  initialServices: Service[];
  categories: { id: number; name: string; icon: string }[];
  locations: { id: string; name: string; region: string }[];
}
interface Notif { id: string; title: string; message: string; is_read: boolean; created_at: string; }

const STATUS_LABEL: Record<string, string> = {
  pending: "На модерации", approved: "Одобрено", rejected: "Отклонено", deleted: "Удалено",
};
const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  pending:  { color: "#92400e", bg: "#fef3c7" },
  approved: { color: "#065f46", bg: "#d1fae5" },
  rejected: { color: "#991b1b", bg: "#fee2e2" },
  deleted:  { color: "#6b7280", bg: "#f3f4f6" },
};

const NAV = [
  { key: "dashboard",     label: "Главная",    icon: "🏠" },
  { key: "services",      label: "Мои услуги", icon: "📋" },
  { key: "notifications", label: "Уведомления", icon: "🔔" },
  { key: "profile",       label: "Профиль",    icon: "👤" },
];

function Badge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.deleted;
  return <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ color: s.color, background: s.bg }}>{STATUS_LABEL[status] ?? status}</span>;
}

function SectionNotifications({ onRead }: { onRead: () => void }) {
  const [data, setData] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/partner/notifications").then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setData(d); setLoading(false); }).catch(()=>setLoading(false));
  }, []);
  const markAllRead = async () => {
    await fetch("/api/partner/notifications", { method: "PATCH" });
    setData(prev => prev.map(n => ({ ...n, is_read: true }))); onRead();
  };
  const unread = data.filter(n => !n.is_read).length;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Уведомления</h2>
        {unread > 0 && <button onClick={markAllRead} className="text-sm font-medium text-green-600 hover:text-green-700">Прочитать все</button>}
      </div>
      {loading ? <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"/></div>
      : data.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-sm text-gray-400">Уведомлений пока нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map(n => (
            <div key={n.id} className="p-4 rounded-2xl border transition-all" style={{ background: n.is_read ? "#fff" : "#f0fdf4", borderColor: n.is_read ? "#f3f4f6" : "#bbf7d0" }}>
              <div className="flex items-start gap-3">
                {!n.is_read && <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500 shrink-0"/>}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                  <p className="text-sm mt-1 text-gray-500 leading-relaxed">{n.message}</p>
                  <p className="text-xs mt-2 text-gray-400">{new Date(n.created_at).toLocaleDateString("ru-RU",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"})}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Services section (list + add form toggled) ────────────────────────────────

interface ServicesSectionProps {
  services: Service[];
  categories: { id: number; name: string; icon: string }[];
  locations: { id: string; name: string; region: string }[];
  user: { phone: string; telegram: string };
  deleting: string | null;
  onDelete: (id: string) => void;
  onAdd: (s: Service) => void;
}

function ServicesSection({ services, categories, locations, user, deleting, onDelete, onAdd }: ServicesSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:"", description:"", category_id:"", location_id:"", price:"", currency:"KGS", phone:user.phone??"", telegram:user.telegram??"", custom_category:"", new_location_name:"", new_location_region:"", new_location_desc:"", new_location_altitude:"", new_location_distance:"", new_location_travel_time:"", new_location_difficulty:"", new_location_price:"", new_location_season:"", new_location_rec:"", photos:[] as File[], loc_photos:[] as File[] });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const iS = { background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)" };
  const iCls = "w-full px-4 py-3 pl-11 rounded-xl text-sm outline-none transition-all text-white placeholder-white/30";
  const sCls = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all text-white";
  const oF = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => (e.target.style.borderColor="#4ade80");
  const oB = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => (e.target.style.borderColor="rgba(255,255,255,0.1)");
  const F = (k: keyof typeof form) => ({ value:form[k], onChange:(e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>setForm(f=>({...f,[k]:e.target.value})), onFocus:oF, onBlur:oB });
  const closeForm = () => { setShowForm(false); setErr(""); setDone(false); setForm({title:"",description:"",category_id:"",location_id:"",price:"",currency:"KGS",phone:user.phone??"",telegram:user.telegram??"",custom_category:"",new_location_name:"",new_location_region:"",new_location_desc:"",new_location_altitude:"",new_location_distance:"",new_location_travel_time:"",new_location_difficulty:"",new_location_price:"",new_location_season:"",new_location_rec:"",photos:[],loc_photos:[]}); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title||!form.category_id) { setErr("Заполните название и категорию"); return; }
    if (!form.location_id) { setErr("Выберите локацию"); return; }
    if (form.location_id === "__new__" && (!form.new_location_name || !form.new_location_region)) {
      setErr("Укажите название и регион новой локации"); return;
    }
    setSaving(true); setErr("");

    // If new location — submit request with all fields and photos
    if (form.location_id === "__new__") {
      if (!form.new_location_name || !form.new_location_region) {
        setErr("Укажите название и регион новой локации"); setSaving(false); return;
      }
      if (form.loc_photos.length === 0) {
        setErr("Добавьте хотя бы одно фото локации"); setSaving(false); return;
      }
      const fd = new FormData();
      fd.append("name", form.new_location_name);
      fd.append("region", form.new_location_region);
      if (form.new_location_desc) fd.append("description", form.new_location_desc);
      if (form.new_location_altitude) fd.append("altitude", form.new_location_altitude);
      if (form.new_location_distance) fd.append("distance_km", form.new_location_distance);
      if (form.new_location_travel_time) fd.append("travel_time", form.new_location_travel_time);
      if (form.new_location_difficulty) fd.append("difficulty", form.new_location_difficulty);
      if (form.new_location_price) fd.append("visit_price", form.new_location_price);
      if (form.new_location_season) fd.append("best_season", form.new_location_season);
      if (form.new_location_rec) fd.append("recommendations", form.new_location_rec);
      form.loc_photos.forEach(f => fd.append("photos", f));
      const locRes = await fetch("/api/partner/location-requests", { method: "POST", body: fd });
      if (!locRes.ok) { setErr("Ошибка отправки заявки на локацию"); setSaving(false); return; }
      setSaving(false); setDone(true); return;
    }

    // Create service
    const res = await fetch("/api/partner/services", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        title: form.title,
        description: form.description,
        category_id: form.category_id,
        location_id: form.location_id,
        price: form.price,
        currency: form.currency,
        phone: form.phone,
        telegram: form.telegram,
      }),
    });
    if (!res.ok) { setErr("Ошибка сохранения"); setSaving(false); return; }
    const created = await res.json();

    // Upload photos
    if (form.photos.length > 0) {
      const fd = new FormData();
      fd.append("service_id", created.id);
      form.photos.forEach(f => fd.append("files", f));
      await fetch("/api/partner/services/photos", { method: "POST", body: fd }).catch(() => {});
    }

    onAdd({ id:created.id, title:form.title, status:"pending", price:form.price?Number(form.price):null, currency:form.currency, category:categories.find(c=>c.id===Number(form.category_id))?.name??"", categoryIcon:categories.find(c=>c.id===Number(form.category_id))?.icon??"", location:locations.find(l=>l.id===form.location_id)?.name??"", reject_reason:null, created_at:new Date().toISOString() });
    setDone(true); setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Мои услуги</h2>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-all">+ Добавить услугу</button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Услуг пока нет</p>
          <p className="text-xs text-gray-400 mb-5">Добавьте свою первую услугу</p>
          <button onClick={() => setShowForm(true)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700">+ Добавить услугу</button>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map(s => (
            <div key={s.id} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-green-50">{s.categoryIcon||"🏔️"}</div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{s.title}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{s.category} · {s.location}</p>
                    {s.price && <p className="text-sm font-medium text-green-700 mt-0.5">{s.price.toLocaleString("ru-RU")} {s.currency}</p>}
                  </div>
                </div>
                <Badge status={s.status} />
              </div>
              {s.reject_reason && <div className="mt-3 px-3 py-2 rounded-xl text-sm bg-red-50 text-red-700 border border-red-100">Причина отказа: {s.reject_reason}</div>}
              {s.status !== "deleted" && (
                <div className="mt-3 flex justify-end border-t border-gray-100 pt-3">
                  <button disabled={deleting===s.id} onClick={()=>onDelete(s.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 disabled:opacity-40">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                    {deleting===s.id ? "Удаление…" : "Удалить"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative w-full max-w-lg rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl"
            style={{ background:"#fff" }}>
            <div className="p-6">
              {done ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Услуга отправлена!</h3>
                  <p className="text-sm text-gray-500 mb-6">Заявка отправлена на проверку администратору</p>                  <div className="flex gap-3">
                    <button onClick={()=>{ setDone(false); setForm({title:"",description:"",category_id:"",location_id:"",price:"",currency:"KGS",phone:user.phone??"",telegram:user.telegram??""}); }}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">Добавить ещё</button>
                    <button onClick={closeForm}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-all">Готово</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Новая услуга</h2>
                      <p className="text-sm text-gray-400 mt-0.5">Заявка уйдёт на проверку администратору</p>
                    </div>
                    <button onClick={closeForm} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <form onSubmit={submit} className="space-y-3">
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-gray-500 uppercase tracking-wider">Название *</label>
                      <input {...F("title")} placeholder="Конная прогулка" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-green-400 bg-gray-50 text-gray-900 placeholder-gray-400" />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-gray-500 uppercase tracking-wider">Категория *</label>
                      <select {...F("category_id")} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-green-400 bg-gray-50 text-gray-900">
                        <option value="">Выберите категорию</option>
                        {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                      </select>
                      {/* "Другое" — custom category input */}
                      {categories.find(c=>c.id===Number(form.category_id))?.name === "Другое" && (
                        <input value={form.custom_category} onChange={e=>setForm(f=>({...f,custom_category:e.target.value}))}
                          placeholder="Введите свою категорию…"
                          className="mt-2 w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-green-300 bg-green-50 text-gray-900 placeholder-gray-400" />
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-gray-500 uppercase tracking-wider">Локация *</label>
                      <select value={form.location_id} onChange={e=>setForm(f=>({...f,location_id:e.target.value}))}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-green-400 bg-gray-50 text-gray-900">
                        <option value="">Выберите локацию</option>
                        {locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
                        <option value="__new__">+ Предложить новую локацию</option>
                      </select>
                      {/* New location form */}
                      {form.location_id === "__new__" && (
                        <div className="mt-2 p-4 rounded-xl bg-green-50 border border-green-200 space-y-3">
                          <p className="text-xs font-semibold text-green-700">🏔 Новая локация — уйдёт на рассмотрение администратору</p>
                          <div className="grid grid-cols-2 gap-2">
                            <input value={form.new_location_name} onChange={e=>setForm(f=>({...f,new_location_name:e.target.value}))}
                              placeholder="Название *" className="px-3 py-2 rounded-lg text-sm outline-none border border-green-200 bg-white text-gray-900 placeholder-gray-400" />
                            <input value={form.new_location_region} onChange={e=>setForm(f=>({...f,new_location_region:e.target.value}))}
                              placeholder="Регион *" className="px-3 py-2 rounded-lg text-sm outline-none border border-green-200 bg-white text-gray-900 placeholder-gray-400" />
                            <input value={form.new_location_altitude} onChange={e=>setForm(f=>({...f,new_location_altitude:e.target.value}))}
                              type="number" placeholder="Высота (м)" className="px-3 py-2 rounded-lg text-sm outline-none border border-green-200 bg-white text-gray-900 placeholder-gray-400" />
                            <input value={form.new_location_distance} onChange={e=>setForm(f=>({...f,new_location_distance:e.target.value}))}
                              type="number" placeholder="Расстояние (км)" className="px-3 py-2 rounded-lg text-sm outline-none border border-green-200 bg-white text-gray-900 placeholder-gray-400" />
                            <input value={form.new_location_travel_time} onChange={e=>setForm(f=>({...f,new_location_travel_time:e.target.value}))}
                              placeholder="Время в пути" className="px-3 py-2 rounded-lg text-sm outline-none border border-green-200 bg-white text-gray-900 placeholder-gray-400" />
                            <select value={form.new_location_difficulty} onChange={e=>setForm(f=>({...f,new_location_difficulty:e.target.value}))}
                              className="px-3 py-2 rounded-lg text-sm outline-none border border-green-200 bg-white text-gray-900">
                              <option value="">Сложность</option>
                              <option value="easy">Лёгкий</option>
                              <option value="medium">Средний</option>
                              <option value="hard">Сложный</option>
                            </select>
                            <input value={form.new_location_price} onChange={e=>setForm(f=>({...f,new_location_price:e.target.value}))}
                              type="number" placeholder="Цена посещения" className="px-3 py-2 rounded-lg text-sm outline-none border border-green-200 bg-white text-gray-900 placeholder-gray-400" />
                            <select value={form.new_location_season} onChange={e=>setForm(f=>({...f,new_location_season:e.target.value}))}
                              className="px-3 py-2 rounded-lg text-sm outline-none border border-green-200 bg-white text-gray-900">
                              <option value="">Лучший сезон</option>
                              <option value="spring">Весна</option>
                              <option value="summer">Лето</option>
                              <option value="autumn">Осень</option>
                              <option value="winter">Зима</option>
                              <option value="all_year">Круглый год</option>
                            </select>
                          </div>
                          <textarea value={form.new_location_desc} onChange={e=>setForm(f=>({...f,new_location_desc:e.target.value}))}
                            placeholder="Описание локации…" rows={2}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none border border-green-200 bg-white text-gray-900 placeholder-gray-400 resize-none" />
                          <textarea value={form.new_location_rec} onChange={e=>setForm(f=>({...f,new_location_rec:e.target.value}))}
                            placeholder="Рекомендации (что взять с собой…)" rows={2}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none border border-green-200 bg-white text-gray-900 placeholder-gray-400 resize-none" />
                          {/* Location photos */}
                          <div>
                            <p className="text-xs font-semibold text-green-700 mb-1.5">Фотографии локации * (до 10)</p>
                            <label className="flex flex-col items-center justify-center gap-1.5 rounded-lg cursor-pointer border-2 border-dashed border-green-300 hover:border-green-500 bg-white transition-all p-3">
                              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                              <span className="text-xs text-gray-400">Добавить фото</span>
                              <input type="file" accept="image/*" multiple className="hidden"
                                onChange={e => { const files = Array.from(e.target.files??[]).slice(0,10); setForm(f=>({...f,loc_photos:files})); }} />
                            </label>
                            {form.loc_photos.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {form.loc_photos.map((file,i)=>(
                                  <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-green-200">
                                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                                    <button type="button" onClick={()=>setForm(f=>({...f,loc_photos:f.loc_photos.filter((_,j)=>j!==i)}))}
                                      className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-bl">×</button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price + Currency */}
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="block text-xs font-semibold mb-1.5 text-gray-500 uppercase tracking-wider">Цена</label><input {...F("price")} type="number" placeholder="1500" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-green-400 bg-gray-50 text-gray-900" /></div>
                      <div><label className="block text-xs font-semibold mb-1.5 text-gray-500 uppercase tracking-wider">Валюта</label><select {...F("currency")} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-green-400 bg-gray-50 text-gray-900"><option value="KGS">KGS — сом</option><option value="USD">USD — доллар</option></select></div>
                    </div>

                    {/* Phone + Telegram */}
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="block text-xs font-semibold mb-1.5 text-gray-500 uppercase tracking-wider">Телефон</label><input {...F("phone")} type="tel" placeholder="+996 700 000000" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-green-400 bg-gray-50 text-gray-900" /></div>
                      <div><label className="block text-xs font-semibold mb-1.5 text-gray-500 uppercase tracking-wider">Telegram</label><input {...F("telegram")} placeholder="@username" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-green-400 bg-gray-50 text-gray-900" /></div>
                    </div>

                    {/* Description */}
                    <div><label className="block text-xs font-semibold mb-1.5 text-gray-500 uppercase tracking-wider">Описание</label><textarea {...F("description")} rows={3} placeholder="Опишите вашу услугу…" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-green-400 bg-gray-50 text-gray-900 resize-none" /></div>

                    {/* Photos */}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-gray-500 uppercase tracking-wider">
                        Фотографии {form.category_id ? `(${categories.find(c=>c.id===Number(form.category_id))?.name ?? "услуги"})` : ""} — до 10 штук
                      </label>
                      <label className="flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer border-2 border-dashed border-gray-200 hover:border-green-400 bg-gray-50 transition-all p-4">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <span className="text-xs text-gray-400">Нажмите чтобы выбрать фото</span>
                        <input type="file" accept="image/*" multiple className="hidden"
                          onChange={e => {
                            const files = Array.from(e.target.files ?? []).slice(0, 10);
                            setForm(f => ({ ...f, photos: files }));
                          }} />
                      </label>
                      {form.photos.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {form.photos.map((file, i) => (
                            <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => setForm(f => ({ ...f, photos: f.photos.filter((_,j)=>j!==i) }))}
                                className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-bl">×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {err && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-100">{err}</p>}
                    <button type="submit" disabled={saving} className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-all">
                      {saving?(<span className="flex items-center justify-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Отправка…</span>):"Отправить на модерацию"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PartnerDashboardClient({ email, user, initialServices, categories, locations }: Props) {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("dashboard");
  const [services, setServices] = useState<Service[]>(initialServices);
  const [unreadCount, setUnreadCount] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/partner/notifications").then(r=>r.json())
      .then((d: Notif[]) => { if(Array.isArray(d)) setUnreadCount(d.filter(n=>!n.is_read).length); })
      .catch(()=>{});
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await fetch("/api/partner/logout", { method: "POST" }); } finally { router.push("/partner/login"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить услугу?")) return;
    setDeleting(id);
    const res = await fetch(`/api/partner/services/${id}`, { method: "DELETE" });
    if (res.ok) setServices(prev => prev.filter(s => s.id !== id));
    setDeleting(null);
  };

  const counts = {
    total: services.length,
    pending: services.filter(s => s.status === "pending").length,
    approved: services.filter(s => s.status === "approved").length,
    rejected: services.filter(s => s.status === "rejected").length,
  };

  // ── Add form ──────────────────────────────────────────────────────────────
  function AddServiceForm() {
    const [form, setForm] = useState({ title:"", description:"", category_id:"", location_id:"", price:"", currency:"KGS", phone: user.phone??"", telegram: user.telegram??"" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");
    const [done, setDone] = useState(false);

    const iCls = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 text-gray-900 placeholder-gray-400";
    const F = (k: keyof typeof form) => ({
      value: form[k],
      onChange: (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm(f=>({...f,[k]:e.target.value})),
      className: iCls,
    });

    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.title||!form.category_id||!form.location_id) { setErr("Заполните обязательные поля"); return; }
      setSaving(true); setErr("");
      const res = await fetch("/api/partner/services", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
      if (!res.ok) { setErr("Ошибка сохранения"); setSaving(false); return; }
      const created = await res.json();
      setServices(prev => [{ id:created.id, title:form.title, status:"pending", price: form.price?Number(form.price):null, currency:form.currency, category: categories.find(c=>c.id===Number(form.category_id))?.name??"", categoryIcon: categories.find(c=>c.id===Number(form.category_id))?.icon??"", location: locations.find(l=>l.id===form.location_id)?.name??"", reject_reason:null, created_at: new Date().toISOString() },...prev]);
      setDone(true); setSaving(false);
    };

    if (done) return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Услуга отправлена!</h3>
        <p className="text-sm text-gray-500 mb-8 max-w-xs">Ваша заявка отправлена администратору. Вы получите уведомление после проверки.</p>
        <div className="flex gap-3">
          <button onClick={()=>{ setDone(false); setForm({title:"",description:"",category_id:"",location_id:"",price:"",currency:"KGS",phone:user.phone??"",telegram:user.telegram??""}); }}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all">
            Добавить ещё
          </button>
          <button onClick={()=>setActiveKey("services")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-all">
            Мои услуги
          </button>
        </div>
      </div>
    );

    return (
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Новая услуга</h2>
          <p className="text-sm text-gray-500 mt-1">Заполните форму — заявка уйдёт администратору на проверку</p>
        </div>

        <form onSubmit={submit} className="space-y-5">

          {/* Card 1 — основное */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Основное</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Название <span className="text-red-400">*</span></label>
              <input {...F("title")} placeholder="Конная прогулка по ущелью" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Категория <span className="text-red-400">*</span></label>
                <select {...F("category_id")} className={iCls}>
                  <option value="">Выберите категорию</option>
                  {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Локация <span className="text-red-400">*</span></label>
                <select {...F("location_id")} className={iCls}>
                  <option value="">Выберите локацию</option>
                  {locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание</label>
              <textarea {...F("description")} rows={4} placeholder="Расскажите подробнее о вашей услуге…" className={iCls} />
            </div>
          </div>

          {/* Card 2 — цена */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Стоимость</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Цена</label>
                <input {...F("price")} type="number" placeholder="1500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Валюта</label>
                <select {...F("currency")} className={iCls}>
                  <option value="KGS">🇰🇬 KGS — сом</option>
                  <option value="USD">🇺🇸 USD — доллар</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 3 — контакты */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Контакты</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </span>
                  <input {...F("phone")} type="tel" placeholder="+996 700 000000" className={iCls + " pl-10"} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telegram</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-1.97 9.284c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.4 13.93l-2.95-.924c-.643-.204-.657-.643.136-.953l11.52-4.44c.537-.194 1.006.13.456.634z"/></svg>
                  </span>
                  <input {...F("telegram")} placeholder="@username" className={iCls + " pl-10"} />
                </div>
              </div>
            </div>
          </div>

          {err && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {err}
            </div>
          )}

          <button type="submit" disabled={saving}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-all shadow-sm shadow-green-200">
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Отправка…
              </span>
            ) : "Отправить на модерацию"}
          </button>
        </form>
      </div>
    );
  }

  // ── renderContent ─────────────────────────────────────────────────────────
  function renderContent() {
    if (activeKey==="notifications") return <SectionNotifications onRead={()=>setUnreadCount(0)} />;

    if (activeKey==="services") return (
      <ServicesSection
        services={services}
        categories={categories}
        locations={locations}
        user={user}
        deleting={deleting}
        onDelete={handleDelete}
        onAdd={(s) => setServices(prev => [s, ...prev])}
      />
    );

    if (activeKey==="profile") return (
      <div className="max-w-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Профиль</h2>
        <div className="rounded-2xl overflow-hidden border border-gray-100">
          {[{label:"Имя",value:user.full_name},{label:"Email",value:user.email},{label:"Телефон",value:user.phone||"—"},{label:"Telegram",value:user.telegram||"—"},{label:"Партнёр с",value:new Date(user.member_since).toLocaleDateString("ru-RU",{day:"numeric",month:"long",year:"numeric"})}].map((row,i)=>(
            <div key={row.label} className="flex items-center justify-between px-5 py-4" style={{background:i%2===0?"#fff":"#f9fafb",borderBottom:i<4?"1px solid #f3f4f6":"none"}}>
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className="text-sm font-medium text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    );

    // Dashboard home
    return (
      <>
        {/* Hero banner */}
        <div className="rounded-2xl p-6 mb-6 relative overflow-hidden" style={{background:"linear-gradient(135deg,#dcfce7 0%,#bbf7d0 50%,#86efac 100%)"}}>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-900">Добро пожаловать, {user.full_name.split(" ")[0]}! 👋</h2>
            <p className="text-sm text-gray-600 mt-1">Управляйте своими услугами на платформе TooGo</p>
            <div className="flex items-center gap-2 mt-3 text-sm text-green-700 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Ваш аккаунт активен
            </div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-20">🏔️</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label:"Всего услуг",    value:counts.total,    color:"#3b82f6", bg:"#eff6ff",
              icon:<svg fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg> },
            { label:"На модерации",   value:counts.pending,  color:"#d97706", bg:"#fffbeb",
              icon:<svg fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
            { label:"Одобрено",       value:counts.approved, color:"#059669", bg:"#ecfdf5",
              icon:<svg fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg> },
            { label:"Отклонено",      value:counts.rejected, color:"#dc2626", bg:"#fef2f2",
              icon:<svg fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg> },
          ].map(c=>(
            <div key={c.label} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:c.bg,color:c.color}}>
                <svg className="w-5 h-5" style={{color:c.color}} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  {c.icon.props.children}
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-400 mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Recent */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Последние услуги</h3>
          {services.length>0&&<button onClick={()=>setActiveKey("services")} className="text-sm font-medium text-green-600 hover:text-green-700">Все услуги →</button>}
        </div>
        {services.length===0 ? (
          <div className="text-center py-12 rounded-2xl bg-gray-50 border border-dashed border-gray-200">
            <p className="text-sm text-gray-400 mb-4">Вы ещё не добавили ни одной услуги</p>
            <button onClick={()=>setActiveKey("add")} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600">+ Добавить услугу</button>
          </div>
        ) : (
          <div className="space-y-2">
            {services.slice(0,5).map(s=>(
              <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-lg shrink-0">{s.categoryIcon||"🏔️"}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.title}</p>
                    <p className="text-xs text-gray-400">{s.location}</p>
                  </div>
                </div>
                <Badge status={s.status} />
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Sidebar — full height */}
      <aside className="w-60 shrink-0 flex flex-col bg-white border-r border-gray-100 shadow-sm">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">Too<span className="text-green-600">Go</span></span>
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">Партнёрский портал</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
          {NAV.map(({ key, label, icon }) => {
            const active = activeKey === key;
            return (
              <button key={key} onClick={() => setActiveKey(key)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                style={{ background: active ? "#f0fdf4" : "transparent", color: active ? "#16a34a" : "#6b7280" }}>
                <div className="flex items-center gap-3">
                  <span className="text-base">{icon}</span>
                  <span>{label}</span>
                </div>
                {key === "notifications" && unreadCount > 0 && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white bg-green-600">{unreadCount}</span>
                )}
                {key === "services" && counts.pending > 0 && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-amber-800 bg-amber-100">{counts.pending}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 shrink-0">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{user.full_name}</p>
              <p className="text-[10px] text-gray-400 truncate">{email}</p>
            </div>
          </div>
          <button onClick={handleLogout} disabled={loggingOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            {loggingOut ? "Выход…" : "Выйти"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 shrink-0 flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900">
            {NAV.find(n => n.key === activeKey)?.label ?? "Главная"}
          </h1>
          <span className="text-xs text-gray-400 hidden sm:block">{email}</span>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
