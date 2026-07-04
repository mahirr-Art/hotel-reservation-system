import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await request.json();
  const reservation = await prisma.reservation.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json({ reservation });
}