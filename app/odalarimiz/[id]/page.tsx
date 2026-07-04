import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await prisma.room.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!room) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-xs uppercase text-neutral-400 mb-2">{room.category.name}</p>
      <h1 className="text-3xl font-semibold mb-4">{room.name}</h1>
      <div className="aspect-video bg-neutral-100 rounded-2xl mb-8" />
      <p className="text-neutral-700 mb-6">{room.description}</p>
      <div className="flex gap-8 mb-8">
        <p><span className="text-neutral-400 text-sm block">Kapasite</span>{room.capacity} kişi</p>
        <p><span className="text-neutral-400 text-sm block">Fiyat</span>{room.price.toString()} ₺ / gece</p>
      </div>
      <Link
        href={`/rezervasyon?oda=${room.id}`}
        className="inline-block rounded-full bg-black text-white px-8 py-3 font-medium"
      >
        Bu Odayı Rezerve Et
      </Link>
    </div>
  );
}