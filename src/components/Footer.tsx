import React from "react";
import Link from "next/link";
import { Camera, Globe, Send, MessageCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-pastel-card pt-20 pb-10 border-t border-pastel-secondary/10">
      <div className="container px-4 mx-auto lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-3xl font-heading font-bold text-pastel-primary tracking-tight">BEAUTÉ</h3>
            <p className="text-pastel-primary/70 leading-relaxed max-w-xs">
              Curated beauty solutions for your unique skin. Discover the science of radiant health.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-pastel-bg rounded-full text-pastel-primary hover:bg-pastel-primary hover:text-white transition-all shadow-sm">
                <Camera className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-pastel-bg rounded-full text-pastel-primary hover:bg-pastel-primary hover:text-white transition-all shadow-sm">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-pastel-bg rounded-full text-pastel-primary hover:bg-pastel-primary hover:text-white transition-all shadow-sm">
                <Send className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-bold text-pastel-primary mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-pastel-primary/70 hover:text-pastel-primary transition-colors">Shop All</Link></li>
              <li><Link href="/new-arrivals" className="text-pastel-primary/70 hover:text-pastel-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/best-sellers" className="text-pastel-primary/70 hover:text-pastel-primary transition-colors">Best Sellers</Link></li>
              <li><Link href="/skincare-quiz" className="text-pastel-primary/70 hover:text-pastel-primary transition-colors text-pastel-primary font-semibold italic underline decoration-dotted">AI Skincare Quiz</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-heading font-bold text-pastel-primary mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/shipping" className="text-pastel-primary/70 hover:text-pastel-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="text-pastel-primary/70 hover:text-pastel-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/faq" className="text-pastel-primary/70 hover:text-pastel-primary transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="text-pastel-primary/70 hover:text-pastel-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-heading font-bold text-pastel-primary mb-6">Get in Touch</h4>
            <p className="text-pastel-primary/70 mb-6">Have questions? We&apos;re here to help you shine.</p>
            <a
              href="https://wa.me/yournumber"
              className="flex items-center gap-3 p-4 bg-pastel-bg rounded-3xl text-pastel-primary border border-pastel-secondary/20 hover:border-pastel-primary transition-all shadow-sm group"
            >
              <div className="p-2 bg-green-100 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold tracking-wide">WhatsApp Support</span>
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-pastel-secondary/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-pastel-primary/40">
          <p>© 2026 BEAUTÉ E-Commerce. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-pastel-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-pastel-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
