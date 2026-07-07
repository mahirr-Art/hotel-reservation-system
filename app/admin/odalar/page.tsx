"use client";

import { useEffect, useState } from "react";

type Category = { id: string; name: string };
type Room = {
  id: string; name: string; description: string | null; price: string;
  capacity: number; quantity: number; categoryId: string; category: Category; photos: string[]; city: string;
};

export default function AdminOdalarPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "",
    quantity: "1",
    categoryId: "",
    photos: [] as string[],
    city: "Sinop Merkez"
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  async function loadData() {
    setLoading(true);
    const [roomsRes, catsRes] = await Promise.all([
      fetch("/api/admin/odalar").then((r) => r.json()),
      fetch("/api/admin/kategoriler").then((r) => r.json()),
    ]);
    setRooms(roomsRes.rooms || []);
    setCategories(catsRes.categories || []);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function handleFilesUpload(files: File[]) {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        return data.url as string | undefined;
      });
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url): url is string => !!url);
      setForm((f) => ({ ...f, photos: [...f.photos, ...validUrls] }));
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editingId ? `/api/admin/odalar/${editingId}` : "/api/admin/odalar";
    const method = editingId ? "PUT" : "POST";
    const payload = { ...form, price: Number(form.price), capacity: Number(form.capacity), quantity: Number(form.quantity) };
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setForm({ name: "", description: "", price: "", capacity: "", quantity: "1", categoryId: "", photos: [], city: "Sinop Merkez" });
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
      quantity: room.quantity.toString(),
      categoryId: room.categoryId,
      photos: room.photos || [],
      city: room.city,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu odayı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/odalar/${id}`, { method: "DELETE" });
    loadData();
  }

  const inputStyle: React.CSSProperties = {
    padding: "0.65rem 0.875rem",
    borderRadius: "10px",
    border: "1px solid #E5E7EB",
    fontSize: "0.88rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#6B7280",
    marginBottom: "0.35rem",
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
          Odalar
        </h1>
        <p style={{ fontSize: "0.88rem", color: "#6B7280" }}>
          Sistemdeki otel odalarını ekleyin, düzenleyin veya kaldırın.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "2rem" }} className="admin-rooms-grid">
        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: "white", border: "1px solid #E5E7EB", borderRadius: "20px",
          padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem",
          alignSelf: "start", boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
        }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", margin: 0 }}>
            {editingId ? "Odayı Güncelle" : "Yeni Oda Ekle"}
          </h2>

          <div>
            <label style={labelStyle}>Oda Adı *</label>
            <input required placeholder="Örn: Deluxe Balayı Süiti" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>Kategori *</label>
              <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} style={inputStyle}>
                <option value="">Seçin...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Şehir / Konum *</label>
              <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={inputStyle}>
                <option value="Sinop Merkez">Sinop Merkez</option>
                <option value="Gerze">Gerze</option>
                <option value="Samsun">Samsun</option>
                <option value="Ordu">Ordu</option>
                <option value="Artvin">Artvin</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>Fiyat (₺) *</label>
              <input required type="number" placeholder="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Kapasite *</label>
              <input required type="number" placeholder="Kişi" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Adet *</label>
              <input required type="number" placeholder="Oda Adet" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Açıklama</label>
            <textarea placeholder="Oda özellikleri ve detayları..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: "vertical", height: 80 }} />
          </div>

          <div>
            <label style={labelStyle}>Oda Fotoğrafları (Çoklu Yükleme & Drag-Drop)</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const files = Array.from(e.dataTransfer.files);
                handleFilesUpload(files);
              }}
              style={{
                border: isDragging ? "2px dashed #A07840" : "2px dashed #E5E7EB",
                borderRadius: "12px",
                padding: "1.5rem",
                textAlign: "center",
                background: isDragging ? "#FDFBF7" : "#FAFAFA",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleFilesUpload(files);
                }}
                style={{ display: "none" }}
              />
              <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.25rem" }}>🖼️</span>
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#4B5563", margin: "0 0 0.25rem" }}>
                Fotoğrafları sürükleyip bırakın veya tıklayın
              </p>
              <p style={{ fontSize: "0.72rem", color: "#9CA3AF", margin: 0 }}>
                PNG, JPG veya WEBP (Birden fazla seçebilirsiniz)
              </p>
            </div>

            {uploading && (
              <p style={{ fontSize: "0.78rem", color: "#A07840", fontWeight: 600, marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                ⏳ Fotoğraflar yükleniyor...
              </p>
            )}

            {form.photos.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: "0.5rem", marginTop: "1rem" }}>
                {form.photos.map((url, i) => (
                  <div key={url} style={{ position: "relative", height: 70, borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E7EB" }}>
                    <img src={url} alt={`Oda Görseli ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setForm(f => ({ ...f, photos: f.photos.filter((_, idx) => idx !== i) }));
                      }}
                      style={{
                        position: "absolute", top: 2, right: 2,
                        background: "rgba(220, 38, 38, 0.85)", color: "white",
                        border: "none", borderRadius: "50%", width: 16, height: 16,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "9px", fontWeight: "bold", cursor: "pointer",
                        lineHeight: 1
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", description: "", price: "", capacity: "", quantity: "1", categoryId: "", photos: [], city: "Sinop Merkez" });
                }}
                style={{
                  flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1px solid #E5E7EB",
                  background: "white", color: "#4B5563", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer"
                }}
              >
                Vazgeç
              </button>
            )}
            <button
              type="submit"
              style={{
                flex: 2, padding: "0.75rem", borderRadius: "10px", border: "none",
                background: "linear-gradient(135deg, #A07840, #C9A96E)", color: "#0D1B2A",
                fontSize: "0.88rem", fontWeight: 700, cursor: "pointer"
              }}
            >
              {editingId ? "Güncelle" : "Oda Ekle"}
            </button>
          </div>
        </form>

        {/* List */}
        <div>
          {loading ? (
            <p style={{ color: "#9CA3AF" }}>Yükleniyor...</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {rooms.map((room) => (
                <div
                  key={room.id}
                  style={{
                    background: "white", border: "1px solid #E5E7EB", borderRadius: "16px",
                    padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {room.photos?.[0] ? (
                      <img src={room.photos[0]} alt={room.name} style={{ width: 64, height: 64, borderRadius: "10px", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 64, height: 64, borderRadius: "10px", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                        🏨
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", margin: 0 }}>{room.name}</h3>
                      <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "0.25rem" }}>
                        {room.city} · {room.category?.name || "Kategorisiz"}
                      </p>
                      <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--gold-dark, #A07840)", marginTop: "0.15rem" }}>
                        {Number(room.price).toLocaleString("tr-TR")} ₺ · {room.capacity} Kişi · {room.quantity} Oda
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <button
                      onClick={() => startEdit(room)}
                      style={{
                        padding: "0.4rem 0.75rem", borderRadius: "6px", border: "1px solid #E5E7EB",
                        background: "white", color: "#4B5563", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer"
                      }}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      style={{
                        padding: "0.4rem 0.75rem", borderRadius: "6px", border: "none",
                        background: "#FEF2F2", color: "#DC2626", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer"
                      }}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}

              {rooms.length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem", color: "#9CA3AF", border: "1px dashed #E5E7EB", borderRadius: "16px", background: "white" }}>
                  Henüz oda eklenmedi.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-rooms-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}