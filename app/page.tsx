import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featuredRooms = await prisma.room.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { category: true }
  });

  return (
    <div>
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="uppercase tracking-widest text-xs text-neutral-500 mb-4">Hoş geldiniz</p>
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          Şehrin kalbinde huzurlu bir mola
        </h1>
        <p className="mt-6 text-neutral-600">
          Odalarımızı keşfedin, müsaitlik durumunu kontrol edin ve rezervasyonunuzu tamamlayın.
        </p>
        <Link
          href="/rezervasyon"
          className="inline-block mt-8 rounded-full bg-black text-white px-8 py-3 font-medium"
        >
          Hemen Rezervasyon Yap
        </Link>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-8">Öne Çıkan Odalar</h2>
        {featuredRooms.length === 0 ? (
          <p className="text-neutral-500">Henüz oda eklenmedi.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredRooms.map((room) => (
              <div key={room.id} className="rounded-2xl border p-6">
                <p className="text-xs uppercase text-neutral-400 mb-2">{room.category.name}</p>
                <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
                <p className="text-sm text-neutral-600 mb-4">{room.description}</p>
                <p className="font-medium">{room.price.toString()} ₺ / gece</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}