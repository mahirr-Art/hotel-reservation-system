import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);
  await prisma.admin.upsert({
    where: { email: "admin@otel.com" },
    update: {},
    create: { email: "admin@otel.com", passwordHash }
  });

  const standart = await prisma.category.upsert({
    where: { id: "standart-cat" },
    update: {},
    create: { id: "standart-cat", name: "Standart", description: "Konforlu ve ekonomik odalar" }
  });

  const deluxe = await prisma.category.upsert({
    where: { id: "deluxe-cat" },
    update: {},
    create: { id: "deluxe-cat", name: "Deluxe", description: "Geniş ve manzaralı odalar" }
  });

  await prisma.room.createMany({
    data: [
      {
        name: "Standart Oda",
        description: "2 kişilik, şehir manzaralı",
        price: 1200,
        capacity: 2,
        categoryId: standart.id
      },
      {
        name: "Deluxe Deniz Manzaralı",
        description: "3 kişilik, deniz manzaralı balkonlu",
        price: 2400,
        capacity: 3,
        categoryId: deluxe.id
      }
    ]
  });

  console.log("Seed tamamlandı. Admin girişi: admin@otel.com / Admin123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });