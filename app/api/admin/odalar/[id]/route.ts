import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const room = await prisma.room.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      capacity: body.capacity ? Number(body.capacity) : undefined,
      quantity: body.quantity ? Number(body.quantity) : undefined,
      categoryId: body.categoryId,
      city: body.city,
      photos: body.photos,
    },
  });
  return NextResponse.json({ room });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.room.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}