"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirm: "",
    phone: "",
    telegram: "",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.password_confirm) { setError("Пароли не совпадают"); return; }
    if (form.password.length < 8) { setError("Пароль должен быть не менее 8 символов"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/partner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          telegram: form.telegram,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msgs: Record<string, string> = {
          EMAIL_EXISTS: "Пользователь с таким email уже зарегистрирован",
          PHONE_EXISTS: "Этот номер телефона уже используется",
          PASSWORD_TOO_SHORT: "Пароль должен быть не менее 8 символов",
          MISSING_FIELDS: "Заполните все обязательные поля",
          SERVER_ERROR: "Ошибка сервера. Попробуйте позже",
        };
        setError(msgs[data.error] ?? "Ошибка регистрации");
        return;
      }
      router.push("/partner/login?registered=1");
    } catch {
      setError("Ошибка сети. Проверьте подключение");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 pl-11 rounded-xl text-sm outline-none transition-all text-white placeholder-white/30";
  const inputStyle = { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "#4ade80");
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')" }} />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#0d2b0d]/80" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Too<span className="text-[#a8c97f]">Go</span>
          <span className="ml-2 text-xs font-normal text-white/40 uppercase tracking-widest">Партнёр</span>
        </Link>
        <Link href="/partner/login"
          className="text-sm text-white/60 hover:text-white transition-colors">
          Уже есть аккаунт? <span className="text-[#a8c97f] font-medium">Войти</span>
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[440px]">
          {/* Glow */}
          <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-30"
            style={{ background: "radial-gradient(circle, #4ade80 0%, transparent 70%)" }} />

          <div className="relative rounded-3xl overflow-hidden border border-white/10"
            style={{ background: "rgba(10, 20, 10, 0.75)", backdropFilter: "blur(24px)" }}>
            <div className="p-8">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)" }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-center text-white mb-1">Стать партнёром</h1>
              <p className="text-sm text-center text-white/50 mb-8">Создайте аккаунт и добавляйте свои услуги</p>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Full name */}
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-widest text-white/50">Имя и фамилия *</label>
                  <div className="relative">
                    <input type="text" value={form.full_name} onChange={set("full_name")}
                      placeholder="Айбек Матанов" required
                      className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-widest text-white/50">Email *</label>
                  <div className="relative">
                    <input type="email" value={form.email} onChange={set("email")}
                      placeholder="you@example.com" required autoComplete="email"
                      className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-widest text-white/50">Пароль * (мин. 8 символов)</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                      placeholder="••••••••" required autoComplete="new-password"
                      className={inputCls + " pr-11"} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      {showPass
                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      }
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-widest text-white/50">Повторите пароль *</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={form.password_confirm} onChange={set("password_confirm")}
                      placeholder="••••••••" required autoComplete="new-password"
                      className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-widest text-white/50">Телефон</label>
                  <div className="relative">
                    <input type="tel" value={form.phone} onChange={set("phone")}
                      placeholder="+996 700 000000"
                      className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>

                {/* Telegram */}
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-widest text-white/50">Telegram</label>
                  <div className="relative">
                    <input type="text" value={form.telegram} onChange={set("telegram")}
                      placeholder="@username"
                      className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                      viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-1.97 9.284c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.4 13.93l-2.95-.924c-.643-.204-.657-.643.136-.953l11.52-4.44c.537-.194 1.006.13.456.634z"/>
                    </svg>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                    style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
                  style={{ background: loading ? "#16a34a" : "linear-gradient(135deg, #16a34a, #22c55e)", boxShadow: "0 4px 20px rgba(34,197,94,0.3)" }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Регистрация…
                    </span>
                  ) : "Зарегистрироваться"}
                </button>
              </form>

              <p className="text-center text-xs text-white/30 mt-6">
                Уже есть аккаунт?{" "}
                <Link href="/partner/login" className="text-[#a8c97f] hover:underline">Войти</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
