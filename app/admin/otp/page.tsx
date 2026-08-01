"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT } from "../../i18n/useT";

type AdminT = {
  otp: {
    title: string; subtitle: string;
    codeLabel: string; codePlaceholder: string;
    submitButton: string; loading: string;
    resend: string; hint: string;
    errorInvalid: string; errorExpired: string; errorServer: string;
  };
};

export default function AdminOtpPage() {
  const router = useRouter();
  const t = useT<AdminT>("admin").otp;

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((v) => v - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      refs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) return;
    const userId = sessionStorage.getItem("admin_pending_id");
    if (!userId) { router.push("/admin"); return; }

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: fullCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "OTP_EXPIRED") setError(t.errorExpired);
        else setError(t.errorInvalid);
        setCode(["", "", "", "", "", ""]);
        refs.current[0]?.focus();
        return;
      }
      sessionStorage.removeItem("admin_pending_id");
      router.push("/admin/dashboard");
    } catch {
      setError(t.errorServer);
    } finally {
      setLoading(false);
    }
  };

  const codeComplete = code.every(Boolean);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')" }} />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#0d2b0d]/80" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold tracking-tight text-white">
          Too<span className="text-[#a8c97f]">Go</span>
          <span className="ml-2 text-xs font-normal text-white/40 uppercase tracking-widest">Admin</span>
        </span>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px]">
          <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-30"
            style={{ background: "radial-gradient(circle, #4ade80 0%, transparent 70%)" }} />

          <div className="relative rounded-3xl overflow-hidden border border-white/10"
            style={{ background: "rgba(10, 20, 10, 0.75)", backdropFilter: "blur(24px)" }}>

            <div className="p-8">
              {/* Telegram icon */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg, #0088cc, #2AABEE)" }}>
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.04 14.422l-2.955-.924c-.642-.2-.654-.642.136-.953l11.527-4.448c.537-.194 1.006.131.814.151z"/>
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-center text-white mb-1">{t.title}</h1>
              <p className="text-sm text-center text-white/50 mb-8">{t.subtitle}</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold mb-4 text-center uppercase tracking-widest text-white/50">
                    {t.codeLabel}
                  </label>

                  {/* 6 digit boxes */}
                  <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { refs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className="text-center text-2xl font-bold text-white rounded-xl outline-none transition-all"
                        style={{
                          width: "48px",
                          height: "60px",
                          background: "rgba(255,255,255,0.07)",
                          border: `2px solid ${digit ? "#4ade80" : "rgba(255,255,255,0.12)"}`,
                          boxShadow: digit ? "0 0 12px rgba(74,222,128,0.25)" : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-center text-white/30">{t.hint}</p>

                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                    style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !codeComplete}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)", boxShadow: "0 4px 20px rgba(34,197,94,0.3)" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      {t.loading}
                    </span>
                  ) : t.submitButton}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setCooldown(60); router.push("/admin"); }}
                    disabled={cooldown > 0}
                    className="text-sm transition-colors disabled:opacity-30"
                    style={{ color: "#4ade80" }}
                  >
                    {cooldown > 0 ? `${t.resend} (${cooldown}s)` : t.resend}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
