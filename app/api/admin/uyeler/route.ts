import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    const reservations = await prisma.reservation.findMany({
      include: { room: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    // Group reservations by email (case-insensitive)
    const reservationsByEmail = new Map<string, typeof reservations>();
    for (const res of reservations) {
      const emailKey = res.email.toLowerCase().trim();
      if (!reservationsByEmail.has(emailKey)) {
        reservationsByEmail.set(emailKey, []);
      }
      reservationsByEmail.get(emailKey)!.push(res);
    }

    const usersWithReservations = users.map((user) => {
      const emailKey = user.email.toLowerCase().trim();
      const userRes = reservationsByEmail.get(emailKey) || [];
      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        createdAt: user.createdAt,
        reservations: userRes.map((r) => ({
          id: r.id,
          roomName: r.room?.name || "Silinmiş Oda",
          checkIn: r.checkIn,
          checkOut: r.checkOut,
          status: r.status,
          createdAt: r.createdAt,
        })),
      };
    });

    return NextResponse.json({ users: usersWithReservations });
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    return NextResponse.json({ error: "Kullanıcılar yüklenirken hata oluştu." }, { status: 500 });
  }
}
