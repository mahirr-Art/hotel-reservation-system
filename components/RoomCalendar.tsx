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

export default function RoomCalendar({ reservations }: { reservations: Reservation[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Function to check if a specific day is booked
  const isBooked = (day: Date) => {
    const startOfCurrentDay = startOfDay(day);
    return reservations.some((res) => {
      const checkIn = startOfDay(typeof res.checkIn === "string" ? parseISO(res.checkIn) : res.checkIn);
      const checkOut = startOfDay(typeof res.checkOut === "string" ? parseISO(res.checkOut) : res.checkOut);
      // Booked if day is >= checkIn AND < checkOut
      return startOfCurrentDay >= checkIn && startOfCurrentDay < checkOut;
    });
  };

  return (
    <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-neutral-50 border-b border-neutral-200">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-neutral-200 transition-colors text-neutral-600"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h3 className="font-medium text-neutral-800 capitalize">
          {format(currentDate, dateFormat, { locale: tr })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-neutral-200 transition-colors text-neutral-600"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50/50">
        {weekDays.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-neutral-500">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 p-2 gap-1">
        {days.map((day, i) => {
          const booked = isBooked(day);
          const past = isBefore(startOfDay(day), startOfDay(new Date()));
          const currentMonth = isSameMonth(day, monthStart);
          const today = isSameDay(day, new Date());

          let bgClass = "bg-white hover:bg-neutral-100";
          let textClass = "text-neutral-700";

          if (!currentMonth) {
            textClass = "text-neutral-300";
            bgClass = "bg-transparent";
          } else if (booked) {
            bgClass = "bg-red-50 text-red-700 border border-red-200";
            textClass = "text-red-700 font-medium";
          } else if (past) {
            textClass = "text-neutral-300";
          } else {
            bgClass = "bg-green-50 border border-green-200";
            textClass = "text-green-700 font-medium";
          }

          if (today && !booked) {
            bgClass += " ring-2 ring-teal-500 ring-offset-1";
          }

          return (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center rounded-md text-sm transition-colors ${bgClass} ${textClass}`}
              title={booked ? "Dolu" : past ? "Geçmiş" : "Müsait"}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="p-3 border-t border-neutral-100 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-neutral-600">
          <div className="w-3 h-3 rounded-full bg-green-50 border border-green-200"></div>
          Müsait
        </div>
        <div className="flex items-center gap-1.5 text-neutral-600">
          <div className="w-3 h-3 rounded-full bg-red-50 border border-red-200"></div>
          Dolu
        </div>
      </div>
    </div>
  );
}
