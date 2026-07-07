import Link from "next/link";

const servicesList = [
  {
    id: "restoran-bar",
    title: "Restoran & Bar",
    subtitle: "Gastronomi Şöleni",
    image: "/gallery_restaurant.jpg",
    desc: "Karadeniz'in taze deniz ürünlerini ve yöresel lezzetlerini modern gastronomi ile harmanlıyoruz. Eşsiz gün batımı manzarası eşliğinde, ödüllü şeflerimizin hazırladığı À la Carte menümüzle damağınızda unutulmaz izler bırakın.",
    features: [
      "Zengin ve Organik Kahvaltı Büfesi",
      "À la Carte Deniz Ürünleri Restoranı",
      "Yerli ve İthal Özel Kav Seçenekleri",
      "Kişiye Özel Akşam Yemeği Organizasyonları",
      "Dünya Kokteylleri Sunan Sahil Barı",
      "Canlı Akustik Müzik Geceleri",
    ],
  },
  {
    id: "spa-wellness",
    title: "Spa & Wellness",
    subtitle: "Ruhsal ve Bedensel Arınma",
    image: "/gallery_spa.jpg",
    desc: "Kuzey Feneri'nin huzurlu atmosferinde bedeninizi ve ruhunuzu şımartın. Geleneksel Türk hamamı, buhar odası, sauna ve Uzak Doğu'nun mistik dokunuşlarını taşıyan aromaterapi masajları ile yenilenin.",
    features: [
      "Geleneksel Türk Hamamı Ritüelleri",
      "Fin Saunası & Aromatik Buhar Odası",
      "Kişiye Özel Cilt ve Vücut Terapileri",
      "Uzak Doğu & İsveç Masajı Seansları",
      "Çiftlere Özel Masaj & Terapi Odası",
      "Detoks & Bitki Çayı Barı",
    ],
  },
  {
    id: "fitness-center",
    title: "Fitness Center",
    subtitle: "Sağlıklı Yaşam Kültürü",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=cover&w=1000&q=80",
    desc: "Doğa ve deniz manzarasından ilham alarak sporunuzu yapın. En son teknoloji kardiyo ekipmanları, serbest ağırlıklar ve uzman eğitmenlerimiz gözetiminde tatilde de formunuzu koruyun.",
    features: [
      "Son Teknoloji Kardiyovasküler Ekipmanlar",
      "Serbest Ağırlık & Fonksiyonel Antrenman Alanı",
      "Denize Karşı Yoga & Pilates Stüdyosu",
      "Kişisel Antrenör (Personal Trainer) Hizmeti",
      "Günlük Sporcu Protein & Vitamin İkramları",
      "Otel Misafirlerine 7/24 Ücretsiz Erişim",
    ],
  },
  {
    id: "acik-havuz",
    title: "Isıtmalı Açık Havuz",
    subtitle: "Manzara Eşliğinde Keyif",
    image: "/gallery_pool.jpg",
    desc: "Karadeniz'in serin havasında, ısıtmalı açık havuzumuzun 28 derece sıcaklıktaki sularında yüzmenin keyfini çıkarın. Havuz barımızdan alacağınız serinletici içeceklerle şezlongunuzda güneşin tadını çıkarın.",
    features: [
      "Karadeniz'e Nazır Eşsiz Konum",
      "Yıl Boyu 28°C Sabit Sıcaklık (Isıtma Sistemi)",
      "Entegre Jakuzi & Hidromasaj Bölümü",
      "Çocuklar İçin Özel Güvenli Yüzme Alanı",
      "Premium Havuz Bar & Aperatif Menüsü",
      "Gün Boyu Lüks Havlu ve Şezlong Hizmeti",
    ],
  },
  {
    id: "transfer-hizmeti",
    title: "Lüks Transfer Hizmeti",
    subtitle: "Konforlu Ulaşım",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=cover&w=1000&q=80",
    desc: "Sinop Havalimanı veya dilediğiniz noktadan lüks VIP araçlarımızla sizi karşılıyor, seyahatinizin başından sonuna kadar kusursuz konforu hissettiriyoruz. Özel şoförünüz eşliğinde Sinop'un güzelliklerini keşfedin.",
    features: [
      "Lüks VIP Vito & Binek Araç Seçenekleri",
      "Profesyonel ve Yabancı Dil Bilen Özel Şoförler",
      "Havalimanı Karşılama ve Bagaj Hizmeti",
      "Araç İçi Soğuk İçecek & İnternet İkramı",
      "Kişiye Özel Günübirlik Sinop Turları",
      "7/24 Güvenli ve Kesintisiz Ulaşım Garantisi",
    ],
  },
];

