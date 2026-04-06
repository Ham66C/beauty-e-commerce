"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Clock, Truck, Package, MessageCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  status: string;
  shippingAddress: string;
  whatsappNumber: string;
  total: number;
  orderItems: OrderItem[];
}

const STATUS_STEPS = [
  { status: "PENDING", label: "Order Placed", icon: Clock },
  { status: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { status: "SHIPPED", label: "Shipped", icon: Truck },
  { status: "DELIVERED", label: "Delivered", icon: Package },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        setOrder(data);
      } catch {
        console.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container px-4 mx-auto py-32 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-pastel-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container px-4 mx-auto py-32 text-center">
        <h1 className="text-4xl font-heading font-bold text-pastel-primary mb-4">Order not found</h1>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.status === order.status);

  return (
    <div className="container px-4 mx-auto py-12 lg:px-8 max-w-4xl">
      <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-soft space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-pastel-primary/60 text-sm uppercase font-bold tracking-widest mb-2">Order Tracking</p>
            <h1 className="text-3xl font-heading font-bold text-pastel-primary">Order #{order.id.slice(-8)}</h1>
          </div>
          <div className="bg-pastel-bg px-6 py-2 rounded-full text-pastel-primary font-bold">
            Status: {order.status}
          </div>
        </div>

        {/* Status Progress Bar */}
        <div className="relative pt-12 pb-8">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-pastel-bg -translate-y-1/2" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-pastel-primary -translate-y-1/2 transition-all duration-1000"
            style={{ width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {STATUS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStatusIndex;
              return (
                <div key={step.status} className="flex flex-col items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${
                    isCompleted ? "bg-pastel-primary text-white" : "bg-pastel-bg text-pastel-primary/30"
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-tighter ${
                    isCompleted ? "text-pastel-primary" : "text-pastel-primary/30"
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-pastel-bg">
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-pastel-primary text-xl">Shipping Details</h3>
            <p className="text-pastel-primary/70 leading-relaxed">{order.shippingAddress}</p>
            <p className="text-pastel-primary/70">WhatsApp: {order.whatsappNumber}</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-pastel-primary text-xl">Order Summary</h3>
            <div className="space-y-2">
              {order.orderItems.map((item: OrderItem) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-pastel-primary/70">{item.quantity}x {item.product.name}</span>
                  <span className="font-bold text-pastel-primary">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-pastel-bg flex justify-between items-center">
                <span className="font-bold text-pastel-primary">Total Amount</span>
                <span className="text-2xl font-heading font-bold text-pastel-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <a 
            href={`https://wa.me/your_support_number?text=${encodeURIComponent(`Hi, I need help with my order #${order.id}`)}`}
            target="_blank"
            className="flex-1"
          >
            <Button variant="secondary" className="w-full flex items-center justify-center gap-3">
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </Button>
          </a>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
