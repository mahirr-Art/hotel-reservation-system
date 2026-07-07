import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import RoomCalendar from "@/components/RoomCalendar";
import { translations } from "@/lib/translations";

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en";
  const t = translations[lang] || translations.tr;

  const { id } = await params;
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      category: true,
      reservations: {
        where: { status: { not: "IPTAL" } },
        orderBy: { checkIn: "asc" },
      },
    },
  });

  if (!room) notFound();

  let roomName = room.name;
  let catName = room.category.name;
  if (lang === "en") {
    if (roomName.includes("Standart")) roomName = roomName.replace("Standart", "Standard");
    if (roomName.includes("Süit")) roomName = roomName.replace("Süit", "Suite");
    if (roomName.includes("Balayı")) roomName = roomName.replace("Balayı", "Honeymoon");

    if (room.category.name === "Standart Oda") catName = "Standard Room";
    else if (room.category.name === "Deluxe Oda") catName = "Deluxe Room";
    else if (room.category.name === "Süit Oda") catName = "Suite Room";
  }

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "0.875rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-light)" }}>
          <Link href="/" style={{ color: "var(--text-light)", textDecoration: "none" }}>{lang === "tr" ? "Ana Sayfa" : "Home"}</Link>
          <span>›</span>
          <Link href="/odalarimiz" style={{ color: "var(--text-light)", textDecoration: "none" }}>{t.rooms}</Link>
          <span>›</span>
          <span style={{ color: "var(--navy)", fontWeight: 600 }}>{roomName}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "3rem", alignItems: "start" }}
          className="room-detail-grid"
        >
          {/* Left column */}
          <div>
            {/* Category tag + Room name */}
            <div style={{ marginBottom: "1.5rem" }}>
              <span style={{
                display: "inline-block",
                background: "var(--gold)", color: "var(--navy)",
                fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", padding: "0.3rem 0.875rem",
                borderRadius: "20px", marginBottom: "0.75rem",
              }}>
                {catName}
              </span>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.75rem, 4vw, 2.8rem)",
                fontWeight: 700, color: "var(--navy)", lineHeight: 1.2,
              }}>
                {roomName}
              </h1>
              <div className="gold-divider" style={{ marginTop: "1rem" }} />
            </div>

            {/* Photo Gallery */}
            <div style={{ marginBottom: "2.5rem" }}>
              {room.photos && room.photos.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: room.photos.length > 2 ? "1.8fr 1fr" : room.photos.length > 1 ? "1fr 1fr" : "1fr",
                  gap: "0.75rem",
                }}
                className="room-detail-gallery"
                >
                  {room.photos.length > 2 ? (
                    <>
                      {/* Big Main Left Image */}
                      <div className="img-zoom" style={{ borderRadius: "16px", overflow: "hidden", height: "420px" }}>
                        <img src={room.photos[0]} alt={roomName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      {/* Right Small Images Stack */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", height: "420px" }}>
                        {room.photos.slice(1, 3).map((photo, idx) => (
                          <div key={idx} className="img-zoom" style={{ flex: 1, borderRadius: "12px", overflow: "hidden", position: "relative" }}>
                            <img src={photo} alt={`${roomName} - ${idx + 2}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    room.photos.map((photo, i) => (
                      <div key={i} className="img-zoom" style={{ borderRadius: "16px", overflow: "hidden", aspectRatio: "16/10" }}>
                        <img src={photo} alt={`${roomName} - ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div style={{
                  aspectRatio: "16/9", borderRadius: "16px",
                  background: "var(--cream-dark)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-light)",
                }}>
                  <div style={{ textAlign: "center" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
                    </svg>
                    <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                      {lang === "tr" ? "Fotoğraf mevcut değil" : "No photos available"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{
              background: "white", borderRadius: "16px", padding: "1.75rem",
              border: "1px solid rgba(0,0,0,0.06)", marginBottom: "2rem",
            }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", marginBottom: "1rem" }}>
                {lang === "tr" ? "Oda Hakkında" : "About the Room"}
              </h2>
              <p style={{ color: "var(--text-mid)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                {room.description || (lang === "tr" ? "Bu oda hakkında detaylı bilgi için lütfen bizimle iletişime geçin." : "Please contact us for detailed information about this suite.")}
              </p>
            </div>

            {/* Room details */}
            <div style={{
              background: "white", borderRadius: "16px", padding: "1.75rem",
              border: "1px solid rgba(0,0,0,0.06)", marginBottom: "2rem",
            }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", marginBottom: "1.25rem" }}>
                {lang === "tr" ? "Oda Bilgileri" : "Room Information"}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                {[
                  { icon: "👤", label: lang === "tr" ? "Kapasite" : "Capacity", value: lang === "tr" ? `${room.capacity} Kişi` : `${room.capacity} Guests` },
                  { icon: "🚪", label: lang === "tr" ? "Oda Adedi" : "Total Rooms", value: lang === "tr" ? `${room.quantity} Adet` : `${room.quantity} Units` },
                  { icon: "📍", label: lang === "tr" ? "Konum" : "Location", value: room.city },
                  { icon: "🏷️", label: lang === "tr" ? "Kategori" : "Category", value: catName },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: "var(--cream)", borderRadius: "12px",
                    padding: "1rem", textAlign: "center",
                    border: "1px solid var(--cream-dark)",
                  }}>
                    <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.35rem" }}>{item.icon}</span>
                    <p style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-light)", marginBottom: "0.2rem" }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--navy)" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Calendar */}
            <div style={{
              background: "white", borderRadius: "16px", padding: "1.75rem",
              border: "1px solid rgba(0,0,0,0.06)",
            }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>
                {lang === "tr" ? "Müsaitlik Durumu" : "Availability Status"}
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "1.25rem" }}>
                {lang === "tr" ? "Takvim üzerinde müsait, kısmen dolu ve dolu tarihleri görebilirsiniz." : "You can check available, partially booked, and fully booked dates on the calendar."}
              </p>
              <RoomCalendar
                reservations={room.reservations}
                quantity={room.quantity}
                capacity={room.capacity}
                price={room.price.toString()}
              />
            </div>
          </div>

          {/* Right column: Booking Card */}
          <div style={{ position: "sticky", top: 80 }}>
            <div style={{
              background: "white", borderRadius: "20px", padding: "2rem",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 12px 48px rgba(0,0,0,0.1)",
            }}>
              {/* Price */}
              <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--cream-dark)" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.25rem" }}>
                  {lang === "tr" ? "Gecelik Başlangıç Fiyatı" : "Starting Price Per Night"}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2.5rem", fontWeight: 700,
                    color: "var(--navy)", lineHeight: 1,
                  }}>
                    {Number(room.price).toLocaleString("tr-TR")}
                  </span>
                  <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-light)" }}>₺ / {lang === "tr" ? "gece" : "night"}</span>
                </div>
              </div>

              {/* Quick info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.75rem" }}>
                {[
                  { icon: "👤", text: lang === "tr" ? `Maksimum ${room.capacity} kişi` : `Maximum ${room.capacity} guests` },
                  { icon: "✅", text: lang === "tr" ? "Ücretsiz iptal (14 gün öncesine kadar)" : "Free cancellation (up to 14 days before)" },
                  { icon: "🛎️", text: lang === "tr" ? "7/24 konsiyerj hizmeti" : "24/7 concierge service" },
                  { icon: "🌊", text: lang === "tr" ? "Karadeniz manzarası" : "Black Sea view" },
                ].map((item) => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1rem", flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-mid)" }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Link
                  href={`/rezervasyon?oda=${room.id}`}
                  className="btn-primary"
                  style={{ justifyContent: "center", borderRadius: "12px", padding: "1rem" }}
                >
                  {t.bookNow}
                </Link>
                <Link
                  href="/iletisim"
                  className="btn-outline"
                  style={{ justifyContent: "center", borderRadius: "12px", padding: "1rem" }}
                >
                  {lang === "tr" ? "Bilgi Al" : "Get Info"}
                </Link>
              </div>

              <p style={{ fontSize: "0.72rem", color: "var(--text-light)", textAlign: "center", marginTop: "1rem" }}>
                {lang === "tr" ? "Ücretsiz iptal · Gizli ücret yok" : "Free cancellation · No hidden fees"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .room-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}