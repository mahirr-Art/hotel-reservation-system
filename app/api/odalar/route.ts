import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guestCount = Number(searchParams.get("kisiSayisi") || 1);
  const city = searchParams.get("city");

  const baseWhere: any = { capacity: { gte: guestCount } };
  if (city) baseWhere.city = city;

  if (!checkIn || !checkOut) {
    const rooms = await prisma.room.findMany({ where: baseWhere, include: { category: true } });
    return NextResponse.json({ rooms });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const rooms = await prisma.room.findMany({
    where: {
      ...baseWhere,
      reservations: {
        none: {
          status: { not: "IPTAL" },
          AND: [{ checkIn: { lt: checkOutDate } }, { checkOut: { gt: checkInDate } }],
        },
      },
    },
    include: { category: true },
  });

  return NextResponse.json({ rooms });
}