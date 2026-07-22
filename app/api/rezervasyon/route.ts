import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

const reservationSchema = z.object({
  roomId: z.string(),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  checkIn: z.string(),
  checkOut: z.string(),
  guestCount: z.number().int().min(1),
  paymentMethod: z.string().optional(),
  promoCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = reservationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { roomId, checkIn, checkOut, guestCount, fullName, email, phone, paymentMethod, promoCode } = parsed.data;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    return NextResponse.json({ error: "Çıkış tarihi giriş tarihinden sonra olmalı" }, { status: 400 });
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { category: true },
  });
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
  }

  // Send Confirmation Email
  const reservationIdString = reservation.id.slice(-8).toUpperCase();
  const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000));
  let totalPrice = Number(room.price) * nights;
  let discountAmount = 0;
  if (promoCode) {
    const code = promoCode.toUpperCase();
    if (code === "YAZ2026") discountAmount = totalPrice * 0.20;
    else if (code === "BALAYI") discountAmount = totalPrice * 0.15;
    else if (code === "KUZEY10") discountAmount = totalPrice * 0.10;
    totalPrice = totalPrice - discountAmount;
  }

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("YOUR_RESEND_API_KEY")) {
    console.log("\n==================================================");
    console.log("📧 REZERVASYON ONAY E-POSTASI (LOCAL CONSOLE FALLBACK):");
    console.log("Kullanıcı:", email);
    console.log("Rezervasyon No:", `#${reservationIdString}`);
    console.log("Oda:", room.name);
    console.log("Tutar:", `${totalPrice} ₺`);
    console.log("Ödeme Yöntemi:", paymentMethod);
    console.log("==================================================\n");
  } else {
    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: `Rezervasyon Talebi Alındı – #${reservationIdString}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', Arial, sans-serif; background: #FAF8F4; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
              .header { background: linear-gradient(135deg, #0D1B2A 0%, #1A2E45 100%); padding: 40px; text-align: center; }
              .logo { font-size: 1.5rem; font-weight: 700; color: #C9A96E; margin-bottom: 4px; }
              .logo-sub { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
              .body { padding: 40px; }
              .title { font-size: 1.4rem; font-weight: 700; color: #0D1B2A; margin-bottom: 8px; }
              .subtitle { font-size: 0.85rem; color: #6B7280; margin-bottom: 24px; }
              .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
              .details-table td { padding: 12px 0; border-bottom: 1px solid #F3F4F6; font-size: 0.9rem; }
              .details-table td.label { color: #6B7280; width: 40%; }
              .details-table td.value { color: #0D1B2A; font-weight: 600; text-align: right; }
              .total-box { background: #FAF8F4; border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
              .total-label { font-size: 0.9rem; font-weight: 700; color: #0D1B2A; }
              .total-val { font-size: 1.3rem; font-weight: 700; color: #C9A96E; }
              .instructions { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 16px; font-size: 0.82rem; color: #78350f; line-height: 1.6; margin-bottom: 24px; }
              .footer { background: #F9FAFB; padding: 20px 40px; text-align: center; font-size: 0.75rem; color: #9CA3AF; border-top: 1px solid #F3F4F6; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">Kuzey Feneri</div>
                <div class="logo-sub">Butik Otel · Sinop Gerze</div>
              </div>
              <div class="body">
                <div class="title">Rezervasyon Talebiniz Alındı</div>
                <div class="subtitle">
                  Sayın ${fullName}, otelimize yaptığınız rezervasyon talebi başarıyla kaydedilmiştir. Detaylar aşağıdadır.
                </div>
                
                <table class="details-table">
                  <tr>
                    <td class="label">Rezervasyon No</td>
                    <td class="value">#${reservationIdString}</td>
                  </tr>
                  <tr>
                    <td class="label">Oda Tipi</td>
                    <td class="value">${room.name} (${room.category.name})</td>
                  </tr>
                  <tr>
                    <td class="label">Konum / Şehir</td>
                    <td class="value">${room.city}</td>
                  </tr>
                  <tr>
                    <td class="label">Giriş Tarihi</td>
                    <td class="value">${checkInDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</td>
                  </tr>
                  <tr>
                    <td class="label">Çıkış Tarihi</td>
                    <td class="value">${checkOutDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</td>
                  </tr>
                  <tr>
                    <td class="label">Kişi Sayısı</td>
                    <td class="value">${guestCount} Kişi</td>
                  </tr>
                  <tr>
                    <td class="label">Ödeme Yöntemi</td>
                    <td class="value">${paymentMethod === "havale" ? "Banka Havalesi / EFT" : "Kapıda Ödeme"}</td>
                  </tr>
                </table>

                <div class="total-box">
                  <span class="total-label">Toplam Tutar</span>
                  <span class="total-val">${totalPrice.toLocaleString("tr-TR")} ₺</span>
                </div>

                ${paymentMethod === "havale" ? `
                <div class="instructions">
                  <strong>Önemli Ödeme Talimatı:</strong><br>
                  Rezervasyonunuzun kesinleşmesi için lütfen <strong>${totalPrice.toLocaleString("tr-TR")} ₺</strong> tutarını en kısa sürede banka hesaplarımızdan birine havale/EFT yapınız.<br>
                  <strong>Açıklama alanına rezervasyon numaranızı (#${reservationIdString}) yazmayı unutmayınız.</strong>
                </div>
                ` : ""}

                <p style="font-size: 0.85rem; color: #6B7280; line-height: 1.6;">
                  Sorularınız veya değişiklik talepleriniz için bizimle 7/24 iletişime geçebilirsiniz:<br>
                  📞 <strong>+90 (553) 790 57 57</strong><br>
                  ✉️ <strong>info@kuzeyfeneri.com</strong>
                </p>
              </div>
              <div class="footer">
                © 2026 Kuzey Feneri Butik Otel · Fatih Mah. Sahil Cad. No:12, Gerze / Sinop
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } catch (err) {
      console.error("Reservation email error:", err);
    }
  }

  return NextResponse.json({ reservation }, { status: 201 });
}