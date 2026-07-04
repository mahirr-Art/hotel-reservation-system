"use client";

import { useEffect, useState } from "react";

type Category = { id: string; name: string };
type Room = {
  id: string; name: string; description: string | null; price: string;
  capacity: number; categoryId: string; category: Category; photos: string[]; city: string;
};

export default function AdminOdalarPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", capacity: "", categoryId: "", photoUrl: "", city: "İstanbul" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function loadData() {
    const [roomsRes, catsRes] = await Promise.all([
      fetch("/api/admin/odalar").then((r) => r.json()),
      fetch("/api/admin/kategoriler").then((r) => r.json()),
    ]);
    setRooms(roomsRes.rooms);
    setCategories(catsRes.categories);
  }

  useEffect(() => { loadData(); }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (data.url) setForm((f) => ({ ...f, photoUrl: data.url }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editingId ? `/api/admin/odalar/${editingId}` : "/api/admin/odalar";
    const method = editingId ? "PUT" : "POST";
    const payload = { ...form, photos: form.photoUrl ? [form.photoUrl] : [] };
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setForm({ name: "", description: "", price: "", capacity: "", categoryId: "", photoUrl: "", city: "İstanbul" });
    setEditingId(null);
    loadData();
  }

  function startEdit(room: Room) {
    setEditingId(room.id);
    setForm({
      name: room.name,
      description: room.description || "",
      price: room.price.toString(),
      capacity: room.capacity.toString(),
      categoryId: room.categoryId,
      photoUrl: room.photos?.[0] || "",
      city: room.city,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu odayı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/odalar/${id}`, { method: "DELETE" });
    loadData();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Odalar</h1>

      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2 mb-10 border rounded-2xl p-6">
        <input required placeholder="Oda adı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border px-3 py-2" />
        <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="rounded-lg border px-3 py-2">
          <option value="">Kategori seç</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-lg border px-3 py-2">
          <option value="İstanbul">İstanbul</option>
          <option value="Antalya">Antalya</option>
          <option value="İzmir">İzmir</option>
          <option value="Muğla">Muğla (Bodrum/Marmaris)</option>
          <option value="Nevşehir">Nevşehir (Kapadokya)</option>
        </select>
        <input required type="number" placeholder="Fiyat (₺)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-lg border px-3 py-2" />
        <input required type="number" placeholder="Kapasite" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="rounded-lg border px-3 py-2" />
        <textarea placeholder="Açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg border px-3 py-2 sm:col-span-2" />

        <div className="sm:col-span-2">
          <label className="text-sm text-neutral-600 block mb-1">Oda Fotoğrafı</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="text-sm" />
          {uploading && <p className="text-sm text-neutral-500 mt-1">Yükleniyor...</p>}
          {form.photoUrl && (
            <img src={form.photoUrl} alt="Önizleme" className="mt-2 h-24 rounded-lg object-cover" />
          )}
        </div>

        <button type="submit" className="sm:col-span-2 rounded-full bg-teal-600 text-white px-6 py-2 font-medium hover:bg-teal-700">
          {editingId ? "Odayı Güncelle" : "Oda Ekle"}
        </button>
      </form>

      <div className="grid gap-3">
        {rooms.map((room) => (
          <div key={room.id} className="flex items-center justify-between border rounded-xl p-4">
            <div className="flex items-center gap-4">
              {room.photos?.[0] && (
                <img src={room.photos[0]} alt={room.name} className="w-16 h-16 rounded-lg object-cover" />
              )}
              <div>
                <p className="font-medium">{room.name}</p>
                <p className="text-sm text-neutral-500">{room.city} · {room.category.name} · {room.capacity} kişi · {room.price.toString()} ₺</p>
              </div>
            </div>
            <div className="flex gap-2 text-sm">
              <button onClick={() => startEdit(room)} className="underline">Düzenle</button>
              <button onClick={() => handleDelete(room.id)} className="text-red-600 underline">Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}