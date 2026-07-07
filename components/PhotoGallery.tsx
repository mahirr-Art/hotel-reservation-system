"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/lang";

type GalleryItem = {
  id: number;
  title: string;
  category: "odalar" | "spa" | "restoran";
  image: string;
};

const galleryItems: GalleryItem[] = [
  { id: 1, title: "Deluxe Balayı Süiti", category: "odalar", image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=cover&w=800&q=80" },
  { id: 2, title: "Spa & Hamam Alanı", category: "spa", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=cover&w=800&q=80" },
  { id: 3, title: "A'la Carte Restoran", category: "restoran", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=cover&w=800&q=80" },
  { id: 4, title: "Açık Isıtmalı Havuz", category: "spa", image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=cover&w=800&q=80" },
  { id: 5, title: "Lüks Lobi Bar", category: "restoran", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=cover&w=800&q=80" },
  { id: 6, title: "Standart Deniz Manzaralı Oda", category: "odalar", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=cover&w=800&q=80" },
];

export default function PhotoGallery() {
  const { lang } = useTranslation();
  const [filter, setFilter] = useState<"tumu" | "odalar" | "spa" | "restoran">("tumu");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const filteredItems = galleryItems.filter(
    (item) => filter === "tumu" || item.category === filter
  );

  const filterLabels = {
    tr: { tumu: "Tümü", odalar: "Odalar", spa: "Spa & Havuz", restoran: "Restoran & Bar" },
    en: { tumu: "All", odalar: "Rooms", spa: "Spa & Pool", restoran: "Restaurant & Bar" },
  };

  const labels = filterLabels[lang] || filterLabels.tr;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex === null) return;
    const newIdx = activePhotoIndex === 0 ? filteredItems.length - 1 : activePhotoIndex - 1;
    setActivePhotoIndex(newIdx);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex === null) return;
    const newIdx = activePhotoIndex === filteredItems.length - 1 ? 0 : activePhotoIndex + 1;
    setActivePhotoIndex(newIdx);
  };

  return (
    <section style={{ padding: "5rem 1.5rem", background: "var(--cream)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>
            {lang === "tr" ? "GALERİ" : "GALLERY"}
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "var(--navy)" }}>
            {lang === "tr" ? "Otelimizden Kareler" : "Frames from Our Hotel"}
          </h2>
          <div className="gold-divider" style={{ margin: "1rem auto 0" }} />
        </div>

        {/* Filter buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          {(["tumu", "odalar", "spa", "restoran"] as const).map((key) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  background: isActive ? "var(--navy)" : "white",
                  color: isActive ? "var(--gold)" : "var(--text-dark)",
                  border: "1px solid #E5E7EB",
                  borderRadius: "20px",
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {labels[key]}
              </button>
            );
          })}
        </div>

        {/* Grid display */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
          className="gallery-grid"
        >
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setActivePhotoIndex(index)}
              style={{
                position: "relative",
                aspectRatio: "4/3",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 4px 20px rgba(13,27,42,0.02)",
              }}
              className="gallery-item card-hover img-zoom"
            >
              <img
                src={item.image}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                className="img-zoom-target"
              />
              <div className="gallery-overlay" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <p style={{ color: "var(--gold)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 0.25rem" }}>
                  {labels[item.category]}
                </p>
                <h3 style={{ color: "white", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && (
        <div
          onClick={() => setActivePhotoIndex(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(13, 27, 42, 0.95)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setActivePhotoIndex(null)}
            style={{
              position: "absolute", top: "1.5rem", right: "1.5rem",
              background: "none", border: "none", color: "white",
              fontSize: "2rem", cursor: "pointer", outline: "none",
            }}
          >
            ✕
          </button>

          {/* Navigation and active image wrapper */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "1000px",
              gap: "1.5rem",
            }}
          >
            {/* Prev */}
            <button
              onClick={handlePrev}
              style={{
                background: "rgba(255,255,255,0.08)", border: "none", color: "white",
                width: 44, height: 44, borderRadius: "50%", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >
              ❮
            </button>

            {/* Active Photo Container */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <img
                src={filteredItems[activePhotoIndex].image}
                alt={filteredItems[activePhotoIndex].title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: "12px",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                }}
              />
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "var(--gold)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 0.25rem" }}>
                  {labels[filteredItems[activePhotoIndex].category]}
                </p>
                <h3 style={{ color: "white", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, margin: 0 }}>
                  {filteredItems[activePhotoIndex].title}
                </h3>
              </div>
            </div>

            {/* Next */}
            <button
              onClick={handleNext}
              style={{
                background: "rgba(255,255,255,0.08)", border: "none", color: "white",
                width: 44, height: 44, borderRadius: "50%", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >
              ❯
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
