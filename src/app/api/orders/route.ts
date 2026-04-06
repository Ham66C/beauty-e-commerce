import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, shippingAddress, paymentMethod, whatsappNumber } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total on server to prevent tampering
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 400 });
      }

      total += product.price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const orderData: any = {
      total,
      status: "PENDING",
      shippingAddress,
      paymentMethod,
      whatsappNumber,
      orderItems: {
        create: orderItemsData,
      },
    };

    if (session?.user?.id) {
      orderData.user = { connect: { id: session.user.id } };
    }

    const order = await prisma.order.create({
      data: orderData,
    });

    // Generate a simple WhatsApp confirmation link for the MVP
    const whatsappMessage = `Hi BEAUTÉ! I just placed an order (Order ID: ${order.id}). Total: $${total.toFixed(2)}. Please confirm my order!`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return NextResponse.json({ order, whatsappLink });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
