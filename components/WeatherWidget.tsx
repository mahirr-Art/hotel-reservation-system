"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/lang";

export default function WeatherWidget() {
  const { t } = useTranslation();
  const [temp, setTemp] = useState(25);
  const [condition, setCondition] = useState("sunny");

  useEffect(() => {
    // Dynamic weather simulator based on local hour/season
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 19;
    
    // Simulate slight temperature variation based on time
    if (isNight) {
      setTemp(19 + Math.floor(Math.random() * 3));
      setCondition("cloudy");
    } else {
      setTemp(24 + Math.floor(Math.random() * 4));
      setCondition(Math.random() > 0.3 ? "sunny" : "cloudy");
    }
  }, []);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.25rem",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        width: "100%",
        maxWidth: "320px",
        boxSizing: "border-box",
      }}
      className="weather-card animate-fade-in-up"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ fontSize: "2rem", lineHeight: 1 }} className="weather-icon animate-pulse">
          {condition === "sunny" ? "☀️" : "⛅"}
        </div>
        <div>
          <h4 style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold-light)", margin: "0 0 0.15rem" }}>
            {t.weatherTitle}
          </h4>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "white", margin: 0 }}>
            Gerze, Sinop
          </p>
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--gold)", margin: 0, lineHeight: 1.1 }}>
          {temp}°C
        </p>
        <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", margin: 0 }}>
          {condition === "sunny" ? t.weatherSunny : t.weatherCloudy}
        </p>
      </div>
    </div>
  );
}
