"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Room = { id: string; name: string; price: string; capacity: number; category: { name: string } };

function RezervasyonForm() {
  const searchParams = useSearchParams();
  const [city, setCity] = useState(searchParams.get("city") || "İstanbul");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [guestCount, setGuestCount] = useState(Number(searchParams.get("guests")) || 2);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState(searchParams.get("oda") || "");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"tarih" | "form" | "onay">("tarih");
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function searchRooms() {
    setError("");
    if (!checkIn || !checkOut) {
      setError("Lütfen giriş ve çıkış tarihi seçin");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/odalar?checkIn=${checkIn}&checkOut=${checkOut}&kisiSayisi=${guestCount}&city=${city}`);
    const data = await res.json();
    setRooms(data.rooms || []);
    setLoading(false);
    setStep("form");
  }

  async function submitReservation(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/rezervasyon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: selectedRoomId,
        fullName,
        email,
        phone,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guestCount,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error?.toString() || "Bir hata oluştu");
      return;
    }
    setStep("onay");
  }

  if (step === "onay") {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-4">Rezervasyonunuz Alındı ✓</h1>
        <p className="text-neutral-600">{fullName}, rezervasyon talebiniz başarıyla oluşturuldu.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2">Rezervasyon</h1>
      <p className="text-neutral-600 mb-10">Şehir ve tarihlerinizi seçin, müsait odalar arasından seçim yapın.</p>

      <div className="grid gap-4 sm:grid-cols-5 mb-8">
        <label className="text-sm">
          Şehir
          <select value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
            <option value="İstanbul">İstanbul</option>
            <option value="Antalya">Antalya</option>
            <option value="İzmir">İzmir</option>
            <option value="Muğla">Muğla</option>
            <option value="Nevşehir">Nevşehir</option>
          </select>
        </label>
        <label className="text-sm">
          Giriş Tarihi
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="text-sm">
          Çıkış Tarihi
          <input type="date" value={checkOut} min={checkIn || undefined} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="text-sm">
          Kişi Sayısı
          <input type="number" min={1} value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <button onClick={searchRooms} disabled={loading} className="self-end rounded-lg bg-teal-600 text-white px-4 py-2 font-medium hover:bg-teal-700">
          {loading ? "Aranıyor..." : "Müsaitlik Ara"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {step === "form" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Müsait Odalar — {city}</h2>
          <div className="grid gap-4 mb-10">
            {rooms.map((room) => (
              <label key={room.id} className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer ${selectedRoomId === room.id ? "border-teal-600 bg-teal-50" : ""}`}>
                <div>
                  <p className="font-medium">{room.name}</p>
                  <p className="text-sm text-neutral-500">{room.category.name} · {room.capacity} kişi</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{room.price.toString()} ₺</span>
                  <input type="radio" name="room" checked={selectedRoomId === room.id} onChange={() => setSelectedRoomId(room.id)} />
                </div>
              </label>
            ))}
            {rooms.length === 0 && <p className="text-neutral-500">Seçilen şehir/tarihlerde müsait oda bulunamadı.</p>}
          </div>

          {selectedRoomId && (
            <form onSubmit={submitReservation} className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="Ad Soyad" value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-lg border px-3 py-2" />
              <input required type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border px-3 py-2" />
              <input required placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-lg border px-3 py-2 sm:col-span-2" />
              <button type="submit" disabled={loading} className="sm:col-span-2 rounded-full bg-teal-600 text-white px-8 py-3 font-medium hover:bg-teal-700">
                {loading ? "Gönderiliyor..." : "Rezervasyonu Tamamla"}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default function RezervasyonPage() {
  return (
    <Suspense fallback={null}>
      <RezervasyonForm />
    </Suspense>
  );
}