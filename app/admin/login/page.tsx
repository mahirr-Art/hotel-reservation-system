"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("E-posta veya şifre hatalı");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <h1 className="text-2xl font-semibold mb-8 text-center">Admin Girişi</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input required type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border px-3 py-2" />
        <input required type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-lg border px-3 py-2" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-full bg-black text-white px-6 py-3 font-medium">
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}