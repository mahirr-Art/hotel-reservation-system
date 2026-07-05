import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { adminReply, approved } = body;

  const data: Record<string, unknown> = {};
  if (adminReply !== undefined) data.adminReply = adminReply;
  if (approved !== undefined) data.approved = approved;

  const updatedTestimonial = await prisma.testimonial.update({
    where: { id },
    data,
  });

  return NextResponse.json({ ok: true, testimonial: updatedTestimonial });
}