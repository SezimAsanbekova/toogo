"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT } from "../../i18n/useT";
import LocaleSwitcher from "../../components/LocaleSwitcher";
import ThemeToggle from "../../components/ThemeToggle";

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
  const [resendCooldown, setResendCooldown] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((v) => v - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const handleChange = (i: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[i] = value;
    setCode(next);
    if (value && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
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
        else if (data.error === "OTP_INVALID" || data.error === "OTP_NOT_FOUND") setError(t.errorInvalid);
        else setError(t.errorServer);
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

  const handleResend = async () => {
    const userId = sessionStorage.getItem("admin_pending_id");
    if (!userId) { router.push("/admin"); return; }
    setResendCooldown(60);
    setError("");
    setCode(["", "", "", "", "", ""]);
    refs.current[0]?.focus();
    // Resend just navigates back to re-trigger login
    // In production you'd have a separate resend endpoint
  };

  const codeComplete = code.every(Boolean);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold" style={{ color: "var(--accent)" }}>
          Too<span style={{ color: "var(--accent-light)" }}>Go</span>
          <span className="text-xs font-normal ml-2" style={{ color: "var(--text-muted)" }}>Admin</span>
        </span>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl p-8 shadow-xl"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>

            {/* Telegram icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "color-mix(in srgb, #2AABEE 12%, transparent)" }}>
              <svg className="w-7 h-7 text-[#2AABEE]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.04 14.422l-2.955-.924c-.642-.2-.654-.642.136-.953l11.527-4.448c.537-.194 1.006.131.814.151z"/>
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-center mb-1" style={{ color: "var(--text-primary)" }}>
              {t.title}
            </h1>
            <p className="text-sm text-center mb-8" style={{ color: "var(--text-muted)" }}>
              {t.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-4 text-center"
                  style={{ color: "var(--text-secondary)" }}>
                  {t.codeLabel}
                </label>

                {/* 6-digit input boxes */}
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
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
                      className="w-11 h-13 h-14 text-center text-xl font-bold rounded-xl outline-none transition-all"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        border: `2px solid ${digit ? "var(--accent)" : "var(--border)"}`,
                        color: "var(--text-primary)",
                        width: "44px",
                        height: "56px",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Hint */}
              <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
                {t.hint}
              </p>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                  style={{ backgroundColor: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !codeComplete}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {loading ? t.loading : t.submitButton}
              </button>

              {/* Resend */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="text-sm transition-colors disabled:opacity-40"
                  style={{ color: "var(--accent-light)" }}
                >
                  {resendCooldown > 0 ? `${t.resend} (${resendCooldown}s)` : t.resend}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
