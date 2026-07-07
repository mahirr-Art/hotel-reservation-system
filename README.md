# 🏨 Kuzey Feneri Butik Otel — Sinop Gerze Rezervasyon Sistemi

> **Canlı Site:** [https://hotel-reservation-system-et6g.vercel.app](https://hotel-reservation-system-et6g.vercel.app)  
> **GitHub:** [https://github.com/mahirr-Art/hotel-reservation-system](https://github.com/mahirr-Art/hotel-reservation-system)

---

## 📌 Proje Hakkında

**Kuzey Feneri Butik Otel**, Sinop Gerze kıyısında Karadeniz manzaralı bir butik otel için geliştirilmiş tam kapsamlı bir rezervasyon ve yönetim sistemidir. Misafir arayüzü ve yönetici paneli olmak üzere iki ana bölümden oluşur.

---

## 🚀 Teknolojiler

| Teknoloji | Kullanım Amacı |
|-----------|---------------|
| **Next.js 16** | Full-stack web framework (App Router) |
| **TypeScript** | Tip güvenliği |
| **Tailwind CSS v4** | Stil & tasarım |
| **Prisma ORM** | Veritabanı yönetimi |
| **PostgreSQL (Neon)** | Bulut veritabanı |
| **Vercel Blob** | Fotoğraf yükleme & depolama |
| **bcryptjs** | Şifre güvenliği |
| **jose** | JWT ile oturum yönetimi |
| **Resend** | Şifre sıfırlama e-postaları (Yerel testler için Konsol Log Fallback entegrasyonu) |
| **Vercel** | Hosting & deployment |

---

## ✨ Özellikler

### 🌐 Misafir (Müşteri) Tarafı

- **Ana Sayfa**
  - Hero bölümü (tam ekran otel görseli + animasyonlu yazılar)
  - Akıllı rezervasyon arama formu (şehir, giriş/çıkış tarihi, kişi sayısı) - **Özel date picker tasarımı**
  - 🏊 **Tıklanabilir Ayrıcalık Kartları** — Havuz, Spa, Restoran, Konsiyerj, Fitness, Panoramik Manzara — her biri tıklandığında blur modal ile detay gösterir
  - Öne çıkan odalar (son 3 oda)
  - 🎫 **Erken Rezervasyon Bölümü** — %20 indirim, ücretsiz spa, transfer ve daha fazla avantaj kartı
  - İstatistik bölümü (500+ misafir, 50+ oda, 15 yıl deneyim, 4.9 puan)
  - Fotoğraf galerisi (hover overlay efektli)
  - 💬 **Misafir Yorumları** — Yalnızca admin tarafından onaylanmış yorumlar gösterilir
  - Yorum bırakma formu (yıldız puanı + metin)
  - Call-to-action bölümü
  - **Yeni Mobil Uyumlu Navigasyon ve Responsive Düzen**

- **Odalarımız** — Yenilenmiş görsel kart tasarımları, konum & kapasite etiketleri, hover zoom animasyonları ve tamamen mobil uyumlu grid yapı
- **Oda Detay** — Tek oda sayfası, çoklu fotoğraf galerisi, özellikler, **entegre müsaitlik takvimi** ve sağda konumlandırılmış sticky fiyatlandırma & rezervasyon kartı
- **Kategoriler** — Her kategoriye özel simge, açıklama ve oda sayısıyla yenilenmiş kategori keşfetme sayfası
- **Kullanıcı Paneli (`/kullanici`)** — E-posta ve şifreyle güvenli giriş, geçmiş rezervasyonları detaylı (tarih, süre, durum) listeleme, **Şifremi Unuttum (Resend mail sıfırlama)** arayüzü, **profil bilgileri (ad, telefon) güncelleme ve şifre değiştirme panelleri**.
- **Tatil Paketleri** — Görsel zenginliği artırılmış 4 özel paket kartı (Yaz Erken Rezervasyon, Balayı, Uzun Hafta Sonu, Aile Paketi) ve özel teklif banner'ı
- **Rezervasyon** — Online rezervasyon formu. **Yeni bir e-posta adresiyle rezervasyon yapıldığında sistem otomatik olarak bir kullanıcı hesabı oluşturur.**

---

### 🔐 Admin Paneli (`/admin`)

Sitenin ana arayüzünden bağımsız, profesyonel bir CMS platformu olarak sıfırdan tasarlandı.
- JWT + bcrypt ile güvenli giriş sistemi. `proxy.ts` (Next.js 16) ile route koruması.
- **Genel Bakış (Dashboard)** — Toplam oda, bekleme/onay/yorum durumlarını gösteren sayaçlar, son rezervasyonlar listesi ve **aylara göre Gelir (Çizgi Grafik), Rezervasyon (Sütun Grafik) ile Oda Doluluk Oranlarını (Donut Grafik) gösteren bağımlılıksız SVG grafik kartları**
- **Oda Yönetimi** — İki kolonlu tasarım. Solda oda ekleme/düzenleme formu, **sürükle-bırak (Drag & Drop) çoklu dosya yükleme (Vercel Blob) alanı**, sağda oda listesi.
- **Takvim** — Tüm odaların aylık bazda doluluk yüzdeleri (Occupancy Rate) ve görsel doluluk takvim panosu
- **Rezervasyon Yönetimi** — Bekleyen rezervasyonları inceleme, tek tıkla onaylama veya iptal etme
- **💬 Yorum Yönetimi** — Onay bekleyen ve onaylanan misafir yorumları, **onaylama/kaldırma**, **yönetici yanıtı yazma** ve silme işlemleri
- **Mesaj Yönetimi** — İletişim formundan gelen mesajların detaylı görüntülenmesi ve silinmesi

---

## ⚙️ Kurulum (Yerel Geliştirme)

```bash
# 1. Repoyu klonla
git clone https://github.com/mahirr-Art/hotel-reservation-system.git
cd hotel-reservation-system

# 2. Bağımlılıkları yükle
npm install

# 3. Ortam değişkenlerini ayarla
cp .env.example .env.local
# .env.local dosyasını doldurun (DATABASE_URL, JWT_SECRET, RESEND_API_KEY vb.)

# 4. Veritabanını senkronize et
npx prisma db push

# 5. Prisma client oluştur
npx prisma generate

# 6. Geliştirme sunucusunu başlat
npm run dev
```

Uygulama **http://localhost:3000** adresinde çalışır.

---

## 🔑 Ortam Değişkenleri

```env
DATABASE_URL=           # PostgreSQL bağlantı URL'si (Neon)
BLOB_READ_WRITE_TOKEN=  # Vercel Blob token
JWT_SECRET=             # JWT imzalama anahtarı
ADMIN_PASSWORD_HASH=    # bcrypt ile hashlenmiş admin şifresi
RESEND_API_KEY=         # Resend.com API anahtarı (Yerel geliştirme için dummy bırakılırsa sıfırlama linki terminale yazdırılır)
NEXT_PUBLIC_BASE_URL=   # Şifre sıfırlama maillerinde kullanılacak base URL (Örn: http://localhost:3000 veya https://siteniz.com)
```

---

## 🗓️ Sürüm Geçmişi

| Sürüm | Değişiklikler |
|-------|--------------|
| v1.0 | İlk yayın — oda yönetimi, rezervasyon, admin paneli |
| v1.1 | Görsel takvim, misafir profil sayfası, tatil paketleri |
| v1.2 | Yorum onay mekanizması, erken rezervasyon bölümü, ödeme yöntemleri admin sayfası, tıklanabilir ayrıcalık kartları (modal), proxy.ts (Next.js 16 uyumu) |
| v1.3 | Müsaitlik takvimi oda kapasitesi / adeti (quantity) çakışma bug'ı düzeltildi, takvimde kısmi doluluk (sarı renk) desteği sağlandı, kapasite ve fiyat bilgisi eklendi. |
| v1.4 | **Admin Paneli tamamen bağımsız bir CMS platformuna dönüştürüldü. Kullanıcı arayüzüne e-posta ve şifre tabanlı giriş / şifre sıfırlama (Resend & yerel fallback) eklendi. Rezervasyon esnasında otomatik kullanıcı kaydı entegre edildi. DatePicker tasarımı yenilendi. Odalarımız, kategoriler, iletişim ve tatil paketleri sayfaları premium detaylar ve tam mobil duyarlılıkla yeniden tasarlandı.** |

---

## 👤 Geliştirici

**Mahir** — [GitHub](https://github.com/mahirr-Art)

---

*Kuzey Feneri Butik Otel — Sinop Gerze kıyısında Karadeniz'in büyüsü* 🌊
