"use client";

import { useState, useEffect } from "react";

export default function HomeSearchForm() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [minCheckIn, setMinCheckIn] = useState("");

  useEffect(() => {
    // Set today's date as the minimum selectable date for check-in
    const today = new Date().toISOString().split("T")[0];
    setMinCheckIn(today);
  }, []);

  return (
    <form
      action="/rezervasyon"
      className="animate-fade-in-up delay-300"
      style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: "4px",
        padding: "1.25rem",
        display: "grid",
        gap: "0.75rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        maxWidth: "800px",
        margin: "0 auto",
        boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <label style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)" }}>Şehir</label>
        <select name="city" style={{ border: "1px solid #e2e8f0", borderRadius: "2px", padding: "0.6rem 0.75rem", fontSize: "0.88rem", color: "var(--text-dark)", background: "white", outline: "none" }}>
          <option value="Sinop Merkez">Sinop Merkez</option>
          <option value="Gerze">Gerze</option>
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <label style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)" }}>Giriş Tarihi</label>
        <input 
          type="date" 
          name="checkIn" 
          value={checkIn}
          min={minCheckIn}
          onChange={(e) => {
            const val = e.target.value;
            setCheckIn(val);
            if (checkOut && val >= checkOut) setCheckOut("");
          }}
          style={{ border: "1px solid #e2e8f0", borderRadius: "2px", padding: "0.6rem 0.75rem", fontSize: "0.88rem", color: "var(--text-dark)", outline: "none" }} 
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <label style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)" }}>Çıkış Tarihi</label>
        <input 
          type="date" 
          name="checkOut" 
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={checkIn || minCheckIn}
          style={{ border: "1px solid #e2e8f0", borderRadius: "2px", padding: "0.6rem 0.75rem", fontSize: "0.88rem", color: "var(--text-dark)", outline: "none" }} 
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <label style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)" }}>Kişi Sayısı</label>
        <input type="number" name="guests" min={1} defaultValue={2} style={{ border: "1px solid #e2e8f0", borderRadius: "2px", padding: "0.6rem 0.75rem", fontSize: "0.88rem", color: "var(--text-dark)", outline: "none" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", justifyContent: "flex-end" }}>
        <label style={{ fontSize: "0.65rem", opacity: 0 }}>x</label>
        <button type="submit" className="btn-primary" style={{ justifyContent: "center" }}>Ara</button>
      </div>
    </form>
  );
}
