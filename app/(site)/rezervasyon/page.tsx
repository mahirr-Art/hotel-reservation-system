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

  // Airbnb Filter states
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [beds, setBeds] = useState<number | "">("");
  const [bathrooms, setBathrooms] = useState<number | "">("");
  const [petFriendly, setPetFriendly] = useState(false);
  const [kitchen, setKitchen] = useState(false);
  const [parking, setParking] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [ac, setAc] = useState(false);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [filteredCount, setFilteredCount] = useState(0);

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

  useEffect(() => {
    if (!showFiltersModal) return;

    let url = `/api/odalar?checkIn=${checkIn || ""}&checkOut=${checkOut || ""}&kisiSayisi=${guestCount}&city=${city}`;
    if (beds) url += `&beds=${beds}`;
    if (bathrooms) url += `&bathrooms=${bathrooms}`;
    if (petFriendly) url += `&petFriendly=true`;
    if (kitchen) url += `&kitchen=true`;
    if (parking) url += `&parking=true`;
    if (wifi) url += `&wifi=true`;
    if (ac) url += `&ac=true`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setFilteredCount(data.rooms?.length || 0);
      })
      .catch(() => {});
  }, [showFiltersModal, beds, bathrooms, petFriendly, kitchen, parking, wifi, ac, minPrice, maxPrice, city, checkIn, checkOut, guestCount]);

  async function searchRooms() {
    setError("");
    if (!checkIn || !checkOut) {
      setError(lang === "tr" ? "Lütfen giriş ve çıkış tarihi seçin" : "Please select check-in and check-out dates");
      return;
    }
    setLoading(true);
    let url = `/api/odalar?checkIn=${checkIn}&checkOut=${checkOut}&kisiSayisi=${guestCount}&city=${city}`;
    if (beds) url += `&beds=${beds}`;
    if (bathrooms) url += `&bathrooms=${bathrooms}`;
    if (petFriendly) url += `&petFriendly=true`;
    if (kitchen) url += `&kitchen=true`;
    if (parking) url += `&parking=true`;
    if (wifi) url += `&wifi=true`;
    if (ac) url += `&ac=true`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;

    const res = await fetch(url);
    const data = await res.json();
    setRooms(data.rooms || []);
    setLoading(false);
    setStep("form");
  }

  function applyFilters() {
    setShowFiltersModal(false);
    searchRooms();
  }

  function clearAllFilters() {
    setBeds("");
    setBathrooms("");
    setPetFriendly(false);
    setKitchen(false);
    setParking(false);
    setWifi(false);
    setAc(false);
    setMinPrice("");
    maxPrice !== "" && setMaxPrice("");
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

      <div className="grid gap-4 sm:grid-cols-6 mb-8">
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

        {/* Airbnb style Filters Trigger Button */}
        <div className="flex flex-col text-sm">
          <span>&nbsp;</span>
          <button 
            type="button" 
            onClick={() => setShowFiltersModal(true)} 
            className="mt-1 rounded-lg border border-neutral-300 bg-white text-neutral-700 px-3 h-[42px] font-medium hover:border-neutral-500 flex items-center justify-center gap-1.5 cursor-pointer select-none"
          >
            <span>🎛️</span>
            <span>{lang === "tr" ? "Filtreler" : "Filters"}</span>
            {(beds !== "" || bathrooms !== "" || petFriendly || kitchen || parking || wifi || ac || minPrice !== "" || maxPrice !== "") && (
              <span className="flex items-center justify-center w-5 h-5 text-[10px] bg-teal-600 text-white rounded-full font-bold">
                {[beds !== "", bathrooms !== "", petFriendly, kitchen, parking, wifi, ac, minPrice !== "", maxPrice !== ""].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        <button onClick={searchRooms} disabled={loading} className="self-end rounded-lg bg-teal-600 text-white px-4 py-2 font-medium hover:bg-teal-700 h-[42px]">
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

      {/* Airbnb-style Filters Modal popup */}
      {showFiltersModal && (
        <div
          onClick={() => setShowFiltersModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
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
              borderRadius: "16px",
              maxWidth: 580,
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
              animation: "fadeInUp 0.25s ease",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid #EAEAEA" }}>
              <button onClick={() => setShowFiltersModal(false)} style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#222" }}>✕</button>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "#222" }}>{lang === "tr" ? "Filtreler" : "Filters"}</span>
              <div style={{ width: 24 }} /> {/* balancer */}
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
              
              {/* Size Özel Öneriler (Features) */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#222", marginBottom: "1rem" }}>
                  {lang === "tr" ? "Size özel öneriler" : "Suggestions for you"}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.875rem" }}>
                  {/* Otopark */}
                  <div
                    onClick={() => setParking(!parking)}
                    style={{
                      border: parking ? "2px solid #222" : "1px solid #E2E8F0",
                      borderRadius: "12px", padding: "1rem", textAlign: "center", cursor: "pointer",
                      background: parking ? "#F7F7F7" : "white", transition: "all 0.2s"
                    }}
                  >
                    <div style={{ color: parking ? "#14b8a6" : "#4B5563", marginBottom: "0.5rem", display: "flex", justifyContent: "center" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" /></svg>
                    </div>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#222" }}>{lang === "tr" ? "Ücretsiz otopark" : "Free parking"}</span>
                  </div>

                  {/* Mutfak */}
                  <div
                    onClick={() => setKitchen(!kitchen)}
                    style={{
                      border: kitchen ? "2px solid #222" : "1px solid #E2E8F0",
                      borderRadius: "12px", padding: "1rem", textAlign: "center", cursor: "pointer",
                      background: kitchen ? "#F7F7F7" : "white", transition: "all 0.2s"
                    }}
                  >
                    <div style={{ color: kitchen ? "#14b8a6" : "#4B5563", marginBottom: "0.5rem", display: "flex", justifyContent: "center" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" /></svg>
                    </div>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#222" }}>{lang === "tr" ? "Mutfak" : "Kitchen"}</span>
                  </div>

                  {/* Evcil Hayvan */}
                  <div
                    onClick={() => setPetFriendly(!petFriendly)}
                    style={{
                      border: petFriendly ? "2px solid #222" : "1px solid #E2E8F0",
                      borderRadius: "12px", padding: "1rem", textAlign: "center", cursor: "pointer",
                      background: petFriendly ? "#F7F7F7" : "white", transition: "all 0.2s"
                    }}
                  >
                    <div style={{ color: petFriendly ? "#14b8a6" : "#4B5563", marginBottom: "0.5rem", display: "flex", justifyContent: "center" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="14" r="4" /><circle cx="6.5" cy="8.5" r="2.5" /><circle cx="9.5" cy="4.5" r="2.5" /><circle cx="14.5" cy="4.5" r="2.5" /><circle cx="17.5" cy="8.5" r="2.5" /></svg>
                    </div>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#222" }}>{lang === "tr" ? "Evcil hayvan" : "Pet-friendly"}</span>
                  </div>

                  {/* Wifi */}
                  <div
                    onClick={() => setWifi(!wifi)}
                    style={{
                      border: wifi ? "2px solid #222" : "1px solid #E2E8F0",
                      borderRadius: "12px", padding: "1rem", textAlign: "center", cursor: "pointer",
                      background: wifi ? "#F7F7F7" : "white", transition: "all 0.2s"
                    }}
                  >
                    <div style={{ color: wifi ? "#14b8a6" : "#4B5563", marginBottom: "0.5rem", display: "flex", justifyContent: "center" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.1a6 6 0 0 1 6.94 0M12 20h.01" /></svg>
                    </div>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#222" }}>{lang === "tr" ? "Kablosuz Wifi" : "Wireless Wifi"}</span>
                  </div>

                  {/* Klima */}
                  <div
                    onClick={() => setAc(!ac)}
                    style={{
                      border: ac ? "2px solid #222" : "1px solid #E2E8F0",
                      borderRadius: "12px", padding: "1rem", textAlign: "center", cursor: "pointer",
                      background: ac ? "#F7F7F7" : "white", transition: "all 0.2s"
                    }}
                  >
                    <div style={{ color: ac ? "#14b8a6" : "#4B5563", marginBottom: "0.5rem", display: "flex", justifyContent: "center" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20M12 12l8-8M12 12l-8 8M12 12l8 8M12 12l-8-8" /></svg>
                    </div>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#222" }}>{lang === "tr" ? "Klima (AC)" : "Air Conditioning"}</span>
                  </div>
                </div>
              </div>

              {/* Yatak & Oda Özellikleri (Beds & Baths) */}
              <div style={{ marginBottom: "2rem", borderTop: "1px solid #EAEAEA", paddingTop: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#222", marginBottom: "1rem" }}>
                  {lang === "tr" ? "Yataklar ve banyolar" : "Beds and bathrooms"}
                </h3>
                
                {/* Yataklar */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "0.88rem", color: "#4B5563", display: "block", marginBottom: "0.5rem" }}>{lang === "tr" ? "Yatak Odaları" : "Bedrooms"}</span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {([
                      { val: "", label: lang === "tr" ? "Tümü" : "Any" },
                      { val: 1, label: "1+" },
                      { val: 2, label: "2+" },
                      { val: 3, label: "3+" }
                    ] as { val: number | ""; label: string }[]).map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setBeds(item.val)}
                        style={{
                          flex: 1, padding: "0.6rem", borderRadius: "100px", border: beds === item.val ? "2px solid #222" : "1px solid #E2E8F0",
                          background: beds === item.val ? "#222" : "white", color: beds === item.val ? "white" : "#222",
                          fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banyolar */}
                <div>
                  <span style={{ fontSize: "0.88rem", color: "#4B5563", display: "block", marginBottom: "0.5rem" }}>{lang === "tr" ? "Banyolar" : "Bathrooms"}</span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {([
                      { val: "", label: lang === "tr" ? "Tümü" : "Any" },
                      { val: 1, label: "1+" },
                      { val: 2, label: "2+" }
                    ] as { val: number | ""; label: string }[]).map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setBathrooms(item.val)}
                        style={{
                          flex: 1, padding: "0.6rem", borderRadius: "100px", border: bathrooms === item.val ? "2px solid #222" : "1px solid #E2E8F0",
                          background: bathrooms === item.val ? "#222" : "white", color: bathrooms === item.val ? "white" : "#222",
                          fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fiyat Aralığı (Price Range) */}
              <div style={{ borderTop: "1px solid #EAEAEA", paddingTop: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#222", marginBottom: "0.25rem" }}>
                  {lang === "tr" ? "Fiyat aralığı" : "Price range"}
                </h3>
                <p style={{ fontSize: "0.78rem", color: "#718096", marginBottom: "1.25rem" }}>
                  {lang === "tr" ? "Tüm ücretler dahil seyahat fiyatı" : "Price inclusive of all fees"}
                </p>

                {/* Histogram */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "50px", marginBottom: "1rem", padding: "0 10px" }}>
                  {[20, 25, 15, 30, 40, 55, 70, 85, 90, 80, 75, 60, 50, 45, 60, 70, 80, 95, 85, 60, 40, 30, 20, 15, 10].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, background: "rgba(20,184,166,0.35)", borderRadius: "2px" }} />
                  ))}
                </div>

                {/* Price Inputs */}
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.88rem", color: "#718096" }}>₺</span>
                    <input
                      type="number"
                      placeholder={lang === "tr" ? "En az" : "Min"}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                      style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "0.6rem 0.6rem 0.6rem 1.75rem", fontSize: "0.85rem", color: "#222" }}
                    />
                  </div>
                  <span style={{ color: "#718096" }}>—</span>
                  <div style={{ flex: 1, position: "relative" }}>
                    <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.88rem", color: "#718096" }}>₺</span>
                    <input
                      type="number"
                      placeholder={lang === "tr" ? "En çok" : "Max"}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                      style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "0.6rem 0.6rem 0.6rem 1.75rem", fontSize: "0.85rem", color: "#222" }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderTop: "1px solid #EAEAEA" }}>
              <button
                type="button"
                onClick={clearAllFilters}
                style={{ background: "none", border: "none", textDecoration: "underline", color: "#222", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer" }}
              >
                {lang === "tr" ? "Tümünü temizle" : "Clear all"}
              </button>
              <button
                type="button"
                onClick={applyFilters}
                style={{
                  background: "#222", color: "white", border: "none", borderRadius: "8px", padding: "0.75rem 1.5rem",
                  fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#000"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#222"}
              >
                {lang === "tr" ? `${filteredCount} yeri göster` : `Show ${filteredCount} places`}
              </button>
            </div>
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