"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/lang";

type Room = { id: string; name: string; price: string; capacity: number; availableCount?: number; category: { name: string } };

function RezervasyonForm() {
  const searchParams = useSearchParams();
  const { lang, t } = useTranslation();

  const [city, setCity] = useState(searchParams.get("city") || "all");
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
  const [user, setUser] = useState<{ fullName: string; email: string; phone: string | null } | null>(null);

  // Promo code states
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // KVKK states
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);

    fetch("/api/kullanici/ben")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setFullName(data.user.fullName || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
        }
      })
      .catch(() => {});
  }, []);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0;
  
  const totalPrice = selectedRoom ? Number(selectedRoom.price) * nights : 0;
  const discountAmount = totalPrice * (discountPercent / 100);
  const finalPrice = totalPrice - discountAmount;

  function handlePromoCodeApply() {
    setPromoError("");
    setPromoSuccess("");
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === "YAZ2026") {
      setDiscountPercent(20);
      setPromoSuccess(lang === "tr" ? "Kupon kodu uygulandı: %20 indirim!" : "Promo applied: 20% discount!");
    } else if (code === "BALAYI") {
      setDiscountPercent(15);
      setPromoSuccess(lang === "tr" ? "Kupon kodu uygulandı: %15 indirim!" : "Promo applied: 15% discount!");
    } else if (code === "KUZEY10") {
      setDiscountPercent(10);
      setPromoSuccess(lang === "tr" ? "Kupon kodu uygulandı: %10 indirim!" : "Promo applied: 10% discount!");
    } else {
      setDiscountPercent(0);
      setPromoError(lang === "tr" ? "Geçersiz indirim kodu!" : "Invalid promo code!");
    }
  }

  async function searchRooms() {
    setError("");
    if (!checkIn || !checkOut) {
      setError(lang === "tr" ? "Lütfen giriş ve çıkış tarihi seçin" : "Please select check-in and check-out dates");
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
      setError(lang === "tr" ? "Lütfen bir ödeme yöntemi seçin" : "Please select a payment method");
      return;
    }
    if (!kvkkAccepted) {
      setError(lang === "tr" ? "Lütfen KVKK Aydınlatma Metnini okuyup onaylayın." : "Please read and accept the KVKK Privacy Agreement.");
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
        paymentMethod,
        promoCode: discountPercent > 0 ? promoCode : undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      let errMsg = lang === "tr" ? "Bir hata oluştu" : "An error occurred";
      if (typeof data.error === "string") {
        errMsg = data.error;
      } else if (data.error && typeof data.error === "object") {
        if (data.error.fieldErrors) {
          const errors = Object.values(data.error.fieldErrors).flat();
          if (errors.length > 0) {
            errMsg = errors.map(err => {
              if (typeof err === 'string') return err;
              if (typeof err === 'object' && err !== null && 'message' in err) return (err as any).message;
              return JSON.stringify(err);
            }).join(", ");
          }
        } else {
          errMsg = JSON.stringify(data.error);
        }
      }
      setError(errMsg);
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
            {lang === "tr" ? "Rezervasyonunuz Alındı!" : "Reservation Received!"}
          </h1>
          <p style={{ color: "var(--text-light)", fontSize: "0.95rem" }}>
            {lang === "tr" ? <>Merhaba <strong>{fullName}</strong>, talebiniz başarıyla oluşturuldu.</> : <>Dear <strong>{fullName}</strong>, your request was created successfully.</>}
          </p>
          <div style={{ display: "inline-block", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.5rem 1.25rem", marginTop: "0.75rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#15803d", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {lang === "tr" ? "Rezervasyon No:" : "Booking No:"} <strong>#{reservationId}</strong>
            </span>
          </div>
        </div>

        {/* Rezervasyon özeti */}
        <div style={{ background: "var(--cream)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem" }}>
            {lang === "tr" ? "Rezervasyon Özeti" : "Reservation Summary"}
          </h3>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {[
              [lang === "tr" ? "Oda" : "Room", selectedRoom?.name ?? "-"],
              [lang === "tr" ? "Kategori" : "Category", selectedRoom?.category.name ?? "-"],
              [lang === "tr" ? "Giriş" : "Check-In", new Date(checkIn).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
              [lang === "tr" ? "Çıkış" : "Check-Out", new Date(checkOut).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
              [lang === "tr" ? "Süre" : "Duration", lang === "tr" ? `${nights} gece` : `${nights} nights`],
              [lang === "tr" ? "Kişi Sayısı" : "Guests", lang === "tr" ? `${guestCount} kişi` : `${guestCount} guests`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                <span style={{ color: "var(--text-light)" }}>{label}</span>
                <span style={{ fontWeight: 600, color: "var(--navy)" }}>{value}</span>
              </div>
            ))}
            
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "0.6rem", display: "grid", gap: "0.4rem" }}>
              {discountPercent > 0 && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                    <span style={{ color: "var(--text-light)" }}>{lang === "tr" ? "Brüt Tutar" : "Gross Total"}</span>
                    <span style={{ color: "var(--text-mid)", textDecoration: "line-through" }}>{totalPrice.toLocaleString("tr-TR")} ₺</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#16a34a", fontWeight: 600 }}>
                    <span>{lang === "tr" ? "Kupon İndirimi" : "Coupon Discount"} (-%{discountPercent})</span>
                    <span>-{discountAmount.toLocaleString("tr-TR")} ₺</span>
                  </div>
                </>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)" }}>{t.totalPrice}</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--navy)" }}>
                  {finalPrice.toLocaleString("tr-TR")} <span style={{ fontSize: "0.9rem", fontWeight: 400 }}>₺</span>
                </span>
              </div>
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
                {isHavale ? (lang === "tr" ? "Havale / EFT ile Ödeme" : "Payment via Wire / Transfer") : (lang === "tr" ? "Kapıda Ödeme" : "Pay at Entrance")}
              </p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem" }}>
                {isHavale ? (lang === "tr" ? "Aşağıdaki hesaba ödemenizi yapın" : "Make your payment to the account below") : (lang === "tr" ? "Check-in sırasında otelde ödeyin" : "Pay at the front desk during check-in")}
              </p>
            </div>
          </div>

          <div style={{ padding: "1.5rem", background: "white" }}>
            {isHavale ? (
              <>
                <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "1rem", lineHeight: 1.6 }}>
                  {lang === "tr" 
                    ? <>Rezervasyonunuzun onaylanabilmesi için aşağıdaki banka hesabına <strong>{finalPrice.toLocaleString("tr-TR")} ₺</strong> aktarım yapmanız gerekmektedir.</>
                    : <>To complete your reservation, you must transfer <strong>{finalPrice.toLocaleString("tr-TR")} ₺</strong> to the bank account below.</>}
                </p>

                {/* Banka bilgileri */}
                {[
                  { bank: "Garanti BBVA", iban: "TR12 0006 2000 1234 0006 2990 01" },
                  { bank: "İş Bankası", iban: "TR34 0006 4000 0011 2345 6789 01" },
                ].map((acc) => (
                  <div key={acc.bank} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1rem", marginBottom: "0.75rem" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--navy)", marginBottom: "0.25rem" }}>{acc.bank}</p>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-light)", marginBottom: "0.4rem" }}>{lang === "tr" ? "Hesap Sahibi: Kuzey Feneri Otel Ltd. Şti." : "Account Holder: Kuzey Feneri Hotel Ltd."}</p>
                    <p style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "var(--navy)", background: "#e2e8f0", padding: "0.4rem 0.75rem", borderRadius: "6px", letterSpacing: "0.04em" }}>
                      {acc.iban}
                    </p>
                  </div>
                ))}

                {/* Uyarı */}
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.875rem 1rem", marginTop: "0.75rem" }}>
                  <p style={{ fontSize: "0.8rem", color: "#92400e", fontWeight: 600, marginBottom: "0.25rem" }}>⚠️ {lang === "tr" ? "Önemli" : "Important"}</p>
                  <p style={{ fontSize: "0.78rem", color: "#78350f", lineHeight: 1.6 }}>
                    {lang === "tr" 
                      ? <>Havale açıklamasına <strong>rezervasyon numaranızı (#{reservationId})</strong> ve <strong>adınızı</strong> yazmayı unutmayın. Ödemeniz doğrulandıktan sonra rezervasyonunuz onaylanacak ve e-posta ile bilgilendirileceksiniz.</>
                      : <>Don't forget to write your <strong>booking code (#{reservationId})</strong> and your <strong>name</strong> in the transfer description. Your reservation will be confirmed once payment is verified.</>}
                  </p>
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: "0.88rem", color: "var(--text-light)", lineHeight: 1.7, marginBottom: "1rem" }}>
                  {lang === "tr" 
                    ? <>Rezervasyonunuz oluşturuldu. <strong>Ödemenizi check-in sırasında</strong> otelimizde yapabilirsiniz.</>
                    : <>Your booking has been created. You can <strong>pay at check-in</strong> at our desk.</>}
                </p>
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  {[lang === "tr" ? "Nakit (Türk Lirası)" : "Cash (TRY / USD / EUR)", lang === "tr" ? "Kredi Kartı (POS Cihazı)" : "Credit Card (POS)"].map((m) => (
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
                    {lang === "tr" 
                      ? <>ℹ️ Kapıda ödeme seçeneğinde iptal durumunda en az <strong>48 saat öncesinde</strong> haber verilmesi gerekmektedir.</>
                      : <>ℹ️ For Pay-at-entrance bookings, please notify cancellations at least <strong>48 hours prior</strong> to check-in.</>}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* İletişim */}
        <div style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text-light)", lineHeight: 1.7 }}>
          {lang === "tr" ? "Sorularınız için:" : "Need help?"} <a href="tel:+905537905757" style={{ color: "var(--gold-dark)", fontWeight: 600 }}>+90 (553) 790 57 57</a> ·{" "}
          <a href="mailto:info@kuzeyfeneri.com" style={{ color: "var(--gold-dark)", fontWeight: 600 }}>info@kuzeyfeneri.com</a>
        </div>
      </div>
    );
  }

  /* ─── ANA FORM ─── */
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2">{lang === "tr" ? "Rezervasyon" : "Online Booking"}</h1>
      <p className="text-neutral-600 mb-10">{lang === "tr" ? "Konum ve tarihlerinizi seçin, müsait odalar arasından seçim yapın." : "Choose your dates, guests count, and explore premium available suites."}</p>

      <div className="grid gap-4 sm:grid-cols-5 mb-8">
        <label className="text-sm">
          {lang === "tr" ? "Konum" : "Location"}
          <select value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
            <option value="all">{lang === "tr" ? "Tüm Konumlar" : "All Locations"}</option>
            <option value="Sinop Merkez">Sinop Merkez</option>
            <option value="Gerze">Gerze</option>
          </select>
        </label>
        
        <div className="flex flex-col text-sm">
          <span>{lang === "tr" ? "Giriş Tarihi" : "Check-In Date"}</span>
          <div className="relative mt-1 flex items-center bg-white border rounded-lg h-[42px] cursor-pointer hover:border-teal-600 transition-colors">
            <span className="absolute left-3 text-neutral-400 pointer-events-none">📅</span>
            <span className="pl-9 text-sm text-neutral-700 pointer-events-none font-medium">
              {checkIn ? new Date(checkIn).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "long", year: "numeric" }) : (lang === "tr" ? "Seçiniz" : "Select Date")}
            </span>
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
              onClick={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col text-sm">
          <span>{lang === "tr" ? "Çıkış Tarihi" : "Check-Out Date"}</span>
          <div className="relative mt-1 flex items-center bg-white border rounded-lg h-[42px] cursor-pointer hover:border-teal-600 transition-colors">
            <span className="absolute left-3 text-neutral-400 pointer-events-none">📅</span>
            <span className="pl-9 text-sm text-neutral-700 pointer-events-none font-medium">
              {checkOut ? new Date(checkOut).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "long", year: "numeric" }) : (lang === "tr" ? "Seçiniz" : "Select Date")}
            </span>
            <input 
              type="date" 
              value={checkOut} 
              min={checkIn || minDate}
              onChange={(e) => setCheckOut(e.target.value)} 
              onClick={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>
        </div>

        <label className="text-sm">
          {lang === "tr" ? "Kişi Sayısı" : "Guests Count"}
          <input type="number" min={1} value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>

        <button onClick={searchRooms} disabled={loading} className="self-end rounded-lg bg-teal-600 text-white px-4 py-2 font-medium hover:bg-teal-700">
          {loading ? (lang === "tr" ? "Aranıyor..." : "Searching...") : (lang === "tr" ? "Müsaitlik Ara" : "Search Rooms")}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">⚠️ {error}</p>}

      {step === "form" && (
        <>
          <h2 className="text-xl font-semibold mb-4">{lang === "tr" ? "Müsait Odalar" : "Available Rooms"} — {city === "all" ? (lang === "tr" ? "Tüm Konumlar" : "All Locations") : city}</h2>
          <div className="grid gap-4 mb-10">
            {rooms.map((room) => (
              <label key={room.id} className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer ${selectedRoomId === room.id ? "border-teal-600 bg-teal-50" : ""}`}>
                <div>
                  <p className="font-medium">{room.name}</p>
                  <p className="text-sm text-neutral-500">{room.category.name} · {room.capacity} {lang === "tr" ? "kişi" : "guests"}</p>
                  {room.availableCount !== undefined && (
                    <p className="text-xs font-semibold text-teal-600 mt-1">
                      {lang === "tr" ? `Sadece ${room.availableCount} oda kaldı` : `Only ${room.availableCount} rooms left`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{room.price.toString()} ₺</span>
                  <input type="radio" name="room" checked={selectedRoomId === room.id} onChange={() => setSelectedRoomId(room.id)} />
                </div>
              </label>
            ))}
            {rooms.length === 0 && <p className="text-neutral-500">{lang === "tr" ? "Seçilen şehir/tarihlerde müsait oda bulunamadı." : "No available rooms found for the selected dates."}</p>}
          </div>

          {selectedRoomId && (
            <form onSubmit={submitReservation} className="grid gap-4 sm:grid-cols-2">
              {user && user.fullName && user.email && user.phone && user.phone.length >= 7 ? (
                <div className="sm:col-span-2 bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-2">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">{lang === "tr" ? "Hesap Bilgileri" : "Account Info"}</p>
                  <p className="text-sm font-medium text-neutral-800">
                    <strong>{user.fullName}</strong> ({user.email}) {lang === "tr" ? "hesabı ile rezervasyon yapıyorsunuz." : "account is being used."}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">{lang === "tr" ? "İletişim:" : "Contact:"} {user.phone}</p>
                </div>
              ) : (
                <>
                  {user ? (
                    <div className="sm:col-span-2 bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-1">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">{lang === "tr" ? "Hesap Bilgileri" : "Account Info"}</p>
                      <p className="text-sm font-medium text-neutral-800">
                        <strong>{user.fullName}</strong> ({user.email}) {lang === "tr" ? "hesabı ile rezervasyon yapıyorsunuz." : "account is being used."}
                      </p>
                      <p className="text-xs text-amber-600 font-semibold mt-2">
                        {lang === "tr" ? "⚠️ Lütfen işlemlerinizi tamamlamak için geçerli bir telefon numarası girin:" : "⚠️ Please enter a valid phone number to continue:"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <input required placeholder={lang === "tr" ? "Ad Soyad" : "Full Name"} value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-lg border px-3 py-2" />
                      <input required type="email" placeholder={lang === "tr" ? "E-posta" : "Email Address"} value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border px-3 py-2" />
                    </>
                  )}
                  <input required placeholder={lang === "tr" ? "Telefon (En az 7 haneli)" : "Phone Number (Min 7 digits)"} value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-lg border px-3 py-2 sm:col-span-2" />
                </>
              )}

              {/* Promo Code Input */}
              <div className="sm:col-span-2 p-4 border border-dashed rounded-xl bg-neutral-50">
                <p className="text-sm font-semibold text-neutral-800 mb-2">{t.promoTitle}</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    placeholder="Örn: YAZ2026"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{ flex: 1, border: "1px solid #E5E7EB", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }}
                  />
                  <button
                    type="button"
                    onClick={handlePromoCodeApply}
                    className="rounded-lg bg-neutral-800 text-white px-4 py-2 text-xs font-semibold hover:bg-black"
                  >
                    {t.promoApply}
                  </button>
                </div>
                {promoSuccess && <p style={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 600, marginTop: "0.35rem" }}>✅ {promoSuccess}</p>}
                {promoError && <p style={{ fontSize: "0.78rem", color: "#dc2626", fontWeight: 600, marginTop: "0.35rem" }}>⚠️ {promoError}</p>}
              </div>

              {/* Pricing breakdown summary */}
              <div className="sm:col-span-2 p-4 border rounded-xl bg-neutral-50 grid gap-2">
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>{lang === "tr" ? "Brüt Tutar" : "Gross Price"}</span>
                  <span className={discountPercent > 0 ? "line-through" : "font-semibold"}>{totalPrice.toLocaleString("tr-TR")} ₺</span>
                </div>
                {discountPercent > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-green-600 font-semibold">
                      <span>{lang === "tr" ? "İndirim" : "Discount"} (-%{discountPercent})</span>
                      <span>-{discountAmount.toLocaleString("tr-TR")} ₺</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-neutral-900 border-t pt-2 mt-1">
                      <span>{t.totalPrice}</span>
                      <span>{finalPrice.toLocaleString("tr-TR")} ₺</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="sm:col-span-2 grid grid-cols-2 gap-4 mt-1">
                <button type="button" onClick={() => setPaymentMethod("havale")} className={`p-4 border rounded-xl text-sm font-semibold transition-all ${paymentMethod === "havale" ? "border-teal-600 bg-teal-50 text-teal-800" : "bg-white text-neutral-700"}`}>
                  {lang === "tr" ? "Havale / EFT" : "Bank Transfer"}
                </button>
                <button type="button" onClick={() => setPaymentMethod("kapida")} className={`p-4 border rounded-xl text-sm font-semibold transition-all ${paymentMethod === "kapida" ? "border-teal-600 bg-teal-50 text-teal-800" : "bg-white text-neutral-700"}`}>
                  {lang === "tr" ? "Kapıda Ödeme" : "Pay at Entrance"}
                </button>
              </div>

              {/* KVKK Checkbox */}
              <div className="sm:col-span-2 flex items-start gap-2.5 my-2">
                <input
                  type="checkbox"
                  id="kvkkCheck"
                  checked={kvkkAccepted}
                  onChange={(e) => setKvkkAccepted(e.target.checked)}
                  style={{ marginTop: "3px", cursor: "pointer" }}
                />
                <label htmlFor="kvkkCheck" style={{ fontSize: "0.78rem", color: "#4B5563", lineHeight: 1.5, cursor: "pointer" }}>
                  {lang === "tr" ? (
                    <>
                      Kuzey Feneri Butik Otel{" "}
                      <button
                        type="button"
                        onClick={() => setShowKvkkModal(true)}
                        style={{ color: "#A07840", fontWeight: 700, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        KVKK Aydınlatma Metnini
                      </button>{" "}
                      okudum ve kabul ediyorum.
                    </>
                  ) : (
                    <>
                      I have read and agree to the{" "}
                      <button
                        type="button"
                        onClick={() => setShowKvkkModal(true)}
                        style={{ color: "#A07840", fontWeight: 700, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        KVKK Disclosure Agreement
                      </button>.
                    </>
                  )}
                </label>
              </div>

              <button type="submit" disabled={loading} className="sm:col-span-2 rounded-full bg-teal-600 text-white px-8 py-3.5 font-medium hover:bg-teal-700 text-base">
                {loading ? (lang === "tr" ? "Gönderiliyor..." : "Submitting...") : (lang === "tr" ? "Rezervasyonu Tamamla" : "Complete Reservation")}
              </button>
            </form>
          )}
        </>
      )}

      {/* KVKK Modal popup dialog */}
      {showKvkkModal && (
        <div
          onClick={() => setShowKvkkModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(13,27,42,0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "2.5rem",
              maxWidth: 540,
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              position: "relative",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <button
              onClick={() => setShowKvkkModal(false)}
              style={{
                position: "absolute", top: "1.25rem", right: "1.25rem",
                background: "none", border: "none", fontSize: "1.5rem",
                cursor: "pointer", color: "#9CA3AF"
              }}
            >
              ✕
            </button>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>
              {t.kvkkTitle}
            </h3>
            <div className="gold-divider" style={{ marginBottom: "1.5rem" }} />
            <p style={{ fontSize: "0.85rem", color: "var(--text-mid)", lineHeight: 1.7, marginBottom: "2rem" }}>
              {t.kvkkBody}
            </p>
            <button
              onClick={() => { setKvkkAccepted(true); setShowKvkkModal(false); }}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", borderRadius: "12px", padding: "0.85rem" }}
            >
              {lang === "tr" ? "Okudum, Kabul Ediyorum" : "I Agree & Accept"}
            </button>
          </div>
        </div>
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