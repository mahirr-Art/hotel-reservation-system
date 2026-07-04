"use client";

import { useState } from "react";

export default function IletisimPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/iletisim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });
    if (!res.ok) {
      setError("Mesajınız gönderilemedi, lütfen tekrar deneyin.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2">İletişim</h1>
      <p className="text-neutral-600 mb-10">Adres: Örnek Mah. Sahil Cad. No:1 · Tel: 0 (000) 000 00 00</p>

      {sent ? (
        <p className="font-medium">Mesajınız için teşekkürler, en kısa sürede dönüş yapacağız.</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
          <input required placeholder="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border px-3 py-2" />
          <input required type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border px-3 py-2" />
          <input required placeholder="Konu" value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-lg border px-3 py-2" />
          <textarea required placeholder="Mesajınız" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="rounded-lg border px-3 py-2" />
          {error && <p className="text-red-600 text-sm">{error}</p>}
         <button type="submit" className="rounded-full bg-teal-600 text-white px-6 py-3 font-medium hover:bg-teal-700">
            Mesaj Gönder
          </button>
        </form>
      )}
    </div>
  );
}