# 🏨 Kuzey Feneri Butik Otel — Sinop Gerze Rezervasyon Sistemi

> **Canlı Site:** [https://hotel-reservation-system-et6g.vercel.app](https://hotel-reservation-system-et6g.vercel.app)

---

## 📌 Proje Hakkında

**Kuzey Feneri Butik Otel**, Sinop Gerze kıyısında Karadeniz manzaralı bir butik otel için geliştirilmiş tam kapsamlı bir rezervasyon ve yönetim sistemidir. Müşteri tarafı (misafir arayüzü) ve yönetici paneli olmak üzere iki ana bölümden oluşur.

---

## 🚀 Teknolojiler

| Teknoloji | Kullanım Amacı |
|-----------|---------------|
| **Next.js 16** | Full-stack web framework (App Router) |
| **TypeScript** | Tip güvenliği |
| **Tailwind CSS v4** | Stil & tasarım |
| **Prisma ORM** | Veritabanı yönetimi |
| **PostgreSQL** | Veritabanı (Vercel Postgres) |
| **Vercel Blob** | Fotoğraf yükleme & depolama |
| **bcryptjs** | Şifre güvenliği |
| **jose** | JWT ile oturum yönetimi |
| **Vercel** | Hosting & deployment |

---

## ✨ Özellikler

### 🌐 Misafir (Müşteri) Tarafı
- **Ana Sayfa** — Hero bölümü, arama formu, öne çıkan odalar, galeri, yorumlar, istatistikler
- **Odalarımız** — Tüm odaların listelendiği sayfa (kategori, fiyat, fotoğraf)
- **Oda Detay** — Tek oda sayfası, fotoğraf galerisi, özellikler, rezervasyon butonu
- **Kategoriler** — Oda kategorilerine göre filtreleme
- **Müsaitlik** — Tarih bazlı müsait oda sorgulama
- **Tatil Paketleri** — Özel kampanya ve paketler
- **Rezervasyon** — Online rezervasyon formu
- **İletişim** — İletişim formu

### 🔐 Admin Paneli (`/admin`)
- Giriş sistemi (JWT token, bcrypt şifre)
- **Oda yönetimi** — Oda ekleme, düzenleme, silme, fotoğraf yükleme
- **Rezervasyon yönetimi** — Rezervasyonları listeleme, onaylama, iptal
- **Kategori yönetimi** — Oda kategorisi oluşturma
- **Testimonial yönetimi** — Misafir yorumları ekleme/düzenleme
- **Mesaj yönetimi** — İletişim formundan gelen mesajları görüntüleme

---

## 🎨 Tasarım

- **Renk Paleti:** Derin Lacivert (`#0D1B2A`) + Altın (`#C9A96E`) + Krem (`#FAF8F4`)
- **Fontlar:** Playfair Display (başlıklar) + Inter (metin)
- **Tema:** Karadeniz / Sinop Gerze'ye özgü — fener, deniz, doğa
- **Efektler:** Scroll'da şeffaflaşan navbar, hover animasyonları, fade-in-up geçişler, galeri overlay
- **Görseller:** AI ile üretilmiş lobi, havuz, restoran, spa, oda fotoğrafları

---

## 📂 Proje Yapısı

```
my-next-app/
├── app/
│   ├── page.tsx              # Ana sayfa
│   ├── layout.tsx            # Root layout (Navbar + Footer)
│   ├── globals.css           # Global stiller & tasarım sistemi
│   ├── odalarimiz/           # Oda listeleme & detay sayfaları
│   ├── rezervasyon/          # Rezervasyon formu
│   ├── kategoriler/          # Kategori sayfası
│   ├── musaitlik/            # Müsaitlik sorgulama
│   ├── tatil/                # Tatil paketleri
│   ├── iletisim/             # İletişim formu
│   ├── admin/                # Admin paneli (korumalı)
│   └── api/                  # REST API rotaları
├── components/
│   ├── Navbar.tsx            # Navigasyon (scroll efekti, mobil menü)
│   └── Footer.tsx            # Footer (4 kolon, sosyal medya)
├── lib/
│   └── prisma.ts             # Prisma client
├── prisma/
│   └── schema.prisma         # Veritabanı şeması
└── public/                   # Statik görseller (galeri fotoğrafları)
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

# 4. Veritabanını migrate et
npx prisma migrate dev

# 5. Geliştirme sunucusunu başlat
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
DATABASE_URL=           # PostgreSQL bağlantı URL'si
BLOB_READ_WRITE_TOKEN=  # Vercel Blob token
JWT_SECRET=             # JWT imzalama anahtarı
ADMIN_PASSWORD_HASH=    # bcrypt ile hashlenmiş admin şifresi
```

---

## 📸 Ekran Görüntüleri

| Bölüm | Açıklama |
|-------|----------|
| Hero | Full-screen otel görseli, arama formu |
| Odalar | Kategori, fiyat, fotoğraf kartları |
| Galeri | Lobi, havuz, restoran, spa, oda |
| Admin | JWT korumalı yönetim paneli |

---

## 👤 Geliştirici

**Mahir** — [GitHub](https://github.com/mahirr-Art)

---

*Kuzey Feneri Butik Otel — Sinop Gerze kıyısında Karadeniz'in büyüsü* 🌊
