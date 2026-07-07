import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createUserToken, verifyUserToken, USER_COOKIE } from "@/lib/auth";

// POST /api/kullanici/giris — Login
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "E-posta veya şifre hatalı" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "E-posta veya şifre hatalı" }, { status: 401 });
  }

  const token = await createUserToken(user.id, user.email);
  const response = NextResponse.json({
    user: { id: user.id, email: user.email, fullName: user.fullName },
  });
  response.cookies.set(USER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && !req.nextUrl.hostname.includes("localhost"),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

// DELETE /api/kullanici/giris — Logout
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(USER_COOKIE);
  return response;
}
