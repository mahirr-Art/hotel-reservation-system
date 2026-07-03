export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-24">
      <div className="max-w-5xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <h3 className="text-white font-semibold mb-2">Otel Adı</h3>
          <p className="text-neutral-400">Şehrin kalbinde huzurlu bir kaçış noktası.</p>
        </div>
        <div className="space-y-1">
          <p>Adres: Örnek Mah. Sahil Cad. No:1</p>
          <p>Telefon: 0 (000) 000 00 00</p>
          <p>E-posta: info@oteladi.com</p>
        </div>
        <div>
          <p>&copy; {new Date().getFullYear()} Otel Adı. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}