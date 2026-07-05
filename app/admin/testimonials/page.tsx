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
    setItems(res.testimonials);
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

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, color: "#9ca3af" }}>
        Yorumlar yükleniyor...
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0D1B2A", marginBottom: "0.4rem" }}>Misafir Yorumları</h1>
        <p style={{ fontSize: "0.85rem", color: "#718096" }}>Yorumları onaylayın, yanıtlayın veya silin. Sadece onaylanan yorumlar ana sayfada görünür.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "1rem 1.25rem" }}>
          <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "#16a34a", lineHeight: 1 }}>{approved.length}</p>
          <p style={{ fontSize: "0.75rem", color: "#15803d", marginTop: "0.25rem", fontWeight: 500 }}>Onaylanan</p>
        </div>
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: "1rem 1.25rem" }}>
          <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "#d97706", lineHeight: 1 }}>{pending.length}</p>
          <p style={{ fontSize: "0.75rem", color: "#b45309", marginTop: "0.25rem", fontWeight: 500 }}>Beklemede</p>
        </div>
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1rem 1.25rem" }}>
          <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "#0D1B2A", lineHeight: 1 }}>{items.length}</p>
          <p style={{ fontSize: "0.75rem", color: "#718096", marginTop: "0.25rem", fontWeight: 500 }}>Toplam</p>
        </div>
      </div>

      {/* Pending section */}
      {pending.length > 0 && (
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
            <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#92400e", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Onay Bekleyenler ({pending.length})
            </h2>
          </div>
          <div style={{ display: "grid", gap: "0.75rem" }}>
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

      {/* Approved section */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
          <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#14532d", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Onaylanan Yorumlar ({approved.length})
          </h2>
        </div>
        {approved.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af", border: "1px dashed #e2e8f0", borderRadius: "12px" }}>
            Henüz onaylanmış yorum yok.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
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

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>Henüz yorum yok.</div>
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
        border: t.approved ? "1px solid #bbf7d0" : "1px solid #fde68a",
        borderRadius: "12px",
        padding: "1.25rem",
        background: t.approved ? "#f9fffe" : "#fffef7",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #A07840, #C9A96E)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.85rem", fontWeight: 700, color: "white", flexShrink: 0,
              }}
            >
              {t.authorTag?.[0]?.toUpperCase() ?? "M"}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "#0D1B2A" }}>{t.authorTag}</p>
              <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: i < t.rating ? "#C9A96E" : "#e2e8f0", fontSize: "0.75rem" }}>★</span>
                ))}
              </div>
            </div>
            {t.approved ? (
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: "#dcfce7", color: "#15803d", padding: "0.2rem 0.6rem", borderRadius: "20px" }}>
                ✓ Onaylı
              </span>
            ) : (
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: "#fef3c7", color: "#b45309", padding: "0.2rem 0.6rem", borderRadius: "20px" }}>
                ⏳ Beklemede
              </span>
            )}
          </div>
          <p style={{ fontSize: "0.88rem", color: "#4A5568", lineHeight: 1.65, fontStyle: "italic", marginBottom: t.adminReply ? "0.75rem" : 0 }}>
            &ldquo;{t.content}&rdquo;
          </p>
          {t.adminReply && (
            <div style={{ background: "#f1f5f9", borderLeft: "3px solid #C9A96E", padding: "0.75rem 1rem", borderRadius: "0 8px 8px 0", marginTop: "0.75rem" }}>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#A07840", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>
                Yanıtınız:
              </p>
              <p style={{ fontSize: "0.85rem", color: "#1e293b" }}>{t.adminReply}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flexShrink: 0 }}>
          <button
            onClick={() => onApprove(t.id, t.approved)}
            style={{
              padding: "0.4rem 0.9rem",
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: t.approved ? "#fef3c7" : "#dcfce7",
              color: t.approved ? "#b45309" : "#15803d",
              transition: "all 0.2s",
            }}
          >
            {t.approved ? "Onayı Kaldır" : "✓ Onayla"}
          </button>
          {!t.adminReply && replyingTo !== t.id && (
            <button
              onClick={() => { setReplyingTo(t.id); setReplyText(""); }}
              style={{ padding: "0.4rem 0.9rem", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", border: "1px solid #e2e8f0", background: "white", color: "#4A5568" }}
            >
              Yanıtla
            </button>
          )}
          <button
            onClick={() => onDelete(t.id)}
            style={{ padding: "0.4rem 0.9rem", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", border: "none", background: "#fef2f2", color: "#dc2626" }}
          >
            Sil
          </button>
        </div>
      </div>

      {replyingTo === t.id && (
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          <textarea
            rows={2}
            placeholder="Yanıtınızı buraya yazın..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            style={{ width: "100%", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "0.625rem 0.875rem", marginBottom: "0.5rem", outline: "none", fontSize: "0.875rem", resize: "none" }}
          />
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button
              onClick={() => setReplyingTo(null)}
              style={{ padding: "0.4rem 0.9rem", borderRadius: "8px", fontSize: "0.75rem", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#4A5568" }}
            >
              İptal
            </button>
            <button
              onClick={() => onReply(t.id)}
              style={{ padding: "0.4rem 0.9rem", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, border: "none", background: "#0D1B2A", color: "white", cursor: "pointer" }}
            >
              Yanıtı Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}