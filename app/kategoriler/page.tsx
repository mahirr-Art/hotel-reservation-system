import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function KategorilerPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { rooms: true } } },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-10">Oda Kategorileri</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/odalarimiz?kategori=${category.id}`}
            className="rounded-2xl border p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-lg font-semibold mb-2">{category.name}</h2>
            <p className="text-sm text-neutral-600 mb-3">{category.description}</p>
            <p className="text-xs text-neutral-400">{category._count.rooms} oda</p>
          </Link>
        ))}
        {categories.length === 0 && <p className="text-neutral-500">Henüz kategori eklenmedi.</p>}
      </div>
    </div>
  );
}