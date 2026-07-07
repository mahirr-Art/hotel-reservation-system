import { prisma } from "@/lib/prisma";
import RoomsGrid from "@/components/RoomsGrid";
import { Suspense } from "react";

export default async function OdalarimizPage() {
  const [rooms, categories] = await Promise.all([
    prisma.room.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { id: "asc" },
    }),
  ]);

  // Clean room prices to string for rendering consistency
  const serializedRooms = rooms.map(room => ({
    ...room,
    price: room.price.toString(),
    category: {
      id: room.category.id,
      name: room.category.name,
      description: room.category.description || "",
    }
  }));

  const serializedCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    description: cat.description || "",
  }));

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
            Otelimizin <em style={{ color: "var(--gold)" }}>Odaları</em>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.7 }}>
            Karadeniz'in eşsiz manzarasıyla buluşan, her bütçe ve konsept için özenle tasarlanmış odalarımız.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <Suspense fallback={<p style={{ color: "var(--text-light)", textAlign: "center", padding: "3rem" }}>Yükleniyor...</p>}>
          <RoomsGrid initialRooms={serializedRooms} categories={serializedCategories} />
        </Suspense>
      </div>
    </div>
  );
}