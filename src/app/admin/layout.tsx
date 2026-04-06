"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "ADMIN")) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-pastel-bg">
        <Loader2 className="w-10 h-10 animate-spin text-pastel-primary" />
      </div>
    );
  }

  if (session?.user?.role !== "ADMIN") return null;

  return (
    <div className="flex bg-pastel-bg min-h-screen">
      <AdminSidebar />
      <main className="flex-grow overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
