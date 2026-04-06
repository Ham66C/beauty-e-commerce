import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { description } = await req.json();
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: { description },
    });
    return NextResponse.json(updatedProduct);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
