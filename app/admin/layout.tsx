import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const links = [
  { href: "/admin", label: "Genel Bakış" },
  { href: "/admin/odalar", label: "Odalar" },
  { href: "/admin/rezervasyonlar", label: "Rezervasyonlar" },
  { href: "/admin/mesajlar", label: "Mesajlar" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-[200px_1fr] gap-10">
      <aside>
        <h2 className="text-lg font-semibold mb-4">Yönetim Paneli</h2>
        <nav className="flex md:flex-col gap-2 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 hover:bg-neutral-100 text-neutral-700">
              {link.label}
            </Link>
          ))}
          <LogoutButton />
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}