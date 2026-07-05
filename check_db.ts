import { prisma } from "./lib/prisma";

async function main() {
  const count = await prisma.room.count();
  console.log("Room count:", count);
  const rooms = await prisma.room.findMany();
  console.log("Rooms:", rooms);
}

main().catch(console.error).finally(() => prisma.$disconnect());
