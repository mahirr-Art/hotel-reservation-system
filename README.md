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
| **Vercel** | Hosting & deployment |

---

## ✨ Özellikler

### 🌐 Misafir (Müşteri) Tarafı

- **Ana Sayfa**
  - Hero bölümü (tam ekran otel görseli + animasyonlu yazılar)
  - Akıllı rezervasyon arama formu (şehir, giriş/çıkış tarihi, kişi sayısı)
  - 🏊 **Tıklanabilir Ayrıcalık Kartları** — Havuz, Spa, Restoran, Konsiyerj, Fitness, Panoramik Manzara — her biri tıklandığında blur modal ile detay gösterir
  - Öne çıkan odalar (son 3 oda)
  - 🎫 **Erken Rezervasyon Bölümü** — %20 indirim, ücretsiz spa, transfer ve daha fazla avantaj kartı
  - İstatistik bölümü (500+ misafir, 50+ oda, 15 yıl deneyim, 4.9 puan)
  - Fotoğraf galerisi (hover overlay efektli)
  - 💬 **Misafir Yorumları** — Yalnızca admin tarafından onaylanmış yorumlar gösterilir
  - Yorum bırakma formu (yıldız puanı + metin)
  - Call-to-action bölümü

- **Odalarımız** — Tüm odaların listelendiği sayfa (kategori, fiyat, fotoğraf)
- **Oda Detay** — Tek oda sayfası, fotoğraf galerisi, özellikler, rezervasyon butonu
- **Kategoriler** — Oda kategorilerine göre filtreleme
- **Müsaitlik Takvimi** — Odaların boş/dolu durumlarını gösteren görsel takvim
- **Kullanıcı Paneli (`/kullanici`)** — Misafirlerin e-posta ile geçmiş rezervasyonlarını sorgulayabildiği sayfa
- **Tatil Paketleri** — Özel kampanya ve paketler
- **Rezervasyon** — Online rezervasyon formu
- **İletişim** — İletişim formu

---

### 🔐 Admin Paneli (`/admin`)

- JWT + bcrypt ile güvenli giriş sistemi
- **Genel Bakış** — Oda sayısı, bekleyen rezervasyon, okunmamış mesaj istatistikleri
- **Oda Yönetimi** — Oda ekleme, düzenleme, silme, fotoğraf yükleme
- **Takvim** — Tüm odaların doluluk durumunu gösteren görsel takvim panosu
- **Rezervasyon Yönetimi** — Listeleme, onaylama, iptal etme
- **💬 Yorum Yönetimi** — Beklemede / Onaylı olarak iki bölümde görüntüleme, **onaylama**, **yanıtlama** ve silme
- **Mesaj Yönetimi** — İletişim formundan gelen mesajları görüntüleme
- **💳 Ödeme Yöntemleri** — Kredi/Banka Kartı, Havale/EFT, Kapıda Ödeme, Online Transfer; IBAN bilgileri

---

## 💬 Yorum Onay Mekanizması

Misafirler yorum bıraktığında sistem şu akışı izler:

```
Misafir → Yorum yazar
    ↓
Veritabanına kaydedilir (approved: false)
    ↓
Admin /admin/testimonials sayfasında "Beklemede" olarak görür
    ↓
Admin "✓ Onayla" butonuna tıklar
    ↓
Yorum ana sayfada görünmeye başlar
```

---

## 💳 Desteklenen Ödeme Yöntemleri

| Yöntem | Detay |
|--------|-------|
| Kredi / Banka Kartı | Visa, Mastercard, American Express, Troy |
| Havale / EFT | Garanti, İş, Ziraat, Akbank |
| Kapıda Ödeme | Nakit, POS, Döviz (USD/EUR) |
| Online Transfer | iyzico, PayTR, Stripe (yakında) |

---

## 🎨 Tasarım Sistemi

- **Renk Paleti:** Lacivert `#0D1B2A` + Altın `#C9A96E` + Krem `#FAF8F4`
- **Fontlar:** Playfair Display (başlıklar) + Inter (metin)
- **Tema:** Karadeniz / Sinop Gerze atmosferi
- **Efektler:** Blur modal, scroll efektli navbar, hover animasyonları, fade-in-up geçişler, galeri overlay, card-hover lift

---

## 📂 Proje Yapısı

