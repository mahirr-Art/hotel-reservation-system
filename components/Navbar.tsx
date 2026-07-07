'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/lang";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; fullName: string; email: string } | null>(null);
  const { lang, changeLanguage, t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });

    fetch("/api/kullanici/ben")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dynamicLinks = [
    { href: "/odalarimiz", label: t.rooms },
    { href: "/kategoriler", label: t.categories },
    { href: "/tatil", label: t.tatil },
    { href: "/hizmetlerimiz", label: t.hizmetlerimiz },
    { href: "/iletisim", label: t.iletisim },
    user
      ? { href: "/kullanici", label: t.profilim }
      : { href: "/kullanici", label: t.girisyap },
  ];

  return (
    <>
      {/* Top bar */}
      <div
        style={{
          background: "var(--navy)",
          color: "var(--gold-light)",
          fontSize: "0.72rem",
          letterSpacing: "0.05em",
        }}
        className="hidden md:block"
      >
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              +90 (553) 790 57 57
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              info@kuzeyfeneri.com
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Social icons */}
            {[
              { label: "Instagram", path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9A4.5 4.5 0 0021 16.5v-9A4.5 4.5 0 0016.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21z" },
              { label: "Facebook", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
            ].map((s) => (
              <a key={s.label} href="#" aria-label={s.label} style={{ color: "var(--gold-light)", opacity: 0.8 }} className="hover:opacity-100 transition-opacity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={s.path}/></svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header
        style={{
          background: scrolled ? "var(--navy)" : "rgba(13,27,42,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: scrolled ? "1px solid rgba(201,169,110,0.2)" : "1px solid rgba(255,255,255,0.08)",
          transition: "all 0.3s ease",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <nav className="navbar-nav">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group" style={{ textDecoration: "none" }}>
            <span className="logo-title">
              Kuzey Feneri
            </span>
            <span className="logo-subtitle">
              Butik Otel · Sinop Gerze
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {dynamicLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.8)",
                    textDecoration: "none",
                    position: "relative",
                    paddingBottom: "4px",
                    transition: "color 0.3s ease",
                  }}
                  className="nav-link"
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "var(--gold)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA & Language switcher */}
          <div className="flex items-center gap-3">
            <div style={{ display: "flex", gap: "0.2rem", marginRight: "0.25rem", background: "rgba(255,255,255,0.06)", borderRadius: "20px", padding: "2px 6px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <button
                onClick={() => changeLanguage("tr")}
                style={{
                  background: "none", border: "none", color: lang === "tr" ? "var(--gold)" : "rgba(255,255,255,0.45)",
                  fontWeight: lang === "tr" ? 800 : 500, fontSize: "0.7rem", cursor: "pointer", padding: "2px 4px"
                }}
              >
                TR
              </button>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem", alignSelf: "center" }}>|</span>
              <button
                onClick={() => changeLanguage("en")}
                style={{
                  background: "none", border: "none", color: lang === "en" ? "var(--gold)" : "rgba(255,255,255,0.45)",
                  fontWeight: lang === "en" ? 800 : 500, fontSize: "0.7rem", cursor: "pointer", padding: "2px 4px"
                }}
              >
                EN
              </button>
            </div>
            
            <Link href="/rezervasyon" className="btn-primary nav-book-btn">
              {t.bookNow}
            </Link>

            {/* Hamburger */}
            <button
              id="mobile-menu-btn"
              aria-label="Menüyü aç"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              style={{ color: "var(--gold)", background: "none", border: "none", cursor: "pointer" }}
            >
              <span style={{ display: "block", width: 20, height: 2, background: "var(--gold)", borderRadius: 2, transition: "transform 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
              <span style={{ display: "block", width: 20, height: 2, background: "var(--gold)", borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: "opacity 0.3s" }} />
              <span style={{ display: "block", width: 20, height: 2, background: "var(--gold)", borderRadius: 2, transition: "transform 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              background: "var(--navy)",
              borderTop: "1px solid rgba(201,169,110,0.2)",
              padding: "1.5rem 1.5rem",
            }}
            className="md:hidden"
          >
            <ul className="flex flex-col gap-4">
              {dynamicLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.85)",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/rezervasyon" onClick={() => setMenuOpen(false)} className="btn-primary mt-2" style={{ width: "100%", justifyContent: "center" }}>
                  {t.bookNow}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      <style>{`
        .navbar-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 1rem !important;
          max-width: 80rem;
          margin: 0 auto;
        }
        .logo-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--gold);
          line-height: 1.1;
        }
        .logo-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.48rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold-light);
          opacity: 0.8;
        }
        .nav-book-btn {
          display: none !important;
        }
        @media (min-width: 768px) {
          .navbar-nav {
            padding: 1rem 1.5rem !important;
          }
          .logo-title {
            font-size: 1.35rem;
          }
          .logo-subtitle {
            font-size: 0.55rem;
            letter-spacing: 0.25em;
          }
          .nav-book-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
}