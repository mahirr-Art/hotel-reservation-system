"use client";

import { useState } from "react";

const contactInfo = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: "Adres",
    value: "Fatih Mah. Sahil Cad. No:12",
    sub: "Gerze / Sinop 57800",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    label: "Telefon",
    value: "+90 (368) 271 00 00",
    sub: "7/24 hizmetinizdeyiz",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: "E-posta",
    value: "info@kuzeyfeneri.com",
    sub: "24 saat içinde yanıt",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
      </svg>
    ),
    label: "Çalışma Saatleri",
    value: "Her Gün 07:00 – 23:00",
    sub: "Resepsiyon 24 saat açık",
  },
];

const subjects = [
  "Rezervasyon Hakkında",
  "Fiyat & Kampanya",
  "Özel Etkinlik",
  "Şikayet & Öneri",
  "Kurumsal",
  "Diğer",
];

const faqs = [
  {
    question: "Giriş ve çıkış saatleriniz nedir?",
    answer: "Giriş saati 14:00, çıkış saati ise en geç 12:00'dir. Müsaitliğe göre erken giriş veya geç çıkış talepleri konsiyerjimiz tarafından değerlendirilir."
  },
  {
    question: "Rezervasyon iptal politikanız nedir?",
    answer: "Rezervasyon tarihinizden 14 gün öncesine kadar ücretsiz iptal gerçekleştirebilir ve ödediğiniz ücretin tamamını geri alabilirsiniz. Son 14 günde yapılan iptallerde ücret iadesi yapılmamaktadır."
  },
  {
    question: "Otelinizde evcil hayvan kabul ediliyor mu?",
    answer: "Maalesef otelimizin genel hijyen ve konsept kuralları gereği evcil hayvan kabul edemiyoruz."
  },
  {
    question: "Havalimanı transfer hizmetiniz var mı?",
    answer: "Evet, Sinop Havalimanı ile otelimiz arasında özel araçlarla transfer hizmeti sunuyoruz. Erken rezervasyon paketlerimizde bu hizmet ücretsizdir. Diğer rezervasyonlar için ücretlidir ve önceden rezervasyon yapılması gereklidir."
  },
  {
    question: "Odalarda sigara içiliyor mu?",
    answer: "Otelimizin tüm kapalı alanları ve odaları dumansız hava sahası kapsamındadır. Sigara tüketimi sadece açık balkonlarda ve bahçe alanlarında serbesttir."
  }
];

