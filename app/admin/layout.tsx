import type { Metadata } from "next";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata: Metadata = {
  title: "Yönetim Paneli | Kuzey Feneri",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#F0F2F5",
      fontFamily: "'Inter', sans-serif",
    }}>
      <AdminSidebar />

      {/* Main content area */}
      <div style={{
        flex: 1,
        marginLeft: 260,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}>
        {/* Top bar */}
        <header style={{
          background: "white",
          borderBottom: "1px solid #E5E7EB",
          padding: "0 2rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
            <span style={{ fontSize: "0.78rem", color: "#6B7280", fontWeight: 500 }}>Sistem aktif</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#374151" }}>Kuzey Feneri Admin</span>
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
        <main style={{ flex: 1, padding: "2rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}