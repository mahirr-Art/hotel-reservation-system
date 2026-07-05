import { prisma } from "@/lib/prisma";
import RoomCalendar from "@/components/RoomCalendar";

export default async function AdminTakvimPage() {
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
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0D1B2A", marginBottom: "0.4rem" }}>Oda Doluluk Takvimi</h1>
        <p style={{ fontSize: "0.85rem", color: "#718096" }}>
          Tüm odaların mevcut doluluk ve müsaitlik durumunu takvim üzerinden takip edebilirsiniz. Yeşil = Müsait, Sarı = Kısmen Dolu, Kırmızı = Tamamen Dolu.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {rooms.map((room) => {
          // Bu ay doluluk oranı
          const now = new Date();
          const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
          const bookedDays = Array.from({ length: daysInMonth }, (_, i) => {
            const day = new Date(now.getFullYear(), now.getMonth(), i + 1);
            const bookedCount = room.reservations.filter((res) => {
              const ci = new Date(res.checkIn);
              const co = new Date(res.checkOut);
              return day >= ci && day < co;
            }).length;
            return Math.min(bookedCount, room.quantity);
          });
          const occupancyRate = Math.round((bookedDays.reduce((a, b) => a + b, 0) / (daysInMonth * room.quantity)) * 100);

          return (
            <div
              key={room.id}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {/* Oda başlığı */}
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontWeight: 700, color: "#0D1B2A", fontSize: "0.95rem" }}>{room.name}</p>
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.3rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 600, background: "#eff6ff", color: "#3b82f6", padding: "0.15rem 0.5rem", borderRadius: "20px" }}>
                      {room.capacity} kişilik
                    </span>
                    <span style={{ fontSize: "0.65rem", fontWeight: 600, background: "#f5f3ff", color: "#7c3aed", padding: "0.15rem 0.5rem", borderRadius: "20px" }}>
                      {room.quantity} oda
                    </span>
                    <span style={{ fontSize: "0.65rem", fontWeight: 600, background: "#f8fafc", color: "#64748b", padding: "0.15rem 0.5rem", borderRadius: "20px" }}>
                      {room.category.name}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.3rem", fontWeight: 700, lineHeight: 1,
                    color: occupancyRate > 75 ? "#dc2626" : occupancyRate > 40 ? "#d97706" : "#16a34a",
                  }}>
                    %{occupancyRate}
                  </p>
                  <p style={{ fontSize: "0.65rem", color: "#94a3b8" }}>bu ay</p>
                </div>
              </div>

              {/* Doluluk bar */}
              <div style={{ padding: "0 1.25rem 0.75rem", paddingTop: "0.5rem" }}>
                <div style={{ height: 3, background: "#f1f5f9", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${occupancyRate}%`,
                    background: occupancyRate > 75 ? "#dc2626" : occupancyRate > 40 ? "#d97706" : "#16a34a",
                    borderRadius: "2px",
                  }} />
                </div>
              </div>

              {/* Takvim */}
              <div style={{ padding: "0 1rem 1rem" }}>
                <RoomCalendar
                  reservations={room.reservations}
                  quantity={room.quantity}
                  capacity={room.capacity}
                  price={room.price.toString()}
                />
              </div>
            </div>
          );
        })}
      </div>

      {rooms.length === 0 && (
        <p style={{ color: "#9ca3af", textAlign: "center", padding: "3rem" }}>Henüz oda eklenmedi.</p>
      )}
    </div>
  );
}
