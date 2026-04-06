"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="container px-4 mx-auto py-32 text-center">
        <div className="w-24 h-24 bg-pastel-card rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-10 h-10 text-pastel-primary/40" />
        </div>
        <h1 className="text-4xl font-heading font-bold text-pastel-primary mb-4">Your cart is empty</h1>
        <p className="text-pastel-primary/60 mb-8 max-w-md mx-auto">
          Looks like you haven&apos;t added anything to your cart yet. Explore our curated beauty collections to find your glow.
        </p>
        <Link href="/">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto py-12 lg:px-8">
      <h1 className="text-4xl font-heading font-bold text-pastel-primary mb-12">Your Shopping Bag ({totalItems})</h1>
      
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-6 p-4 bg-pastel-card rounded-3xl shadow-soft"
              >
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-medium uppercase text-pastel-primary/60 mb-1">{item.category}</p>
                  <h3 className="text-lg font-heading font-bold text-pastel-primary line-clamp-1">{item.name}</h3>
                  <p className="text-pastel-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-3 bg-pastel-bg rounded-full p-1 border border-pastel-secondary/10">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-pastel-card rounded-full text-pastel-primary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-pastel-primary">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-pastel-card rounded-full text-pastel-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-3 text-pastel-primary/40 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-pastel-card p-8 rounded-[2.5rem] shadow-soft sticky top-28 space-y-6 border border-pastel-secondary/5">
            <h2 className="text-2xl font-heading font-bold text-pastel-primary">Order Summary</h2>
            
            <div className="space-y-4 border-b border-pastel-secondary/10 pb-6">
              <div className="flex justify-between text-pastel-primary/70">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-pastel-primary/70">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-heading font-bold text-pastel-primary">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="block w-full pt-4">
              <Button size="lg" className="w-full flex items-center justify-center gap-3 group">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="text-center text-xs text-pastel-primary/40 pt-4 px-4 leading-relaxed">
              Taxes and shipping calculated at checkout. Secure checkout powered by BEAUTÉ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
