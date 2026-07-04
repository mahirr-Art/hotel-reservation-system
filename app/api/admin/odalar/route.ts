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
      categoryId: body.categoryId,
      city: body.city,
      photos: body.photos || [],
    },
  });
  return NextResponse.json({ room }, { status: 201 });
}