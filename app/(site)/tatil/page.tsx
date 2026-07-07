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

      {/* Packages Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4.5rem", marginBottom: "4rem" }}>
          {packages.map((pkg, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={pkg.id}
                style={{
                  display: "flex",
                  flexDirection: isEven ? "row" : "row-reverse",
                  background: "white",
                  borderRadius: "24px",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 15px 40px rgba(13,27,42,0.03)",
                }}
                className="package-card"
              >
                {/* Visual Image */}
                <div style={{ flex: "1 1 50%", minHeight: "360px", position: "relative", overflow: "hidden" }}>
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(13,27,42,0.35) 0%, transparent 60%)"
                  }} />

                  {/* Badge top-left */}
                  <div style={{ position: "absolute", top: "1.25rem", left: "1.25rem" }}>
                    <span style={{
                      background: pkg.badgeColor,
                      color: "white",
                      fontSize: "0.68rem", fontWeight: 700,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      padding: "0.4rem 0.9rem", borderRadius: "20px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}>
                      {pkg.badge}
                    </span>
                  </div>
                </div>

                {/* Content details */}
                <div style={{ flex: "1 1 50%", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <span style={{
                      color: "var(--gold-dark)",
                      fontSize: "0.72rem", fontWeight: 700,
                      letterSpacing: "0.15em", textTransform: "uppercase",
                    }}>
                      {pkg.subtitle}
                    </span>
                    <span style={{
                      background: `${pkg.badgeColor}12`,
                      border: `1px solid ${pkg.badgeColor}33`,
                      color: pkg.badgeColor,
                      fontSize: "0.72rem", fontWeight: 800,
                      padding: "0.25rem 0.6rem", borderRadius: "6px"
                    }}>
                      {pkg.price}
                    </span>
                  </div>

                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.8rem", fontWeight: 700,
                    color: "var(--navy)", marginBottom: "1rem",
                  }}>
                    {pkg.title}
                  </h2>
                  
                  <p style={{
                    fontSize: "0.88rem", color: "var(--text-mid)",
                    lineHeight: 1.7, marginBottom: "1.5rem"
                  }}>
                    {pkg.desc}
                  </p>

                  <div style={{ marginBottom: "1.75rem" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--navy)", marginBottom: "0.6rem" }}>
                      Paket Ayrıcalıkları:
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }} className="pkg-features">
                      {pkg.features.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold-dark)" strokeWidth="3" style={{ flexShrink: 0, marginTop: "2px" }}>
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-dark)", lineHeight: 1.3, fontWeight: 500 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", marginTop: "auto" }}>
                    <Link
                      href="/rezervasyon"
                      className="btn-primary"
                      style={{ borderRadius: "8px", padding: "0.75rem 1.5rem", fontSize: "0.82rem" }}
                    >
                      Paketle Rezervasyon Yap
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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

      <style>{`
        @media (max-width: 900px) {
          .package-card {
            flex-direction: column !important;
          }
          .package-card > div {
            flex: 1 1 100% !important;
          }
          .pkg-features {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}