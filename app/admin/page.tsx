import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [roomCount, pendingCount, confirmedCount, cancelledCount, messageCount, testimonialCount, userCount, recentReservations] =
    await Promise.all([
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
    </div>
  );
}