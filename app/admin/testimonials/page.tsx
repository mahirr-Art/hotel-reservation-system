"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  id: string;
  authorTag: string;
  content: string;
  rating: number;
  adminReply: string | null;
  approved: boolean;
  createdAt: string;
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const res = await fetch("/api/testimonials?all=true").then((r) => r.json());
    setItems(res.testimonials || []);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    loadData();
  }

  async function handleApprove(id: string, currentApproved: boolean) {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: !currentApproved }),
    });
    loadData();
  }

  async function handleReply(id: string) {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminReply: replyText }),
    });
    setReplyingTo(null);
    setReplyText("");
    loadData();
  }

  const approved = items.filter((i) => i.approved);
  const pending = items.filter((i) => !i.approved);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
          Misafir Yorumları
        </h1>
        <p style={{ fontSize: "0.88rem", color: "#6B7280" }}>
          Yorumları onaylayın, yanıtlayın veya silin. Yalnızca onaylanmış yorumlar ana sayfada yayınlanır.
        </p>
      </div>

      {loading ? (
        <p style={{ color: "#9CA3AF", textAlign: "center", padding: "3rem" }}>Yükleniyor...</p>
      ) : (
        <div>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "1rem 1.25rem" }}>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#16A34A", lineHeight: 1, margin: 0 }}>{approved.length}</p>
              <p style={{ fontSize: "0.78rem", color: "#6B7280", marginTop: "0.25rem", marginBottom: 0 }}>Onaylanan</p>
            </div>
            <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "1rem 1.25rem" }}>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#D97706", lineHeight: 1, margin: 0 }}>{pending.length}</p>
              <p style={{ fontSize: "0.78rem", color: "#6B7280", marginTop: "0.25rem", marginBottom: 0 }}>Bekleyen</p>
            </div>
            <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "1rem 1.25rem" }}>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#111827", lineHeight: 1, margin: 0 }}>{items.length}</p>
              <p style={{ fontSize: "0.78rem", color: "#6B7280", marginTop: "0.25rem", marginBottom: 0 }}>Toplam</p>
            </div>
          </div>

          {/* Pending Section */}
          {pending.length > 0 && (
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D97706", display: "inline-block" }} />
                <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#B45309", letterSpacing: "0.05em", textTransform: "uppercase", margin: 0 }}>
                  Onay Bekleyenler ({pending.length})
                </h2>
              </div>
              <div style={{ display: "grid", gap: "1rem" }}>
                {pending.map((t) => (
                  <TestimonialRow
                    key={t.id}
                    t={t}
                    replyingTo={replyingTo}
                    replyText={replyText}
                    setReplyingTo={setReplyingTo}
                    setReplyText={setReplyText}
                    onApprove={handleApprove}
                    onDelete={handleDelete}
                    onReply={handleReply}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Approved Section */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} />
              <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#15803D", letterSpacing: "0.05em", textTransform: "uppercase", margin: 0 }}>
                Onaylanan Yorumlar ({approved.length})
              </h2>
            </div>
            {approved.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#9CA3AF", border: "1px dashed #E5E7EB", borderRadius: "16px", background: "white" }}>
                Henüz onaylanmış yorum bulunmuyor.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {approved.map((t) => (
                  <TestimonialRow
                    key={t.id}
                    t={t}
                    replyingTo={replyingTo}
                    replyText={replyText}
                    setReplyingTo={setReplyingTo}
                    setReplyText={setReplyText}
                    onApprove={handleApprove}
                    onDelete={handleDelete}
                    onReply={handleReply}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TestimonialRow({
  t,
  replyingTo,
  replyText,
  setReplyingTo,
  setReplyText,
  onApprove,
  onDelete,
  onReply,
}: {
  t: Testimonial;
  replyingTo: string | null;
  replyText: string;
  setReplyingTo: (id: string | null) => void;
  setReplyText: (text: string) => void;
  onApprove: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onReply: (id: string) => void;
}) {
  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: "16px",
        padding: "1.5rem",
        background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(135deg, #A07840, #C9A96E)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", fontWeight: 700, color: "#0D1B2A", flexShrink: 0,
            }}
          >
            {t.authorTag?.[0]?.toUpperCase() || "M"}
          </div>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", margin: 0 }}>{t.authorTag}</h4>
            <div style={{ display: "flex", gap: "2px", marginTop: "0.15rem" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < t.rating ? "#C9A96E" : "#E5E7EB", fontSize: "0.82rem" }}>★</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => onApprove(t.id, t.approved)}
            style={{
              padding: "0.35rem 0.75rem", borderRadius: "6px", border: "none",
              fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
              background: t.approved ? "#FFFBEB" : "#F0FDF4",
              color: t.approved ? "#D97706" : "#16A34A",
            }}
          >
            {t.approved ? "Onayı Kaldır" : "Onayla"}
          </button>
          <button
            onClick={() => onDelete(t.id)}
            style={{
              padding: "0.35rem 0.75rem", borderRadius: "6px", border: "none",
              fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
              background: "#FEF2F2", color: "#DC2626",
            }}
          >
            Sil
          </button>
        </div>
      </div>

      <p style={{ fontSize: "0.9rem", color: "#374151", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
        "{t.content}"
      </p>

      {t.adminReply ? (
        <div style={{
          background: "#F9FAFB", borderLeft: "3px solid #C9A96E",
          padding: "1rem", borderRadius: "0 10px 10px 0"
        }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#A07840", margin: "0 0 0.25rem 0" }}>
            Yanıtınız
          </p>
          <p style={{ fontSize: "0.85rem", color: "#4B5563", margin: 0 }}>{t.adminReply}</p>
        </div>
      ) : (
        replyingTo !== t.id && (
          <button
            onClick={() => { setReplyingTo(t.id); setReplyText(""); }}
            style={{
              alignSelf: "flex-start", background: "none", border: "none",
              color: "var(--gold-dark, #A07840)", fontSize: "0.82rem", fontWeight: 600,
              cursor: "pointer", padding: 0
            }}
          >
            💬 Yanıtla
          </button>
        )
      )}

      {replyingTo === t.id && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <textarea
            rows={2}
            placeholder="Yanıtınızı yazın..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            style={{
              width: "100%", borderRadius: "8px", border: "1px solid #E5E7EB",
              padding: "0.625rem 0.875rem", outline: "none", fontSize: "0.88rem",
              fontFamily: "inherit", resize: "none", boxSizing: "border-box"
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem", alignSelf: "flex-end" }}>
            <button
              onClick={() => setReplyingTo(null)}
              style={{
                padding: "0.4rem 0.75rem", borderRadius: "6px", border: "1px solid #E5E7EB",
                background: "white", color: "#4B5563", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer"
              }}
            >
              İptal
            </button>
            <button
              onClick={() => onReply(t.id)}
              style={{
                padding: "0.4rem 0.75rem", borderRadius: "6px", border: "none",
                background: "#0D1B2A", color: "white", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer"
              }}
            >
              Yanıtı Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}