import type { Metadata } from "next";
import AdminLayoutClient from "@/components/AdminLayoutClient";

export const metadata: Metadata = {
  title: "Yönetim Paneli | Kuzey Feneri",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}