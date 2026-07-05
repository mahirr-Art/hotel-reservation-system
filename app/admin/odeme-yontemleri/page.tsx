export default function OdemeYontemleriPage() {
  const methods = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
      title: "Kredi / Banka Kartı",
      color: "#3b82f6",
      bgColor: "#eff6ff",
      borderColor: "#bfdbfe",
      desc: "Visa, Mastercard ve American Express kartlarıyla güvenli ödeme yapabilirsiniz.",
      details: ["Visa", "Mastercard", "American Express", "Troy"],
      note: "3D Secure ile güvence altında. Taksit imkânı mevcuttur.",
      active: true,
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      ),
      title: "Havale / EFT",
      color: "#8b5cf6",
      bgColor: "#f5f3ff",
      borderColor: "#ddd6fe",
      desc: "Banka havalesi veya EFT yöntemiyle rezervasyon bedelini aktarabilirsiniz.",
      details: ["Garanti Bankası", "İş Bankası", "Ziraat Bankası", "Akbank"],
      note: "Ödeme sonrası dekont bilgileri rezervasyon detay sayfasından gönderilebilir.",
      active: true,
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      title: "Kapıda Ödeme",
      color: "#10b981",
      bgColor: "#f0fdf4",
      borderColor: "#bbf7d0",
      desc: "Check-in sırasında otelde nakit veya POS cihazıyla ödeme yapabilirsiniz.",
      details: ["Nakit (TL)", "Kredi Kartı (POS)", "Banka Kartı (POS)", "Döviz (USD/EUR)"],
      note: "Kapıda ödeme seçeneğinde iptal politikası farklıdır. Lütfen önceden bildiriniz.",
      active: true,
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      title: "Online Transfer",
      color: "#f59e0b",
      bgColor: "#fffbeb",
      borderColor: "#fde68a",
      desc: "PayTR, iyzico veya diğer online ödeme platformları üzerinden güvenle ödeyebilirsiniz.",
      details: ["iyzico", "PayTR", "PayU", "Stripe"],
      note: "Online transfer ödemelerinde işlem ücreti uygulanmaz.",
      active: false,
    },
  ];

  const bankAccounts = [
    { bank: "Garanti BBVA", iban: "TR12 0006 2000 1234 0006 2990 01", name: "Kuzey Feneri Otel Ltd. Şti." },
    { bank: "İş Bankası", iban: "TR34 0006 4000 0011 2345 6789 01", name: "Kuzey Feneri Otel Ltd. Şti." },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0D1B2A", marginBottom: "0.4rem" }}>Ödeme Yöntemleri</h1>
        <p style={{ fontSize: "0.85rem", color: "#718096" }}>Otelin kabul ettiği ödeme yöntemleri ve banka hesap bilgileri.</p>
      </div>

      {/* Payment methods grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {methods.map((m) => (
          <div
            key={m.title}
            style={{
              border: `1px solid ${m.borderColor}`,
              borderRadius: "12px",
              padding: "1.5rem",
              background: m.bgColor,
              opacity: m.active ? 1 : 0.55,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {!m.active && (
              <span style={{
                position: "absolute", top: "0.75rem", right: "0.75rem",
                fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", background: "#f1f5f9", color: "#94a3b8",
                padding: "0.2rem 0.6rem", borderRadius: "20px",
              }}>
                Yakında
              </span>
            )}
            <div style={{ color: m.color, marginBottom: "1rem" }}>{m.icon}</div>
            <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#0D1B2A", marginBottom: "0.4rem" }}>{m.title}</h3>
            <p style={{ fontSize: "0.82rem", color: "#4A5568", marginBottom: "1rem", lineHeight: 1.6 }}>{m.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
              {m.details.map((d) => (
                <span
                  key={d}
                  style={{ fontSize: "0.7rem", fontWeight: 600, background: "rgba(0,0,0,0.06)", color: "#374151", padding: "0.2rem 0.6rem", borderRadius: "20px" }}
                >
                  {d}
                </span>
              ))}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", fontStyle: "italic", lineHeight: 1.55 }}>{m.note}</p>
          </div>
        ))}
      </div>

      {/* Bank accounts */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#0D1B2A", marginBottom: "1rem" }}>
          Havale / EFT Banka Hesapları
        </h2>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {bankAccounts.map((acc) => (
            <div
              key={acc.bank}
              style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}
            >
              <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0D1B2A" }}>{acc.bank}</p>
              <p style={{ fontSize: "0.82rem", color: "#4A5568" }}>Hesap Sahibi: {acc.name}</p>
              <p style={{ fontFamily: "monospace", fontSize: "0.88rem", color: "#374151", letterSpacing: "0.05em", background: "#f1f5f9", padding: "0.4rem 0.75rem", borderRadius: "6px", marginTop: "0.25rem" }}>
                {acc.iban}
              </p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "1rem", fontStyle: "italic" }}>
          * Havale/EFT işlemlerinde açıklama kısmına rezervasyon numaranızı yazmayı unutmayınız.
        </p>
      </div>
    </div>
  );
}
