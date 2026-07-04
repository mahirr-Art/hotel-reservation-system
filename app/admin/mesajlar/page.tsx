"use client";

import { useEffect, useState } from "react";

type Message = { id: string; name: string; email: string; subject: string; message: string; createdAt: string };

export default function AdminMesajlarPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  async function loadData() {
    const res = await fetch("/api/admin/mesajlar").then((r) => r.json());
    setMessages(res.messages);
  }

  useEffect(() => { loadData(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/mesajlar/${id}`, { method: "DELETE" });
    loadData();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">İletişim Mesajları</h1>
      <div className="grid gap-3">
        {messages.map((m) => (
          <div key={m.id} className="border rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium">{m.subject}</p>
              <span className="text-xs text-neutral-400">{new Date(m.createdAt).toLocaleDateString("tr-TR")}</span>
            </div>
            <p className="text-sm text-neutral-500 mb-2">{m.name} · {m.email}</p>
            <p className="text-sm text-neutral-700 mb-3">{m.message}</p>
            <button onClick={() => handleDelete(m.id)} className="text-red-600 text-sm underline">Sil</button>
          </div>
        ))}
        {messages.length === 0 && <p className="text-neutral-500">Henüz mesaj yok.</p>}
      </div>
    </div>
  );
}