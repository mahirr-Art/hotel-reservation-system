"use client";

import { useEffect, useState } from "react";

type Reservation = {
  id: string; fullName: string; email: string; phone: string;
  checkIn: string; checkOut: string; guestCount: number;
  paymentMethod: string;
  status: "BEKLIYOR" | "ONAYLANDI" | "IPTAL"; room: { name: string };
};

const statusLabel: Record<Reservation["status"], string> = {
  BEKLIYOR: "Beklemede", ONAYLANDI: "Onaylandı", IPTAL: "İptal Edildi",
};

const statusStyles: Record<Reservation["status"], { color: string; bg: string; border: string }> = {
  BEKLIYOR: { color: "#d97706", bg: "#fffbeb", border: "1px solid #fde68a" },
  ONAYLANDI: { color: "#16a34a", bg: "#f0fdf4", border: "1px solid #bbf7d0" },
  IPTAL: { color: "#dc2626", bg: "#fef2f2", border: "1px solid #fecaca" },
};

export default function AdminRezervasyonlarPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const res = await fetch("/api/admin/rezervasyonlar").then((r) => r.json());
    setReservations(res.reservations || []);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function updateStatus(id: string, status: Reservation["status"]) {
    await fetch(`/api/admin/rezervasyonlar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadData();
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
          Rezervasyonlar
        </h1>
        <p style={{ fontSize: "0.88rem", color: "#6B7280" }}>
          Oteldeki tüm oda rezervasyonlarını yönetin, onaylayın veya iptal edin.
        </p>
      </div>

      {loading ? (
        <p style={{ color: "#9CA3AF", textAlign: "center", padding: "3rem" }}>Yükleniyor...</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {reservations.map((r) => {
            const currentStyle = statusStyles[r.status];
            const checkInDate = new Date(r.checkIn);
            const checkOutDate = new Date(r.checkOut);
            const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000));

            return (
              <div
                key={r.id}
                style={{
                  background: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", margin: 0 }}>
                      {r.room?.name || "Oda Silinmiş"}
                    </h3>
                    <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.25rem", fontFamily: "monospace" }}>
                      ID: #{r.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: "0.72rem", fontWeight: 600, padding: "0.25rem 0.6rem", borderRadius: "6px",
                      background: "#F3F4F6", color: "#4B5563", border: "1px solid #E5E7EB"
                    }}>
                      {r.paymentMethod === "KAPIDA" ? "💳 Kapıda Ödeme" : "🏦 Havale / EFT"}
                    </span>
                    <span style={{
                      fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "6px",
                      color: currentStyle.color, background: currentStyle.bg, border: currentStyle.border
                    }}>
                      {statusLabel[r.status]}
                    </span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", padding: "1rem", background: "#F9FAFB", borderRadius: "12px" }}>
                  <div>
                    <p style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#9CA3AF", marginBottom: "0.25rem" }}>Müşteri Bilgileri</p>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>{r.fullName}</p>
                    <p style={{ fontSize: "0.82rem", color: "#6B7280" }}>{r.email}</p>
                    <p style={{ fontSize: "0.82rem", color: "#6B7280" }}>{r.phone}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#9CA3AF", marginBottom: "0.25rem" }}>Konaklama Tarihleri</p>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
                      {checkInDate.toLocaleDateString("tr-TR")} – {checkOutDate.toLocaleDateString("tr-TR")}
                    </p>
                    <p style={{ fontSize: "0.82rem", color: "#6B7280" }}>{nights} Gece · {r.guestCount} Kişi</p>
                  </div>
                </div>

                {r.status === "BEKLIYOR" && (
                  <div style={{ display: "flex", gap: "0.5rem", alignSelf: "flex-end" }}>
                    <button
                      onClick={() => updateStatus(r.id, "IPTAL")}
                      style={{
                        padding: "0.45rem 1rem", borderRadius: "8px", border: "1px solid #FCA5A5",
                        background: "#FEF2F2", color: "#DC2626", fontSize: "0.82rem", fontWeight: 600,
                        cursor: "pointer", transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#FEE2E2")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#FEF2F2")}
                    >
                      İptal Et
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "ONAYLANDI")}
                      style={{
                        padding: "0.45rem 1rem", borderRadius: "8px", border: "none",
                        background: "#16A34A", color: "white", fontSize: "0.82rem", fontWeight: 600,
                        cursor: "pointer", transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#15803D")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#16A34A")}
                    >
                      ✓ Onayla
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {reservations.length === 0 && (
            <p style={{ color: "#9CA3AF", textAlign: "center", padding: "3rem" }}>Henüz rezervasyon bulunmuyor.</p>
          )}
        </div>
      )}
    </div>
  );
}