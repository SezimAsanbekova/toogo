"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "../i18n/useT";
import LocaleSwitcher from "../components/LocaleSwitcher";
import ThemeToggle from "../components/ThemeToggle";

type AdminT = {
  login: {
    title: string; subtitle: string;
    emailLabel: string; emailPlaceholder: string;
    passwordLabel: string; passwordPlaceholder: string;
    submitButton: string; loading: string;
    errorInvalid: string; errorBlocked: string; errorServer: string;
  };
};

export default function AdminLoginPage() {
  const router = useRouter();
  const t = useT<AdminT>("admin").login;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "BLOCKED") setError(t.errorBlocked);
        else if (data.error === "INVALID_CREDENTIALS") setError(t.errorInvalid);
        else setError(t.errorServer);
        return;
      }

      // Save userId for OTP step
      sessionStorage.setItem("admin_pending_id", data.userId);
      router.push("/admin/otp");
    } catch {
      setError(t.errorServer);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl p-8 shadow-xl"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)" }}>
              <svg className="w-7 h-7" style={{ color: "var(--accent-light)" }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-center mb-1" style={{ color: "var(--text-primary)" }}>
              {t.title}
            </h1>
            <p className="text-sm text-center mb-8" style={{ color: "var(--text-muted)" }}>
              {t.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {showPassword ? (
                      <svg className="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

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
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {loading ? t.loading : t.submitButton}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