```
my-next-app/
├── app/
│   ├── page.tsx                      # Ana sayfa (ayrıcalıklar, erken rezervasyon, yorumlar)
│   ├── layout.tsx                    # Root layout (Navbar + Footer)
│   ├── globals.css                   # Global stiller & tasarım sistemi
│   ├── odalarimiz/                   # Oda listeleme & detay sayfaları
│   ├── rezervasyon/                  # Rezervasyon formu
│   ├── kullanici/                    # Misafir profil & rezervasyon sorgulama
│   ├── kategoriler/                  # Kategori sayfası
│   ├── musaitlik/                    # Müsaitlik sorgulama (Görsel Takvim)
│   ├── tatil/                        # Tatil paketleri
│   ├── iletisim/                     # İletişim formu
│   ├── admin/
│   │   ├── page.tsx                  # Genel bakış
│   │   ├── layout.tsx                # Admin yan menü
│   │   ├── takvim/                   # Doluluk takvimi
│   │   ├── odalar/                   # Oda yönetimi
│   │   ├── rezervasyonlar/           # Rezervasyon yönetimi
│   │   ├── mesajlar/                 # Mesaj yönetimi
│   │   ├── testimonials/             # Yorum onay & yönetim
│   │   └── odeme-yontemleri/         # Ödeme yöntemleri sayfası
│   └── api/                          # REST API rotaları
├── components/
│   ├── Navbar.tsx                    # Navigasyon (scroll efekti, mobil menü)
│   ├── Footer.tsx                    # Footer
│   ├── AmenityCard.tsx               # Tıklanabilir ayrıcalık kartı (modal)
│   ├── RoomCalendar.tsx              # Görsel takvim bileşeni
│   ├── TestimonialCard.tsx           # Admin yanıtlı yorum kartı
│   ├── TestimonialForm.tsx           # Ziyaretçi yorum formu
│   └── HomeSearchForm.tsx            # Ana sayfa arama formu
├── lib/
│   └── prisma.ts                     # Prisma client
├── prisma/
│   └── schema.prisma                 # Veritabanı şeması
├── proxy.ts                          # Kimlik doğrulama proxy (Next.js 16)
└── public/                           # Statik görseller
```

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
# .env.local dosyasını doldurun (DATABASE_URL, BLOB_READ_WRITE_TOKEN vb.)

# 4. Veritabanını senkronize et
npx prisma db push

# 5. Prisma client oluştur
npx prisma generate

# 6. Geliştirme sunucusunu başlat
npm run dev
```

Uygulama **http://localhost:3000** adresinde çalışır.

---

## 🌍 Deployment

Proje **Vercel** üzerinde host edilmektedir.

- `main` branch'e yapılan her `git push` otomatik olarak canlıya alınır.
- Ortam değişkenleri Vercel Dashboard'dan yönetilir.

```bash
# Manuel deploy
npx vercel --prod
```

---

## 🔑 Ortam Değişkenleri

```env
DATABASE_URL=           # PostgreSQL bağlantı URL'si (Neon)
BLOB_READ_WRITE_TOKEN=  # Vercel Blob token
JWT_SECRET=             # JWT imzalama anahtarı
ADMIN_PASSWORD_HASH=    # bcrypt ile hashlenmiş admin şifresi
```

---

## 📸 Ekran Görüntüleri

| Bölüm | Açıklama |
|-------|----------|
| Hero | Full-screen otel görseli, akıllı arama formu |
| Ayrıcalıklar | 6 tıklanabilir kart, blur modal ile detay |
| Erken Rezervasyon | Avantaj kartları, fırsat bitiş tarihi |
| Odalar | Kategori, fiyat, fotoğraf kartları |
| Yorumlar | Onaylı yorumlar + yorum bırakma formu |
| Takvim | Aylık görsel doluluk haritası |
| Admin Yorumlar | Onay/red, yanıt yazma, bekleyen rozetler |
| Admin Ödeme | Ödeme yöntemi kartları & IBAN bilgileri |

---

## 🗓️ Sürüm Geçmişi

| Sürüm | Değişiklikler |
|-------|--------------|
| v1.0 | İlk yayın — oda yönetimi, rezervasyon, admin paneli |
| v1.1 | Görsel takvim, misafir profil sayfası, tatil paketleri |
| v1.2 | **Yorum onay mekanizması, erken rezervasyon bölümü, ödeme yöntemleri admin sayfası, tıklanabilir ayrıcalık kartları (modal), proxy.ts (Next.js 16 uyumu)** |

---

## 👤 Geliştirici

**Mahir** — [GitHub](https://github.com/mahirr-Art)

---

*Kuzey Feneri Butik Otel — Sinop Gerze kıyısında Karadeniz'in büyüsü* 🌊
