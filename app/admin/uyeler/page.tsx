"use client";

import { useEffect, useState } from "react";

type Reservation = {
  id: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: "BEKLIYOR" | "ONAYLANDI" | "IPTAL";
  createdAt: string;
};

type User = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  createdAt: string;
  reservations: Reservation[];
};

const statusLabel: Record<Reservation["status"], string> = {
  BEKLIYOR: "Beklemede",
  ONAYLANDI: "Onaylandı",
  IPTAL: "İptal Edildi",
};

const statusStyles: Record<Reservation["status"], { color: string; bg: string; border: string }> = {
  BEKLIYOR: { color: "#d97706", bg: "#fffbeb", border: "1px solid #fde68a" },
  ONAYLANDI: { color: "#16a34a", bg: "#f0fdf4", border: "1px solid #bbf7d0" },
  IPTAL: { color: "#dc2626", bg: "#fef2f2", border: "1px solid #fecaca" },
};

export default function AdminUyelerPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"TÜMÜ" | "REZERVASYONLU" | "REZERVASYONSUZ">("TÜMÜ");
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/uyeler").then((r) => r.json());
      setUsers(res.users || []);
    } catch (err) {
      console.error("Yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const toggleExpand = (userId: string) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Filter and search logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const hasReservations = u.reservations.length > 0;
    if (filterType === "REZERVASYONLU") return matchesSearch && hasReservations;
    if (filterType === "REZERVASYONSUZ") return matchesSearch && !hasReservations;
    return matchesSearch;
  });

  const inputStyle: React.CSSProperties = {
    padding: "0.65rem 0.875rem",
    borderRadius: "10px",
    border: "1px solid #E5E7EB",
    fontSize: "0.88rem",
    outline: "none",
    width: "100%",
    maxWidth: "320px",
    boxSizing: "border-box",
  };

  const filterTabStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
    border: active ? "1px solid rgba(201,169,110,0.3)" : "1px solid #E5E7EB",
    background: active ? "rgba(201,169,110,0.1)" : "white",
    color: active ? "#C9A96E" : "#4B5563",
    transition: "all 0.2s",
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
          Kayıtlı Üyeler
        </h1>
        <p style={{ fontSize: "0.88rem", color: "#6B7280" }}>
          Sistemde kayıtlı olan tüm kullanıcıları ve rezervasyon geçmişlerini listeleyin.
        </p>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button onClick={() => setFilterType("TÜMÜ")} style={filterTabStyle(filterType === "TÜMÜ")}>
            Tüm Üyeler ({users.length})
          </button>
          <button
            onClick={() => setFilterType("REZERVASYONLU")}
            style={filterTabStyle(filterType === "REZERVASYONLU")}
          >
            Rezervasyon Yapanlar ({users.filter((u) => u.reservations.length > 0).length})
          </button>
          <button
            onClick={() => setFilterType("REZERVASYONSUZ")}
            style={filterTabStyle(filterType === "REZERVASYONSUZ")}
          >
            Rezervasyon Yapmayanlar ({users.filter((u) => u.reservations.length === 0).length})
          </button>
        </div>

        <input
          type="text"
          placeholder="İsim veya E-posta ile ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={inputStyle}
        />
      </div>

      {loading ? (
        <p style={{ color: "#9CA3AF", textAlign: "center", padding: "3rem" }}>Yükleniyor...</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {filteredUsers.map((u) => {
            const isExpanded = !!expandedUsers[u.id];
            const hasRes = u.reservations.length > 0;
            const regDate = new Date(u.createdAt);

            return (
              <div
                key={u.id}
                style={{
                  background: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  transition: "all 0.2s",
                }}
              >
                {/* Main Card Line */}
                <div
                  style={{
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #A07840, #C9A96E)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#0D1B2A",
                        flexShrink: 0,
                      }}
                    >
                      {u.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", margin: 0 }}>
                        {u.fullName}
                      </h3>
                      <p style={{ fontSize: "0.82rem", color: "#6B7280", marginTop: "0.1rem" }}>
                        {u.email} {u.phone ? `· ${u.phone}` : ""}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "#9CA3AF",
                          marginBottom: "0.15rem",
                        }}
                      >
                        Kayıt Tarihi
                      </p>
                      <p style={{ fontSize: "0.82rem", fontWeight: 500, color: "#374151" }}>
                        {regDate.toLocaleDateString("tr-TR")}
                      </p>
                    </div>

                    <div style={{ textAlign: "right", minWidth: "120px" }}>
                      <p
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "#9CA3AF",
                          marginBottom: "0.15rem",
                        }}
                      >
                        Rezervasyonlar
                      </p>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color: hasRes ? "#16A34A" : "#6B7280",
                        }}
                      >
                        {hasRes ? `✓ ${u.reservations.length} Rezervasyon` : "Rezervasyon Yok"}
                      </span>
                    </div>

                    {hasRes && (
                      <button
                        onClick={() => toggleExpand(u.id)}
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          background: "#F9FAFB",
                          color: "#374151",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          transition: "all 0.2s",
                        }}
                      >
                        {isExpanded ? "Gizle" : "Detaylar"}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          style={{
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        >
                          <polyline points="6,9 12,15 18,9" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Reservation Detail Accordion */}
                {isExpanded && hasRes && (
                  <div
                    style={{
                      borderTop: "1px solid #E5E7EB",
                      background: "#F9FAFB",
                      padding: "1.25rem 1.5rem",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#6B7280",
                        marginBottom: "0.75rem",
                        marginTop: 0,
                      }}
                    >
                      Rezervasyon Geçmişi
                    </h4>
                    <div style={{ display: "grid", gap: "0.75rem" }}>
                      {u.reservations.map((res) => {
                        const checkIn = new Date(res.checkIn);
                        const checkOut = new Date(res.checkOut);
                        const style = statusStyles[res.status];

                        return (
                          <div
                            key={res.id}
                            style={{
                              background: "white",
                              border: "1px solid #E5E7EB",
                              borderRadius: "10px",
                              padding: "0.75rem 1rem",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: "0.5rem",
                            }}
                          >
                            <div>
                              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                                {res.roomName}
                              </p>
                              <p style={{ fontSize: "0.78rem", color: "#6B7280", marginTop: "0.15rem" }}>
                                {checkIn.toLocaleDateString("tr-TR")} – {checkOut.toLocaleDateString("tr-TR")}
                              </p>
                            </div>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                padding: "0.25rem 0.5rem",
                                borderRadius: "4px",
                                color: style.color,
                                background: style.bg,
                                border: style.border,
                              }}
                            >
                              {statusLabel[res.status]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredUsers.length === 0 && (
            <p style={{ color: "#9CA3AF", textAlign: "center", padding: "3rem" }}>
              Arama kriterlerine uygun üye bulunamadı.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
