"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLoading(false);
        setError(data.error || "E-posta veya şifre hatalı");
        return;
      }

      // Hard redirect — cookie'nin middleware tarafından okunabilmesi için
      window.location.href = "/admin";
    } catch (err) {
      setLoading(false);
      setError("Sunucuya bağlanılamadı. Lütfen internetinizi veya sunucu durumunu kontrol edin.");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0D1B2A 0%, #1A2E45 50%, #0D1B2A 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      fontFamily: "'Inter', sans-serif",
      overflowY: "auto",
    }}>
      {/* Background decoration */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 70%)" }} />
      </div>

      <div style={{
        width: "100%",
        maxWidth: 440,
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: "16px",
            background: "linear-gradient(135deg, #A07840, #C9A96E)",
            marginBottom: "1rem",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0D1B2A" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "white", marginBottom: "0.25rem" }}>
            Yönetim Paneli
          </h1>
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Kuzey Feneri · Admin
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(201,169,110,0.15)",
          borderRadius: "20px",
          padding: "2.5rem",
          backdropFilter: "blur(20px)",
        }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: "1.75rem" }}>
            Giriş Yap
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>
                E-posta Adresi
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kuzeyfeneri.com"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px",
                  padding: "0.85rem 1rem",
                  fontSize: "0.9rem",
                  color: "white",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(201,169,110,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>
                Şifre
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px",
                  padding: "0.85rem 1rem",
                  fontSize: "0.9rem",
                  color: "white",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(201,169,110,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>

            {error && (
              <div style={{
                background: "rgba(220,38,38,0.12)",
                border: "1px solid rgba(220,38,38,0.25)",
                borderRadius: "10px",
                padding: "0.75rem 1rem",
                fontSize: "0.85rem",
                color: "#fca5a5",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "0.5rem",
                background: loading ? "rgba(201,169,110,0.4)" : "linear-gradient(135deg, #A07840, #C9A96E)",
                color: loading ? "rgba(255,255,255,0.5)" : "#0D1B2A",
                border: "none",
                borderRadius: "10px",
                padding: "0.95rem",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.25)" }}>
          © 2026 Kuzey Feneri Butik Otel. Tüm hakları saklıdır.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}