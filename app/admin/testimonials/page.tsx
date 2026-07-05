"use client";

import { useEffect, useState } from "react";

type Testimonial = { id: string; authorTag: string; content: string; rating: number; adminReply: string | null };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  async function loadData() {
    const res = await fetch("/api/testimonials").then((r) => r.json());
    setItems(res.testimonials);
  }

  useEffect(() => { loadData(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    loadData();
  }

  async function handleReply(id: string) {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminReply: replyText }),
    });
    setReplyingTo(null);
    setReplyText("");
    loadData();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Misafir Yorumları</h1>

      <div className="grid gap-4">
        {items.map((t) => (
          <div key={t.id} className="border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-lg">{t.authorTag}</p>
              <span className="text-sm text-amber-500">{"★".repeat(t.rating)}</span>
            </div>
            <p className="text-neutral-700 mb-4 italic">&ldquo;{t.content}&rdquo;</p>
            
            {t.adminReply && (
              <div className="bg-gray-50 border-l-4 border-gray-400 p-3 mb-4 rounded-r-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Yanıtınız:</p>
                <p className="text-sm text-gray-800">{t.adminReply}</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <button onClick={() => handleDelete(t.id)} className="text-red-600 text-sm font-medium hover:underline">Sil</button>
              
              {!t.adminReply && replyingTo !== t.id && (
                <button 
                  onClick={() => { setReplyingTo(t.id); setReplyText(""); }} 
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Yanıtla
                </button>
              )}
            </div>

            {replyingTo === t.id && (
              <div className="mt-4 border-t pt-4">
                <textarea 
                  rows={2} 
                  placeholder="Yanıtınızı buraya yazın..." 
                  value={replyText} 
                  onChange={(e) => setReplyText(e.target.value)} 
                  className="w-full rounded-lg border px-3 py-2 mb-2 outline-none"
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setReplyingTo(null)} className="px-3 py-1 text-sm border rounded hover:bg-gray-50">İptal</button>
                  <button onClick={() => handleReply(t.id)} className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800">Yanıtı Gönder</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-neutral-500">Henüz yorum yok.</p>}
      </div>
    </div>
  );
}