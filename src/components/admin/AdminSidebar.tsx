"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, ShoppingBag, 
  ClipboardList, Sparkles, 
  Settings, LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const MENU_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Products", icon: ShoppingBag, href: "/admin/products" },
  { label: "Orders", icon: ClipboardList, href: "/admin/orders" },
  { label: "AI Tools", icon: Sparkles, href: "/admin/ai-tools" },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-pastel-card flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <Link href="/" className="text-2xl font-heading font-bold text-pastel-primary">
          BEAUTÉ <span className="text-xs block opacity-50 uppercase tracking-tighter">Admin Portal</span>
        </Link>
      </div>

      <nav className="flex-grow px-4 space-y-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium",
                isActive 
                  ? "bg-pastel-primary text-white shadow-lg shadow-pastel-primary/20" 
                  : "text-pastel-primary/60 hover:bg-pastel-bg hover:text-pastel-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-pastel-bg">
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-2xl text-red-400 hover:bg-red-50 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};
