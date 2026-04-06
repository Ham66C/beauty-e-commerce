"use client";

import React from "react";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "./ui/Button";
import { RatingStars } from "./ui/RatingStars";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
}

export const ProductCard = ({ id, name, price, image, category, rating = 4.5 }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name, price, image, category });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({ id, name, price, image, category });
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="p-4 transition-all duration-300 bg-pastel-card rounded-3xl group shadow-soft"
    >
      <div className="relative overflow-hidden aspect-square rounded-2xl mb-4">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button
          onClick={handleToggleWishlist}
          className={cn(
            "absolute p-2 backdrop-blur-md rounded-full shadow-md top-3 right-3 transition-all duration-300",
            isInWishlist(id) 
              ? "bg-pastel-primary text-white scale-110" 
              : "bg-white/80 text-pastel-primary hover:text-red-500"
          )}
        >
          <Heart className={cn("w-5 h-5", isInWishlist(id) && "fill-current")} />
        </button>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-pastel-primary/60">{category}</p>
        <h3 className="text-lg font-heading text-pastel-primary line-clamp-1">{name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-pastel-primary">${price.toFixed(2)}</p>
          <RatingStars rating={rating} />
        </div>
        <Button 
          onClick={handleAddToCart}
          className="w-full mt-2 gap-2 flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};
