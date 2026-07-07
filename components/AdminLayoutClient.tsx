"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#F0F2F5",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Sidebar with open/close state */}
      <AdminSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} isMobile={isMobile} />

      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 35,
          }}
        />
      )}

      {/* Main content area */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : 260,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        transition: "margin-left 0.3s ease",
      }}>
        {/* Top bar */}
        <header style={{
          background: "white",
          borderBottom: "1px solid #E5E7EB",
          padding: "0 1.5rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Hamburger Button for mobile */}
            {isMobile && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.5rem",
                  color: "#374151",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
              </button>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
              <span style={{ fontSize: "0.78rem", color: "#6B7280", fontWeight: 500 }}>Sistem aktif</span>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#374151", display: isMobile ? "none" : "inline" }}>Kuzey Feneri Admin</span>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #A07840, #C9A96E)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.8rem", fontWeight: 700, color: "#0D1B2A",
            }}>
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: isMobile ? "1.25rem" : "2rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
