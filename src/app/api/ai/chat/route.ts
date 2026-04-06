import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages, userContext } = await req.json();

    // Fetch products to provide context to the AI
    const products = await prisma.product.findMany({
      take: 20,
      select: {
        name: true,
        category: true,
        price: true,
        skinTypeTags: true,
        problemTags: true,
        description: true,
      },
    });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are "LuxeBeauty AI" – a luxury skincare advisor for BEAUTÉ.
      
      User's skin type: ${userContext?.skinType || "Not specified"}
      User's concern: ${userContext?.concerns || "Not specified"}
      
      Product catalog (JSON):
      ${JSON.stringify(products.map(p => ({
        name: p.name,
        category: p.category,
        price: p.price,
        skinType: p.skinTypeTags,
        concerns: p.problemTags,
        benefit: p.description.substring(0, 80)
      })))}

      Rules:
      1. ONLY recommend products from the catalog above.
      2. For each recommendation, mention the product name and exactly why it fits the user's skin type or concern.
      3. Keep responses under 3 sentences + one engaging question.
      4. Use gentle, elegant, and sophisticated language (pastel vibes).
      5. If the user asks something outside of beauty or skincare, politely redirect them back to our curated collections.
    `;

    // Format history for Gemini
    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    // Add the system prompt context to the first message if it's the start
    const lastMessage = messages[messages.length - 1].content;
    const promptWithContext = messages.length === 1 
      ? `${systemPrompt}\n\nUser Question: ${lastMessage}`
      : lastMessage;

    const result = await chat.sendMessage(promptWithContext);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Failed to connect to advisor" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
