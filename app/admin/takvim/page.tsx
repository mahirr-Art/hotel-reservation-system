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
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
          Oda Doluluk Takvimi
        </h1>
        <p style={{ fontSize: "0.88rem", color: "#6B7280" }}>
          Tüm odaların mevcut doluluk ve müsaitlik durumunu takvim üzerinden takip edebilirsiniz.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
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
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Oda başlığı */}
              <div style={{ padding: "1.25rem", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", margin: 0 }}>{room.name}</h3>
                  <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.35rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, background: "#EFF6FF", color: "#3B82F6", padding: "0.15rem 0.5rem", borderRadius: "20px" }}>
                      {room.capacity} kişilik
                    </span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, background: "#F5F3FF", color: "#7C3AED", padding: "0.15rem 0.5rem", borderRadius: "20px" }}>
                      {room.quantity} oda
                    </span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, background: "#F9FAFB", color: "#6B7280", padding: "0.15rem 0.5rem", borderRadius: "20px", border: "1px solid #E5E7EB" }}>
                      {room.category?.name || "Kategorisiz"}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    fontSize: "1.3rem", fontWeight: 800, lineHeight: 1, margin: 0,
                    color: occupancyRate > 75 ? "#DC2626" : occupancyRate > 40 ? "#D97706" : "#16A34A",
                  }}>
                    %{occupancyRate}
                  </p>
                  <p style={{ fontSize: "0.68rem", color: "#9CA3AF", margin: "0.15rem 0 0 0" }}>bu ay</p>
                </div>
              </div>

              {/* Doluluk bar */}
              <div style={{ padding: "0 1.25rem 0.75rem", paddingTop: "0.5rem" }}>
                <div style={{ height: 3, background: "#F3F4F6", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${occupancyRate}%`,
                    background: occupancyRate > 75 ? "#DC2626" : occupancyRate > 40 ? "#D97706" : "#16A34A",
                    borderRadius: "2px",
                  }} />
                </div>
              </div>

              {/* Takvim */}
              <div style={{ padding: "0 1.25rem 1.25rem", flex: 1 }}>
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
        <div style={{ textAlign: "center", padding: "4rem", color: "#9CA3AF", border: "1px dashed #E5E7EB", borderRadius: "16px", background: "white" }}>
          Henüz oda eklenmedi.
        </div>
      )}
    </div>
  );
}
