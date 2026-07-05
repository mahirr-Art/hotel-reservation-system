"use client";

import { useState } from "react";

type Testimonial = {
  id: string;
  authorTag: string;
  content: string;
  rating: number;
  adminReply: string | null;
};

export default function TestimonialCard({ t }: { t: Testimonial }) {
  const [expanded, setExpanded] = useState(false);

  // If the admin reply is long, we truncate it. Let's say max 60 characters.
  const isLongReply = t.adminReply && t.adminReply.length > 60;
  const displayReply = expanded || !isLongReply 
    ? t.adminReply 
    : `${t.adminReply?.substring(0, 60)}...`;

  return (
    <div
      className="card-hover"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(201,169,110,0.15)",
        borderRadius: "4px",
        padding: "2rem",
      }}
    >
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={i < t.rating ? "var(--gold)" : "none"}
            stroke="var(--gold)"
            strokeWidth="1.5"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        ))}
      </div>
      <p
        style={{
          fontSize: "0.9rem",
          color: "rgba(255,255,255,0.75)",
          lineHeight: 1.75,
          marginBottom: "1.5rem",
          fontStyle: "italic",
        }}
      >
        &ldquo;{t.content}&rdquo;
      </p>

      {t.adminReply && (
        <div
          onClick={() => {
            if (isLongReply) setExpanded(!expanded);
          }}
          style={{
            background: "rgba(0,0,0,0.2)",
            borderLeft: "3px solid var(--gold)",
            padding: "1rem",
            marginBottom: "1.5rem",
            borderRadius: "0 4px 4px 0",
            cursor: isLongReply ? "pointer" : "default",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--gold)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.25rem",
            }}
          >
            Otel Yönetimi'nin Yanıtı:
          </p>
          <p
            style={{
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.6,
            }}
          >
            {displayReply}
            {isLongReply && !expanded && (
              <span style={{ color: "var(--gold)", fontSize: "0.75rem", marginLeft: "0.5rem", fontWeight: 600 }}>
                (Devamını Oku)
              </span>
            )}
            {isLongReply && expanded && (
              <span style={{ color: "var(--gold)", fontSize: "0.75rem", marginLeft: "0.5rem", fontWeight: 600 }}>
                (Gizle)
              </span>
            )}
          </p>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--gold-dark), var(--gold))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--navy)",
          }}
        >
          {t.authorTag?.[0]?.toUpperCase() ?? "M"}
        </div>
        <div>
          <p style={{ fontWeight: 600, color: "var(--white)", fontSize: "0.9rem" }}>
            {t.authorTag}
          </p>
          <p style={{ fontSize: "0.72rem", color: "var(--gold)", letterSpacing: "0.08em" }}>
            Misafir
          </p>
        </div>
      </div>
    </div>
  );
}
