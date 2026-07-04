import Link from "next/link";

const links = [
  { href: "/odalarimiz", label: "Odalarımız" },
  { href: "/kategoriler", label: "Kategoriler" },
  { href: "/musaitlik", label: "Müsaitlik" },
  { href: "/tatil", label: "Tatil Paketleri" },
  { href: "/iletisim", label: "İletişim" }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
      <Link href="/" className="text-xl font-semibold text-teal-700">
          Otel Adı
        </Link>
        <ul className="hidden md:flex items-center gap-8 text-sm text-neutral-600">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-black transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
       <Link href="/rezervasyon" className="rounded-full bg-teal-600 text-white px-5 py-2 text-sm font-medium hover:bg-teal-700">
          Rezervasyon Yap
        </Link>
      </nav>
    </header>
  );
}