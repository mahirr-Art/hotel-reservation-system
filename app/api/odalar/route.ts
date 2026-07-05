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
    const mappedRooms = rooms.map(room => ({ ...room, availableCount: room.quantity }));
    return NextResponse.json({ rooms: mappedRooms });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const rooms = await prisma.room.findMany({
    where: baseWhere,
    include: {
      category: true,
      reservations: {
        where: {
          status: { not: "IPTAL" },
          AND: [{ checkIn: { lt: checkOutDate } }, { checkOut: { gt: checkInDate } }],
        },
      },
    },
  });

  const availableRooms = rooms
    .map(room => {
      const overlapCount = room.reservations.length;
      const availableCount = room.quantity - overlapCount;
      // Exclude reservations array from the response
      const { reservations, ...roomData } = room;
      return { ...roomData, availableCount };
    })
    .filter(room => room.availableCount > 0);

  return NextResponse.json({ rooms: availableRooms });
}