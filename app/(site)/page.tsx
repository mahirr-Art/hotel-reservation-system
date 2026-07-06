import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TestimonialForm from "@/components/TestimonialForm";
import HomeSearchForm from "@/components/HomeSearchForm";
import TestimonialCard from "@/components/TestimonialCard";
import AmenityCard from "@/components/AmenityCard";

export default async function HomePage() {
  const [featuredRooms, testimonials] = await Promise.all([
    prisma.room.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.testimonial.findMany({
      take: 6,
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const amenities = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 19V10a8 8 0 0 1 16 0v9" />
          <path d="M4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="14" r="3" />
        </svg>
      ),
      title: "Açık Yüzme Havuzu",
      desc: "Karadeniz manzaralı ısıtmalı açık havuzumuzda serinleyin.",
      detail:
        "Karadeniz'in eşsiz manzarasına karşı konumlanan olimpik ölçülerdeki açık yüzme havuzumuz, sabah 07:00'den gece 22:00'ye kadar hizmet vermektedir. Yetişkin havuzu, çocuk havuzu ve jakuzi bölümlerimizle tüm aile için unutulmaz bir deneyim sunuyoruz.",
      features: ["Olimpik boyutlar", "Isıtma sistemi", "Çocuk havuzu", "Jakuzi bölümü", "Havuz barı", "Şezlong & şemsiye", "Soyunma kabinleri", "Havlu hizmeti"],
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      ),
      title: "Spa & Wellness",
      desc: "Uzman ellerde masaj, hamam ve terapi deneyimi.",
      detail:
        "5 özel tedavi odası, Türk hamamı, buhar odası, sauna ve masaj salonumuzla bütüncül bir dinlenme deneyimi sunuyoruz. Uzman masöz ve terapistlerimiz ile vücudunuzu ve zihninizi yeniden canlandırın.",
      features: ["Türk hamamı", "Sauna & buhar odası", "Aromaterapi masajı", "Derin doku masajı", "Çift masaj odası", "Cilt bakımı", "Refleksoloji", "Meditatif terapi"],
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
        </svg>
      ),
      title: "Lüks Restoran",
      desc: "Ödüllü şeflerimizin hazırladığı yerel ve uluslararası lezzetler.",
      detail:
        "Karadeniz'in taze deniz ürünlerini ve bölgeye özgü lezzetleri öne çıkaran menümüzle gastronomi tutkunlarına özel bir deneyim sunuyoruz. Gün batımı manzarası eşliğinde fine dining keyfi yaşayın.",
      features: ["Kahvaltı büfesi", "À la carte öğle", "Fine dining akşam yemeği", "Canlı müzik", "Vejetaryen seçenekler", "Çocuk menüsü", "Şarap koleksiyonu", "Özel etkinlik mekanı"],
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      ),
      title: "7/24 Konsiyerj",
      desc: "Günün her saatinde kişisel asistanınız yanınızda.",
      detail:
        "Profesyonel konsiyerj ekibimiz gece gündüz hizmetinizdedir. Tur organizasyonu, restoran rezervasyonu, transfer hizmetleri ve özel istekleriniz için tek bir telefon araması yeterli.",
      features: ["Tur organizasyonu", "Transfer hizmeti", "Restoran rezervasyonu", "Hava alanı karşılama", "Özel etkinlik planlama", "Dil tercümanlığı", "Çamaşır servisi", "Oda servisi 24/7"],
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      ),
      title: "Fitness & Spor",
      desc: "Modern ekipmanlarla donanmış spor salonu ve aktivite alanları.",
      detail:
        "1.200 m² alan üzerinde kurulu fitness merkezimiz, en son teknoloji kardiyovasküler aletler, serbest ağırlık bölümü, yoga & pilates stüdyosu ve kişisel antrenör hizmetiyle donatılmıştır.",
      features: ["Kardiyovasküler aletler", "Serbest ağırlıklar", "Yoga stüdyosu", "Pilates sınıfı", "Kişisel antrenör", "Tenis kortu", "Plaj voleybolu", "Bisiklet kiralama"],
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      ),
      title: "Panoramik Manzara",
      desc: "Deniz ve dağ manzaralı özel odalarda sonsuz güzellik.",
      detail:
        "Otelimizin tüm odaları Karadeniz'e veya Sinop dağlarına bakan muhteşem manzaralarla tasarlanmıştır. Balkonlu superior ve deluxe odalarımızda sabahın ilk ışıklarıyla beraber büyülü manzaranın tadını çıkarın.",
      features: ["Karadeniz manzarası", "Dağ manzarası", "Özel balkon", "Panoramik teras", "Gün batımı görünümü", "Yıldız gözlemi alanı", "Fotoğraf noktaları", "Sonsuzluk havuzu"],
    },
  ];

  const stats = [
    { num: "500+", label: "Mutlu Misafir" },
    { num: "50+", label: "Lüks Oda" },
    { num: "15", label: "Yıllık Deneyim" },
    { num: "4.9", label: "Ortalama Puan" },
  ];



  const earlyBookingPerks = [
    {
      icon: "🏷️",
      title: "%20 İndirim",
      desc: "60 gün önceden rezervasyon yapanlara özel fiyat avantajı.",
    },
    {
      icon: "🎁",
      title: "Ücretsiz Karşılama",
      desc: "Oda servisiyle ikram edilen karşılama sepeti ve şampanya.",
    },
    {
      icon: "🛏️",
      title: "Erken Check-in",
      desc: "Müsaitliğe göre saat 10:00'dan itibaren erken giriş imkânı.",
    },
    {
      icon: "🏊",
      title: "Ücretsiz Spa",
      desc: "1 saatlik hamam + masaj deneyimi hediye olarak sunulur.",
    },
    {
      icon: "🚗",
      title: "Ücretsiz Transfer",
      desc: "Havalimanı – otel arası ücretsiz özel araç transferi.",
    },
    {
      icon: "❌",
      title: "Ücretsiz İptal",
      desc: "14 güne kadar ücretsiz iptal ve tam para iadesi garantisi.",
    },
  ];

  return (
    <div>
      {/* ─── HERO ─── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/hotel_hero_bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(13,27,42,0.65) 0%, rgba(13,27,42,0.45) 50%, rgba(13,27,42,0.8) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            padding: "2rem 1.5rem",
            maxWidth: "900px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <p className="section-label animate-fade-in-up" style={{ color: "var(--gold-light)", marginBottom: "1.25rem" }}>
            ✦ Hoş Geldiniz ✦
          </p>
          <h1
            className="animate-fade-in-up delay-100"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 700,
              color: "var(--white)",
              lineHeight: 1.1,
              marginBottom: "1.25rem",
              opacity: 0,
            }}
          >
            Karadeniz&apos;i Hisset,{" "}
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Gerze&apos;yi Keşfet</em>
          </h1>
          <p
            className="animate-fade-in-up delay-200"
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "1.05rem",
              maxWidth: "560px",
              margin: "0 auto 2.5rem",
              fontWeight: 300,
              lineHeight: 1.7,
              opacity: 0,
            }}
          >
            Sinop Gerze kıyısında, Karadeniz&apos;in masmavi suları eşliğinde huzur dolu bir konaklama
            deneyimi sizi bekliyor.
          </p>

          {/* Search form */}
          <HomeSearchForm />

          {/* Scroll indicator */}
          <div
            className="animate-fade-in delay-600"
            style={{ marginTop: "3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0 }}
          >
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Kaydır</span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, var(--gold), transparent)" }} />
          </div>
        </div>
      </section>

      {/* ─── AMENITIES (Tıklanabilir Ayrıcalıklar) ─── */}
      <section style={{ background: "var(--navy)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>Ayrıcalıklarımız</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "var(--white)", marginBottom: "0.75rem" }}>
              Neden Kuzey Feneri?
            </h2>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.45)", maxWidth: "480px", margin: "0 auto 1.5rem" }}>
              Her bir ayrıcalığa tıklayarak detayları keşfedin
            </p>
            <div className="gold-divider" style={{ margin: "0 auto" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {amenities.map((a) => (
              <AmenityCard key={a.title} {...a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED ROOMS ─── */}
      <section style={{ padding: "5rem 1.5rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", gap: "1rem" }}>
            <div>
              <p className="section-label" style={{ marginBottom: "0.75rem" }}>Seçkin Koleksiyonumuz</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "var(--navy)" }}>
                Öne Çıkan Odalar
              </h2>
              <div className="gold-divider" style={{ marginTop: "1rem" }} />
            </div>
            <Link href="/odalarimiz" className="link-navy">Tüm Odalar →</Link>
          </div>

          {featuredRooms.length === 0 ? (
            <p style={{ color: "var(--text-light)", textAlign: "center", padding: "3rem" }}>Henüz oda eklenmedi.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {featuredRooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/odalarimiz/${room.id}`}
                  className="card-hover img-zoom"
                  style={{ background: "var(--white)", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", textDecoration: "none", display: "block" }}
                >
                  <div style={{ aspectRatio: "4/3", background: "var(--cream-dark)", overflow: "hidden", position: "relative" }}>
                    {room.photos?.[0] ? (
                      <img src={room.photos[0]} alt={room.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-light)" }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" /></svg>
                      </div>
                    )}
                    <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--gold)", color: "var(--navy)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.3rem 0.75rem", borderRadius: "2px" }}>
                      {room.category.name}
                    </div>
                  </div>
                  <div style={{ padding: "1.75rem" }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.5rem" }}>{room.name}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginBottom: "1.25rem", lineHeight: 1.6 }}>{room.description}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.1em" }}>gecelik</span>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--navy)" }}>
                          {room.price.toString()} <span style={{ fontSize: "0.9rem", fontWeight: 400 }}>₺</span>
                        </p>
                      </div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-dark)", borderBottom: "1px solid var(--gold)" }}>
                        Detaylar →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── ERKEN REZERVASYON ─── */}
      <section style={{ background: "var(--navy-mid)", padding: "5rem 1.5rem", position: "relative", overflow: "hidden" }}>
        {/* Decorative bg circle */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "2rem", marginBottom: "3.5rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.25)", borderRadius: "20px", padding: "0.35rem 1rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>🔥 Sınırlı Süre</span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "var(--white)", marginBottom: "0.75rem" }}>
                Erken Rezervasyon<br />
                <em style={{ color: "var(--gold)" }}>Ayrıcalıkları</em>
              </h2>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", maxWidth: "400px", lineHeight: 1.7 }}>
                60 gün önceden rezervasyon yapın, özel fırsatlardan yararlanın. Kontenjanlar sınırlıdır.
              </p>
              <div className="gold-divider" style={{ marginTop: "1.25rem" }} />
            </div>

            {/* Countdown box */}
            <div style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: "12px", padding: "1.5rem 2rem", textAlign: "center", minWidth: 200 }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Bu Fırsat Sona Eriyor</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>31 Ağustos</p>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "0.25rem" }}>2026</p>
            </div>
          </div>

          {/* Perks grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
            {earlyBookingPerks.map((perk, i) => (
              <div
                key={i}
                className="card-hover"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.12)", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}
              >
                <span style={{ fontSize: "1.75rem" }}>{perk.icon}</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: "var(--white)" }}>{perk.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{perk.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(201,169,110,0.12)" }}>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
              Erken rezervasyon fırsatı için hemen rezervasyon yapın →
            </p>
            <Link href="/rezervasyon" className="btn-primary">
              Şimdi Rezervasyon Yap
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ background: "linear-gradient(135deg, var(--navy-mid) 0%, var(--navy) 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem", textAlign: "center" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "1.5rem" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: 700, background: "linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1, marginBottom: "0.5rem" }}>
                {s.num}
              </p>
              <p style={{ fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>



      {/* ─── TESTIMONIALS ─── */}
      <section style={{ background: "var(--navy)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>Misafir Yorumları</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "var(--white)" }}>
              Misafirlerimiz Ne Diyor?
            </h2>
            <div className="gold-divider" style={{ margin: "1rem auto 0" }} />
          </div>
          {testimonials.length === 0 ? (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)" }}>Henüz yorum eklenmedi.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} t={t} />
              ))}
            </div>
          )}

          <TestimonialForm />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ background: "linear-gradient(135deg, var(--gold-dark) 0%, var(--gold) 50%, var(--gold-light) 100%)", padding: "5rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--navy)", opacity: 0.7, marginBottom: "1rem" }}>
          ✦ Özel Fırsatlar ✦
        </p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, color: "var(--navy)", marginBottom: "1rem", lineHeight: 1.2 }}>
          Gerze&apos;de Unutulmaz<br />
          <em>Bir Tatil Sizi Bekliyor</em>
        </p>
        <p style={{ color: "var(--navy)", opacity: 0.7, fontSize: "1rem", marginBottom: "2.5rem", maxWidth: "480px", margin: "0 auto 2.5rem" }}>
          Erken rezervasyon yapın, %20&apos;ye varan indirimlerden yararlanın.
        </p>
        <Link href="/rezervasyon" className="btn-cta">
          Rezervasyon Yap →
        </Link>
      </section>
    </div>
  );
}