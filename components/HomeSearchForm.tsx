"use client";

import { useState, useEffect } from "react";

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--gold-dark)" }}>
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export default function HomeSearchForm() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [minCheckIn, setMinCheckIn] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinCheckIn(today);
  }, []);

  const labelStyle: React.CSSProperties = {
    fontSize: "0.62rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--text-light)",
    marginBottom: "0.3rem",
    display: "block",
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
    flex: "1 1 140px",
  };

  const inputWrapStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    left: "0.65rem",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
  };

  return (
    <form
      action="/rezervasyon"
      className="animate-fade-in-up delay-300"
      style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: "8px",
        padding: "1.5rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        maxWidth: "860px",
        margin: "0 auto",
        boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
        alignItems: "flex-end",
        opacity: 0,
      }}
    >
      {/* Şehir */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Şehir</label>
        <div style={inputWrapStyle}>
          <span style={iconStyle}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold-dark)" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </span>
          <select
            name="city"
            className="search-date-input"
            style={{ paddingLeft: "2.2rem", appearance: "none" }}
          >
            <option value="all">Tüm Konumlar</option>
            <option value="Sinop Merkez">Sinop Merkez</option>
            <option value="Gerze">Gerze</option>
          </select>
        </div>
      </div>

      {/* Giriş Tarihi */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Giriş Tarihi</label>
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          background: "white",
          border: "1.5px solid #e2e8f0",
          borderRadius: "4px",
          height: "44px",
          width: "100%",
          transition: "border-color 0.2s",
          cursor: "pointer",
        }}
        className="date-picker-container"
        >
          <span style={{ position: "absolute", left: "0.75rem", display: "flex", alignItems: "center", pointerEvents: "none" }}><CalendarIcon /></span>
          <span style={{
            fontSize: "0.82rem",
            color: checkIn ? "var(--text-dark)" : "#94a3b8",
            paddingLeft: "2.2rem",
            pointerEvents: "none",
            fontWeight: 500,
          }}>
            {checkIn ? new Date(checkIn).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "Giriş Tarihi Seçin"}
          </span>
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
            onClick={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
        </div>
      </div>

      {/* Çıkış Tarihi */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Çıkış Tarihi</label>
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          background: "white",
          border: "1.5px solid #e2e8f0",
          borderRadius: "4px",
          height: "44px",
          width: "100%",
          transition: "border-color 0.2s",
          cursor: "pointer",
        }}
        className="date-picker-container"
        >
          <span style={{ position: "absolute", left: "0.75rem", display: "flex", alignItems: "center", pointerEvents: "none" }}><CalendarIcon /></span>
          <span style={{
            fontSize: "0.82rem",
            color: checkOut ? "var(--text-dark)" : "#94a3b8",
            paddingLeft: "2.2rem",
            pointerEvents: "none",
            fontWeight: 500,
          }}>
            {checkOut ? new Date(checkOut).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "Çıkış Tarihi Seçin"}
          </span>
          <input
            type="date"
            name="checkOut"
            value={checkOut}
            min={checkIn || minCheckIn}
            onChange={(e) => setCheckOut(e.target.value)}
            onClick={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
        </div>
      </div>

      {/* Kişi Sayısı */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Kişi Sayısı</label>
        <div style={inputWrapStyle}>
          <span style={iconStyle}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold-dark)" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
          </span>
          <input
            type="number"
            name="guests"
            min={1}
            max={10}
            defaultValue={2}
            className="search-date-input"
            style={{ paddingLeft: "2.2rem" }}
          />
        </div>
      </div>

      {/* Submit */}
      <div style={{ flex: "1 1 120px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <button
          type="submit"
          className="btn-primary"
          style={{ justifyContent: "center", width: "100%", borderRadius: "4px", height: 44 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Ara
        </button>
      </div>
    </form>
  );
}
