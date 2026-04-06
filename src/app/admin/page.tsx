"use client";

import React, { useEffect, useState } from "react";
import { 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from "recharts";
import { 
  TrendingUp, Users, ShoppingBag, 
  DollarSign, ArrowUpRight, ArrowDownRight, Sparkles 
} from "lucide-react";

interface AnalyticsStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  salesOverTime: { date: string; revenue: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) return null;

  const kpis = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, trend: "+12.5%", trendUp: true },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, trend: "+5.2%", trendUp: true },
    { label: "Avg. Order Value", value: `$${stats.averageOrderValue.toFixed(2)}`, icon: TrendingUp, trend: "-2.1%", trendUp: false },
    { label: "Active Customers", value: "1,284", icon: Users, trend: "+8.4%", trendUp: true },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-pastel-primary">Dashboard Overview</h1>
          <p className="text-pastel-primary/60 text-sm">Welcome back! Here&apos;s what&apos;s happening with BEAUTÉ today.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-pastel-card text-xs font-bold text-pastel-primary">
          Last 7 Days
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-soft border border-pastel-secondary/5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-pastel-bg rounded-2xl text-pastel-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${kpi.trendUp ? "text-green-500" : "text-red-400"}`}>
                  {kpi.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              </div>
              <div>
                <p className="text-pastel-primary/40 text-xs font-bold uppercase tracking-widest">{kpi.label}</p>
                <p className="text-3xl font-heading font-bold text-pastel-primary mt-1">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-soft border border-pastel-secondary/5">
          <h3 className="text-xl font-heading font-bold text-pastel-primary mb-8">Revenue Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.salesOverTime}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FDE8E8" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#9B6B6B", fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#9B6B6B", fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#9B6B6B" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: "#9B6B6B" }} 
                  activeDot={{ r: 8, stroke: "#FFF5F5", strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-pastel-primary text-white p-8 rounded-[3rem] shadow-lg relative overflow-hidden flex flex-col justify-between group">
          <Sparkles className="absolute -right-10 -top-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <h3 className="text-2xl font-heading font-bold mb-4">AI Ready to Scale?</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Your sales are up 12%. Use the AI Content Generator to create high-converting ads for your top-selling category.
            </p>
          </div>
          <button className="mt-8 bg-white text-pastel-primary px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-xl transition-all w-fit">
            Launch AI Tools
          </button>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
