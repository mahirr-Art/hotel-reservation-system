"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/lang";

type Reservation = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  status: string;
  createdAt: string;
  room: { name: string; city: string; category: { name: string } };
};

type User = { id: string; fullName: string; email: string };

function StatusBadge({ status, lang }: { status: string; lang: "tr" | "en" }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    ONAYLANDI: { label: lang === "tr" ? "Onaylandı" : "Confirmed", color: "#16a34a", bg: "#f0fdf4" },
    IPTAL: { label: lang === "tr" ? "İptal Edildi" : "Cancelled", color: "#dc2626", bg: "#fef2f2" },
    BEKLIYOR: { label: lang === "tr" ? "Bekliyor" : "Pending", color: "#d97706", bg: "#fffbeb" },
  };
  const s = map[status] ?? map.BEKLIYOR;
  return (
    <span style={{
      fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.75rem",
      borderRadius: "20px", background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  );
}

export default function KullaniciPage() {
  const { lang, t } = useTranslation();
  const [tab, setTab] = useState<"giris" | "kayit" | "profil">("giris");
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Forgot password
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Profile update state
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password update state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Check session on load
  useEffect(() => {
    fetch("/api/kullanici/ben")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setProfileName(data.user.fullName || "");
          setProfilePhone(data.user.phone || "");
          setTab("profil");
          loadReservations(data.user.email);
        }
      })
      .catch(() => {});
  }, []);

  async function loadReservations(email: string) {
    const res = await fetch(`/api/kullanici/rezervasyonlar?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (data.reservations) setReservations(data.reservations);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/kullanici/giris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || (lang === "tr" ? "Giriş başarısız" : "Login failed")); return; }
    setUser(data.user);
    setProfileName(data.user.fullName || "");
    setProfilePhone(data.user.phone || "");
    setTab("profil");
    loadReservations(data.user.email);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/kullanici/kayit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: registerName,
        email: registerEmail,
        phone: registerPhone,
        password: registerPassword,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || (lang === "tr" ? "Kayıt başarısız" : "Registration failed")); return; }
    setUser(data.user);
    setProfileName(data.user.fullName || "");
    setProfilePhone(data.user.phone || "");
    setTab("profil");
    setReservations([]);
  }

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      const res = await fetch("/api/kullanici/ben", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: profileName, phone: profilePhone }),
      });
      const data = await res.json();
      setProfileLoading(false);
      if (!res.ok) {
        setProfileError(data.error || (lang === "tr" ? "Güncelleme başarısız" : "Update failed"));
        return;
      }
      setUser(data.user);
      setProfileSuccess(lang === "tr" ? "Profil bilgileriniz başarıyla güncellendi." : "Profile updated successfully.");
    } catch {
      setProfileLoading(false);
      setProfileError(lang === "tr" ? "Bağlantı hatası oluştu." : "A connection error occurred.");
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordLoading(true);

    try {
      const res = await fetch("/api/kullanici/ben", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      setPasswordLoading(false);
      if (!res.ok) {
        setPasswordError(data.error || (lang === "tr" ? "Şifre değiştirme başarısız" : "Password update failed"));
        return;
      }
      setOldPassword("");
      setNewPassword("");
      setPasswordSuccess(lang === "tr" ? "Şifreniz başarıyla değiştirildi." : "Password changed successfully.");
    } catch {
      setPasswordLoading(false);
      setPasswordError(lang === "tr" ? "Bağlantı hatası oluştu." : "A connection error occurred.");
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    await fetch("/api/kullanici/sifre-sifirla", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail }),
    });
    setForgotLoading(false);
    setForgotSent(true);
  }

  async function handleLogout() {
    await fetch("/api/kullanici/giris", { method: "DELETE" });
    setUser(null);
    setTab("giris");
    setReservations([]);
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

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--text-light)",
    marginBottom: "0.4rem",
  };

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "var(--navy)", padding: "4rem 1.5rem 3rem", textAlign: "center" }}>
        <p className="section-label" style={{ marginBottom: "0.75rem" }}>{t.profilim}</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 4vw, 2.8rem)", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
          {user 
            ? (lang === "tr" ? `Hoş geldiniz, ${user.fullName.split(" ")[0]}` : `Welcome, ${user.fullName.split(" ")[0]}`) 
            : tab === "giris" ? t.girisyap : (lang === "tr" ? "Kayıt Ol" : "Register")}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
          {user 
            ? (lang === "tr" ? "Rezervasyonlarınızı buradan takip edebilirsiniz." : "You can track your reservations here.") 
            : (lang === "tr" ? "Giriş yapın veya yeni bir hesap oluşturun." : "Log in or create a new account.")}
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* === LOGGED OUT: Login / Register / Forgot === */}
        {!user && (
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            {!showForgot ? (
              <div style={{ background: "white", borderRadius: "24px", padding: "2.5rem", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 8px 40px rgba(0,0,0,0.07)" }}>
                {/* Tabs */}
                <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB", marginBottom: "1.75rem" }}>
                  <button
                    onClick={() => { setTab("giris"); setError(""); }}
                    style={{
                      flex: 1, padding: "0.75rem", background: "none", border: "none",
                      borderBottom: tab === "giris" ? "2px solid var(--gold)" : "2px solid transparent",
                      color: tab === "giris" ? "var(--navy)" : "#9CA3AF",
                      fontWeight: tab === "giris" ? 700 : 500, fontSize: "0.95rem", cursor: "pointer",
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {t.girisyap}
                  </button>
                  <button
                    onClick={() => { setTab("kayit"); setError(""); }}
                    style={{
                      flex: 1, padding: "0.75rem", background: "none", border: "none",
                      borderBottom: tab === "kayit" ? "2px solid var(--gold)" : "2px solid transparent",
                      color: tab === "kayit" ? "var(--navy)" : "#9CA3AF",
                      fontWeight: tab === "kayit" ? 700 : 500, fontSize: "0.95rem", cursor: "pointer",
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {lang === "tr" ? "Kayıt Ol" : "Register"}
                  </button>
                </div>

                {/* Login Form */}
                {tab === "giris" && (
                  <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                    <div>
                      <label style={labelStyle}>{lang === "tr" ? "E-posta" : "Email Address"}</label>
                      <input
                        type="email" required
                        placeholder="ornek@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>{lang === "tr" ? "Şifre" : "Password"}</label>
                      <input
                        type="password" required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
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
                    <button
                      type="submit" disabled={loading}
                      className="btn-primary"
                      style={{ justifyContent: "center", borderRadius: "10px", opacity: loading ? 0.7 : 1 }}
                    >
                      {loading ? (lang === "tr" ? "Giriş yapılıyor..." : "Logging in...") : t.girisyap}
                    </button>
                  </form>
                )}

                {/* Register Form */}
                {tab === "kayit" && (
                  <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                    <div>
                      <label style={labelStyle}>{lang === "tr" ? "Ad Soyad *" : "Full Name *"}</label>
                      <input
                        type="text" required
                        placeholder={lang === "tr" ? "Adınız Soyadınız" : "Your Full Name"}
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>{lang === "tr" ? "E-posta *" : "Email Address *"}</label>
                      <input
                        type="email" required
                        placeholder="ornek@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>{lang === "tr" ? "Telefon" : "Phone Number"}</label>
                      <input
                        type="text"
                        placeholder="05xx xxx xx xx"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>{lang === "tr" ? "Şifre *" : "Password *"}</label>
                      <input
                        type="password" required
                        placeholder={lang === "tr" ? "En az 6 karakter" : "At least 6 characters"}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
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
                    <button
                      type="submit" disabled={loading}
                      className="btn-primary"
                      style={{ justifyContent: "center", borderRadius: "10px", opacity: loading ? 0.7 : 1 }}
                    >
                      {loading ? (lang === "tr" ? "Kaydolunuyor..." : "Registering...") : (lang === "tr" ? "Kayıt Ol" : "Register")}
                    </button>
                  </form>
                )}

                {/* Forgot Password Toggle */}
                {tab === "giris" && (
                  <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                    <button
                      onClick={() => setShowForgot(true)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", color: "var(--gold-dark)", textDecoration: "underline", fontFamily: "'Inter', sans-serif" }}
                    >
                      {lang === "tr" ? "Şifremi unuttum" : "Forgot password"}
                    </button>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-light)", textAlign: "center" }}>
                      {lang === "tr" ? "Hesabınız yoksa rezervasyon yaptığınızda otomatik oluşturulur." : "If you do not have an account, one will be created automatically when you book."}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: "24px", padding: "2.5rem", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 8px 40px rgba(0,0,0,0.07)" }}>
                <button
                  onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); }}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "1.5rem", fontFamily: "'Inter', sans-serif" }}
                >
                  ← {lang === "tr" ? "Geri dön" : "Go back"}
                </button>
                {forgotSent ? (
                  <div style={{ textAlign: "center", padding: "1rem 0" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📧</div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.75rem" }}>
                      {lang === "tr" ? "E-posta Gönderildi!" : "Email Sent!"}
                    </h3>
                    <p style={{ color: "var(--text-light)", fontSize: "0.88rem", lineHeight: 1.6 }}>
                      {lang === "tr" ? (
                        <><strong>{forgotEmail}</strong> adresine şifre sıfırlama bağlantısı gönderdik. Birkaç dakika içinde gelmezse spam klasörünüzü kontrol edin.</>
                      ) : (
                        <>We sent a password reset link to <strong>{forgotEmail}</strong>. If it doesn't arrive in a few minutes, check your spam folder.</>
                      )}
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>
                      {lang === "tr" ? "Şifremi Unuttum" : "Forgot Password"}
                    </h2>
                    <div className="gold-divider" style={{ marginBottom: "1.5rem" }} />
                    <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                      {lang === "tr" ? "Kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı göndereceğiz." : "Enter your registered email address. We will send you a password reset link."}
                    </p>
                    <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <label style={labelStyle}>{lang === "tr" ? "E-posta" : "Email Address"}</label>
                        <input
                          type="email" required
                          placeholder="ornek@email.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                          onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                        />
                      </div>
                      <button type="submit" disabled={forgotLoading} className="btn-primary" style={{ justifyContent: "center", borderRadius: "10px" }}>
                        {forgotLoading ? (lang === "tr" ? "Gönderiliyor..." : "Sending...") : (lang === "tr" ? "Sıfırlama Bağlantısı Gönder" : "Send Reset Link")}
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* === LOGGED IN: Profile + Reservations === */}
        {user && (
          <div>
            {/* User card */}
            <div style={{
              background: "white", borderRadius: "20px", padding: "1.75rem",
              border: "1px solid rgba(0,0,0,0.06)", marginBottom: "2rem",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: "1rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--navy), var(--navy-mid))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem", color: "var(--gold)", fontWeight: 700,
                  fontFamily: "'Playfair Display', serif",
                }}>
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy)" }}>{user.fullName}</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-light)" }}>{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: "none", border: "1px solid #E5E7EB", borderRadius: "10px",
                  padding: "0.5rem 1.25rem", cursor: "pointer", fontSize: "0.82rem",
                  color: "var(--text-light)", fontFamily: "'Inter', sans-serif",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  transition: "all 0.2s",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {lang === "tr" ? "Çıkış Yap" : "Log Out"}
              </button>
            </div>

            {/* Profile Info and Password update forms */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }} className="profile-update-grid">
              {/* Profile Details form */}
              <div style={{ background: "white", borderRadius: "20px", padding: "2rem", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 10px 30px rgba(13,27,42,0.02)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>
                  {lang === "tr" ? "Profil Bilgileri" : "Profile Details"}
                </h3>
                <div className="gold-divider" style={{ marginBottom: "1.5rem" }} />
                
                <form onSubmit={handleProfileUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>{lang === "tr" ? "Ad Soyad" : "Full Name"}</label>
                    <input
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>{lang === "tr" ? "Telefon Numarası" : "Phone Number"}</label>
                    <input
                      required
                      placeholder="05xx xxx xx xx"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                  {profileSuccess && (
                    <p style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 600 }}>✅ {profileSuccess}</p>
                  )}
                  {profileError && (
                    <p style={{ fontSize: "0.8rem", color: "#dc2626", fontWeight: 600 }}>⚠️ {profileError}</p>
                  )}
                  <button type="submit" disabled={profileLoading} className="btn-primary" style={{ justifyContent: "center", borderRadius: "10px", marginTop: "0.5rem" }}>
                    {profileLoading ? (lang === "tr" ? "Güncelleniyor..." : "Updating...") : (lang === "tr" ? "Profili Güncelle" : "Update Profile")}
                  </button>
                </form>
              </div>

              {/* Password update form */}
              <div style={{ background: "white", borderRadius: "20px", padding: "2rem", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 10px 30px rgba(13,27,42,0.02)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>
                  {lang === "tr" ? "Şifre Değiştir" : "Change Password"}
                </h3>
                <div className="gold-divider" style={{ marginBottom: "1.5rem" }} />
                
                <form onSubmit={handlePasswordUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>{lang === "tr" ? "Mevcut Şifre" : "Current Password"}</label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>{lang === "tr" ? "Yeni Şifre" : "New Password"}</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                  {passwordSuccess && (
                    <p style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 600 }}>✅ {passwordSuccess}</p>
                  )}
                  {passwordError && (
                    <p style={{ fontSize: "0.8rem", color: "#dc2626", fontWeight: 600 }}>⚠️ {passwordError}</p>
                  )}
                  <button type="submit" disabled={passwordLoading} className="btn-primary" style={{ justifyContent: "center", borderRadius: "10px", marginTop: "0.5rem" }}>
                    {passwordLoading ? (lang === "tr" ? "Değiştiriliyor..." : "Updating...") : (lang === "tr" ? "Şifreyi Güncelle" : "Update Password")}
                  </button>
                </form>
              </div>
            </div>

            {/* Reservations */}
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--navy)", marginBottom: "1.25rem" }}>
              {lang === "tr" ? `Rezervasyonlarım (${reservations.length})` : `My Bookings (${reservations.length})`}
            </h2>
            {reservations.length === 0 ? (
              <div style={{ background: "white", borderRadius: "16px", padding: "3rem", textAlign: "center", border: "1px solid rgba(0,0,0,0.06)" }}>
                <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛏️</p>
                <p style={{ color: "var(--text-light)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                  {lang === "tr" ? "Henüz rezervasyonunuz bulunmuyor." : "You do not have any bookings yet."}
                </p>
                <Link href="/rezervasyon" className="btn-primary">{t.bookNow}</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {reservations.map((res) => {
                  const nights = Math.max(1, Math.round((new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) / 86400000));
                  let roomName = res.room?.name || "Oda";
                  let catName = res.room?.category?.name || "Kategori";

                  if (lang === "en") {
                    if (roomName.includes("Standart")) roomName = roomName.replace("Standart", "Standard");
                    if (roomName.includes("Süit")) roomName = roomName.replace("Süit", "Suite");
                    if (roomName.includes("Balayı")) roomName = roomName.replace("Balayı", "Honeymoon");

                    if (catName === "Standart Oda") catName = "Standard Room";
                    else if (catName === "Deluxe Oda") catName = "Deluxe Room";
                    else if (catName === "Süit Oda") catName = "Suite Room";
                  }

                  return (
                    <div key={res.id} style={{
                      background: "white", borderRadius: "16px", padding: "1.5rem",
                      border: "1px solid rgba(0,0,0,0.06)",
                      display: "grid", gridTemplateColumns: "1fr auto",
                      gap: "1rem", alignItems: "start",
                    }}
                    className="reservation-card"
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy)" }}>{roomName}</h3>
                          <StatusBadge status={res.status} lang={lang} />
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-light)", marginBottom: "0.75rem" }}>
                          {res.room?.city} · {catName}
                        </p>
                        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                          {[
                            { label: lang === "tr" ? "Giriş" : "Check-In", value: new Date(res.checkIn).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US") },
                            { label: lang === "tr" ? "Çıkış" : "Check-Out", value: new Date(res.checkOut).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US") },
                            { label: lang === "tr" ? "Süre" : "Duration", value: lang === "tr" ? `${nights} gece` : `${nights} nights` },
                            { label: lang === "tr" ? "Kişi" : "Guests", value: lang === "tr" ? `${res.guestCount} kişi` : `${res.guestCount} guests` },
                          ].map((item) => (
                            <div key={item.label}>
                              <p style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-light)" }}>{item.label}</p>
                              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--navy)" }}>{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "var(--text-light)", whiteSpace: "nowrap" }}>
                        #{res.id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-update-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
        @media (max-width: 600px) {
          .reservation-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
