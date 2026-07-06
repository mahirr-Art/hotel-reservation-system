import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const reservationSchema = z.object({
  roomId: z.string(),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  checkIn: z.string(),
  checkOut: z.string(),
  guestCount: z.number().int().min(1),
  paymentMethod: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = reservationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { roomId, checkIn, checkOut, guestCount, fullName, email, phone, paymentMethod } = parsed.data;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    return NextResponse.json({ error: "Çıkış tarihi giriş tarihinden sonra olmalı" }, { status: 400 });
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    return NextResponse.json({ error: "Oda bulunamadı" }, { status: 404 });
  }
  if (guestCount > room.capacity) {
    return NextResponse.json({ error: `Bu oda en fazla ${room.capacity} kişi kapasiteli` }, { status: 400 });
  }

  const overlapCount = await prisma.reservation.count({
    where: {
      roomId,
      status: { not: "IPTAL" },
      AND: [{ checkIn: { lt: checkOutDate } }, { checkOut: { gt: checkInDate } }],
    },
  });
  if (overlapCount >= room.quantity) {
    return NextResponse.json({ error: "Bu oda seçilen tarihlerde müsait değil" }, { status: 409 });
  }

  const reservation = await prisma.reservation.create({
    data: {
      roomId,
      fullName,
      email,
      phone,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guestCount,
      paymentMethod: paymentMethod ? paymentMethod.toUpperCase() : "HAVALE",
    },
  });

  // Auto-create user account if not exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) {
    // Generate a random temp password — user can reset via "Şifremi unuttum"
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(tempPassword, 12);
    await prisma.user.create({
      data: { email, fullName, phone, passwordHash },
    });
    // Note: In production, send a welcome email with the temp password or reset link
  }

  return NextResponse.json({ reservation }, { status: 201 });
}