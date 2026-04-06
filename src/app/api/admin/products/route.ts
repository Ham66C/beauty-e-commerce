import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Protection helper
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          category ? { category } : {},
          search ? { name: { contains: search } } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, price, description, images, category, stock, skinTypeTags, problemTags } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/ /g, "-") + "-" + Date.now(),
        price: parseFloat(price),
        description,
        images: JSON.stringify(images),
        category,
        stock: parseInt(stock),
        skinTypeTags: JSON.stringify(skinTypeTags),
        problemTags: JSON.stringify(problemTags),
      },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
