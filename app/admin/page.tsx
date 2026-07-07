import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [
    roomCount,
    pendingCount,
    confirmedCount,
    cancelledCount,
    messageCount,
    testimonialCount,
    userCount,
    recentReservations,
    allReservations,
  ] = await Promise.all([
    prisma.room.count(),
    prisma.reservation.count({ where: { status: "BEKLIYOR" } }),
    prisma.reservation.count({ where: { status: "ONAYLANDI" } }),
    prisma.reservation.count({ where: { status: "IPTAL" } }),
    prisma.message.count(),
    prisma.testimonial.count({ where: { approved: false } }),
    prisma.user.count(),
    prisma.reservation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { room: { select: { name: true } } },
    }),
    prisma.reservation.findMany({
      select: {
        checkIn: true,
        status: true,
        room: {
          select: {
            price: true,
          },
        },
      },
    }),
  ]);

  const stats = [
    { label: "Toplam Oda", value: roomCount, icon: "🏨", color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
    { label: "Bekleyen Rezervasyon", value: pendingCount, icon: "⏳", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
    { label: "Onaylanan Rezervasyon", value: confirmedCount, icon: "✅", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
    { label: "Kayıtlı Kullanıcı", value: userCount, icon: "👤", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
    { label: "Yeni Mesaj", value: messageCount, icon: "✉️", color: "#0891B2", bg: "#ECFEFF", border: "#A5F3FC" },
    { label: "Bekleyen Yorum", value: testimonialCount, icon: "⭐", color: "#C9A96E", bg: "#FFFBEB", border: "#FDE68A" },
  ];

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    BEKLIYOR: { label: "Bekliyor", color: "#D97706", bg: "#FFFBEB" },
    ONAYLANDI: { label: "Onaylandı", color: "#16A34A", bg: "#F0FDF4" },
    IPTAL: { label: "İptal", color: "#DC2626", bg: "#FEF2F2" },
  };

  // Group reservations and revenue by month (last 6 months)
  const now = new Date();
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return {
      monthName: months[d.getMonth()],
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
      reservations: 0,
      revenue: 0,
    };
  });

  allReservations.forEach((res) => {
    const date = new Date(res.checkIn);
    const match = last6Months.find(
      (m) => m.monthIndex === date.getMonth() && m.year === date.getFullYear()
    );
    if (match) {
      match.reservations += 1;
      if (res.status === "ONAYLANDI") {
        match.revenue += Number(res.room?.price || 0);
      }
    }
  });

  // Calculate SVG line/bar chart coordinates
  const chartHeight = 160;
  const chartWidth = 500;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 25;

  const maxReservations = Math.max(...last6Months.map((m) => m.reservations), 4);
  const maxRevenue = Math.max(...last6Months.map((m) => m.revenue), 10000);

  // Revenue line points
  const points = last6Months.map((m, i) => {
    const x = paddingLeft + (i * (chartWidth - paddingLeft - paddingRight)) / 5;
    const y =
      chartHeight -
      paddingBottom -
      (m.revenue / maxRevenue) * (chartHeight - paddingTop - paddingBottom);
    return { x, y, ...m };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z`;

  // Occupancy Donut stats
  const totalOccupancyRooms = roomCount * 8; // Assumed multiplier for total capacity limits
  const occupancyRate = totalOccupancyRooms > 0 
    ? Math.min(100, Math.round((confirmedCount / totalOccupancyRooms) * 100)) 
    : 0;
  const radius = 40;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (occupancyRate / 100) * circumference;

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
          Genel Bakış
        </h1>
        <p style={{ fontSize: "0.88rem", color: "#6B7280" }}>
          Kuzey Feneri Butik Otel — Yönetim Paneli
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem",
      }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            background: "white",
            borderRadius: "16px",
            padding: "1.5rem",
            border: `1px solid ${stat.border}`,
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "12px",
              background: stat.bg, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "1.4rem", flexShrink: 0,
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: "1.75rem", fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: "0.78rem", color: "#6B7280", marginTop: "0.25rem" }}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* SVG Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: "1.5rem", marginBottom: "2rem" }} className="chart-grid">
        {/* Revenue line chart */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #E5E7EB", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", margin: 0 }}>
              Gelir ve Rezervasyon İstatistikleri (Son 6 Ay)
            </h2>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", fontWeight: 600 }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#C9A96E" }}>
                <span style={{ width: 10, height: 10, background: "#C9A96E", borderRadius: "50%", display: "inline-block" }} />
                Gelir (₺)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#6366F1" }}>
                <span style={{ width: 10, height: 10, background: "#6366F1", borderRadius: "50%", display: "inline-block" }} />
                Rezervasyon
              </span>
            </div>
          </div>

          <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
            <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ display: "block" }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y Axis Grid lines (Revenue) */}
              {[0, 0.5, 1].map((r, idx) => {
                const y = paddingTop + r * (chartHeight - paddingTop - paddingBottom);
                const value = Math.round(maxRevenue * (1 - r));
                return (
                  <g key={idx}>
                    <line x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} stroke="#F3F4F6" strokeWidth="1" />
                    <text x={paddingLeft - 8} y={y + 4} textAnchor="end" fontSize="9" fill="#9CA3AF" fontWeight="500">
                      {value >= 1000 ? `${(value / 1000).toFixed(1)}k ₺` : `${value} ₺`}
                    </text>
                  </g>
                );
              })}

              {/* X Axis label texts */}
              {points.map((p, idx) => (
                <text key={idx} x={p.x} y={chartHeight - 8} textAnchor="middle" fontSize="10" fill="#6B7280" fontWeight="600">
                  {p.monthName}
                </text>
              ))}

              {/* Reservations count Bar Chart */}
              {points.map((p, idx) => {
                const barWidth = 14;
                const barHeight = (p.reservations / maxReservations) * (chartHeight - paddingTop - paddingBottom);
                const barX = p.x - barWidth / 2;
                const barY = chartHeight - paddingBottom - barHeight;
                return (
                  <g key={idx}>
                    <rect
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill="#6366F1"
                      opacity="0.15"
                      rx="3"
                    />
                    <text x={p.x} y={barY - 4} textAnchor="middle" fontSize="9" fill="#6366F1" fontWeight="700">
                      {p.reservations > 0 ? p.reservations : ""}
                    </text>
                  </g>
                );
              })}

              {/* Revenue Area */}
              <path d={areaPath} fill="url(#revenueGrad)" />

              {/* Revenue Path line */}
              <path d={linePath} fill="none" stroke="#C9A96E" strokeWidth="2.5" strokeLinecap="round" />

              {/* Revenue Points dots & values */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#C9A96E" strokeWidth="2.5" />
                  {p.revenue > 0 && (
                    <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fill="#8B6E3C" fontWeight="700">
                      {p.revenue >= 1000 ? `${(p.revenue / 1000).toFixed(1)}k` : p.revenue}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Occupancy Donut chart */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #E5E7EB", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", marginBottom: "1rem", alignSelf: "flex-start", width: "100%" }}>
            Oda Doluluk Oranı
          </h2>
          <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#F3F4F6" strokeWidth={strokeWidth} />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="#C9A96E"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <div style={{ position: "absolute", textAlign: "center" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>
                {occupancyRate}%
              </p>
              <p style={{ fontSize: "0.65rem", color: "#6B7280", margin: 0, fontWeight: 600, textTransform: "uppercase" }}>
                Doluluk
              </p>
            </div>
          </div>
          <p style={{ fontSize: "0.78rem", color: "#6B7280", marginTop: "1rem", textAlign: "center", lineHeight: 1.4 }}>
            Onaylanan aktif rezervasyonlar temel alınmıştır.
          </p>
        </div>
      </div>

      {/* Recent Reservations */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid #F3F4F6",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
            Son Rezervasyonlar
          </h2>
          <Link href="/admin/rezervasyonlar" style={{
            fontSize: "0.78rem", color: "#C9A96E", fontWeight: 600,
            textDecoration: "none",
          }}>
            Tümünü Gör →
          </Link>
        </div>
        <div>
          {recentReservations.length === 0 ? (
            <p style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF", fontSize: "0.88rem" }}>
              Henüz rezervasyon yok.
            </p>
          ) : (
            recentReservations.map((res, i) => {
              const s = statusMap[res.status];
              return (
                <div key={res.id} style={{
                  padding: "1rem 1.5rem",
                  borderBottom: i < recentReservations.length - 1 ? "1px solid #F9FAFB" : "none",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: "0.5rem",
                }}>
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111827" }}>{res.fullName}</p>
                    <p style={{ fontSize: "0.78rem", color: "#6B7280" }}>
                      {res.room.name} · {new Date(res.checkIn).toLocaleDateString("tr-TR")} – {new Date(res.checkOut).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.75rem",
                    borderRadius: "20px", background: s.bg, color: s.color,
                  }}>
                    {s.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {[
          { href: "/admin/odalar", label: "Oda Ekle", icon: "➕", desc: "Yeni oda oluştur" },
          { href: "/admin/mesajlar", label: "Mesajları Görüntüle", icon: "📧", desc: `${messageCount} mesaj var` },
          { href: "/admin/testimonials", label: "Yorumları Onayla", icon: "⭐", desc: `${testimonialCount} bekliyor` },
          { href: "/admin/rezervasyonlar", label: "Rezervasyonlar", icon: "📋", desc: `${pendingCount} bekliyor` },
        ].map((a) => (
          <Link key={a.href} href={a.href} style={{
            background: "white", borderRadius: "12px", padding: "1.25rem",
            border: "1px solid #E5E7EB", textDecoration: "none",
            display: "flex", alignItems: "center", gap: "0.75rem",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}>
            <span style={{ fontSize: "1.5rem" }}>{a.icon}</span>
            <div>
              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#111827" }}>{a.label}</p>
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .chart-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}