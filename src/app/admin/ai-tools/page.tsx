"use client";

import Link from "next/link";
import { Sparkles, BookOpen, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AIToolsPage() {
  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-pastel-primary/10 text-pastel-primary font-semibold uppercase tracking-[0.2em]">
          <Sparkles className="w-5 h-5" /> AI Marketing & Content
        </div>
        <div>
          <h1 className="text-4xl font-heading font-bold text-pastel-primary">AI Tools Hub</h1>
          <p className="max-w-2xl text-pastel-primary/70 text-lg leading-relaxed">
            Manage your beauty brand growth with AI-powered content creation and marketing analysis. Use the tools below to turn sales data into strategy.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Link href="/admin/ai-content" className="group block rounded-[2.5rem] border border-pastel-secondary/20 bg-white p-8 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-3xl bg-pastel-primary text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-pastel-primary">AI Content Generator</h2>
              <p className="text-pastel-primary/70">Create product descriptions, social captions, and ad copy in seconds.</p>
            </div>
          </div>
          <Button className="w-full">Open Content Generator</Button>
        </Link>

        <Link href="/admin/ai-marketing" className="group block rounded-[2.5rem] border border-pastel-secondary/20 bg-white p-8 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-3xl bg-pastel-primary text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-pastel-primary">AI Marketing Analyzer</h2>
              <p className="text-pastel-primary/70">Turn your last 30 days of sales into a growth campaign and messaging strategy.</p>
            </div>
          </div>
          <Button className="w-full">Open Marketing Insights</Button>
        </Link>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
