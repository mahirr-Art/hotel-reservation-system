import Link from "next/link";

const packages = [
  {
    id: "yaz",
    badge: "🔥 En Popüler",
    badgeColor: "#DC2626",
    title: "Yaz Erken Rezervasyon",
    subtitle: "Haziran – Ağustos 2026",
    price: "%20 İndirim",
    desc: "Yazın en güzel günlerini Karadeniz kıyısında geçirin. 60 gün önceden rezervasyon yaptığınızda gecelik fiyatlarda %20 indirim kazanın.",
    features: [
      "Tüm oda kategorilerinde geçerli",
      "Ücretsiz kahvaltı dahil",
      "Erken check-in (10:00)",
      "Geç check-out (14:00)",
      "Ücretsiz otopark",
    ],
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #0D1B2A 100%)",
    accentColor: "#C9A96E",
    image: "/gallery_room.jpg",
  },
  {
    id: "balayı",
    badge: "💑 Özel Paket",
    badgeColor: "#be185d",
    title: "Balayı Paketi",
    subtitle: "Tüm yıl geçerli",
    price: "Ücretsiz Yükseltme",
    desc: "Hayatınızın en özel anını Kuzey Feneri'nin romantik atmosferinde kutlayın. Özel süsleme, karşılama ikramı ve oda yükseltme dahil.",
    features: [
      "Ücretsiz oda kategorisi yükseltme",
      "Köpüklü şarap & çikolata ikramı",
      "Çiçek süslemeli oda",
      "Özel romantik akşam yemeği",
      "Spa & hamam hediye çeki",
    ],
    gradient: "linear-gradient(135deg, #9d174d 0%, #1f0a17 100%)",
    accentColor: "#F9A8D4",
    image: "/gallery_spa.jpg",
  },
  {
    id: "hafta-sonu",
    badge: "⚡ Fırsat",
    badgeColor: "#7C3AED",
    title: "Uzun Hafta Sonu",
    subtitle: "Perşembe – Pazar",
    price: "4. Gece Bedava",
    desc: "Perşembe giriş yapın, 3 gece konaklayın, 4. gece bizden hediye! Hafta sonunu daha uzun ve ekonomik geçirmenin en iyi yolu.",
    features: [
      "3 gece öde, 4. gece bedava",
      "Tüm oda kategorilerinde geçerli",
      "Havuz & fitness ücretsiz",
      "%10 restaurant indirimi",
      "Ücretsiz çamaşır hizmeti",
    ],
    gradient: "linear-gradient(135deg, #4C1D95 0%, #1E1B4B 100%)",
    accentColor: "#C4B5FD",
    image: "/gallery_pool.jpg",
  },
  {
    id: "aile",
    badge: "👨‍👩‍👧 Aile Paketi",
    badgeColor: "#059669",
    title: "Aile Tatil Paketi",
    subtitle: "Okul tatilleri boyunca",
    price: "Çocuk Bedava",
    desc: "0-12 yaş çocuklar ebeveynleriyle aynı odada ücretsiz konaklayabilir. Çocuk havuzu, mini kulüp ve özel aktiviteler dahil.",
    features: [
      "0-12 yaş çocuk ücretsiz",
      "Çocuk havuzu & mini kulüp",
      "Özel çocuk menüsü",
      "Animasyon & etkinlik",
      "Bebek karyolası hediye",
    ],
    gradient: "linear-gradient(135deg, #065F46 0%, #022C22 100%)",
    accentColor: "#6EE7B7",
    image: "/gallery_lobby.jpg",
  },
];

export default function TatilPage() {
  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        background: "var(--navy)",
        padding: "5rem 1.5rem 4rem",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "url('/hotel_hero_bg.jpg') center/cover", opacity: 0.08 }} />
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>Özel Kampanyalar</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700, color: "white",
            marginBottom: "1rem", lineHeight: 1.2,
          }}>
            Tatil <em style={{ color: "var(--gold)" }}>Paketlerimiz</em>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.7 }}>
            Size ve sevdiklerinize özel hazırlanmış ayrıcalıklı paketler. Her bütçeye, her anıya uygun seçenekler.
          </p>
        </div>
      </div>

      {/* Packages */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2rem" }}>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="card-hover"
              style={{
                borderRadius: "24px",
                overflow: "hidden",
                background: "white",
                border: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image header */}
              <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
                />
                <div style={{ position: "absolute", inset: 0, background: pkg.gradient, opacity: 0.85 }} />
                <div style={{ position: "absolute", inset: 0, padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <span style={{
                    alignSelf: "flex-start",
                    background: pkg.badgeColor,
                    color: "white",
                    fontSize: "0.68rem", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    padding: "0.3rem 0.75rem", borderRadius: "20px",
                  }}>
                    {pkg.badge}
                  </span>
                  <div>
                    <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: pkg.accentColor, marginBottom: "0.35rem", opacity: 0.9 }}>
                      {pkg.subtitle}
                    </p>
                    <h2 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.4rem", fontWeight: 700, color: "white",
                      lineHeight: 1.2, marginBottom: "0.5rem",
                    }}>
                      {pkg.title}
                    </h2>
                    <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: `1px solid ${pkg.accentColor}44`, borderRadius: "8px", padding: "0.35rem 0.875rem" }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: pkg.accentColor }}>
                        {pkg.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-mid)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  {pkg.desc}
                </p>

                {/* Features */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                  {pkg.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.82rem", color: "var(--text-dark)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold-dark)" strokeWidth="3">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/rezervasyon"
                  className="btn-primary"
                  style={{ justifyContent: "center", borderRadius: "10px" }}
                >
                  Bu Paketi Seç →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div style={{
          marginTop: "3rem",
          background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)",
          borderRadius: "24px",
          padding: "3rem 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-50px", right: "-50px", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)" }} />
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>
            Özel Teklif
          </p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>
            Paket Bulamadınız mı?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", marginBottom: "2rem", maxWidth: 480, margin: "0 auto 2rem" }}>
            Size özel bir teklif hazırlamak için bizimle iletişime geçin. Kurumsal, düğün veya özel etkinlik paketleri için arayın.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/iletisim" className="btn-primary">İletişime Geç</Link>
            <Link href="/rezervasyon" className="btn-outline">Hemen Rezervasyon Yap</Link>
          </div>
        </div>
      </div>
    </div>
  );
}