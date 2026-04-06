import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. Fetch sales data for the last 30 days
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { not: "CANCELLED" },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // 2. Aggregate Data
    const productSales: Record<string, { count: number; revenue: number; category: string }> = {};
    const categorySales: Record<string, number> = {};
    let totalRevenue = 0;

    orders.forEach(order => {
      totalRevenue += order.total;
      order.orderItems.forEach(item => {
        const p = item.product;
        if (!productSales[p.name]) {
          productSales[p.name] = { count: 0, revenue: 0, category: p.category };
        }
        productSales[p.name].count += item.quantity;
        productSales[p.name].revenue += item.price * item.quantity;
        
        categorySales[p.category] = (categorySales[p.category] || 0) + item.quantity;
      });
    });

    const salesSummary = {
      totalOrders: orders.length,
      totalRevenue,
      topProducts: Object.entries(productSales)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 5),
      categoryPerformance: categorySales,
    };

    // 3. Call Gemini for Analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `
      You are a beauty e-commerce marketing analyst for "BEAUTÉ".
      Sales data (last 30 days):
      ${JSON.stringify(salesSummary)}

      Provide the analysis in the following valid JSON format:
      {
        "bestCategory": "string",
        "why": "string",
        "campaignSuggestion": { 
          "name": "string", 
          "targetAudience": "string", 
          "channel": "Instagram/Facebook" 
        },
        "discountStrategy": "string",
        "instagramIdeas": ["idea1", "idea2", "idea3"]
      }
      
      Focus on actionable insights. Use beauty industry benchmarks.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/gi, "").trim();
    const analysis = JSON.parse(text);

    return NextResponse.json({ ...analysis, rawStats: salesSummary });
  } catch (error) {
    console.error("Marketing Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze marketing data" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
