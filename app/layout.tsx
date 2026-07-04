import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Kuzey Feneri Butik Otel | Sinop Gerze",
  description:
    "Sinop Gerze kıyısında Karadeniz manzaralı butik otel. Online rezervasyon, özel paketler ve huzurlu konaklama deneyimi.",
  keywords: "otel, butik otel, sinop, gerze, karadeniz, rezervasyon, kuzey feneri",
  openGraph: {
    title: "Kuzey Feneri Butik Otel",
    description: "Sinop Gerze kıyısında Karadeniz'in eşsiz manzarasıyla huzurlu bir konaklama.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ background: "var(--cream)" }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}