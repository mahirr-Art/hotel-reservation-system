import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  // Always return success even if user not found (security)
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  // Generate reset token
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { email },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/kullanici/sifre-sifirla/${token}`;

  // Fallback: If Resend API Key is not configured or is the placeholder, log to console
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("YOUR_RESEND_API_KEY")) {
    console.log("\n==================================================");
    console.log("🔑 ŞİFRE SIFIRLAMA BAĞLANTISI (LOCAL CONSOLE FALLBACK):");
    console.log("Kullanıcı:", email);
    console.log("Link:", resetUrl);
    console.log("==================================================\n");
    return NextResponse.json({ ok: true });
  }

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Şifre Sıfırlama – Kuzey Feneri",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #FAF8F4; margin: 0; padding: 0; }
            .container { max-width: 580px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; }
            .header { background: linear-gradient(135deg, #0D1B2A 0%, #1A2E45 100%); padding: 40px 40px 30px; text-align: center; }
            .logo { font-size: 1.4rem; font-weight: 700; color: #C9A96E; margin-bottom: 4px; }
            .logo-sub { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
            .body { padding: 40px; }
            .title { font-size: 1.4rem; font-weight: 700; color: #0D1B2A; margin-bottom: 12px; }
            .text { font-size: 0.9rem; color: #6B7280; line-height: 1.7; margin-bottom: 24px; }
            .btn { display: inline-block; background: linear-gradient(135deg, #A07840, #C9A96E); color: #0D1B2A; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; letter-spacing: 0.06em; text-transform: uppercase; }
            .note { font-size: 0.78rem; color: #9CA3AF; margin-top: 24px; }
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
              <div class="title">Şifrenizi Sıfırlayın</div>
              <div class="text">
                Merhaba ${user.fullName},<br><br>
                Hesabınız için şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
              </div>
              <a href="${resetUrl}" class="btn">Şifremi Sıfırla →</a>
              <div class="note">
                Bu bağlantı 1 saat süreyle geçerlidir. Eğer bu isteği siz yapmadıysanız bu e-postayı dikkate almayın.<br><br>
                Bağlantı çalışmıyorsa şu URL'yi tarayıcınıza kopyalayın:<br>
                <span style="word-break: break-all; color: #C9A96E;">${resetUrl}</span>
              </div>
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
    console.error("Email send error, fallback to console log:", err);
    console.log("\n==================================================");
    console.log("🔑 ŞİFRE SIFIRLAMA BAĞLANTISI (FALLBACK):");
    console.log("Kullanıcı:", email);
    console.log("Link:", resetUrl);
    console.log("==================================================\n");
  }

  return NextResponse.json({ ok: true });
}
