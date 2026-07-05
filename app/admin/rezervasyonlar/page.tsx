"use client";

import { useEffect, useState } from "react";

type Reservation = {
  id: string; fullName: string; email: string; phone: string;
  checkIn: string; checkOut: string; guestCount: number;
  paymentMethod: string;
  status: "BEKLIYOR" | "ONAYLANDI" | "IPTAL"; room: { name: string };
};

const statusLabel: Record<Reservation["status"], string> = {
  BEKLIYOR: "Beklemede", ONAYLANDI: "Onaylandı", IPTAL: "İptal Edildi",
};

export default function AdminRezervasyonlarPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  async function loadData() {
    const res = await fetch("/api/admin/rezervasyonlar").then((r) => r.json());
    setReservations(res.reservations);
  }

  useEffect(() => { loadData(); }, []);

  async function updateStatus(id: string, status: Reservation["status"]) {
    await fetch(`/api/admin/rezervasyonlar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadData();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Rezervasyonlar</h1>
      <div className="grid gap-3">
        {reservations.map((r) => (
          <div key={r.id} className="border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">{r.room.name}</p>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 font-semibold text-neutral-600">
                  {r.paymentMethod === "KAPIDA" ? "💳 Kapıda Ödeme" : "🏦 Havale / EFT"}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${r.status === "ONAYLANDI" ? "bg-green-100 text-green-800" : r.status === "IPTAL" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{statusLabel[r.status]}</span>
              </div>
            </div>
            <p className="text-sm text-neutral-600">{r.fullName} · {r.email} · {r.phone}</p>
            <p className="text-sm text-neutral-500 mb-3">
              {new Date(r.checkIn).toLocaleDateString("tr-TR")} — {new Date(r.checkOut).toLocaleDateString("tr-TR")} · {r.guestCount} kişi
            </p>
            {r.status === "BEKLIYOR" && (
              <div className="flex gap-3 text-sm">
                <button onClick={() => updateStatus(r.id, "ONAYLANDI")} className="text-green-700 underline">Onayla</button>
                <button onClick={() => updateStatus(r.id, "IPTAL")} className="text-red-600 underline">İptal Et</button>
              </div>
            )}
          </div>
        ))}
        {reservations.length === 0 && <p className="text-neutral-500">Henüz rezervasyon yok.</p>}
      </div>
    </div>
  );
}