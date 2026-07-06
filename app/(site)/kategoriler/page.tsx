import Link from "next/link";
import { prisma } from "@/lib/prisma";

const categoryMeta: Record<string, { icon: string; gradient: string; textColor: string; desc: string }> = {
  "Standart": {
    icon: "🌊",
    gradient: "linear-gradient(135deg, #0D1B2A 0%, #1A2E45 100%)",
    textColor: "#C9A96E",
    desc: "Karadeniz manzaralı konforlu ve ekonomik odalar",
  },
  "Standard": {
    icon: "🌊",
    gradient: "linear-gradient(135deg, #0D1B2A 0%, #1A2E45 100%)",
    textColor: "#C9A96E",
    desc: "Karadeniz manzaralı konforlu ve ekonomik odalar",
  },
  "Deluxe": {
    icon: "🌟",
    gradient: "linear-gradient(135deg, #A07840 0%, #C9A96E 100%)",
    textColor: "#0D1B2A",
    desc: "Geniş balkon ve premium olanaklarla donatılmış lüks odalar",
  },
  "Süit": {
    icon: "👑",
    gradient: "linear-gradient(135deg, #1A2E45 0%, #243B55 100%)",
    textColor: "#E8D5B0",
    desc: "Tam Karadeniz manzaralı, jakuzili lüks süit deneyimi",
  },
  "Suite": {
    icon: "👑",
    gradient: "linear-gradient(135deg, #1A2E45 0%, #243B55 100%)",
    textColor: "#E8D5B0",
    desc: "Tam Karadeniz manzaralı, jakuzili lüks süit deneyimi",
  },
  "Aile": {
    icon: "🏡",
    gradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    textColor: "#ECFDF5",
    desc: "Aileler için özel düzenlenmiş geniş odalar",
  },
  "Balayı": {
    icon: "💑",
    gradient: "linear-gradient(135deg, #be185d 0%, #9d174d 100%)",
    textColor: "#FDF2F8",
    desc: "Romantik atmosfer ve özel sürprizlerle dolu odalar",
  },
};

const fallbackMeta = {
  icon: "🛏️",
  gradient: "linear-gradient(135deg, #374151 0%, #1F2937 100%)",
  textColor: "#F9FAFB",
  desc: "Konforlu ve kaliteli konaklama deneyimi",
};

export default async function KategorilerPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { rooms: true } },
      rooms: { take: 1, select: { photos: true } },
    },
    orderBy: { createdAt: "asc" },
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
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>Oda Kategorileri</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            color: "white",
            marginBottom: "1rem",
            lineHeight: 1.2,
          }}>
            Size Özel <em style={{ color: "var(--gold)" }}>Konfor</em> Seçenekleri
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.7 }}>
            Standart odadan lüks süite, aileden balayına kadar her bütçe ve tercih için oda kategorimiz bulunmaktadır.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1.5rem" }}>
        {categories.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-light)", padding: "4rem" }}>
            Henüz kategori eklenmedi.
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.75rem",
          }}>
            {categories.map((cat) => {
              const meta = categoryMeta[cat.name] ?? fallbackMeta;
              const coverPhoto = cat.rooms[0]?.photos?.[0];
              return (
                <Link
                  key={cat.id}
                  href={`/odalarimiz?kategori=${cat.id}`}
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
                  {/* Card image / gradient header */}
                  <div style={{
                    height: 200,
                    position: "relative",
                    overflow: "hidden",
                    background: coverPhoto ? undefined : meta.gradient,
                  }}>
                    {coverPhoto ? (
                      <>
                        <img
                          src={coverPhoto}
                          alt={cat.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                          className="img-zoom-target"
                        />
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)",
                        }} />
                      </>
                    ) : (
                      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "4rem", opacity: 0.9 }}>{meta.icon}</span>
                      </div>
                    )}

                    {/* Category badge */}
                    <div style={{
                      position: "absolute", top: "1rem", left: "1rem",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      borderRadius: "20px",
                      padding: "0.3rem 0.875rem",
                      display: "flex", alignItems: "center", gap: "0.35rem",
                    }}>
                      <span style={{ fontSize: "0.9rem" }}>{meta.icon}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "white" }}>
                        {cat.name}
                      </span>
                    </div>

                    {/* Room count badge */}
                    <div style={{
                      position: "absolute", bottom: "1rem", right: "1rem",
                      background: "var(--gold)",
                      borderRadius: "20px",
                      padding: "0.3rem 0.875rem",
                    }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--navy)" }}>
                        {cat._count.rooms} Oda
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h2 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.25rem", fontWeight: 700,
                      color: "var(--navy)", marginBottom: "0.5rem",
                    }}>
                      {cat.name} Odaları
                    </h2>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-light)", lineHeight: 1.6, flex: 1, marginBottom: "1.25rem" }}>
                      {cat.description || meta.desc}
                    </p>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      paddingTop: "1rem", borderTop: "1px solid var(--cream-dark)",
                    }}>
                      <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {cat._count.rooms} oda mevcut
                      </span>
                      <span style={{
                        fontSize: "0.78rem", fontWeight: 700,
                        color: "var(--gold-dark)",
                        borderBottom: "1px solid var(--gold)",
                        paddingBottom: "1px",
                      }}>
                        İncele →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}