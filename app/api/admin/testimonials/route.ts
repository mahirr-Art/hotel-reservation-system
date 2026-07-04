import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const testimonial = await prisma.testimonial.create({
    data: { authorTag: body.authorTag, content: body.content, rating: Number(body.rating) || 5 },
  });
  return NextResponse.json({ testimonial }, { status: 201 });
}