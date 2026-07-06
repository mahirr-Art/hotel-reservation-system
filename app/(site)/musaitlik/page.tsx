import { prisma } from "@/lib/prisma";
import RoomCalendar from "@/components/RoomCalendar";
import Link from "next/link";

export default async function MusaitlikPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { name: "asc" },
    include: {
      category: true,
      reservations: {
        where: { status: { not: "IPTAL" } },
        orderBy: { checkIn: "asc" },
      },
    },
  });

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* Başlık */}
      <div style={{ background: "var(--navy)", padding: "4rem 1.5rem 3rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>
            ✦ Gerçek Zamanlı ✦
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>
            Doluluk & Müsaitlik Durumu
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", maxWidth: "500px", lineHeight: 1.7 }}>
            Her oda için müsait, kısmen dolu ve dolu tarihleri takvim üzerinden inceleyebilirsiniz.
          </p>
        </div>
      </div>

      {/* Renk açıklamaları */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0.875rem 1.5rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Renk Kılavuzu:</span>
          {[
            { bg: "#f0fdf4", border: "#bbf7d0", color: "#16a34a", label: "Tüm odalar müsait" },
            { bg: "#fffbeb", border: "#fde68a", color: "#d97706", label: "Kısmen dolu" },
            { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", label: "Tamamen dolu" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 14, height: 14, borderRadius: "4px", background: item.bg, border: `1px solid ${item.border}` }} />
              <span style={{ fontSize: "0.75rem", color: "#4A5568" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Odalar */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {rooms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-light)" }}>
            <p>Henüz oda eklenmedi.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem" }}>
            {rooms.map((room) => {
              // Bu ay için doluluk özeti hesapla
              const now = new Date();
              const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
              const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
              const daysInMonth = thisMonthEnd.getDate();

              const bookedDays = Array.from({ length: daysInMonth }, (_, i) => {
                const day = new Date(now.getFullYear(), now.getMonth(), i + 1);
                const bookedCount = room.reservations.filter((res) => {
                  const ci = new Date(res.checkIn);
                  const co = new Date(res.checkOut);
                  return day >= ci && day < co;
                }).length;
                return Math.min(bookedCount, room.quantity);
              });
              const totalCapacityDays = daysInMonth * room.quantity;
              const totalBookedDays = bookedDays.reduce((a, b) => a + b, 0);
              const occupancyRate = totalCapacityDays > 0 ? Math.round((totalBookedDays / totalCapacityDays) * 100) : 0;

              return (
                <div
                  key={room.id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Oda başlığı */}
                  <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                      <div>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.25rem" }}>
                          {room.name}
                        </h2>
                        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.7rem", fontWeight: 600, background: "var(--cream)", color: "var(--text-light)", padding: "0.2rem 0.6rem", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
                            {room.category.name}
                          </span>
                          <span style={{ fontSize: "0.7rem", fontWeight: 600, background: "#eff6ff", color: "#3b82f6", padding: "0.2rem 0.6rem", borderRadius: "20px", border: "1px solid #bfdbfe" }}>
                            👤 {room.capacity} kişilik
                          </span>
                          <span style={{ fontSize: "0.7rem", fontWeight: 600, background: "#f5f3ff", color: "#7c3aed", padding: "0.2rem 0.6rem", borderRadius: "20px", border: "1px solid #ddd6fe" }}>
                            🚪 {room.quantity} oda
                          </span>
                        </div>
                      </div>

                      {/* Bu ay doluluk oranı */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>Bu Ay</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: occupancyRate > 75 ? "#dc2626" : occupancyRate > 40 ? "#d97706" : "#16a34a", lineHeight: 1 }}>
                          %{occupancyRate}
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-light)" }}>doluluk</div>
                      </div>
                    </div>

                    {/* Doluluk bar */}
                    <div style={{ marginTop: "0.75rem" }}>
                      <div style={{ height: 4, background: "#f1f5f9", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${occupancyRate}%`,
                          background: occupancyRate > 75 ? "linear-gradient(90deg, #dc2626, #f87171)" : occupancyRate > 40 ? "linear-gradient(90deg, #d97706, #fbbf24)" : "linear-gradient(90deg, #16a34a, #4ade80)",
                          borderRadius: "2px",
                          transition: "width 0.5s ease",
                        }} />
                      </div>
                    </div>
                  </div>

                  {/* Takvim */}
                  <div style={{ padding: "1.25rem" }}>
                    <RoomCalendar
                      reservations={room.reservations}
                      quantity={room.quantity}
                      capacity={room.capacity}
                      price={room.price.toString()}
                    />
                  </div>

                  {/* Rezervasyon butonu */}
                  <div style={{ padding: "0 1.25rem 1.25rem" }}>
                    <Link
                      href={`/rezervasyon?oda=${room.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        width: "100%",
                        padding: "0.75rem",
                        background: "linear-gradient(135deg, var(--gold-dark, #A07840), var(--gold, #C9A96E))",
                        color: "var(--navy, #0D1B2A)",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        transition: "opacity 0.2s",
                      }}
                    >
                      Bu Odayı Rezerve Et →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}