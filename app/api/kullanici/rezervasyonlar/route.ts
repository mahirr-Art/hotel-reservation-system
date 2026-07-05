import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "E-posta adresi gerekli" }, { status: 400 });
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: { email },
      include: {
        room: {
          include: {
            category: true,
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Rezervasyonlar getirilirken hata:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
