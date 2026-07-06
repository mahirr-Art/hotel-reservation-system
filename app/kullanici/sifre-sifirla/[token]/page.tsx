"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SifreSifirlaPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Şifreler eşleşmiyor"); return; }
    if (password.length < 6) { setError("Şifre en az 6 karakter olmalı"); return; }
    setLoading(true);
    const res = await fetch(`/api/kullanici/sifre-onayla/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Bir hata oluştu"); return; }
    setSuccess(true);
    setTimeout(() => router.push("/kullanici"), 2500);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    padding: "0.8rem 1rem",
    fontSize: "0.9rem",
    color: "var(--text-dark)",
    outline: "none",
    background: "#FAFAFA",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ background: "white", borderRadius: "24px", padding: "2.5rem", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 8px 40px rgba(0,0,0,0.07)" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.75rem" }}>
                Şifre Güncellendi!
              </h2>
              <p style={{ color: "var(--text-light)", fontSize: "0.88rem" }}>
                Yeni şifrenizle giriş yapabilirsiniz. Yönlendiriliyorsunuz...
              </p>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>
                Yeni Şifre Belirle
              </h1>
              <div className="gold-divider" style={{ marginBottom: "1.75rem" }} />
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.4rem" }}>
                    Yeni Şifre
                  </label>
                  <input
                    type="password" required
                    placeholder="En az 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.4rem" }}>
                    Şifre Tekrar
                  </label>
                  <input
                    type="password" required
                    placeholder="Şifreyi tekrar girin"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
                {error && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "0.75rem", fontSize: "0.85rem", color: "#DC2626" }}>
                    {error}
                  </div>
                )}
                <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: "center", borderRadius: "10px" }}>
                  {loading ? "Güncelleniyor..." : "Şifremi Güncelle"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
