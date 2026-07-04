import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await request.json(); // "ONAYLANDI" | "IPTAL" | "BEKLIYOR"
  const reservation = await prisma.reservation.update({
    where: { id: params.id },
    data: { status },
  });
  return NextResponse.json({ reservation });
}