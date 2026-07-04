import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export default async function MusaitlikPage() {
  const rooms = await prisma.room.findMany({
    include: {
      reservations: { where: { status: { not: "IPTAL" } }, orderBy: { checkIn: "asc" } },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2">Doluluk / Müsaitlik Durumu</h1>
      <p className="text-neutral-600 mb-10">Her oda için dolu tarih aralıkları aşağıda listelenmiştir.</p>

      <div className="space-y-8">
        {rooms.map((room) => (
          <div key={room.id} className="border rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3">{room.name}</h2>
            {room.reservations.length === 0 ? (
              <p className="text-sm text-neutral-500">Bu oda için dolu tarih yok, tamamen müsait.</p>
            ) : (
              <ul className="text-sm text-neutral-600 space-y-1">
                {room.reservations.map((r) => (
                  <li key={r.id}>{format(r.checkIn, "dd.MM.yyyy")} — {format(r.checkOut, "dd.MM.yyyy")}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}