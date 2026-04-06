"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Sparkles, Copy, Check, Loader2, Share2, Save, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
}

interface FacebookAd {
  hook: string;
  body: string;
  cta: string;
}

interface AIContentResult {
  description: string;
  instagramCaptions: string[];
  facebookAds: FacebookAd[];
}

export default function AIContentGenerator() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [formData, setFormData] = useState({
    productName: "",
    audience: "",
    tone: "luxury",
  });
  const [result, setResult] = useState<AIContentResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setIsSaved(false);

    try {
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      alert("Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveToProduct = async () => {
    if (!selectedProductId || !result?.description) return;
    try {
      const res = await fetch(`/api/products/${selectedProductId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: result.description }),
      });
      if (res.ok) {
        setIsSaved(true);
      }
    } catch {
      alert("Failed to save description");
    }
  };

  return (
    <div className="container px-4 mx-auto py-12 lg:px-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-pastel-primary text-white rounded-2xl shadow-lg">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-heading font-bold text-pastel-primary tracking-tight">AI Content Generator</h1>
          <p className="text-pastel-primary/60">Generate expert beauty marketing copy in seconds.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-pastel-secondary/5 sticky top-28">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-pastel-primary uppercase tracking-wider">Product Name</label>
                <input
                  required
                  placeholder="e.g., Vitamin C Glow Serum"
                  className="w-full px-5 py-3 bg-pastel-bg rounded-2xl outline-none focus:ring-2 ring-pastel-secondary transition-all"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-pastel-primary uppercase tracking-wider">Target Audience</label>
                <textarea
                  required
                  placeholder="e.g., Young women with acne-prone skin looking for natural solutions"
                  className="w-full px-5 py-3 bg-pastel-bg rounded-2xl outline-none focus:ring-2 ring-pastel-secondary transition-all h-24 resize-none"
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-pastel-primary uppercase tracking-wider">Tone</label>
                <select
                  className="w-full px-5 py-3 bg-pastel-bg rounded-2xl outline-none focus:ring-2 ring-pastel-secondary transition-all"
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                >
                  <option value="luxury">Luxury / High-End</option>
                  <option value="friendly">Friendly / Relatable</option>
                  <option value="educational">Educational / Scientific</option>
                  <option value="minimalist">Minimalist / Modern</option>
                </select>
              </div>

              <Button size="lg" className="w-full flex items-center justify-center gap-2 group" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Generate Magic</>}
              </Button>
            </form>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-2">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-pastel-card/30 rounded-[3rem] border-2 border-dashed border-pastel-secondary/20">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Sparkles className="w-8 h-8 text-pastel-primary/30" />
              </div>
              <p className="text-pastel-primary/60 font-medium">Your AI-generated content will appear here.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-8 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-pastel-card h-48 rounded-[2rem]" />
              ))}
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* SEO Description */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-pastel-secondary/5">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-heading font-bold text-pastel-primary flex items-center gap-2">
                      <ShoppingBag className="w-6 h-6" /> SEO Product Description
                    </h2>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => copyToClipboard(result.description, 'desc')}
                        className="p-2 hover:bg-pastel-bg rounded-xl text-pastel-primary transition-colors"
                      >
                        {copiedIndex === 'desc' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-pastel-primary/80 leading-relaxed bg-pastel-bg/50 p-6 rounded-2xl border border-pastel-secondary/5 italic font-medium">
                    {result.description}
                  </p>
                  
                  <div className="mt-8 pt-8 border-t border-pastel-bg flex flex-col sm:flex-row items-center gap-4">
                    <select
                      className="flex-grow px-5 py-2.5 bg-pastel-bg rounded-xl outline-none focus:ring-2 ring-pastel-secondary transition-all text-sm"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                      <option value="">Select a product to update...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <Button 
                      variant="outline" 
                      onClick={handleSaveToProduct} 
                      disabled={!selectedProductId || isSaved}
                      className="whitespace-nowrap flex items-center gap-2"
                    >
                      {isSaved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save to Product</>}
                    </Button>
                  </div>
                </div>

                {/* Instagram Captions */}
                <div className="grid md:grid-cols-2 gap-8">
                  {result.instagramCaptions.map((caption: string, i: number) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-pastel-secondary/5 relative group">
                      <h3 className="text-lg font-heading font-bold text-pastel-primary mb-4 flex items-center gap-2">
                        <Share2 className="w-4 h-4" /> Instagram Option {i + 1}
                      </h3>
                      <p className="text-sm text-pastel-primary/80 leading-relaxed mb-6">{caption}</p>
                      <button 
                        onClick={() => copyToClipboard(caption, `insta-${i}`)}
                        className="absolute top-6 right-6 p-2 bg-pastel-bg rounded-xl text-pastel-primary opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      >
                        {copiedIndex === `insta-${i}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Facebook Ads */}
                <div className="grid md:grid-cols-2 gap-8">
                  {result.facebookAds.map((ad: FacebookAd, i: number) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-pastel-secondary/5 relative group">
                      <h3 className="text-lg font-heading font-bold text-pastel-primary mb-4">FB Ad Option {i + 1}</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-pastel-primary/40 uppercase mb-1">Hook</p>
                          <p className="text-sm font-bold text-pastel-primary">{ad.hook}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-pastel-primary/40 uppercase mb-1">Body</p>
                          <p className="text-sm text-pastel-primary/80">{ad.body}</p>
                        </div>
                        <div className="bg-pastel-primary text-white text-xs px-4 py-2 rounded-full inline-block font-bold">
                          CTA: {ad.cta}
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(`${ad.hook}\n\n${ad.body}\n\nCTA: ${ad.cta}`, `fb-${i}`)}
                        className="absolute top-6 right-6 p-2 bg-pastel-bg rounded-xl text-pastel-primary opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      >
                        {copiedIndex === `fb-${i}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
