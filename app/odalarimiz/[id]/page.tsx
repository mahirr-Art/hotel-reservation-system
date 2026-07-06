import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RoomCalendar from "@/components/RoomCalendar";

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  const nights1 = 1;
  const totalPrice = Number(room.price);

  const amenityIcons: Record<string, string> = {
    "wifi": "📶", "wifi ücretsiz": "📶", "klima": "❄️", "minibar": "🍾",
    "tv": "📺", "balkon": "🌿", "deniz manzarası": "🌊", "jakuzi": "🛁",
    "çalışma masası": "💼", "kasa": "🔐", "saç kurutma makinesi": "💨",
  };

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "0.875rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-light)" }}>
          <Link href="/" style={{ color: "var(--text-light)", textDecoration: "none" }}>Ana Sayfa</Link>
          <span>›</span>
          <Link href="/odalarimiz" style={{ color: "var(--text-light)", textDecoration: "none" }}>Odalarımız</Link>
          <span>›</span>
          <span style={{ color: "var(--navy)", fontWeight: 600 }}>{room.name}</span>
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
                {room.category.name}
              </span>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.75rem, 4vw, 2.8rem)",
                fontWeight: 700, color: "var(--navy)", lineHeight: 1.2,
              }}>
                {room.name}
              </h1>
              <div className="gold-divider" style={{ marginTop: "1rem" }} />
            </div>

            {/* Photo Gallery */}
            <div style={{ marginBottom: "2.5rem" }}>
              {room.photos && room.photos.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: room.photos.length > 1 ? "1fr 1fr" : "1fr", gap: "0.75rem" }}>
                  {room.photos.map((photo, i) => (
                    <div
                      key={i}
                      className="img-zoom"
                      style={{
                        borderRadius: "16px",
                        overflow: "hidden",
                        aspectRatio: i === 0 && room.photos.length > 1 ? "16/10" : "4/3",
                        gridColumn: i === 0 && room.photos.length > 1 ? "1 / -1" : undefined,
                      }}
                    >
                      <img
                        src={photo}
                        alt={`${room.name} - Fotoğraf ${i + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  ))}
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
                    <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>Fotoğraf mevcut değil</p>
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
                Oda Hakkında
              </h2>
              <p style={{ color: "var(--text-mid)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                {room.description || "Bu oda hakkında detaylı bilgi için lütfen bizimle iletişime geçin."}
              </p>
            </div>

            {/* Room details */}
            <div style={{
              background: "white", borderRadius: "16px", padding: "1.75rem",
              border: "1px solid rgba(0,0,0,0.06)", marginBottom: "2rem",
            }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", marginBottom: "1.25rem" }}>
                Oda Bilgileri
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                {[
                  { icon: "👤", label: "Kapasite", value: `${room.capacity} Kişi` },
                  { icon: "🚪", label: "Oda Adedi", value: `${room.quantity} Adet` },
                  { icon: "📍", label: "Konum", value: room.city },
                  { icon: "🏷️", label: "Kategori", value: room.category.name },
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
                Müsaitlik Durumu
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "1.25rem" }}>
                Takvim üzerinde müsait, kısmen dolu ve dolu tarihleri görebilirsiniz.
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
                  Gecelik Başlangıç Fiyatı
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2.5rem", fontWeight: 700,
                    color: "var(--navy)", lineHeight: 1,
                  }}>
                    {Number(room.price).toLocaleString("tr-TR")}
                  </span>
                  <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-light)" }}>₺ / gece</span>
                </div>
              </div>

              {/* Quick info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.75rem" }}>
                {[
                  { icon: "👤", text: `Maksimum ${room.capacity} kişi` },
                  { icon: "✅", text: "Ücretsiz iptal (14 gün öncesine kadar)" },
                  { icon: "🛎️", text: "7/24 konsiyerj hizmeti" },
                  { icon: "🌊", text: "Karadeniz manzarası" },
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
                  Hemen Rezervasyon Yap
                </Link>
                <Link
                  href="/iletisim"
                  className="btn-outline"
                  style={{ justifyContent: "center", borderRadius: "12px", padding: "1rem" }}
                >
                  Bilgi Al
                </Link>
              </div>

              <p style={{ fontSize: "0.72rem", color: "var(--text-light)", textAlign: "center", marginTop: "1rem" }}>
                Ücretsiz iptal · Gizli ücret yok
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