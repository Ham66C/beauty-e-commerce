"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();

  return (
    <nav className="sticky top-0 z-40 w-full bg-pastel-bg/80 backdrop-blur-md border-b border-pastel-card">
      <div className="container px-4 mx-auto lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <button
            className="p-2 lg:hidden text-pastel-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          <Link href="/" className="text-2xl font-heading font-bold text-pastel-primary tracking-tight">
            BEAUTÉ
          </Link>

          <div className="hidden lg:flex flex-1 max-w-md relative group">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-6 py-2.5 bg-pastel-card rounded-full outline-none focus:ring-2 ring-pastel-secondary transition-all text-pastel-primary placeholder:text-pastel-primary/40"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-pastel-primary/40 group-focus-within:text-pastel-primary transition-colors" />
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button className="hidden sm:flex p-2 rounded-full hover:bg-pastel-card text-pastel-primary transition-colors">
              <Search className="w-6 h-6 lg:hidden" />
            </button>
            <Link href="/wishlist" className="p-2 rounded-full hover:bg-pastel-card text-pastel-primary transition-colors relative">
              <Heart className="w-6 h-6" />
              {totalWishlist > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-pastel-secondary text-[10px] text-white flex items-center justify-center rounded-full">
                  {totalWishlist}
                </span>
              )}
            </Link>
            <Link href="/cart" className="p-2 rounded-full hover:bg-pastel-card text-pastel-primary transition-colors relative">
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-pastel-primary text-[10px] text-white flex items-center justify-center rounded-full shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href="/login" className="hidden sm:flex p-2 rounded-full hover:bg-pastel-card text-pastel-primary transition-colors">
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-pastel-bg border-b border-pastel-card"
          >
            <div className="flex flex-col p-4 gap-4">
              <Link href="/shop" className="text-pastel-primary font-medium p-2">Shop All</Link>
              <Link href="/categories" className="text-pastel-primary font-medium p-2">Categories</Link>
              <Link href="/about" className="text-pastel-primary font-medium p-2">About Us</Link>
              <Link href="/login" className="text-pastel-primary font-medium p-2 flex items-center gap-2">
                <User className="w-5 h-5" /> Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
