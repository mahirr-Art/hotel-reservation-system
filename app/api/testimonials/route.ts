import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get("all") === "true";
  const testimonials = await prisma.testimonial.findMany({
    where: showAll ? {} : { approved: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ testimonials });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authorTag, content, rating } = body;

    if (!authorTag || !content) {
      return NextResponse.json({ error: "İsim ve yorum zorunludur" }, { status: 400 });
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        authorTag,
        content,
        rating: Number(rating) || 5,
      },
    });

    return NextResponse.json({ testimonial: newTestimonial });
  } catch (error) {
    console.error("Yorum eklenirken hata:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}