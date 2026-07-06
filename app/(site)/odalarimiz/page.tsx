import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function OdalarimizPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const rooms = await prisma.room.findMany({
    where: kategori ? { categoryId: kategori } : {},
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

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
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>Konaklamalarımız</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700, color: "white",
            marginBottom: "1rem", lineHeight: 1.2,
          }}>
            Tüm <em style={{ color: "var(--gold)" }}>Odalarımız</em>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.7 }}>
            Karadeniz'in eşsiz manzarasıyla buluşan {rooms.length} adet özenle tasarlanmış oda.
          </p>
        </div>
      </div>

      {/* Rooms Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1.5rem" }}>
        {rooms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-light)" }}>
            <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛏️</p>
            <p>Henüz oda eklenmedi.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "2rem",
          }}>
            {rooms.map((room) => (
              <Link
                key={room.id}
                href={`/odalarimiz/${room.id}`}
                className="card-hover"
                style={{
                  textDecoration: "none",
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.06)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Photo */}
                <div className="img-zoom" style={{ height: 220, position: "relative", overflow: "hidden", background: "var(--cream-dark)" }}>
                  {room.photos?.[0] ? (
                    <img
                      src={room.photos[0]}
                      alt={room.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
                      </svg>
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, transparent 40%, rgba(13,27,42,0.55) 100%)",
                  }} />
                  {/* Category badge */}
                  <div style={{
                    position: "absolute", top: "1rem", left: "1rem",
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "20px",
                    padding: "0.25rem 0.75rem",
                  }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "white" }}>
                      {room.category.name}
                    </span>
                  </div>
                  {/* Price badge */}
                  <div style={{
                    position: "absolute", bottom: "1rem", right: "1rem",
                    background: "var(--gold)",
                    borderRadius: "20px",
                    padding: "0.3rem 0.875rem",
                  }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)" }}>
                      {Number(room.price).toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.2rem", fontWeight: 700,
                    color: "var(--navy)", marginBottom: "0.4rem",
                  }}>
                    {room.name}
                  </h2>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-light)", marginBottom: "1rem" }}>
                    📍 {room.city}
                  </p>

                  <div style={{
                    display: "flex", gap: "0.75rem", flexWrap: "wrap",
                    marginBottom: "1.25rem",
                  }}>
                    {[
                      { icon: "👤", label: `${room.capacity} Kişi` },
                      { icon: "🚪", label: `${room.quantity} Oda` },
                    ].map((item) => (
                      <span key={item.label} style={{
                        display: "flex", alignItems: "center", gap: "0.3rem",
                        fontSize: "0.78rem", color: "var(--text-mid)",
                        background: "var(--cream)", borderRadius: "6px",
                        padding: "0.25rem 0.6rem",
                        border: "1px solid var(--cream-dark)",
                      }}>
                        {item.icon} {item.label}
                      </span>
                    ))}
                  </div>

                  <div style={{
                    marginTop: "auto",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--cream-dark)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-light)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.08em" }}>
                      Gecelik
                    </span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--navy)" }}>
                      {Number(room.price).toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        {rooms.length > 0 && (
          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <Link href="/rezervasyon" className="btn-primary">
              Rezervasyon Yap →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}