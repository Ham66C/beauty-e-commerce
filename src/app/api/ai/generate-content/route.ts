import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { productName, audience, tone } = await req.json();

    if (!productName || !audience || !tone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are a professional beauty copywriter for a brand named BEAUTÉ.
      Generate the following content for a product named "${productName}".
      Target Audience: ${audience}.
      Tone: ${tone}.

      Required Content:
      1. 3 Instagram captions with relevant hashtags.
      2. 2 Facebook ad copies (hook, body, CTA).
      3. 1 SEO-optimized product description (around 150 words).

      Respond ONLY with a JSON object in this exact format:
      {
        "instagramCaptions": ["caption 1", "caption 2", "caption 3"],
        "facebookAds": [
          { "hook": "hook text", "body": "body text", "cta": "cta text" },
          { "hook": "hook text", "body": "body text", "cta": "cta text" }
        ],
        "description": "the full seo-optimized description text"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON output from Gemini
    const cleanText = text.replace(/```json|```/gi, "").trim();
    const content = JSON.parse(cleanText);

    return NextResponse.json(content);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