export default function HizmetlerimizPage() {
  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* Hero Header */}
      <div style={{
        background: "var(--navy)",
        padding: "6rem 1.5rem 5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "url('/hotel_hero_bg.jpg') center/cover", opacity: 0.08 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>Ayrıcalıklarımız</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
            fontWeight: 700, color: "white",
            marginBottom: "1.25rem", lineHeight: 1.2,
          }}>
            Hizmetlerimiz <em style={{ color: "var(--gold)" }}>& Ayrıcalıklar</em>
          </h1>
          <div style={{ width: 64, height: 2, background: "var(--gold)", margin: "0 auto 1.5rem" }} />
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
            Kuzey Feneri Butik Otel'de konaklamanızı unutulmaz kılacak, 5 yıldızlı standartlardaki seçkin hizmetlerimizle tanışın.
          </p>
        </div>
      </div>

      {/* Services List Section */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
          {servicesList.map((svc, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={svc.id}
                style={{
                  display: "flex",
                  flexDirection: isEven ? "row" : "row-reverse",
                  background: "white",
                  borderRadius: "24px",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 15px 40px rgba(13,27,42,0.03)",
                }}
                className="service-card"
              >
                {/* Visual Image */}
                <div style={{ flex: "1 1 50%", minHeight: "380px", position: "relative", overflow: "hidden" }}>
                  <img
                    src={svc.image}
                    alt={svc.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(13,27,42,0.3) 0%, transparent 60%)"
                  }} />
                </div>

                {/* Content details */}
                <div style={{ flex: "1 1 50%", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={{
                    color: "var(--gold-dark)",
                    fontSize: "0.72rem", fontWeight: 700,
                    letterSpacing: "0.15em", textTransform: "uppercase",
                    marginBottom: "0.5rem", display: "block"
                  }}>
                    {svc.subtitle}
                  </span>

                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2rem", fontWeight: 700,
                    color: "var(--navy)", marginBottom: "1.25rem",
                  }}>
                    {svc.title}
                  </h2>
                  
                  <p style={{
                    fontSize: "0.92rem", color: "var(--text-mid)",
                    lineHeight: 1.8, marginBottom: "2rem"
                  }}>
                    {svc.desc}
                  </p>

                  <div style={{ marginBottom: "2rem" }}>
                    <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--navy)", marginBottom: "0.75rem" }}>
                      Öne Çıkan Özellikler:
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }} className="svc-features">
                      {svc.features.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold-dark)" strokeWidth="3" style={{ flexShrink: 0, marginTop: "3px" }}>
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                          <span style={{ fontSize: "0.82rem", color: "var(--text-dark)", lineHeight: 1.4, fontWeight: 500 }}>{f}</span>
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
                      Hemen Rezervasyon
                    </Link>
                    <Link
                      href="/iletisim"
                      className="btn-outline"
                      style={{ borderRadius: "8px", padding: "0.75rem 1.5rem", fontSize: "0.82rem" }}
                    >
                      Bilgi Al
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .service-card {
            flex-direction: column !important;
          }
          .service-card > div {
            flex: 1 1 100% !important;
          }
          .svc-features {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
