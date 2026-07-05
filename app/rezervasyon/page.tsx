"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Room = { id: string; name: string; price: string; capacity: number; availableCount?: number; category: { name: string } };

function RezervasyonForm() {
  const searchParams = useSearchParams();
  const [city, setCity] = useState(searchParams.get("city") || "Sinop Merkez");
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
  const [minDate, setMinDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"havale" | "kapida" | "">("");
  const [reservationId, setReservationId] = useState("");

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0;
  const totalPrice = selectedRoom ? Number(selectedRoom.price) * nights : 0;

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
    if (!paymentMethod) {
      setError("Lütfen bir ödeme yöntemi seçin");
      return;
    }
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
        paymentMethod
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error?.toString() || "Bir hata oluştu");
      return;
    }
    setReservationId(data.reservation?.id?.slice(-8).toUpperCase() || "--------");
    setStep("onay");
  }

  /* ─── ONAY + ÖDEME BİLGİSİ ─── */
  if (step === "onay") {
    const isHavale = paymentMethod === "havale";
    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "4rem 1.5rem" }}>

        {/* Başarı başlığı */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.25rem", boxShadow: "0 8px 24px rgba(22,163,74,0.3)"
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>
            Rezervasyonunuz Alındı!
          </h1>
          <p style={{ color: "var(--text-light)", fontSize: "0.95rem" }}>
            Merhaba <strong>{fullName}</strong>, talebiniz başarıyla oluşturuldu.
          </p>
          <div style={{ display: "inline-block", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.5rem 1.25rem", marginTop: "0.75rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#15803d", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Rezervasyon No: <strong>#{reservationId}</strong>
            </span>
          </div>
        </div>

        {/* Rezervasyon özeti */}
        <div style={{ background: "var(--cream)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem" }}>
            Rezervasyon Özeti
          </h3>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {[
              ["Oda", selectedRoom?.name ?? "-"],
              ["Kategori", selectedRoom?.category.name ?? "-"],
              ["Giriş", new Date(checkIn).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
              ["Çıkış", new Date(checkOut).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
              ["Süre", `${nights} gece`],
              ["Kişi Sayısı", `${guestCount} kişi`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                <span style={{ color: "var(--text-light)" }}>{label}</span>
                <span style={{ fontWeight: 600, color: "var(--navy)" }}>{value}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "0.6rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)" }}>Toplam Tutar</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--navy)" }}>
                {totalPrice.toLocaleString("tr-TR")} <span style={{ fontSize: "0.9rem", fontWeight: 400 }}>₺</span>
              </span>
            </div>
          </div>
        </div>

        {/* Ödeme talimatları */}
        <div style={{
          border: isHavale ? "1px solid #ddd6fe" : "1px solid #bbf7d0",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "1.5rem",
        }}>
          {/* Başlık */}
          <div style={{
            background: isHavale ? "linear-gradient(135deg, #7c3aed, #8b5cf6)" : "linear-gradient(135deg, #059669, #10b981)",
            padding: "1rem 1.5rem",
            display: "flex", alignItems: "center", gap: "0.75rem"
          }}>
            {isHavale ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            )}
            <div>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>
                {isHavale ? "Havale / EFT ile Ödeme" : "Kapıda Ödeme"}
              </p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem" }}>
                {isHavale ? "Aşağıdaki hesaba ödemenizi yapın" : "Check-in sırasında otelde ödeyin"}
              </p>
            </div>
          </div>

          <div style={{ padding: "1.5rem", background: "white" }}>
            {isHavale ? (
              <>
                <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "1rem", lineHeight: 1.6 }}>
                  Rezervasyonunuzun onaylanabilmesi için aşağıdaki banka hesabına <strong>{totalPrice.toLocaleString("tr-TR")} ₺</strong> aktarım yapmanız gerekmektedir.
                </p>

                {/* Banka bilgileri */}
                {[
                  { bank: "Garanti BBVA", iban: "TR12 0006 2000 1234 0006 2990 01" },
                  { bank: "İş Bankası", iban: "TR34 0006 4000 0011 2345 6789 01" },
                ].map((acc) => (
                  <div key={acc.bank} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1rem", marginBottom: "0.75rem" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--navy)", marginBottom: "0.25rem" }}>{acc.bank}</p>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-light)", marginBottom: "0.4rem" }}>Hesap Sahibi: Kuzey Feneri Otel Ltd. Şti.</p>
                    <p style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "var(--navy)", background: "#e2e8f0", padding: "0.4rem 0.75rem", borderRadius: "6px", letterSpacing: "0.04em" }}>
                      {acc.iban}
                    </p>
                  </div>
                ))}

                {/* Uyarı */}
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.875rem 1rem", marginTop: "0.75rem" }}>
                  <p style={{ fontSize: "0.8rem", color: "#92400e", fontWeight: 600, marginBottom: "0.25rem" }}>⚠️ Önemli</p>
                  <p style={{ fontSize: "0.78rem", color: "#78350f", lineHeight: 1.6 }}>
                    Havale açıklamasına <strong>rezervasyon numaranızı (#{reservationId})</strong> ve <strong>adınızı</strong> yazmayı unutmayın. Ödemeniz doğrulandıktan sonra rezervasyonunuz onaylanacak ve e-posta ile bilgilendirileceksiniz.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: "0.88rem", color: "var(--text-light)", lineHeight: 1.7, marginBottom: "1rem" }}>
                  Rezervasyonunuz oluşturuldu. <strong>Ödemenizi check-in sırasında</strong> otelimizde yapabilirsiniz.
                </p>
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  {["Nakit (Türk Lirası)", "Kredi Kartı (POS Cihazı)", "Banka Kartı (POS Cihazı)", "Döviz (USD / EUR)"].map((m) => (
                    <div key={m} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                      <span style={{ fontSize: "0.85rem", color: "var(--navy)" }}>{m}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.875rem 1rem", marginTop: "1rem" }}>
                  <p style={{ fontSize: "0.78rem", color: "#14532d", lineHeight: 1.6 }}>
                    ℹ️ Kapıda ödeme seçeneğinde iptal durumunda en az <strong>48 saat öncesinde</strong> haber verilmesi gerekmektedir.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* İletişim */}
        <div style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text-light)", lineHeight: 1.7 }}>
          Sorularınız için: <a href="tel:+903682710000" style={{ color: "var(--gold-dark)", fontWeight: 600 }}>+90 368 271 00 00</a> ·{" "}
          <a href="mailto:info@kuzeyfeneri.com" style={{ color: "var(--gold-dark)", fontWeight: 600 }}>info@kuzeyfeneri.com</a>
        </div>
      </div>
    );
  }

  /* ─── ANA FORM ─── */
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2">Rezervasyon</h1>
      <p className="text-neutral-600 mb-10">Şehir ve tarihlerinizi seçin, müsait odalar arasından seçim yapın.</p>

      <div className="grid gap-4 sm:grid-cols-5 mb-8">
        <label className="text-sm">
          Şehir
          <select value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
            <option value="Sinop Merkez">Sinop Merkez</option>
            <option value="Gerze">Gerze</option>
          </select>
        </label>
        <label className="text-sm">
          Giriş Tarihi
          <input 
            type="date" 
            value={checkIn} 
            min={minDate}
            max={checkOut || undefined}
            onChange={(e) => {
              const val = e.target.value;
              setCheckIn(val);
              if (checkOut && val >= checkOut) setCheckOut("");
            }} 
            className="mt-1 w-full rounded-lg border px-3 py-2" 
          />
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
                  {room.availableCount !== undefined && (
                    <p className="text-xs font-semibold text-teal-600 mt-1">
                      Sadece {room.availableCount} oda kaldı
                    </p>
                  )}
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
              
              <div className="sm:col-span-2 grid grid-cols-2 gap-4 mt-2">
                <button type="button" onClick={() => setPaymentMethod("havale")} className={`p-4 border rounded-xl ${paymentMethod === "havale" ? "border-teal-600 bg-teal-50" : ""}`}>
                  Havale / EFT
                </button>
                <button type="button" onClick={() => setPaymentMethod("kapida")} className={`p-4 border rounded-xl ${paymentMethod === "kapida" ? "border-teal-600 bg-teal-50" : ""}`}>
                  Kapıda Ödeme
                </button>
              </div>

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