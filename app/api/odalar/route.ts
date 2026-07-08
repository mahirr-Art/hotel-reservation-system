import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guestCount = Number(searchParams.get("kisiSayisi") || 1);
  const city = searchParams.get("city");

  const beds = searchParams.get("beds") ? Number(searchParams.get("beds")) : null;
  const bathrooms = searchParams.get("bathrooms") ? Number(searchParams.get("bathrooms")) : null;
  const petFriendly = searchParams.get("petFriendly") === "true";
  const kitchen = searchParams.get("kitchen") === "true";
  const parking = searchParams.get("parking") === "true";
  const wifi = searchParams.get("wifi") === "true";
  const ac = searchParams.get("ac") === "true";
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;

  const baseWhere: any = { capacity: { gte: guestCount } };
  if (city && city !== "all" && city !== "Tüm Konumlar") baseWhere.city = city;

  if (beds !== null) baseWhere.beds = { gte: beds };
  if (bathrooms !== null) baseWhere.bathrooms = { gte: bathrooms };
  if (petFriendly) baseWhere.petFriendly = true;
  if (kitchen) baseWhere.kitchen = true;
  if (parking) baseWhere.parking = true;
  if (wifi) baseWhere.wifi = true;
  if (ac) baseWhere.ac = true;
  if (minPrice !== null || maxPrice !== null) {
    baseWhere.price = {};
    if (minPrice !== null) baseWhere.price.gte = minPrice;
    if (maxPrice !== null) baseWhere.price.lte = maxPrice;
  }

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