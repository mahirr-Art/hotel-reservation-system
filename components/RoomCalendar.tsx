"use client";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
  parseISO,
} from "date-fns";
import { tr } from "date-fns/locale";

type Reservation = {
  checkIn: string | Date;
  checkOut: string | Date;
};

type Props = {
  reservations: Reservation[];
  quantity: number;       // Odanın toplam adet sayısı
  capacity: number;       // Odanın kişi kapasitesi
  price: string | number; // Gecelik fiyat
};

export default function RoomCalendar({ reservations, quantity, capacity, price }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Bir gün için kaç rezervasyon çakışıyor → müsait oda sayısı
  const getAvailableCount = (day: Date): number => {
    const d = startOfDay(day);
    const bookedCount = reservations.filter((res) => {
      const checkIn = startOfDay(typeof res.checkIn === "string" ? parseISO(res.checkIn) : new Date(res.checkIn));
      const checkOut = startOfDay(typeof res.checkOut === "string" ? parseISO(res.checkOut) : new Date(res.checkOut));
      return d >= checkIn && d < checkOut;
    }).length;
    return Math.max(0, quantity - bookedCount);
  };

  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  return (
    <div style={{
      width: "100%",
      background: "white",
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}>
      {/* Takvim başlığı */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 1.25rem",
        background: "var(--navy)",
      }}>
        <button
          onClick={prevMonth}
          style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "8px", padding: "0.4rem 0.6rem", cursor: "pointer", color: "white", display: "flex", alignItems: "center" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "white", fontSize: "0.95rem", textTransform: "capitalize" }}>
          {format(currentDate, "MMMM yyyy", { locale: tr })}
        </h3>
        <button
          onClick={nextMonth}
          style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "8px", padding: "0.4rem 0.6rem", cursor: "pointer", color: "white", display: "flex", alignItems: "center" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Gün isimleri */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
        {weekDays.map((d) => (
          <div key={d} style={{ padding: "0.5rem 0", textAlign: "center", fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Günler */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", padding: "0.5rem" }}>
        {days.map((day, i) => {
          const available = getAvailableCount(day);
          const past = isBefore(startOfDay(day), startOfDay(new Date()));
          const currentMonth = isSameMonth(day, monthStart);
          const today = isSameDay(day, new Date());
          const fullyBooked = available === 0;
          const isHovered = hoveredDay && isSameDay(day, hoveredDay);

          // Renk mantığı
          let bg = "transparent";
          let color = "#cbd5e1";
          let border = "1px solid transparent";
          let title = "";

          if (!currentMonth) {
            color = "#e2e8f0";
          } else if (past) {
            color = "#cbd5e1";
            title = "Geçmiş tarih";
          } else if (fullyBooked) {
            bg = "#fef2f2";
            color = "#dc2626";
            border = "1px solid #fecaca";
            title = "Dolu";
          } else if (available === quantity) {
            bg = "#f0fdf4";
            color = "#16a34a";
            border = "1px solid #bbf7d0";
            title = `${available} oda müsait`;
          } else {
            // Kısmen dolu
            bg = "#fffbeb";
            color = "#d97706";
            border = "1px solid #fde68a";
            title = `${available}/${quantity} oda müsait`;
          }

          if (today && !fullyBooked && !past) {
            border = "2px solid var(--gold)";
          }

          if (isHovered && currentMonth && !past) {
            bg = fullyBooked ? "#fee2e2" : available === quantity ? "#dcfce7" : "#fef3c7";
          }

          return (
            <div
              key={i}
              title={title}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              style={{
                aspectRatio: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                background: bg,
                border,
                color,
                fontSize: "0.78rem",
                fontWeight: currentMonth && !past ? 600 : 400,
                cursor: currentMonth && !past ? "default" : "default",
                transition: "all 0.15s ease",
                position: "relative",
              }}
            >
              <span>{format(day, "d")}</span>
              {/* Kaç oda müsait küçük gösterge */}
              {currentMonth && !past && quantity > 1 && (
                <span style={{ fontSize: "0.5rem", lineHeight: 1, marginTop: "1px", opacity: 0.8 }}>
                  {fullyBooked ? "dolu" : `${available}/${quantity}`}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        padding: "0.75rem 1rem",
        borderTop: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        flexWrap: "wrap",
      }}>
        {[
          { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", label: "Müsait" },
          { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "Kısmi" },
          { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "Dolu" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div style={{ width: 10, height: 10, borderRadius: "3px", background: item.bg, border: `1px solid ${item.border}` }} />
            <span style={{ fontSize: "0.7rem", color: "#64748b" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Kapasite bilgisi */}
      <div style={{
        padding: "0.6rem 1rem",
        background: "#f8fafc",
        borderTop: "1px solid #f1f5f9",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
            <span style={{ fontWeight: 700, color: "#0D1B2A" }}>{capacity}</span> kişilik
          </span>
          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
            <span style={{ fontWeight: 700, color: "#0D1B2A" }}>{quantity}</span> oda
          </span>
        </div>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--gold-dark, #A07840)" }}>
          {Number(price).toLocaleString("tr-TR")} ₺ / gece
        </span>
      </div>
    </div>
  );
}
