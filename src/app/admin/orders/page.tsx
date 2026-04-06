"use client";

import React, { useEffect, useState } from "react";
import { 
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  user?: {
    name: string;
  } | null;
  whatsappNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-600",
  CONFIRMED: "bg-blue-100 text-blue-600",
  SHIPPED: "bg-purple-100 text-purple-600",
  DELIVERED: "bg-green-100 text-green-600",
  CANCELLED: "bg-red-100 text-red-600",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchOrders();
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-pastel-primary">Orders</h1>
        <p className="text-pastel-primary/60 text-sm">Track and fulfill your customer orders.</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-soft border border-pastel-secondary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-pastel-bg/50 text-pastel-primary/40 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Order ID</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pastel-bg">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-pastel-primary mx-auto" />
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="group hover:bg-pastel-bg/20 transition-colors">
                  <td className="px-8 py-6">
                    <span className="font-mono text-xs font-bold text-pastel-primary">#{order.id.slice(-8)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-pastel-primary text-sm">{order.user?.name || "Guest"}</span>
                      <span className="text-[10px] text-pastel-primary/40">{order.whatsappNumber}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-pastel-primary text-sm">${order.total.toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold", STATUS_COLORS[order.status])}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs text-pastel-primary/60">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <select 
                      className="bg-pastel-bg text-pastel-primary text-xs font-bold px-3 py-2 rounded-xl outline-none focus:ring-2 ring-pastel-secondary cursor-pointer"
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
