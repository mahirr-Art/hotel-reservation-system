"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestimonialForm() {
  const router = useRouter();
  const [authorTag, setAuthorTag] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorTag || !content) {
      setError("Lütfen isim ve yorum alanlarını doldurun.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorTag, content, rating }),
      });
      
      if (!res.ok) {
        throw new Error("Yorum gönderilemedi.");
      }

      setSuccess(true);
      setAuthorTag("");
      setContent("");
      setRating(5);
      
      // Refresh the page to show the new testimonial
      setTimeout(() => {
        router.refresh();
      }, 1500);
      
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <div className="text-center mt-12">
        <button 
          onClick={() => setIsOpen(true)}
          className="btn-primary"
          style={{ background: "transparent", border: "1px solid var(--gold)", color: "var(--gold)" }}
        >
          Yorum Bırakın
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-12" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: "4px", padding: "2rem" }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--white)", marginBottom: "1.5rem", textAlign: "center" }}>
        Deneyiminizi Paylaşın
      </h3>
      
      {success ? (
        <div className="text-center py-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" className="mx-auto mb-4">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p style={{ color: "var(--white)" }}>Yorumunuz başarıyla eklendi, teşekkür ederiz!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.5rem", display: "block" }}>Adınız Soyadınız</label>
            <input 
              required 
              value={authorTag} 
              onChange={(e) => setAuthorTag(e.target.value)} 
              className="w-full rounded-lg border px-3 py-2 outline-none" 
              style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "var(--white)" }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.5rem", display: "block" }}>Puanınız</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  type="button" 
                  onClick={() => setRating(star)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={rating >= star ? "var(--gold)" : "none"} stroke="var(--gold)" strokeWidth="1.5">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.5rem", display: "block" }}>Yorumunuz</label>
            <textarea 
              required 
              rows={4}
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              className="w-full rounded-lg border px-3 py-2 outline-none" 
              style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "var(--white)", resize: "none" }}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <div className="flex gap-3 justify-end mt-2">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)} 
              className="px-4 py-2 rounded-lg"
              style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              İptal
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-6 py-2 rounded-lg font-medium"
              style={{ background: "var(--gold)", color: "var(--navy)" }}
            >
              {loading ? "Gönderiliyor..." : "Gönder"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
