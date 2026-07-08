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
      beds: body.beds ? Number(body.beds) : undefined,
      bathrooms: body.bathrooms ? Number(body.bathrooms) : undefined,
      petFriendly: body.petFriendly !== undefined ? Boolean(body.petFriendly) : undefined,
      kitchen: body.kitchen !== undefined ? Boolean(body.kitchen) : undefined,
      parking: body.parking !== undefined ? Boolean(body.parking) : undefined,
      wifi: body.wifi !== undefined ? Boolean(body.wifi) : undefined,
      ac: body.ac !== undefined ? Boolean(body.ac) : undefined,
      features: body.features || [],
    },
  });
  return NextResponse.json({ room });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.room.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}