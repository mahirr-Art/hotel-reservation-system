"use client";

import { useState } from "react";

type AmenityProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  detail: string;
  features: string[];
  image?: string;
};

export default function AmenityCard({ icon, title, desc, detail, features }: AmenityProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="card-hover"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(201,169,110,0.15)",
          borderRadius: "4px",
          padding: "2.5rem 2rem",
          textAlign: "center",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.5)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.15)";
        }}
      >
        <div style={{ color: "var(--gold)", marginBottom: "1.25rem", display: "flex", justifyContent: "center" }}>
          {icon}
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: "var(--white)", marginBottom: "0.75rem" }}>
          {title}
        </h3>
        <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
          {desc}
        </p>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--gold)",
            borderBottom: "1px solid rgba(201,169,110,0.4)",
            paddingBottom: "1px",
          }}
        >
          Detayları Gör
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </span>
      </div>

      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(13,27,42,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            backdropFilter: "blur(8px)",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--navy-mid)",
              border: "1px solid rgba(201,169,110,0.3)",
              borderRadius: "8px",
              padding: "2.5rem",
              maxWidth: "520px",
              width: "100%",
              position: "relative",
              animation: "fadeInUp 0.25s ease",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "rgba(255,255,255,0.08)",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div style={{ color: "var(--gold)", marginBottom: "1.25rem", display: "flex", justifyContent: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(201,169,110,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {icon}
              </div>
            </div>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--white)", textAlign: "center", marginBottom: "0.75rem" }}>
              {title}
            </h2>

            <div style={{ width: 48, height: 2, background: "linear-gradient(90deg, var(--gold-dark), var(--gold))", borderRadius: 2, margin: "0 auto 1.5rem" }} />

            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, textAlign: "center", marginBottom: "1.75rem" }}>
              {detail}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)" }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setOpen(false)}
              style={{
                marginTop: "2rem",
                width: "100%",
                padding: "0.85rem",
                background: "linear-gradient(135deg, var(--gold-dark), var(--gold))",
                color: "var(--navy)",
                fontWeight: 700,
                fontSize: "0.78rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
