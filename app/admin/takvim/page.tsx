import { prisma } from "@/lib/prisma";
import RoomCalendar from "@/components/RoomCalendar";

export default async function AdminTakvimPage() {
  const rooms = await prisma.room.findMany({
    include: {
      reservations: { where: { status: { not: "IPTAL" } }, orderBy: { checkIn: "asc" } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Oda Doluluk Takvimi</h1>
      <p className="text-neutral-600 mb-8">Tüm odaların mevcut doluluk ve müsaitlik durumunu takvim üzerinden takip edebilirsiniz.</p>

      <div className="grid md:grid-cols-2 gap-8">
        {rooms.map((room) => (
          <div key={room.id} className="border border-neutral-200 bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-1">{room.name}</h2>
            <p className="text-sm text-neutral-500 mb-6">Müsaitlik Takvimi</p>
            <div className="flex justify-center">
              <RoomCalendar reservations={room.reservations} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
