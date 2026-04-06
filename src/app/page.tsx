"use client";

import React, { useState } from "react";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight, Heart } from "lucide-react";
import { SkincareQuiz } from "@/components/SkincareQuiz";

const BEST_SELLERS = [
  { id: "1", name: "Hydrating Facial Mist", price: 24, category: "Face Care", image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=1000&auto=format&fit=crop" },
  { id: "2", name: "Rose Quartz Serum", price: 45, category: "Anti-Aging", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop" },
  { id: "3", name: "Whipped Body Butter", price: 32, category: "Body Care", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000&auto=format&fit=crop" },
  { id: "4", name: "Midnight Recovery Oil", price: 58, category: "Night Care", image: "https://images.unsplash.com/photo-1556229167-7313a2997c43?q=80&w=1000&auto=format&fit=crop" },
];

const NEW_ARRIVALS = [
  { id: "5", name: "Glow Cleansing Balm", price: 28, category: "Cleanser", image: "https://images.unsplash.com/photo-1556229162-d27b9c9c3620?q=80&w=1000&auto=format&fit=crop" },
  { id: "6", name: "Bamboo Charcoal Mask", price: 35, category: "Masks", image: "https://images.unsplash.com/photo-1570172619666-1111624ca347?q=80&w=1000&auto=format&fit=crop" },
  { id: "7", name: "SPF 50 Silk Shield", price: 38, category: "Protection", image: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1000&auto=format&fit=crop" },
  { id: "8", name: "Lip Hydration Nectar", price: 18, category: "Lips", image: "https://images.unsplash.com/photo-1586495764447-6f97ca18d0d2?q=80&w=1000&auto=format&fit=crop" },
];

export default function Home() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="space-y-32 mb-32">
      <Hero />

      {/* AI Skincare Quiz Callout */}
      <section className="container px-4 mx-auto lg:px-8">
        <div className="bg-pastel-primary/10 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <Sparkles className="w-full h-full text-pastel-primary" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pastel-primary text-white rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Personalization</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-pastel-primary leading-tight">
              Not sure which product is right for you?
            </h2>
            <p className="text-xl text-pastel-primary/70 leading-relaxed">
              Take our 2-minute AI Skincare Quiz to get a personalized routine tailored to your skin type and concerns.
            </p>
            <Button size="lg" className="gap-3 group" onClick={() => setIsQuizOpen(true)}>
              Start AI Quiz
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container px-4 mx-auto lg:px-8">
        <div className="flex items-end justify-between mb-16">
          <div className="space-y-4">
            <h2 className="text-5xl font-heading font-bold text-pastel-primary tracking-tight">Best Sellers</h2>
            <p className="text-pastel-primary/60 text-lg">Our community&apos;s most-loved essentials.</p>
          </div>
          <Button variant="outline" className="hidden sm:flex group">
            View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-all" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {BEST_SELLERS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container px-4 mx-auto lg:px-8">
        <div className="flex items-end justify-between mb-16">
          <div className="space-y-4">
            <h2 className="text-5xl font-heading font-bold text-pastel-primary tracking-tight">New Arrivals</h2>
            <p className="text-pastel-primary/60 text-lg">Fresh innovations for your beauty routine.</p>
          </div>
          <Button variant="outline" className="hidden sm:flex group">
            Explore New <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-all" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {NEW_ARRIVALS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Features/Values */}
      <section className="bg-pastel-card py-32 border-y border-pastel-secondary/10">
        <div className="container px-4 mx-auto lg:px-8">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-10 h-10 text-pastel-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-pastel-primary">Clean Ingredients</h3>
              <p className="text-pastel-primary/60">Sustainably sourced, non-toxic, and dermatologically tested.</p>
            </div>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Heart className="w-10 h-10 text-pastel-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-pastel-primary">Cruelty Free</h3>
              <p className="text-pastel-primary/60">We never test on animals and ensure ethical supply chains.</p>
            </div>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-10 h-10 text-pastel-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-pastel-primary">Fast Delivery</h3>
              <p className="text-pastel-primary/60">Global shipping with eco-friendly packaging in 3-5 days.</p>
            </div>
          </div>
        </div>
      </section>

      <SkincareQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
}
