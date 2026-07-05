"use client";

import { useState } from "react";

type Reservation = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  status: string;
  createdAt: string;
  room: {
    name: string;
    city: string;
    category: {
      name: string;
    };
  };
};

export default function KullaniciPaneliPage() {
  const [email, setEmail] = useState("");
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Lütfen e-posta adresinizi girin.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/kullanici/rezervasyonlar?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Bir hata oluştu.");
        setReservations(null);
      } else {
        setReservations(data.reservations);
      }
    } catch (err) {
      setError("Bağlantı hatası oluştu.");
      setReservations(null);
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'ONAYLANDI':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Onaylandı</span>;
      case 'IPTAL':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">İptal Edildi</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Bekliyor</span>;
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 min-h-[70vh]">
      <h1 className="text-3xl font-semibold mb-2">Kullanıcı Paneli</h1>
      <p className="text-neutral-600 mb-10">E-posta adresinizi girerek rezervasyon geçmişinizi görüntüleyebilirsiniz.</p>

      <form onSubmit={handleSearch} className="flex gap-4 mb-12 max-w-md">
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="E-posta adresiniz" 
          required 
          className="flex-1 rounded-lg border px-4 py-2 outline-none focus:border-teal-600"
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="rounded-lg bg-teal-600 text-white px-6 py-2 font-medium hover:bg-teal-700 disabled:opacity-70 transition-colors"
        >
          {loading ? "Aranıyor..." : "Sorgula"}
        </button>
      </form>

      {error && <p className="text-red-600 mb-6">{error}</p>}

      {reservations && (
        <div>
          <h2 className="text-xl font-medium mb-6">Rezervasyonlarınız ({reservations.length})</h2>
          
          {reservations.length === 0 ? (
            <p className="text-neutral-500 bg-neutral-50 p-6 rounded-xl border border-neutral-100 text-center">
              Bu e-posta adresine ait bir rezervasyon bulunamadı.
            </p>
          ) : (
            <div className="grid gap-6">
              {reservations.map(res => (
                <div key={res.id} className="border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{res.room.name}</h3>
                      {getStatusBadge(res.status)}
                    </div>
                    <p className="text-neutral-600 text-sm mb-4">
                      {res.room.city} • {res.room.category.name}
                    </p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <div>
                        <span className="text-neutral-500 block text-xs">Giriş Tarihi</span>
                        <span className="font-medium">{new Date(res.checkIn).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-xs">Çıkış Tarihi</span>
                        <span className="font-medium">{new Date(res.checkOut).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-xs">Kişi Sayısı</span>
                        <span className="font-medium">{res.guestCount} Kişi</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-xs">Oluşturulma</span>
                        <span className="font-medium text-neutral-600">{new Date(res.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-lg self-start md:self-stretch flex flex-col justify-center min-w-[200px]">
                    <span className="text-neutral-500 block text-xs mb-1">Rezervasyon Bilgileri</span>
                    <p className="font-medium text-sm">{res.fullName}</p>
                    <p className="text-neutral-600 text-sm">{res.phone}</p>
                    <p className="text-xs text-neutral-400 mt-2 font-mono">ID: {res.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
