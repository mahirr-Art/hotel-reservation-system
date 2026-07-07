import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { translations } from "@/lib/translations";

export const revalidate = 0; // Dynamic rendering

const categoryImages: Record<string, string> = {
  "standart-cat": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=cover&w=800&q=80",
  "deluxe-cat": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=cover&w=800&q=80",
  "suite-cat": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=cover&w=800&q=80",
};

const defaultImage = "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=cover&w=800&q=80";

export default async function KategorilerPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en";
  const t = translations[lang] || translations.tr;

  const categories = await prisma.category.findMany({
    include: {
      rooms: {
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* Hero Header */}
      <div style={{
        background: "var(--navy)",
        padding: "5rem 1.5rem 4rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "url('/hotel_hero_bg.jpg') center/cover", opacity: 0.08 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>{t.kategoriSubtitle}</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700, color: "white",
            marginBottom: "1rem", lineHeight: 1.2,
          }}>
            {lang === "tr" ? (
              <>Oda <em style={{ color: "var(--gold)" }}>Kategorileri</em></>
            ) : (
              <>Room <em style={{ color: "var(--gold)" }}>Categories</em></>
            )}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.7 }}>
            {t.kategoriDesc}
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {categories.map((cat, index) => {
            const image = categoryImages[cat.id] || defaultImage;
            const roomCount = cat.rooms.length;
            const isEven = index % 2 === 0;

            let catName = cat.name;
            let catDesc = cat.description || "";
            if (lang === "en") {
              if (cat.name === "Standart Oda") catName = "Standard Room";
              else if (cat.name === "Deluxe Oda") catName = "Deluxe Room";
              else if (cat.name === "Süit Oda") catName = "Suite Room";

              if (!cat.description || cat.description.includes("Karadeniz'in huzur")) {
                catDesc = "Our rooms in this category offer the peaceful view of the Black Sea and modern comfort together.";
              }
            }

            return (
              <div
                key={cat.id}
                style={{
                  display: "flex",
                  flexDirection: isEven ? "row" : "row-reverse",
                  background: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 10px 30px rgba(13,27,42,0.04)",
                }}
                className="category-card card-hover"
              >
                {/* Visual Image */}
                <div className="img-zoom" style={{ flex: "1 1 45%", minHeight: "300px", position: "relative", overflow: "hidden" }}>
                  <img
                    src={image}
                    alt={catName}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(13,27,42,0.4) 0%, transparent 60%)"
                  }} />
                </div>

                {/* Content Details */}
                <div style={{ flex: "1 1 55%", padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <span style={{
                      background: "rgba(201,169,110,0.12)",
                      color: "var(--gold-dark)",
                      fontSize: "0.7rem", fontWeight: 700,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      padding: "0.3rem 0.75rem", borderRadius: "20px",
                    }}>
                      {roomCount} {t.kategoriActive}
                    </span>
                  </div>

                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.75rem", fontWeight: 700,
                    color: "var(--navy)", marginBottom: "1rem",
                  }}>
                    {catName}
                  </h2>
                  <p style={{
                    fontSize: "0.9rem", color: "var(--text-mid)",
                    lineHeight: 1.7, marginBottom: "2rem"
                  }}>
                    {catDesc}
                  </p>

                  <div style={{ marginTop: "auto" }}>
                    <Link
                      href={`/odalarimiz?kategori=${cat.id}`}
                      className="btn-primary"
                      style={{ borderRadius: "8px" }}
                    >
                      {t.discoverRooms} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .category-card {
            flex-direction: column !important;
          }
          .category-card > div {
            flex: 1 1 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
