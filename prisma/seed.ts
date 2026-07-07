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

  await prisma.room.create({
    data: {
      name: "Standard Karadeniz Odası",
      description: "Modern mimari ile dekore edilmiş, iki kişilik konforlu yatak, yüksek hızlı Wi-Fi, klima, minibar ve deniz manzaralı penceresiyle bütçe dostu konfor sunar.",
      price: 1850,
      capacity: 2,
      quantity: 5,
      city: "Sinop Merkez",
      photos: [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=cover&w=1200&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=cover&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=cover&w=1200&q=80"
      ],
      categoryId: standart.id
    }
  });

  await prisma.room.create({
    data: {
      name: "Standard Bahçe Manzaralı Oda",
      description: "Doğa ile iç içe, otelimizin yemyeşil bahçesine bakan konforlu standart oda. Huzur arayan misafirlerimiz için mükemmel bir seçenek.",
      price: 1600,
      capacity: 2,
      quantity: 4,
      city: "Sinop Merkez",
      photos: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=cover&w=1200&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=cover&w=1200&q=80"
      ],
      categoryId: standart.id
    }
  });

  await prisma.room.create({
    data: {
      name: "Deluxe Balkonlu King Oda",
      description: "Geniş özel balkonuyla Karadeniz'in serin esintisini odanıza taşır. Lüks king yatak, LCD TV, espresso makinesi, yağmur duşlu banyo ve özel çalışma alanı ile donatılmıştır.",
      price: 2950,
      capacity: 3,
      quantity: 3,
      city: "Gerze",
      photos: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=cover&w=1200&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=cover&w=1200&q=80",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=cover&w=1200&q=80"
      ],
      categoryId: deluxe.id
    }
  });

  await prisma.room.create({
    data: {
      name: "Deluxe Teraslı Queen Oda",
      description: "Kendinize ait geniş teras alanında gün batımını izleyebileceğiniz premium oda. Modern şömine detayı, akıllı TV sistemi ve lüks buklet seti bulunmaktadır.",
      price: 3200,
      capacity: 2,
      quantity: 2,
      city: "Gerze",
      photos: [
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=cover&w=1200&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=cover&w=1200&q=80"
      ],
      categoryId: deluxe.id
    }
  });

  await prisma.room.create({
    data: {
      name: "Kuzey Feneri Jakuzili Süit",
      description: "Tam boy panoramik pencereleriyle 180 derece Karadeniz manzaralı bu özel süit; oda içi jakuzi, şömineli geniş oturma alanı, VIP karşılama ikramları ve 24 saat özel oda servisi ayrıcalığı sunar.",
      price: 4800,
      capacity: 2,
      quantity: 2,
      city: "Gerze",
      photos: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=cover&w=1200&q=80",
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=cover&w=1200&q=80",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=cover&w=1200&q=80"
      ],
      categoryId: suite.id
    }
  });

  await prisma.room.create({
    data: {
      name: "Deniz Feneri Şömineli Aile Süiti",
      description: "Geniş aileler için tasarlanmış, iki ayrı yatak odası ve şömineli ortak oturma odasına sahip lüks süit. 2 adet banyo, tam donanımlı minibar ve geniş deniz manzaralı balkon mevcuttur.",
      price: 6000,
      capacity: 4,
      quantity: 2,
      city: "Gerze",
      photos: [
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=cover&w=1200&q=80",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=cover&w=1200&q=80"
      ],
      categoryId: suite.id
    }
  });

  console.log("Odalar çoklu fotoğraflarla oluşturuldu.");
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