import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Database temizleniyor...");
  await prisma.reservation.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.admin.deleteMany({});

  const passwordHash = await bcrypt.hash("Admin123!", 10);
  await prisma.admin.create({
    data: { email: "admin@otel.com", passwordHash }
  });
  console.log("Admin oluşturuldu: admin@otel.com / Admin123!");

  const standart = await prisma.category.create({
    data: {
      id: "standart-cat",
      name: "Standard",
      description: "Karadeniz manzaralı, modern olanaklarla donatılmış konforlu ve ekonomik odalar."
    }
  });

  const deluxe = await prisma.category.create({
    data: {
      id: "deluxe-cat",
      name: "Deluxe",
      description: "Geniş balkonlu, tam deniz manzaralı ve lüks ayrıcalıklara sahip premium odalar."
    }
  });

  const suite = await prisma.category.create({
    data: {
      id: "suite-cat",
      name: "Suite",
      description: "Karadeniz'in büyülü ufkuna bakan, jakuzili, geniş oturma alanlı lüks süit deneyimi."
    }
  });

  console.log("Kategoriler oluşturuldu.");

  const roomsData = [
    // --- STANDART ODALAR (1-10) ---
    {
      name: "Standard Karadeniz Odası",
      description: "Modern mimari ile dekore edilmiş, iki kişilik konforlu yatak, yüksek hızlı Wi-Fi, klima, minibar ve deniz manzaralı penceresiyle bütçe dostu konfor sunar.",
      price: 1850, capacity: 2, quantity: 5, city: "Sinop Merkez", categoryId: standart.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Deniz Manzarası", "Minibar", "Televizyon", "Kasa"],
      photos: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Standard Bahçe Manzaralı Oda",
      description: "Doğa ile iç içe, otelimizin yemyeşil bahçesine bakan konforlu standart oda. Huzur arayan evcil hayvan sahibi misafirlerimiz için mükemmel bir seçenek.",
      price: 1600, capacity: 2, quantity: 4, city: "Sinop Merkez", categoryId: standart.id,
      beds: 1, bathrooms: 1, petFriendly: true, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Bahçe Manzarası", "Evcil Hayvan Dostu", "Minibar", "Televizyon"],
      photos: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Eco Single Solo Oda",
      description: "Tek başına seyahat eden bütçe odaklı gezginler için tasarlanmış, sade ve şık tek kişilik oda.",
      price: 1200, capacity: 1, quantity: 3, city: "Sinop Merkez", categoryId: standart.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: false, parking: false, wifi: true, ac: false,
      features: ["Ekonomik Oda", "Çalışma Masası", "Gardırop"],
      photos: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Standard Twin İkiz Yataklı Oda",
      description: "İki adet tek kişilik konforlu yatak seçeneği sunan, arkadaş veya iş seyahatleri için ideal standart oda.",
      price: 1750, capacity: 2, quantity: 4, city: "Gerze", categoryId: standart.id,
      beds: 2, bathrooms: 1, petFriendly: false, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["İki Ayrı Yatak", "Çalışma Masası", "Minibar"],
      photos: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Cozy Double Çift Kişilik Oda",
      description: "Sıcak tonlarda dekore edilmiş, samimi ve konforlu bir konaklama sunan çift kişilik standart oda. Evcil hayvan kabul edilmektedir.",
      price: 1650, capacity: 2, quantity: 3, city: "Gerze", categoryId: standart.id,
      beds: 1, bathrooms: 1, petFriendly: true, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Evcil Hayvan Dostu", "Geniş Yatak", "Su Isıtıcı"],
      photos: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Comfort Twin Geniş Oda",
      description: "Standart odalardan daha geniş bir alana sahip, iki ayrı yataklı konforlu konaklama seçeneği.",
      price: 1900, capacity: 2, quantity: 3, city: "Sinop Merkez", categoryId: standart.id,
      beds: 2, bathrooms: 1, petFriendly: false, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Geniş Alan", "Oturma Köşesi", "Çay Kahve Seti"],
      photos: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Seaside Single Deniz Odası",
      description: "Denize sıfır konumda, dalga sesleri eşliğinde uyanabileceğiniz konforlu tek kişilik standart oda.",
      price: 1500, capacity: 1, quantity: 2, city: "Sinop Merkez", categoryId: standart.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: false, parking: false, wifi: true, ac: true,
      features: ["Deniz Manzarası", "Balkon", "Minibar"],
      photos: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Garden Triple Üç Kişilik Oda",
      description: "Bahçeye açılan verandası ve 3 ayrı tek kişilik yatağı ile küçük aileler veya arkadaş grupları için geniş konaklama.",
      price: 2200, capacity: 3, quantity: 2, city: "Gerze", categoryId: standart.id,
      beds: 3, bathrooms: 1, petFriendly: true, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Bahçe Girişli", "Evcil Hayvan Dostu", "3 Yatak", "Veranda"],
      photos: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Quiet Backroom Sessiz Arka Oda",
      description: "Gürültüden uzak, tam sessizlik ve dinlenme arayanlar için özel olarak tasarlanmış arka cephe oda.",
      price: 1300, capacity: 2, quantity: 3, city: "Sinop Merkez", categoryId: standart.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: false, parking: true, wifi: true, ac: false,
      features: ["Sessiz Oda", "Kasa", "Çalışma Masası"],
      photos: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Standard Attic Çatı Katı Odası",
      description: "Tavan pencerelerinden gökyüzünü izleyebileceğiniz, şirin ve romantik çatı katı odası.",
      price: 1450, capacity: 2, quantity: 2, city: "Sinop Merkez", categoryId: standart.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Gökyüzü Penceresi", "Romantik Atmosfer", "Minibar"],
      photos: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=cover&w=800&q=80"]
    },

    // --- DELUXE ODALAR (11-20) ---
    {
      name: "Deluxe Balkonlu King Oda",
      description: "Geniş özel balkonuyla Karadeniz'in serin esintisini odanıza taşır. Lüks king yatak, LCD TV, espresso makinesi ve özel çalışma alanı sunar.",
      price: 2950, capacity: 3, quantity: 3, city: "Gerze", categoryId: deluxe.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Balkon", "Deniz Manzarası", "Espresso Makinesi", "Yağmur Duşu"],
      photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Deluxe Teraslı Queen Oda",
      description: "Kendinize ait geniş teras alanında gün batımını izleyebileceğiniz premium oda. Modern şömine detayı, akıllı TV sistemi ve küçük bir mutfak tezgahı bulunmaktadır.",
      price: 3200, capacity: 2, quantity: 2, city: "Gerze", categoryId: deluxe.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: true, parking: true, wifi: true, ac: true,
      features: ["Özel Teras", "Mutfak Tezgahı", "Şömine", "Akıllı TV"],
      photos: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Deluxe Corner Jakuzili Oda",
      description: "Köşe konumda yer alan, banyosunda muhteşem deniz manzaralı jakuzi bulunan lüks deluxe oda.",
      price: 3500, capacity: 2, quantity: 2, city: "Sinop Merkez", categoryId: deluxe.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Oda İçi Jakuzi", "Köşe Oda", "Deniz Manzarası", "Balkon"],
      photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Deluxe Panorama Deniz Odası",
      description: "Yerden tavana cam tasarımıyla panoramik Karadeniz manzarası sunan, uykudan manzaraya uyanacağınız lüks oda.",
      price: 3300, capacity: 2, quantity: 3, city: "Sinop Merkez", categoryId: deluxe.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Panoramik Cam", "Tam Deniz Manzarası", "Espresso Makinesi"],
      photos: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Deluxe Family Studio Aile Odası",
      description: "Geniş aileler için tasarlanmış, içerisinde tam donanımlı mutfak alanı bulunan evcil hayvan dostu lüks stüdyo daire konseptli oda.",
      price: 3800, capacity: 4, quantity: 2, city: "Gerze", categoryId: deluxe.id,
      beds: 2, bathrooms: 1, petFriendly: true, kitchen: true, parking: true, wifi: true, ac: true,
      features: ["Tam Donanımlı Mutfak", "Evcil Hayvan Dostu", "Aile Odası", "Geniş Balkon"],
      photos: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Executive Business Suit Oda",
      description: "İş seyahatlerinizde yüksek konfor ve verimlilik için tasarlanmış, toplantı masası ve çalışma ünitesi içeren lüks oda.",
      price: 3100, capacity: 2, quantity: 2, city: "Sinop Merkez", categoryId: deluxe.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Çalışma Ünitesi", "Yazıcı & Ofis Araçları", "Espresso Makinesi"],
      photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Deluxe Garden Terrace Bahçe Odası",
      description: "Doğrudan otelin şık iç bahçesine açılan veranda alanı ve özel şezlongları ile doğayı sevenler için evcil hayvan kabul eden oda.",
      price: 2900, capacity: 2, quantity: 3, city: "Gerze", categoryId: deluxe.id,
      beds: 1, bathrooms: 1, petFriendly: true, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Özel Bahçe Verandası", "Şezlong", "Evcil Hayvan Dostu", "Çay Saati İkramı"],
      photos: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Premium Loft Çatı Dubleksi",
      description: "İki katlı tasarımı, üst katında yatak odası ve alt katında mutfaklı yaşam alanı bulunan 2 banyolu premium dubleks çatı odası.",
      price: 4200, capacity: 3, quantity: 2, city: "Sinop Merkez", categoryId: deluxe.id,
      beds: 2, bathrooms: 2, petFriendly: false, kitchen: true, parking: true, wifi: true, ac: true,
      features: ["Dubleks Tasarım", "2 Adet Banyo", "Mutfak", "Şömine"],
      photos: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Deluxe Double Balcony Çift Balkonlu",
      description: "Hem deniz hem de doğa manzaralı iki ayrı balkonu ile günün her saati esintinin tadını çıkarabileceğiniz lüks oda.",
      price: 3050, capacity: 2, quantity: 2, city: "Gerze", categoryId: deluxe.id,
      beds: 2, bathrooms: 1, petFriendly: false, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Çift Balkon", "Çift Manzara", "Minibar", "Yağmur Duşu"],
      photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Romantic Honeymoon Balayı Odası",
      description: "Yeni evli çiftler için özel cibinlikli yatak, oda içi bağımsız küvet, şampanya ikramı ve deniz manzaralı balkon içeren balayı odası.",
      price: 3600, capacity: 2, quantity: 2, city: "Sinop Merkez", categoryId: deluxe.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Oda İçi Bağımsız Küvet", "Cibinlikli Yatak", "Balayı İkramı", "Balkon"],
      photos: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=cover&w=800&q=80"]
    },

    // --- SUITE ODALAR (21-30) ---
    {
      name: "Kuzey Feneri Jakuzili Süit",
      description: "Tam boy panoramik pencereleriyle 180 derece Karadeniz manzaralı bu özel süit; oda içi jakuzi, şömineli geniş oturma alanı, mutfak alanı ve VIP karşılama sunar.",
      price: 4800, capacity: 2, quantity: 2, city: "Gerze", categoryId: suite.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: true, parking: true, wifi: true, ac: true,
      features: ["VIP Karşılama", "Jakuzi", "Şömine", "Mutfak", "Akıllı Otomasyon"],
      photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Deniz Feneri Şömineli Aile Süiti",
      description: "Geniş aileler için tasarlanmış, iki ayrı yatak odası ve şömineli ortak oturma odasına sahip lüks süit. 2 adet banyo, tam donanımlı mutfak ve geniş deniz manzaralı balkon mevcuttur. Evcil hayvan kabul edilir.",
      price: 6000, capacity: 4, quantity: 2, city: "Gerze", categoryId: suite.id,
      beds: 2, bathrooms: 2, petFriendly: true, kitchen: true, parking: true, wifi: true, ac: true,
      features: ["2 Yatak Odası", "2 Banyo", "Evcil Hayvan Dostu", "Mutfak", "Şömine"],
      photos: ["https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Presidential King Süit",
      description: "Otelimizin en üst katında yer alan, ultra lüks mobilyalar, giyinme odası, mutfak, 2 banyo, bar alanı ve eşsiz Karadeniz manzaralı 50m² özel teras içeren kral dairesi.",
      price: 8500, capacity: 4, quantity: 1, city: "Sinop Merkez", categoryId: suite.id,
      beds: 2, bathrooms: 2, petFriendly: false, kitchen: true, parking: true, wifi: true, ac: true,
      features: ["Kral Dairesi", "50m² Teras", "Bar Bölümü", "Mutfak", "Giyinme Odası"],
      photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Royal Garden Villa Süiti",
      description: "Ana binadan bağımsız, özel bahçeli, havuzlu ve 3 yatak odalı lüks villa süiti. Geniş aileler ve arkadaş grupları için evcil hayvan dostu lüks konaklama.",
      price: 7800, capacity: 6, quantity: 1, city: "Gerze", categoryId: suite.id,
      beds: 3, bathrooms: 2, petFriendly: true, kitchen: true, parking: true, wifi: true, ac: true,
      features: ["Müstakil Villa", "Özel Bahçe & Havuz", "3 Yatak Odası", "Mutfak", "Evcil Hayvan Dostu"],
      photos: ["https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Grand Duplex Teras Süiti",
      description: "Muhteşem dubleks tasarımı, her iki katından da kesintisiz deniz manzarası ve üst katında yer alan açık hava jakuzili lüks terası ile unutulmaz bir süit deneyimi.",
      price: 5500, capacity: 3, quantity: 2, city: "Gerze", categoryId: suite.id,
      beds: 2, bathrooms: 2, petFriendly: false, kitchen: true, parking: true, wifi: true, ac: true,
      features: ["Dubleks Süit", "Açık Hava Jakuzisi", "Teras", "Mutfak"],
      photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Marine Executive VIP Süit",
      description: "Denizcilik temasıyla dekore edilmiş, yüksek düzeyde konfor, VIP transfer hizmeti ve 24 saat uşak servisi sunan prestijli süit.",
      price: 5200, capacity: 2, quantity: 2, city: "Sinop Merkez", categoryId: suite.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Uşak Servisi", "VIP Transfer", "Marine Tema", "Jakuzi"],
      photos: ["https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Sunset Terrace Özel Havuzlu Süit",
      description: "Geniş terasında gün batımına karşı konumlanmış özel sonsuzluk havuzuna sahip, mutfaklı ve ultra lüks süit.",
      price: 7200, capacity: 2, quantity: 1, city: "Gerze", categoryId: suite.id,
      beds: 2, bathrooms: 2, petFriendly: false, kitchen: true, parking: true, wifi: true, ac: true,
      features: ["Özel Havuz", "Sonsuzluk Havuzu", "Mutfak", "Şömine", "VIP Setup"],
      photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Lighthouse Signature Süit",
      description: "Kuzey Feneri'nin imza süiti. Dairesel tasarımı, oda merkezinde konumlanan jakuzi küveti ve 2 banyosu ile lüksün zirvesi.",
      price: 5800, capacity: 2, quantity: 2, city: "Gerze", categoryId: suite.id,
      beds: 1, bathrooms: 2, petFriendly: false, kitchen: true, parking: true, wifi: true, ac: true,
      features: ["İmza Süiti", "Merkez Jakuzi", "2 Banyo", "Premium Buklet", "Mutfak"],
      photos: ["https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Penthouse Deniz Manzaralı Süit",
      description: "Otelimizin çatı katındaki bu lüks daire, evcil hayvan dostu özellikleri, geniş salonu, barbekülü terası ve tam donanımlı mutfağı ile ev konforunda süit deneyimi.",
      price: 6800, capacity: 4, quantity: 1, city: "Sinop Merkez", categoryId: suite.id,
      beds: 2, bathrooms: 2, petFriendly: true, kitchen: true, parking: true, wifi: true, ac: true,
      features: ["Penthouse", "Barbekü Terası", "Evcil Hayvan Dostu", "Mutfak", "2 Banyo"],
      photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=cover&w=800&q=80"]
    },
    {
      name: "Premium Spa & Wellness Süiti",
      description: "Kendi içerisinde özel hamam kubbesi, sauna odası ve masaj masası barındıran, tam bir dinlenme ve arınma vadeden lüks spa süiti.",
      price: 6400, capacity: 2, quantity: 2, city: "Sinop Merkez", categoryId: suite.id,
      beds: 1, bathrooms: 1, petFriendly: false, kitchen: false, parking: true, wifi: true, ac: true,
      features: ["Oda İçi Hamam & Sauna", "Masaj Masası", "Jakuzi", "Premium Bitki Çayı Seti"],
      photos: ["https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=cover&w=800&q=80"]
    }
  ];

  console.log("30 adet detaylı oda oluşturuluyor...");
  for (const r of roomsData) {
    await prisma.room.create({
      data: r
    });
  }

  console.log("Odalar başarıyla oluşturuldu.");
  console.log("Seed başarıyla tamamlandı!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });