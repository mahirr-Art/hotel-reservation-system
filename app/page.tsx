import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [featuredRooms, testimonials] = await Promise.all([
    prisma.room.findMany({ take: 3, orderBy: { createdAt: "desc" }, include: { category: true } }),
    prisma.testimonial.findMany({ take: 4, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      {/* Hero + Arama */}
      <section className="bg-neutral-900 text-white">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
          <p className="uppercase tracking-widest text-xs text-neutral-400 mb-4">Hoş geldiniz</p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Şehrin kalbinde huzurlu bir mola
          </h1>
          <form action="/rezervasyon" className="bg-white rounded-2xl p-4 grid gap-3 sm:grid-cols-4 max-w-2xl mx-auto text-neutral-900">
            <input type="date" name="checkIn" className="rounded-lg border px-3 py-2 text-sm" />
            <input type="date" name="checkOut" className="rounded-lg border px-3 py-2 text-sm" />
            <input type="number" name="guests" min={1} defaultValue={2} placeholder="Kişi" className="rounded-lg border px-3 py-2 text-sm" />
            <button type="submit" className="rounded-lg bg-black text-white px-4 py-2 text-sm font-medium">Ara</button>
          </form>
        </div>
      </section>

      {/* Öne çıkan odalar */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-8">Öne Çıkan Odalar</h2>
        {featuredRooms.length === 0 ? (
          <p className="text-neutral-500">Henüz oda eklenmedi.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredRooms.map((room) => (
              <Link key={room.id} href={`/odalarimiz/${room.id}`} className="rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-neutral-100">
                  {room.photos?.[0] && <img src={room.photos[0]} alt={room.name} className="w-full h-full object-cover" />}
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase text-neutral-400 mb-1">{room.category.name}</p>
                  <h3 className="font-semibold mb-1">{room.name}</h3>
                  <p className="text-sm text-neutral-600 mb-3">{room.description}</p>
                  <p className="font-medium">{room.price.toString()} ₺ / gece</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Misafirlerimiz ne diyor */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-8 text-center">Misafirlerimiz Ne Diyor</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl border p-6">
                <p className="text-amber-500 mb-2">{"★".repeat(t.rating)}</p>
                <p className="text-neutral-700 mb-3">"{t.content}"</p>
                <p className="text-sm text-neutral-400">— {t.authorTag}</p>
              </div>
            ))}
            {testimonials.length === 0 && <p className="text-neutral-500 text-center col-span-2">Henüz yorum eklenmedi.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}