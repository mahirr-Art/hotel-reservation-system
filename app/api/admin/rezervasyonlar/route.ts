import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reservations = await prisma.reservation.findMany({
    include: { room: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reservations });
}