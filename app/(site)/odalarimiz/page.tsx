import { prisma } from "@/lib/prisma";
import RoomsGrid from "@/components/RoomsGrid";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { translations } from "@/lib/translations";

export default async function OdalarimizPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "tr") as "tr" | "en";
  const t = translations[lang] || translations.tr;

  const [rooms, categories] = await Promise.all([
    prisma.room.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { id: "asc" },
    }),
  ]);

  // Clean room prices to string for rendering consistency & translate names
  const serializedRooms = rooms.map(room => {
    let name = room.name;
    let desc = room.description;
    let catName = room.category.name;
    
    if (lang === "tr") {
      if (room.category.name === "Standard") catName = "Standart Oda";
      else if (room.category.name === "Deluxe") catName = "Deluxe Oda";
      else if (room.category.name === "Suite") catName = "Süit Oda";
    } else {
      if (room.name.includes("Standart")) name = name.replace("Standart", "Standard");
      if (room.name.includes("Süit")) name = name.replace("Süit", "Suite");
      if (room.name.includes("Balayı")) name = name.replace("Balayı", "Honeymoon");
      
      if (room.category.name === "Standard") catName = "Standard Room";
      else if (room.category.name === "Deluxe") catName = "Deluxe Room";
      else if (room.category.name === "Suite") catName = "Suite Room";
    }

    return {
      ...room,
      name,
      description: desc,
      price: room.price.toString(),
      category: {
        id: room.category.id,
        name: catName,
        description: room.category.description || "",
      }
    };
  });

  const serializedCategories = categories.map(cat => {
    let name = cat.name;
    if (lang === "tr") {
      if (cat.name === "Standard") name = "Standart Oda";
      else if (cat.name === "Deluxe") name = "Deluxe Oda";
      else if (cat.name === "Suite") name = "Süit Oda";
    } else {
      if (cat.name === "Standard") name = "Standard Room";
      else if (cat.name === "Deluxe") name = "Deluxe Room";
      else if (cat.name === "Suite") name = "Suite Room";
    }
    return {
      id: cat.id,
      name,
      description: cat.description || "",
    };
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
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>{t.odalarSubtitle}</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700, color: "white",
            marginBottom: "1rem", lineHeight: 1.2,
          }}>
            {lang === "tr" ? (
              <>Otelimizin <em style={{ color: "var(--gold)" }}>Odaları</em></>
            ) : (
              <>Our Hotel <em style={{ color: "var(--gold)" }}>Rooms</em></>
            )}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.7 }}>
            {t.odalarDesc}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <Suspense fallback={<p style={{ color: "var(--text-light)", textAlign: "center", padding: "3rem" }}>{t.loading}</p>}>
          <RoomsGrid initialRooms={serializedRooms} categories={serializedCategories} />
        </Suspense>
      </div>
    </div>
  );
}