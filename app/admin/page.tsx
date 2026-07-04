import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [roomCount, pendingReservations, messageCount] = await Promise.all([
    prisma.room.count(),
    prisma.reservation.count({ where: { status: "BEKLIYOR" } }),
    prisma.message.count(),
  ]);

  const stats = [
    { label: "Toplam Oda", value: roomCount },
    { label: "Bekleyen Rezervasyon", value: pendingReservations },
    { label: "Okunmamış Mesaj", value: messageCount },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-8">Genel Bakış</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border p-6">
            <p className="text-3xl font-semibold">{stat.value}</p>
            <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}