"use client";

import { useEffect, useState } from "react";

type Testimonial = { id: string; authorTag: string; content: string; rating: number };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState({ authorTag: "", content: "", rating: "5" });

  async function loadData() {
    const res = await fetch("/api/testimonials").then((r) => r.json());
    setItems(res.testimonials);
  }

  useEffect(() => { loadData(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ authorTag: "", content: "", rating: "5" });
    loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    loadData();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Misafir Yorumları</h1>

      <form onSubmit={handleSubmit} className="grid gap-3 mb-10 border rounded-2xl p-6">
        <input required placeholder="Etiket (örn: Bir Misafirimiz, İş Gezgini)" value={form.authorTag} onChange={(e) => setForm({ ...form, authorTag: e.target.value })} className="rounded-lg border px-3 py-2" />
        <textarea required placeholder="Yorum metni" rows={3} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="rounded-lg border px-3 py-2" />
        <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="rounded-lg border px-3 py-2">
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} yıldız</option>)}
        </select>
        <button type="submit" className="rounded-full bg-black text-white px-6 py-2 font-medium">Yorum Ekle</button>
      </form>

      <div className="grid gap-3">
        {items.map((t) => (
          <div key={t.id} className="border rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium">{t.authorTag}</p>
              <span className="text-sm text-amber-500">{"★".repeat(t.rating)}</span>
            </div>
            <p className="text-sm text-neutral-700 mb-3">{t.content}</p>
            <button onClick={() => handleDelete(t.id)} className="text-red-600 text-sm underline">Sil</button>
          </div>
        ))}
        {items.length === 0 && <p className="text-neutral-500">Henüz yorum yok.</p>}
      </div>
    </div>
  );
}