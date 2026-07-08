import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rooms = await prisma.room.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ rooms });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const room = await prisma.room.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      capacity: Number(body.capacity),
      quantity: Number(body.quantity || 1),
      categoryId: body.categoryId,
      city: body.city,
      photos: body.photos || [],
      beds: Number(body.beds || 1),
      bathrooms: Number(body.bathrooms || 1),
      petFriendly: Boolean(body.petFriendly),
      kitchen: Boolean(body.kitchen),
      parking: Boolean(body.parking),
      wifi: Boolean(body.wifi),
      ac: Boolean(body.ac),
      features: body.features || [],
    },
  });
  return NextResponse.json({ room }, { status: 201 });
}