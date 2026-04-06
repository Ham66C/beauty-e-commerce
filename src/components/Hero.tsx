"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Radiance Defined",
    subtitle: "Discover the science of glowing skin with our new Vitamin C collection.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=2080&auto=format&fit=crop",
    cta: "Shop Collection",
    color: "bg-pastel-card",
  },
  {
    title: "Pure Botanical Bliss",
    subtitle: "100% Organic ingredients for a more natural, healthier routine.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=2080&auto=format&fit=crop",
    cta: "Explore Nature",
    color: "bg-pastel-secondary/20",
  },
  {
    title: "Your Nightly Ritual",
    subtitle: "Deep hydration and repair while you sleep. Wake up refreshed.",
    image: "https://images.unsplash.com/photo-1570172619666-1111624ca347?q=80&w=2080&auto=format&fit=crop",
    cta: "View Rituals",
    color: "bg-pastel-primary/10",
  },
];

export const Hero = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 flex items-center ${slides[current].color}`}
        >
          <div className="container px-4 mx-auto lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-8 z-10"
            >
              <h1 className="text-6xl md:text-8xl font-heading font-bold text-pastel-primary leading-tight">
                {slides[current].title}
              </h1>
              <p className="text-xl text-pastel-primary/80 max-w-lg leading-relaxed">
                {slides[current].subtitle}
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="px-10">
                  {slides[current].cta}
                </Button>
                <Button variant="outline" size="lg" className="px-10">
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotate: 2 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative hidden lg:block aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl"
            >
              <Image
                src={slides[current].image}
                alt={slides[current].title}
                fill
                priority
                className="object-cover"
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
        <button onClick={prev} className="p-3 rounded-full bg-white/50 backdrop-blur-md text-pastel-primary hover:bg-white transition-all">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                current === i ? "bg-pastel-primary w-8" : "bg-pastel-primary/30"
              }`}
            />
          ))}
        </div>
        <button onClick={next} className="p-3 rounded-full bg-white/50 backdrop-blur-md text-pastel-primary hover:bg-white transition-all">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};
