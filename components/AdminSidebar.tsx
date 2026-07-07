"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/admin",
    label: "Genel Bakış",
    exact: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    href: "/admin/takvim",
    label: "Takvim",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    href: "/admin/odalar",
    label: "Odalar",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
  },
  {
    href: "/admin/rezervasyonlar",
    label: "Rezervasyonlar",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
  {
    href: "/admin/uyeler",
    label: "Üyeler",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    href: "/admin/mesajlar",
    label: "Mesajlar",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    href: "/admin/testimonials",
    label: "Yorumlar",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ),
  },
  {
    href: "/admin/odeme-yontemleri",
    label: "Ödeme Yöntemleri",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function AdminSidebar({ isOpen, onClose, isMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 260,
      minHeight: "100vh",
      background: "#0D1B2A",
      borderRight: "1px solid rgba(201,169,110,0.12)",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: 0,
      left: isMobile ? (isOpen ? 0 : -260) : 0,
      bottom: 0,
      zIndex: 40,
      transition: "left 0.3s ease",
    }}>
      {/* Logo */}
      <div style={{
        padding: "1.75rem 1.5rem",
        borderBottom: "1px solid rgba(201,169,110,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "12px",
            background: "linear-gradient(135deg, #A07840, #C9A96E)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D1B2A" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, color: "#C9A96E", lineHeight: 1.2 }}>
              Kuzey Feneri
            </p>
            <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "0.1rem" }}>
              Admin CMS
            </p>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", overflowY: "auto" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", padding: "0.5rem 0.75rem", marginBottom: "0.25rem" }}>
          Menü
        </p>
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.875rem",
                borderRadius: "10px",
                marginBottom: "0.25rem",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#C9A96E" : "rgba(255,255,255,0.55)",
                background: isActive ? "rgba(201,169,110,0.1)" : "transparent",
                border: isActive ? "1px solid rgba(201,169,110,0.15)" : "1px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid rgba(201,169,110,0.12)" }}>
        <Link
          href="/"
          target="_blank"
          style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.65rem 0.875rem", borderRadius: "10px",
            textDecoration: "none", fontSize: "0.82rem", color: "rgba(255,255,255,0.4)",
            marginBottom: "0.5rem", transition: "color 0.2s",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Siteye Git
        </Link>
        <button
          onClick={async () => {
            await fetch("/api/admin/login", { method: "DELETE" });
            window.location.href = "/admin/login";
          }}
          style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.65rem 0.875rem", borderRadius: "10px",
            border: "none", background: "transparent",
            fontSize: "0.82rem", color: "rgba(239,68,68,0.7)",
            cursor: "pointer", width: "100%", textAlign: "left",
            transition: "color 0.2s",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
