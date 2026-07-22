import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "💖 Sana Özel | Love",
  description: "Bu sayfa sadece senin için hazırlandı. Seni seviyorum ❤️",
  keywords: "aşk, sevgi, sürpriz, romantik",
};

export default function LoveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "#0a0c10",
        color: "#ffffff",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      {children}
    </div>
  );
}
