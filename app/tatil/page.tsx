export default function TatilPage() {
  const packages = [
    { title: "Yaz Erken Rezervasyon", description: "Haziran-Ağustos konaklamalarında %20 indirim" },
    { title: "Balayı Paketi", description: "Ücretsiz oda yükseltme ve özel karşılama ikramı" },
    { title: "Uzun Hafta Sonu", description: "3 gece konaklayana 4. gece hediye" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2">Tatil Paketleri</h1>
      <p className="text-neutral-600 mb-10">Sizin için hazırladığımız özel kampanyalar.</p>
      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((pkg) => (
          <div key={pkg.title} className="rounded-2xl border p-6">
            <h2 className="text-lg font-semibold mb-2">{pkg.title}</h2>
            <p className="text-sm text-neutral-600">{pkg.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}