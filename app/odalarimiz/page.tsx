import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function OdalarimizPage() {
  const rooms = await prisma.room.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2">Odalarımız</h1>
      <p className="text-neutral-600 mb-10">İhtiyacınıza uygun odayı seçin.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Link
            key={room.id}
            href={`/odalarimiz/${room.id}`}
            className="rounded-2xl border p-6 hover:shadow-lg transition-shadow"
          >
            <p className="text-xs uppercase text-neutral-400 mb-1">{room.category.name}</p>
            <h2 className="text-lg font-semibold mb-1">{room.name}</h2>
            <p className="text-sm text-neutral-600 mb-3">Kapasite: {room.capacity} kişi</p>
            <p className="font-medium">{room.price.toString()} ₺ / gece</p>
          </Link>
        ))}
        {rooms.length === 0 && <p className="text-neutral-500">Henüz oda eklenmedi.</p>}
      </div>
    </div>
  );
}