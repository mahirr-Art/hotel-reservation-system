import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: "/odalarimiz", label: "Odalarımız" },
    { href: "/kategoriler", label: "Kategoriler" },
    { href: "/tatil", label: "Tatil Paketleri" },
    { href: "/musaitlik", label: "Müsaitlik" },
    { href: "/iletisim", label: "İletişim" },
  ];

  const services = [
    "Restoran & Bar",
    "Spa & Wellness",
    "Fitness Center",
    "Açık Havuz",
    "Transfer Hizmeti",
  ];

  const socials = [
    { label: "Instagram", d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9A4.5 4.5 0 0021 16.5v-9A4.5 4.5 0 0016.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21z" },
    { label: "Facebook", d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
    { label: "Twitter", d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
  ];

  const contacts = [
    { icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z", text: "Sahil Cad. No:1, İstanbul" },
    { icon: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z", text: "0 (850) 123 45 67" },
    { icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6", text: "info@grandazur.com" },
  ];

  return (
    <footer style={{ background: "var(--navy)", color: "rgba(255,255,255,0.65)" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "4rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "3rem",
        }}
      >
        {/* Brand */}
        <div>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--gold)", lineHeight: 1.1, marginBottom: "0.25rem" }}>
              Grand Azur
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-light)", opacity: 0.7, marginBottom: "1.25rem" }}>
              Resort &amp; Spa
            </div>
          </Link>
          <div className="gold-divider" style={{ marginBottom: "1.25rem" }} />
          <p style={{ fontSize: "0.87rem", lineHeight: 1.8, maxWidth: "240px" }}>
            Şehrin kalbinde, denizin hemen yanı başında lüks ve huzuru bir arada yaşayın.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
            {socials.map((s) => (
              <a key={s.label} href="#" aria-label={s.label} className="footer-social">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--white)", marginBottom: "1.25rem" }}>
            Hızlı Bağlantılar
          </h4>
          <div className="gold-divider" style={{ marginBottom: "1.25rem" }} />
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="footer-link">
                  <span style={{ color: "var(--gold)", fontSize: "0.6rem" }}>›</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--white)", marginBottom: "1.25rem" }}>
            Hizmetlerimiz
          </h4>
          <div className="gold-divider" style={{ marginBottom: "1.25rem" }} />
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {services.map((s) => (
              <li key={s} style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "var(--gold)", fontSize: "0.6rem" }}>›</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--white)", marginBottom: "1.25rem" }}>
            İletişim
          </h4>
          <div className="gold-divider" style={{ marginBottom: "1.25rem" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.87rem" }}>
            {contacts.map((c) => (
              <div key={c.text} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <path d={c.icon} />
                </svg>
                <span style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(201,169,110,0.12)", padding: "1.5rem", textAlign: "center", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
        © {year} Grand Azur Resort &amp; Spa. Tüm hakları saklıdır.
        <span style={{ color: "var(--gold)", margin: "0 0.5rem" }}>·</span>
        Gizlilik Politikası
        <span style={{ color: "var(--gold)", margin: "0 0.5rem" }}>·</span>
        Kullanım Koşulları
      </div>
    </footer>
  );
}