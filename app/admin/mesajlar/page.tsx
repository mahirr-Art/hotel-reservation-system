"use client";

import { useEffect, useState } from "react";

type Message = { id: string; name: string; email: string; subject: string; message: string; createdAt: string };

export default function AdminMesajlarPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const res = await fetch("/api/admin/mesajlar").then((r) => r.json());
    setMessages(res.messages || []);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/mesajlar/${id}`, { method: "DELETE" });
    loadData();
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
          İletişim Mesajları
        </h1>
        <p style={{ fontSize: "0.88rem", color: "#6B7280" }}>
          Müşterilerin iletişim formu üzerinden gönderdiği tüm mesajlar.
        </p>
      </div>

      {loading ? (
        <p style={{ color: "#9CA3AF", textAlign: "center", padding: "3rem" }}>Yükleniyor...</p>
      ) : (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                    color: "var(--gold-dark, #A07840)", background: "#FFFBEB", border: "1px solid #FDE68A",
                    padding: "0.2rem 0.5rem", borderRadius: "4px"
                  }}>
                    {m.subject}
                  </span>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827", marginTop: "0.5rem", marginBottom: 0 }}>
                    {m.name}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#6B7280", marginTop: "0.15rem" }}>{m.email}</p>
                </div>
                <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>
                  {new Date(m.createdAt).toLocaleDateString("tr-TR")} {new Date(m.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <div style={{
                background: "#F9FAFB", borderRadius: "10px", padding: "1rem",
                fontSize: "0.88rem", color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap"
              }}>
                {m.message}
              </div>

              <button
                onClick={() => handleDelete(m.id)}
                style={{
                  alignSelf: "flex-end",
                  background: "none", border: "none", color: "#DC2626",
                  fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: "0.3rem"
                }}
              >
                🗑️ Sil
              </button>
            </div>
          ))}

          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem", color: "#9CA3AF", border: "1px dashed #E5E7EB", borderRadius: "16px", background: "white" }}>
              📩 Henüz mesaj bulunmuyor.
            </div>
          )}
        </div>
      )}
    </div>
  );
}