import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    });

    const totalOrders = await prisma.order.count({
      where: { status: { not: "CANCELLED" } },
    });

    const averageOrderValue = totalOrders > 0 ? (totalRevenue._sum.total || 0) / totalOrders : 0;

    // Sales over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesData = await prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: { not: "CANCELLED" },
      },
      select: { createdAt: true, total: true },
    });

    // Group sales by day
    const dailySales: Record<string, number> = {};
    salesData.forEach(sale => {
      const date = sale.createdAt.toISOString().split("T")[0];
      dailySales[date] = (dailySales[date] || 0) + sale.total;
    });

    const formattedSalesData = Object.entries(dailySales).map(([date, total]) => ({
      date,
      revenue: total,
    })).sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      averageOrderValue,
      salesOverTime: formattedSalesData,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
