"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { CreditCard, Truck, MessageCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    whatsappNumber: "",
    paymentMethod: "COD",
  });

  React.useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: `${formData.fullName}, ${formData.address}, ${formData.city}`,
          paymentMethod: formData.paymentMethod,
          whatsappNumber: formData.whatsappNumber,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        // Redirect to order tracking page
        router.push(`/order/${data.order.id}`);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 mx-auto py-12 lg:px-8">
      <Link href="/cart" className="inline-flex items-center gap-2 text-pastel-primary/60 hover:text-pastel-primary mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Cart
      </Link>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Checkout Form */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h1 className="text-4xl font-heading font-bold text-pastel-primary">Checkout</h1>
            <p className="text-pastel-primary/60">Complete your details to finish your order.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-heading font-bold text-pastel-primary flex items-center gap-2">
                <Truck className="w-5 h-5" /> Shipping Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-6 py-3 bg-pastel-card rounded-2xl outline-none focus:ring-2 ring-pastel-secondary transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-6 py-3 bg-pastel-card rounded-2xl outline-none focus:ring-2 ring-pastel-secondary transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <input
                required
                type="text"
                placeholder="Shipping Address"
                className="w-full px-6 py-3 bg-pastel-card rounded-2xl outline-none focus:ring-2 ring-pastel-secondary transition-all"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="City"
                  className="w-full px-6 py-3 bg-pastel-card rounded-2xl outline-none focus:ring-2 ring-pastel-secondary transition-all"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <input
                  required
                  type="tel"
                  placeholder="WhatsApp Number"
                  className="w-full px-6 py-3 bg-pastel-card rounded-2xl outline-none focus:ring-2 ring-pastel-secondary transition-all border-2 border-pastel-secondary/20"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                />
              </div>
              <p className="text-xs text-pastel-primary/40 flex items-center gap-2">
                <MessageCircle className="w-3 h-3" />
                Required for order status updates & confirmation via WhatsApp.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-heading font-bold text-pastel-primary flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Payment Method
              </h2>
              <div className="grid gap-4">
                <label className="flex items-center gap-4 p-4 bg-pastel-card rounded-2xl cursor-pointer border-2 border-transparent has-[:checked]:border-pastel-primary transition-all">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={() => setFormData({ ...formData, paymentMethod: "COD" })}
                    className="accent-pastel-primary"
                  />
                  <div>
                    <p className="font-bold text-pastel-primary">Cash on Delivery</p>
                    <p className="text-sm text-pastel-primary/60">Pay when you receive your order.</p>
                  </div>
                </label>
                <label className="flex items-center gap-4 p-4 bg-pastel-card rounded-2xl cursor-not-allowed opacity-50 border-2 border-transparent">
                  <input type="radio" disabled className="accent-pastel-primary" />
                  <div>
                    <p className="font-bold text-pastel-primary">Credit / Debit Card (Coming Soon)</p>
                    <p className="text-sm text-pastel-primary/60">Secure online payment via Stripe.</p>
                  </div>
                </label>
              </div>
            </div>

            <Button size="lg" className="w-full h-16 text-lg shadow-lg shadow-pastel-primary/20" disabled={loading}>
              {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Complete Order"}
            </Button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="bg-pastel-card p-8 rounded-[3rem] shadow-soft border border-pastel-secondary/5 space-y-6">
            <h2 className="text-2xl font-heading font-bold text-pastel-primary">Review Items</h2>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-pastel-primary/70">{item.quantity}x {item.name}</span>
                  <span className="font-bold text-pastel-primary">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-pastel-secondary/10 space-y-4">
              <div className="flex justify-between text-pastel-primary/70">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-pastel-primary/70">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-2xl font-heading font-bold text-pastel-primary pt-4">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
