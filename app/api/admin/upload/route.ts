import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }

  const blob = await put(`odalar/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}