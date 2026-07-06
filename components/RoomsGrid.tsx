"use client";

import { useState } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  description: string;
};

type Room = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  capacity: number;
  quantity: number;
  city: string;
  photos: string[];
  category: Category;
};

interface RoomsGridProps {
  initialRooms: Room[];
  categories: Category[];
}

export default function RoomsGrid({ initialRooms, categories }: RoomsGridProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredRooms = activeTab === "all"
    ? initialRooms
    : initialRooms.filter(r => r.category.id === activeTab);

  // Dynamic Category Description
  const activeCategoryDesc = activeTab === "all"
    ? "Karadeniz'in eşsiz manzarasıyla buluşan, her bütçe ve konsept için özenle tasarlanmış odalarımız."
    : categories.find(c => c.id === activeTab)?.description;

  const activeCategoryName = activeTab === "all"
    ? "Tüm Odalar"
    : categories.find(c => c.id === activeTab)?.name;

  return (
    <div>
      {/* Category Tabs Section */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "0.75rem",
        marginBottom: "2rem",
        flexWrap: "wrap",
      }}>
        <button
          onClick={() => setActiveTab("all")}
          style={{
            padding: "0.6rem 1.5rem",
            borderRadius: "30px",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
            border: activeTab === "all" ? "1.5px solid var(--gold)" : "1.5px solid rgba(201,169,110,0.3)",
            background: activeTab === "all" ? "var(--gold)" : "transparent",
            color: activeTab === "all" ? "var(--navy)" : "var(--gold)",
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== "all") {
              e.currentTarget.style.borderColor = "var(--gold)";
              e.currentTarget.style.background = "rgba(201, 169, 110, 0.08)";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== "all") {
              e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)";
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          Tüm Odalar
        </button>

        {categories.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                padding: "0.6rem 1.5rem",
                borderRadius: "30px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: isActive ? "1.5px solid var(--gold)" : "1.5px solid rgba(201,169,110,0.3)",
                background: isActive ? "var(--gold)" : "transparent",
                color: isActive ? "var(--navy)" : "var(--gold)",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "var(--gold)";
                  e.currentTarget.style.background = "rgba(201, 169, 110, 0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Category Info Banner */}
      <div style={{
        textAlign: "center",
        maxWidth: "680px",
        margin: "0 auto 3.5rem",
        animation: "fadeIn 0.5s ease",
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--navy)",
          marginBottom: "0.5rem"
        }}>
          {activeCategoryName}
        </h2>
        <p style={{
          fontSize: "0.9rem",
          color: "var(--text-mid)",
          lineHeight: 1.7
        }}>
          {activeCategoryDesc}
        </p>
        <div className="gold-divider" style={{ margin: "1rem auto 0" }} />
      </div>

      {/* Rooms List Grid */}
      {filteredRooms.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-light)" }}>
          <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛏️</p>
          <p>Seçilen kategoride şu an oda bulunmuyor.</p>
        </div>
      ) : (
        <div
          key={activeTab} // Forces re-render for smooth fade animation on tab click
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "2rem",
            animation: "fadeIn 0.5s ease-out",
          }}
        >
          {filteredRooms.map((room) => (
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
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.2rem", fontWeight: 700,
                  color: "var(--navy)", marginBottom: "0.4rem",
                }}>
                  {room.name}
                </h3>
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
                      display: "flex", alignItems: "center", gap: "0.35rem",
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
    </div>
  );
}
