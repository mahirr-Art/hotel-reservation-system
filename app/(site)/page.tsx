import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import TestimonialForm from "@/components/TestimonialForm";
import HomeSearchForm from "@/components/HomeSearchForm";
import TestimonialCard from "@/components/TestimonialCard";
import AmenityCard from "@/components/AmenityCard";
import WeatherWidget from "@/components/WeatherWidget";
import PhotoGallery from "@/components/PhotoGallery";
import { translations } from "@/lib/translations";

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en";
  const t = translations[lang] || translations.tr;

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
      title: lang === "tr" ? "Açık Yüzme Havuzu" : "Outdoor Swimming Pool",
      desc: lang === "tr" ? "Karadeniz manzaralı ısıtmalı açık havuzumuzda serinleyin." : "Cool off in our heated outdoor pool with a Black Sea view.",
      detail: lang === "tr"
        ? "Karadeniz'in eşsiz manzarasına karşı konumlanan olimpik ölçülerdeki açık yüzme havuzumuz, sabah 07:00'den gece 22:00'ye kadar hizmet vermektedir. Yetişkin havuzu, çocuk havuzu ve jakuzi bölümlerimizle tüm aile için unutulmaz bir deneyim sunuyoruz."
        : "Our Olympic-sized outdoor swimming pool, positioned against the unique view of the Black Sea, serves from 07:00 in the morning until 22:00 at night. We offer an unforgettable experience for the whole family with our adult, child, and jacuzzi sections.",
      features: lang === "tr"
        ? ["Olimpik boyutlar", "Isıtma sistemi", "Çocuk havuzu", "Jakuzi bölümü", "Havuz barı", "Şezlong & şemsiye", "Soyunma kabinleri", "Havlu hizmeti"]
        : ["Olympic size", "Heating system", "Kids pool", "Jacuzzi section", "Pool bar", "Sunbed & umbrella", "Changing rooms", "Towel service"],
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      ),
      title: "Spa & Wellness",
      desc: lang === "tr" ? "Uzman ellerde masaj, hamam ve terapi deneyimi." : "Massage, bath, and therapy experience in expert hands.",
      detail: lang === "tr"
        ? "5 özel tedavi odası, Türk hamamı, buhar odası, sauna ve masaj salonumuzla bütüncül bir dinlenme deneyimi sunuyoruz. Uzman masöz ve terapistlerimiz ile vücudunuzu ve zihninizi yeniden canlandırın."
        : "We offer a holistic relaxation experience with 5 private treatment rooms, a Turkish bath, a steam room, a sauna, and a massage parlor. Revitalize your body and mind with our expert masseuses and therapists.",
      features: lang === "tr"
        ? ["Türk hamamı", "Sauna & buhar odası", "Aromaterapi masajı", "Derin doku masajı", "Çift masaj odası", "Cilt bakımı", "Refleksoloji", "Meditatif terapi"]
        : ["Turkish bath", "Sauna & steam room", "Aromatherapy massage", "Deep tissue massage", "Couples room", "Skincare", "Reflexology", "Meditative therapy"],
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
        </svg>
      ),
      title: lang === "tr" ? "Lüks Restoran" : "Luxury Restaurant",
      desc: lang === "tr" ? "Ödüllü şeflerimizin hazırladığı yerel ve uluslararası lezzetler." : "Local and international flavors prepared by award-winning chefs.",
      detail: lang === "tr"
        ? "Karadeniz'in taze deniz ürünlerini ve bölgeye özgü lezzetleri öne çıkaran menümüzle gastronomi tutkunlarına özel bir deneyim sunuyoruz. Gün batımı manzarası eşliğinde fine dining keyfi yaşayın."
        : "We offer a unique experience to gastronomy lovers with our menu highlighting fresh Black Sea seafood and local delicacies. Enjoy fine dining accompanied by the sunset view.",
      features: lang === "tr"
        ? ["Kahvaltı büfesi", "À la carte öğle", "Fine dining akşam yemeği", "Canlı müzik", "Vejetaryen seçenekler", "Çocuk menüsü", "Şarap koleksiyonu", "Özel etkinlik mekanı"]
        : ["Breakfast buffet", "À la carte lunch", "Fine dining dinner", "Live music", "Vegetarian options", "Kids menu", "Wine collection", "Event venue"],
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      ),
      title: "7/24 Konsiyerj",
      desc: lang === "tr" ? "Günün her saatinde kişisel asistanınız yanınızda." : "Your personal assistant is with you at any time of the day.",
      detail: lang === "tr"
        ? "Profesyonel konsiyerj ekibimiz gece gündüz hizmetinizdedir. Tur organizasyonu, restoran rezervasyonu, transfer hizmetleri ve özel istekleriniz için tek bir telefon araması yeterli."
        : "Our professional concierge team is at your service day and night. One phone call is enough for tour organizations, restaurant reservations, transfer services, and custom requests.",
      features: lang === "tr"
        ? ["Tur organizasyonu", "Transfer hizmeti", "Restoran rezervasyonu", "Hava alanı karşılama", "Özel etkinlik planlama", "Dil tercümanlığı", "Çamaşır servisi", "Oda servisi 24/7"]
        : ["Tour organizations", "Transfer services", "Table reservations", "Airport pickup", "Event planning", "Language translation", "Laundry service", "Room service 24/7"],
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      ),
      title: lang === "tr" ? "Fitness & Spor" : "Fitness & Sports",
      desc: lang === "tr" ? "Modern ekipmanlarla donanmış spor salonu ve aktivite alanları." : "Gym and activity areas equipped with modern equipment.",
      detail: lang === "tr"
        ? "1.200 m² alan üzerinde kurulu fitness merkezimiz, en son teknoloji kardiyovasküler aletler, serbest ağırlık bölümü, yoga & pilates stüdyosu ve kişisel antrenör hizmetiyle donatılmıştır."
        : "Built on 1,200 m² of space, our fitness center is equipped with state-of-the-art cardiovascular machines, a free-weight section, yoga & pilates studios, and personal trainer services.",
      features: lang === "tr"
        ? ["Kardiyovasküler aletler", "Serbest ağırlıklar", "Yoga stüdyosu", "Pilates sınıfı", "Kişisel antrenör", "Tenis kortu", "Plaj voleybolu", "Bisiklet kiralama"]
        : ["Cardio machines", "Free weights", "Yoga studio", "Pilates class", "Personal trainers", "Tennis court", "Beach volleyball", "Bike rental"],
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      ),
      title: lang === "tr" ? "Panoramik Manzara" : "Panoramic View",
      desc: lang === "tr" ? "Deniz ve dağ manzaralı özel odalarda sonsuz güzellik." : "Endless beauty in private rooms with sea and mountain views.",
      detail: lang === "tr"
        ? "Otelimizin tüm odaları Karadeniz'e veya Sinop dağlarına bakan muhteşem manzaralarla tasarlanmıştır. Balkonlu superior ve deluxe odalarımızda sabahın ilk ışıklarıyla beraber büyülü manzaranın tadını çıkarın."
        : "All rooms of our hotel are designed with spectacular views overlooking the Black Sea or Sinop mountains. Enjoy the magical view with the first rays of morning in our superior and deluxe rooms with balconies.",
      features: lang === "tr"
        ? ["Karadeniz manzarası", "Dağ manzarası", "Özel balkon", "Panoramik teras", "Gün batımı görünümü", "Yıldız gözlemi alanı", "Fotoğraf noktaları", "Sonsuzluk havuzu"]
        : ["Black sea view", "Mountain view", "Private balcony", "Panoramic terrace", "Sunset view", "Stargazing area", "Photography spots", "Infinity pool"],
    },
  ];

  const stats = [
    { num: "500+", label: lang === "tr" ? "Mutlu Misafir" : "Happy Guests" },
    { num: "50+", label: lang === "tr" ? "Lüks Oda" : "Luxury Rooms" },
    { num: "15", label: lang === "tr" ? "Yıllık Deneyim" : "Years of Experience" },
    { num: "4.9", label: lang === "tr" ? "Ortalama Puan" : "Average Score" },
  ];

  const earlyBookingPerks = [
    {
      icon: "🏷️",
      title: lang === "tr" ? "%20 İndirim" : "20% Discount",
      desc: lang === "tr" ? "60 gün önceden rezervasyon yapanlara özel fiyat avantajı." : "Special price advantage for bookings 60 days in advance.",
    },
    {
      icon: "🎁",
      title: lang === "tr" ? "Ücretsiz Karşılama" : "Free Welcome",
      desc: lang === "tr" ? "Oda servisiyle ikram edilen karşılama sepeti ve şampanya." : "Welcome basket and champagne served with room service.",
    },
    {
      icon: "🛏️",
      title: lang === "tr" ? "Erken Check-in" : "Early Check-in",
      desc: lang === "tr" ? "Müsaitliğe göre saat 10:00'dan itibaren erken giriş imkânı." : "Early entrance opportunity from 10:00 AM based on availability.",
    },
    {
      icon: "🏊",
      title: lang === "tr" ? "Ücretsiz Spa" : "Complimentary Spa",
      desc: lang === "tr" ? "1 saatlik hamam + masaj deneyimi hediye olarak sunulur." : "1 hour of Turkish bath + massage experience is offered as a gift.",
    },
  ];

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* ─── HERO SECTION ─── */}
      <section
        className="homepage-hero"
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          overflow: "hidden",
        }}
      >
        {/* Background Zoom Image */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-zoom-slow"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=cover&w=1920&q=80')",
            zIndex: 0,
          }}
        />
        {/* Navy Overlay with gold gradient tint */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(13,27,42,0.85) 0%, rgba(13,27,42,0.7) 60%, var(--navy) 100%)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "800px" }}>
          <p
            className="animate-fade-in-up"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.65rem, 1.5vw, 0.85rem)",
              fontWeight: 600,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "1.25rem",
              opacity: 0,
            }}
          >
            ✦ {t.heroSubtitle} ✦
          </p>
          <h1
            className="animate-fade-in-up delay-100"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              background: "linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: 0,
            }}
          >
            {t.heroTitle}
          </h1>
          <div
            className="gold-divider animate-fade-in-up delay-150"
            style={{ margin: "0 auto 1.5rem", width: 80, height: 2, opacity: 0 }}
          />
          <p
            className="animate-fade-in-up delay-200"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
              color: "rgba(255,255,255,0.75)",
              marginBottom: "2.5rem",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
              fontWeight: 300,
              lineHeight: 1.7,
              opacity: 0,
            }}
          >
            {t.heroDesc}
          </p>

          {/* Keşfet CTA Buttons */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.25rem",
            marginBottom: "3rem",
            flexWrap: "wrap",
            opacity: 0,
          }}
          className="animate-fade-in-up delay-300"
          >
            <Link href="/odalarimiz" className="btn-primary" style={{ borderRadius: "30px", padding: "0.85rem 2rem", fontSize: "0.85rem" }}>
              {t.discoverRooms}
            </Link>
            <Link href="/iletisim" className="btn-outline" style={{ borderRadius: "30px", padding: "0.85rem 2rem", fontSize: "0.85rem", color: "white", borderColor: "rgba(255,255,255,0.4)" }}>
              {t.contactUs}
            </Link>
          </div>

          {/* Weather Widget */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem", opacity: 0 }} className="animate-fade-in-up delay-500">
            <WeatherWidget />
          </div>

          {/* Search form */}
          <HomeSearchForm />

          {/* Scroll indicator */}
          <div
            className="animate-fade-in delay-600"
            style={{ marginTop: "3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0 }}
          >
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
              {lang === "tr" ? "Kaydır" : "Scroll"}
            </span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, var(--gold), transparent)" }} />
          </div>
        </div>
      </section>

      {/* ─── AMENITIES (Tıklanabilir Ayrıcalıklar) ─── */}
      <section style={{ background: "var(--navy)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>
              {lang === "tr" ? "Ayrıcalıklarımız" : "Our Amenities"}
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "var(--white)", marginBottom: "0.75rem" }}>
              {t.whyChooseUs}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.45)", maxWidth: "480px", margin: "0 auto 1.5rem" }}>
              {t.amenitiesSubtitle}
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
              <p className="section-label" style={{ marginBottom: "0.75rem" }}>{t.featuredRoomsSubtitle}</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "var(--navy)" }}>
                {t.featuredRoomsTitle}
              </h2>
              <div className="gold-divider" style={{ marginTop: "1rem" }} />
            </div>
            <Link href="/odalarimiz" className="link-navy">{t.allRoomsLink}</Link>
          </div>

          {featuredRooms.length === 0 ? (
            <p style={{ color: "var(--text-light)", textAlign: "center", padding: "3rem" }}>
              {lang === "tr" ? "Henüz oda eklenmedi." : "No rooms have been added yet."}
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {featuredRooms.map((room) => {
                let name = room.name;
                let desc = room.description || "";
                let catName = room.category.name;

                if (lang === "en") {
                  if (room.name.includes("Deniz Feneri Şömineli Aile Süiti")) {
                    name = "Lighthouse Family Suite with Fireplace";
                    desc = "Designed for large families, a luxury suite with two separate bedrooms and a shared fireplace living room. Features 2 bathrooms, fully equipped minibar, and a spacious balcony with Black Sea view.";
                  } else if (room.name.includes("Kuzey Feneri Jakuzili Süit")) {
                    name = "North Lighthouse Suite with Jacuzzi";
                    desc = "With its full-height panoramic windows, this special suite offers a 180-degree Black Sea view. Features in-room jacuzzi, fireplace living area, VIP welcoming treats, and 24-hour private room service.";
                  } else if (room.name.includes("Deluxe Teraslı Queen Oda")) {
                    name = "Deluxe Queen Room with Terrace";
                    desc = "A premium room where you can watch the sunset on your own spacious private terrace. Features modern fireplace detail, smart TV system, and luxury guest amenities.";
                  } else {
                    if (room.name.includes("Standart")) name = name.replace("Standart", "Standard");
                    if (room.name.includes("Süit")) name = name.replace("Süit", "Suite");
                    if (room.name.includes("Balayı")) name = name.replace("Balayı", "Honeymoon");
                  }

                  if (room.category.name === "Standart Oda") catName = "Standard Room";
                  else if (room.category.name === "Deluxe Oda") catName = "Deluxe Room";
                  else if (room.category.name === "Süit Oda") catName = "Suite Room";
                }

                return (
                  <Link
                    key={room.id}
                    href={`/odalarimiz/${room.id}`}
                    className="card-hover img-zoom"
                    style={{ background: "var(--white)", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", textDecoration: "none", display: "block" }}
                  >
                    <div style={{ aspectRatio: "4/3", background: "var(--cream-dark)", overflow: "hidden", position: "relative" }}>
                      {room.photos?.[0] ? (
                        <img src={room.photos[0]} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-light)" }}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" /></svg>
                        </div>
                      )}
                      <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--gold)", color: "var(--navy)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.3rem 0.75rem", borderRadius: "2px" }}>
                        {catName}
                      </div>
                    </div>
                    <div style={{ padding: "1.75rem" }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.5rem" }}>{name}</h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginBottom: "1.25rem", lineHeight: 1.6 }}>{desc}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{t.perNight}</span>
                          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--navy)" }}>
                            {room.price.toString()} <span style={{ fontSize: "0.9rem", fontWeight: 400 }}>₺</span>
                          </p>
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-dark)", borderBottom: "1px solid var(--gold)" }}>
                          {t.detailsArrow}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>
                  🔥 {t.earlyBookingSubtitle}
                </span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "var(--white)", marginBottom: "0.75rem" }}>
                {lang === "tr" ? (
                  <>
                    Erken Rezervasyon<br />
                    <em style={{ color: "var(--gold)" }}>Ayrıcalıkları</em>
                  </>
                ) : (
                  <>
                    Early Booking<br />
                    <em style={{ color: "var(--gold)" }}>Privileges</em>
                  </>
                )}
              </h2>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", maxWidth: "400px", lineHeight: 1.7 }}>
                {t.earlyBookingDesc}
              </p>
              <div className="gold-divider" style={{ marginTop: "1.25rem" }} />
            </div>

            {/* Countdown box */}
            <div style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: "12px", padding: "1.5rem 2rem", textAlign: "center", minWidth: 200 }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>
                {t.countdownTitle}
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>{t.countdownDate}</p>
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
              {lang === "tr" ? "Erken rezervasyon fırsatı için hemen rezervasyon yapın →" : "Book now to catch early booking offers →"}
            </p>
            <Link href="/rezervasyon" className="btn-primary">
              {t.bookNow}
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

      {/* ─── GALLERY SECTION ─── */}
      <PhotoGallery />

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ background: "var(--navy)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>{t.testimonialsSubtitle}</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "var(--white)" }}>
              {t.testimonialsTitle}
            </h2>
            <div className="gold-divider" style={{ margin: "1rem auto 0" }} />
          </div>
          {testimonials.length === 0 ? (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)" }}>{t.noTestimonials}</p>
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
          {lang === "tr" ? "✦ Özel Fırsatlar ✦" : "✦ Special Offers ✦"}
        </p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, color: "var(--navy)", marginBottom: "1rem", lineHeight: 1.2 }}>
          {lang === "tr" ? (
            <>
              Gerze&apos;de Unutulmaz<br />
              <em>Bir Tatil Sizi Bekliyor</em>
            </>
          ) : (
            <>
              An Unforgettable Vacation<br />
              <em>Awaits You in Gerze</em>
            </>
          )}
        </p>
        <p style={{ color: "var(--navy)", opacity: 0.7, fontSize: "1rem", marginBottom: "2.5rem", maxWidth: "480px", margin: "0 auto 2.5rem" }}>
          {t.ctaDesc}
        </p>
        <Link href="/rezervasyon" className="btn-cta">
          {t.ctaButton}
        </Link>
      </section>

      <style>{`
        .homepage-hero {
          padding: 130px 1.5rem 0 !important;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .homepage-hero {
            padding: 150px 1.5rem 0 !important;
          }
        }
      `}</style>
    </div>
  );
}