export default function IletisimPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // KVKK states
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!kvkkAccepted) {
      setError("Lütfen KVKK Aydınlatma Metnini okuyup onaylayın.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/iletisim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Mesajınız gönderilemedi. Lütfen tekrar deneyin.");
      return;
    }
    setSent(true);
  }

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        background: "var(--navy)",
        padding: "5rem 1.5rem 4rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "url('/hotel_hero_bg.jpg') center/cover", opacity: 0.08 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>Bize Ulaşın</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 700, color: "white",
            marginBottom: "1rem", lineHeight: 1.2,
          }}>
            İletişim<em style={{ color: "var(--gold)" }}> & Destek</em>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.7 }}>
            Sorularınız, özel istekleriniz veya etkinlik planlamanız için 7/24 buradayız.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: "3rem",
          alignItems: "start",
          marginBottom: "4rem",
        }}
        className="contact-grid"
        >
          {/* Left: Info */}
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>
              İletişim Bilgileri
            </h2>
            <div className="gold-divider" style={{ marginBottom: "2rem" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
              {contactInfo.map((info) => (
                <div key={info.label} style={{
                  display: "flex", alignItems: "flex-start", gap: "1rem",
                  background: "white", borderRadius: "14px", padding: "1.25rem",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "12px",
                    background: "var(--navy)",
                    color: "var(--gold)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {info.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.2rem" }}>
                      {info.label}
                    </p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--navy)" }}>{info.value}</p>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>{info.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "1rem" }}>
                Sosyal Medya
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {[
                  { label: "Instagram", path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9A4.5 4.5 0 0021 16.5v-9A4.5 4.5 0 0016.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21z" },
                  { label: "Facebook", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                  { label: "Twitter/X", path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    style={{
                      width: 42, height: 42, borderRadius: "50%",
                      background: "var(--navy)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--gold)", textDecoration: "none",
                      transition: "transform 0.2s, background 0.2s",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Map embed */}
            <div style={{ marginTop: "2rem", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3002.3!2d35.096!3d41.797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDQ3JzQ5LjIiTiAzNcKwMDUnMzguMyJF!5e0!3m2!1str!2str!4v1234567890"
                width="100%"
                height="200"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kuzey Feneri Konum"
              />
            </div>
          </div>

          {/* Right: Form */}
          <div style={{
            background: "white",
            borderRadius: "24px",
            padding: "2.5rem",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
          }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "#F0FDF4", border: "2px solid #BBF7D0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.5rem", fontSize: "2rem",
                }}>
                  ✅
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.75rem" }}>
                  Mesajınız Gönderildi!
                </h3>
                <p style={{ color: "var(--text-light)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  En kısa sürede size dönüş yapacağız. Genellikle 24 saat içinde yanıt veriyoruz.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                  className="btn-outline"
                  style={{ marginTop: "1.5rem" }}
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>
                  Mesaj Gönderin
                </h2>
                <div className="gold-divider" style={{ marginBottom: "2rem" }} />

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-grid">
                    <div>
                      <label style={labelStyle}>Ad Soyad *</label>
                      <input
                        required
                        placeholder="Adınız Soyadınız"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Telefon</label>
                      <input
                        placeholder="+90 5xx xxx xx xx"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>E-posta *</label>
                    <input
                      required
                      type="email"
                      placeholder="ornek@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Konu *</label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    >
                      <option value="">Konu seçin...</option>
                      {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Mesajınız *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Mesajınızı buraya yazın..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ ...inputStyle, resize: "vertical" }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>

                  {/* KVKK Checkbox */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", margin: "1rem 0" }}>
                    <input
                      type="checkbox"
                      id="kvkkCheck"
                      checked={kvkkAccepted}
                      onChange={(e) => setKvkkAccepted(e.target.checked)}
                      style={{ marginTop: "3px", cursor: "pointer" }}
                    />
                    <label htmlFor="kvkkCheck" style={{ fontSize: "0.78rem", color: "var(--text-light)", cursor: "pointer", lineHeight: 1.4 }}>
                      Kuzey Feneri Butik Otel{" "}
                      <button
                        type="button"
                        onClick={() => setShowKvkkModal(true)}
                        style={{ color: "var(--gold-dark)", fontWeight: 700, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        KVKK Aydınlatma Metnini
                      </button>{" "}
                      okudum ve kabul ediyorum.
                    </label>
                  </div>

                  {error && (
                    <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#DC2626" }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !kvkkAccepted}
                    className="btn-primary"
                    style={{ justifyContent: "center", borderRadius: "10px", opacity: (loading || !kvkkAccepted) ? 0.7 : 1 }}
                  >
                    {loading ? "Gönderiliyor..." : "Mesaj Gönder →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div style={{ marginTop: "6rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="section-label" style={{ marginBottom: "0.5rem" }}>Sıkça Sorulan Sorular</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>
              Merak Edilenler
            </h2>
            <div className="gold-divider" style={{ margin: "0 auto" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "800px", margin: "0 auto" }}>
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 4px 20px rgba(13,27,42,0.02)",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    style={{
                      width: "100%",
                      padding: "1.25rem 1.75rem",
                      background: "none",
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--navy)", fontFamily: "'Inter', sans-serif" }}>
                      {faq.question}
                    </span>
                    <span style={{
                      fontSize: "1.2rem",
                      color: "var(--gold-dark)",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      lineHeight: 1,
                      display: "inline-block",
                    }}>
                      +
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div style={{
                      padding: "0 1.75rem 1.5rem",
                      fontSize: "0.88rem",
                      color: "var(--text-mid)",
                      lineHeight: 1.7,
                      borderTop: "1px solid #F3F4F6",
                      paddingTop: "1rem",
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KVKK Modal */}
      {showKvkkModal && (
        <div
          onClick={() => setShowKvkkModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(13,27,42,0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "2.5rem",
              maxWidth: 500,
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              position: "relative",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <button
              onClick={() => setShowKvkkModal(false)}
              style={{
                position: "absolute", top: "1.25rem", right: "1.25rem",
                background: "none", border: "none", fontSize: "1.5rem",
                cursor: "pointer", color: "#9CA3AF"
              }}
            >
              ✕
            </button>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>
              KVKK Aydınlatma Metni
            </h3>
            <div className="gold-divider" style={{ marginBottom: "1.25rem" }} />
            <p style={{ fontSize: "0.85rem", color: "var(--text-mid)", lineHeight: 1.7, marginBottom: "2rem" }}>
              Kuzey Feneri Butik Otel olarak kişisel verilerinizin güvenliğine önem veriyoruz. İletişim formu aracılığıyla toplanan ad, e-posta, telefon ve mesaj bilgileriniz, sorularınızı yanıtlamak ve size daha iyi hizmet sunabilmek amacıyla işlenecektir. Verileriniz üçüncü şahıslarla paylaşılmayacaktır.
            </p>
            <button
              onClick={() => { setKvkkAccepted(true); setShowKvkkModal(false); }}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", borderRadius: "10px" }}
            >
              Okudum, Kabul Ediyorum
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-light)",
  marginBottom: "0.4rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #E5E7EB",
  borderRadius: "10px",
  padding: "0.75rem 1rem",
  fontSize: "0.9rem",
  color: "var(--text-dark)",
  background: "#FAFAFA",
  outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "'Inter', sans-serif",
};