import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken, USER_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/kullanici/ben — Get current session user
export async function GET(req: NextRequest) {
  const token = req.cookies.get(USER_COOKIE)?.value;
  if (!token) return NextResponse.json({ user: null });

  const payload = await verifyUserToken(token);
  if (!payload) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, fullName: true },
  });

  return NextResponse.json({ user });
}
