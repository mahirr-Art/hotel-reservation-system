import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken, USER_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/kullanici/ben — Get current session user
export async function GET(req: NextRequest) {
  const token = req.cookies.get(USER_COOKIE)?.value;
  if (!token) return NextResponse.json({ user: null });

  const payload = await verifyUserToken(token);
  if (!payload) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, fullName: true, phone: true },
  });

  return NextResponse.json({ user });
}

// POST /api/kullanici/ben — Update profile and password
export async function POST(req: NextRequest) {
  const token = req.cookies.get(USER_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Oturum açmanız gerekiyor" }, { status: 401 });
  }

  const payload = await verifyUserToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Geçersiz oturum" }, { status: 401 });
  }

  const body = await req.json();
  const { fullName, phone, oldPassword, newPassword } = body;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
  }

  const updateData: any = {};
  if (fullName !== undefined) updateData.fullName = fullName;
  if (phone !== undefined) updateData.phone = phone;

  if (newPassword) {
    if (!oldPassword) {
      return NextResponse.json({ error: "Şifrenizi değiştirmek için mevcut şifrenizi girmelisiniz" }, { status: 400 });
    }
    // Check old password
    const valid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Mevcut şifreniz hatalı" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Yeni şifre en az 6 karakter olmalıdır" }, { status: 400 });
    }
    updateData.passwordHash = await bcrypt.hash(newPassword, 12);
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateData,
    select: { id: true, email: true, fullName: true, phone: true },
  });

  return NextResponse.json({ ok: true, user: updatedUser });
}

