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
  title: "Grand Azur Resort & Spa | Lüks Otel Deneyimi",
  description:
    "Grand Azur Resort & Spa ile şehrin kalbinde unutulmaz bir konaklama deneyimi yaşayın. Online rezervasyon, özel paketler ve daha fazlası.",
  keywords: "otel, resort, spa, lüks, rezervasyon, Grand Azur",
  openGraph: {
    title: "Grand Azur Resort & Spa",
    description: "Şehrin kalbinde huzurlu bir lüks kaçış noktası.",
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