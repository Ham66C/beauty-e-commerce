import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { skinType, concerns, excludeProductId, limit = 4 } = await req.json();

    // 1. Fetch all products from DB
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        skinTypeTags: true,
        problemTags: true,
        description: true,
      },
    });

    const filteredProducts = allProducts.filter(p => p.id !== excludeProductId);

    try {
      // 2. Attempt AI Recommendation
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const productSummary = filteredProducts.map(p => ({
        id: p.id,
        name: p.name,
        tags: [...(p.skinTypeTags as string[]), ...(p.problemTags as string[])].join(", "),
        desc: p.description.substring(0, 100) + "..."
      }));

      const prompt = `
        You are a beauty product recommendation engine.
        Given user's skin type: ${skinType}
        Concerns: ${concerns.join(", ")}
        
        Here is a list of products (JSON array):
        ${JSON.stringify(productSummary)}

        Select the ${limit} most suitable products for this user.
        Return ONLY an array of product IDs in order of best match, like: ["id1", "id2", "id3", "id4"]
        
        Rules:
        - Prioritize products that match both skin type and at least one concern.
        - If no perfect match, recommend general soothing products.
      `;

      const result = await model.generateContent(prompt);
      const aiResponse = await result.response;
      const text = aiResponse.text().replace(/```json|```/gi, "").trim();
      const recommendedIds = JSON.parse(text);

      // Fetch full product details for the recommended IDs
      const recommendedProducts = await prisma.product.findMany({
        where: { id: { in: recommendedIds } }
      });

      // Sort according to AI's ranking
      const sortedResult = recommendedIds.map((id: string) => 
        recommendedProducts.find(p => p.id === id)
      ).filter(Boolean);

      return NextResponse.json(sortedResult);

    } catch (aiError) {
      console.warn("Gemini recommendation failed, falling back to tag matching", aiError);
      
      // 3. Fallback: Simple Tag Matching Logic
      const fallbackResults = filteredProducts
        .map(product => {
          let score = 0;
          const pSkinTags = (product.skinTypeTags as string[]) || [];
          const pProbTags = (product.problemTags as string[]) || [];

          if (pSkinTags.includes(skinType) || pSkinTags.includes("All Types")) score += 5;
          concerns.forEach((c: string) => {
            if (pProbTags.some(tag => tag.toLowerCase().includes(c.toLowerCase()))) score += 3;
          });

          return { ...product, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return NextResponse.json(fallbackResults);
    }
  } catch {
    return NextResponse.json({ error: "Recommendation failed" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
