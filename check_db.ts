import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const count = await prisma.admin.count();
  console.log("Admin count:", count);
  const admins = await prisma.admin.findMany();
  console.log("Admins:", admins);
  if (admins.length > 0) {
    const valid = await bcrypt.compare("Admin123!", admins[0].passwordHash);
    console.log("Password 'Admin123!' is valid:", valid);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
