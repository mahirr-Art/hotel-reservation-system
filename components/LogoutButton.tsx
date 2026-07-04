"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-100">
      Çıkış Yap
    </button>
  );
}