import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [featuredRooms, testimonials] = await Promise.all([
    prisma.room.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.testimonial.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const services = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/>
        </svg>
      ),
      title: "Dünya Mutfağı",
      desc: "Ödüllü şeflerimizin hazırladığı yerel ve uluslararası lezzetler.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      ),
      title: "Spa & Wellness",
      desc: "Vücudunuzu ve zihninizi dinlendiren premium spa deneyimleri.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
        </svg>
      ),
      title: "7/24 Hizmet",
      desc: "Günün her saatinde ihtiyaçlarınız için yanınızdayız.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      title: "Panoramik Manzara",
      desc: "Deniz ve şehir manzaralı özel odalarda sonsuz güzellik.",
    },
  ];

  const stats = [
    { num: "500+", label: "Mutlu Misafir" },
    { num: "50+", label: "Lüks Oda" },
    { num: "15", label: "Yıllık Deneyim" },
    { num: "4.9", label: "Ortalama Puan" },
  ];

  const gallery = [
    { src: "/gallery_lobby.jpg", label: "Muhteşem Lobi", wide: true },
    { src: "/gallery_room.jpg", label: "Lüks Süit", wide: false },
    { src: "/gallery_pool.jpg", label: "Sonsuzluk Havuzu", wide: false },
    { src: "/gallery_restaurant.jpg", label: "Gurme Restoran", wide: false },
    { src: "/gallery_spa.jpg", label: "Spa & Wellness", wide: false },
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
            Karadeniz'i Hisset,{" "}
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Gerze'yi Keşfet</em>
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
            Sinop Gerze kıyısında, Karadeniz'in masmavi suları eşliğinde huzur dolu bir konaklama
            deneyimi sizi bekliyor.
          </p>

          {/* Search form */}
          <form
            action="/rezervasyon"
            className="animate-fade-in-up delay-300"
            style={{
              background: "rgba(255,255,255,0.97)",
              borderRadius: "4px",
              padding: "1.25rem",
              display: "grid",
              gap: "0.75rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              maxWidth: "800px",
              margin: "0 auto",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
              opacity: 0,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)" }}>Şehir</label>
              <select name="city" style={{ border: "1px solid #e2e8f0", borderRadius: "2px", padding: "0.6rem 0.75rem", fontSize: "0.88rem", color: "var(--text-dark)", background: "white", outline: "none" }}>
                {["Sinop Merkez", "Gerze", "Samsun", "Ordu", "Artvin"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)" }}>Giriş Tarihi</label>
              <input type="date" name="checkIn" style={{ border: "1px solid #e2e8f0", borderRadius: "2px", padding: "0.6rem 0.75rem", fontSize: "0.88rem", color: "var(--text-dark)", outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)" }}>Çıkış Tarihi</label>
              <input type="date" name="checkOut" style={{ border: "1px solid #e2e8f0", borderRadius: "2px", padding: "0.6rem 0.75rem", fontSize: "0.88rem", color: "var(--text-dark)", outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)" }}>Kişi Sayısı</label>
              <input type="number" name="guests" min={1} defaultValue={2} style={{ border: "1px solid #e2e8f0", borderRadius: "2px", padding: "0.6rem 0.75rem", fontSize: "0.88rem", color: "var(--text-dark)", outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", justifyContent: "flex-end" }}>
              <label style={{ fontSize: "0.65rem", opacity: 0 }}>x</label>
              <button type="submit" className="btn-primary" style={{ justifyContent: "center" }}>Ara</button>
            </div>
          </form>

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

      {/* ─── SERVICES ─── */}
      <section style={{ background: "var(--navy)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>Ayrıcalıklarımız</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "var(--white)", marginBottom: "1rem" }}>
              Neden Kuzey Feneri?
            </h2>
            <div className="gold-divider" style={{ margin: "0 auto" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
            {services.map((s) => (
              <div
                key={s.title}
                className="card-hover"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: "4px", padding: "2.5rem 2rem", textAlign: "center", cursor: "default" }}
              >
                <div style={{ color: "var(--gold)", marginBottom: "1.25rem", display: "flex", justifyContent: "center" }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: "var(--white)", marginBottom: "0.75rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
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
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
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

      {/* ─── GALLERY ─── */}
      <section style={{ padding: "5rem 1.5rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>Fotoğraf Turu</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "var(--navy)" }}>
              Otelimizi Keşfedin
            </h2>
            <div className="gold-divider" style={{ margin: "1rem auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "240px 240px", gap: "0.75rem" }}>
            {gallery.map((g, i) => (
              <div
                key={i}
                className="img-zoom gallery-item"
                style={{ gridColumn: g.wide ? "span 2" : undefined, borderRadius: "4px", overflow: "hidden", position: "relative", cursor: "pointer" }}
              >
                <img src={g.src} alt={g.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div className="gallery-overlay">
                  <span style={{ fontFamily: "'Playfair Display', serif", color: "var(--white)", fontSize: "1rem", fontWeight: 600 }}>{g.label}</span>
                </div>
              </div>
            ))}
          </div>
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
                <div
                  key={t.id}
                  className="card-hover"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: "4px", padding: "2rem" }}
                >
                  <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < t.rating ? "var(--gold)" : "none"} stroke="var(--gold)" strokeWidth="1.5">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: "1.5rem", fontStyle: "italic" }}>
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, color: "var(--navy)" }}>
                      {t.authorTag?.[0]?.toUpperCase() ?? "M"}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: "var(--white)", fontSize: "0.9rem" }}>{t.authorTag}</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--gold)", letterSpacing: "0.08em" }}>Misafir</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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