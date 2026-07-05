import { prisma } from "./lib/prisma";

async function main() {
  const result = await prisma.room.updateMany({
    data: { city: "Sinop Merkez" }
  });
  console.log(`Updated ${result.count} rooms.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
