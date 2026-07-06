"use client";

// LogoutButton - artık AdminSidebar içinde inline olarak kullanılıyor.
// Bu bileşen geriye dönük uyumluluk için korunuyor.
export default function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/login", { method: "DELETE" });
        window.location.href = "/admin/login";
      }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "0.82rem",
        color: "rgba(239,68,68,0.7)",
        fontFamily: "'Inter', sans-serif",
        padding: "0.5rem",
        textAlign: "left",
      }}
    >
      Çıkış Yap
    </button>
  );
}