"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  BarChart3, TrendingUp, Target, 
  Tag, Camera, Printer, RefreshCcw, 
  Loader2, DollarSign, Package 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisData {
  rawStats: {
    totalRevenue: number;
    totalOrders: number;
  };
  bestCategory: string;
  why: string;
  campaignSuggestion: {
    name: string;
    channel: string;
    targetAudience: string;
  };
  discountStrategy: string;
  instagramIdeas: string[];
}

export default function AIMarketingDashboard() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/analyze-marketing", { method: "POST" });
      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="container px-4 mx-auto py-12 lg:px-8 max-w-7xl print:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 no-print">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pastel-primary text-white rounded-2xl shadow-lg">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-heading font-bold text-pastel-primary tracking-tight">Marketing Insights</h1>
            <p className="text-pastel-primary/60">30-day performance analysis powered by AI.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={exportPDF} 
            disabled={!analysis}
            className="gap-2"
          >
            <Printer className="w-4 h-4" /> Export Report
          </Button>
          <Button 
            onClick={fetchAnalysis} 
            disabled={loading}
            className="gap-2 shadow-lg shadow-pastel-primary/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            Refresh Analysis
          </Button>
        </div>
      </div>

      {!analysis && !loading && (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] shadow-soft border border-pastel-secondary/5 no-print">
          <div className="w-20 h-20 bg-pastel-bg rounded-full flex items-center justify-center mb-8">
            <TrendingUp className="w-10 h-10 text-pastel-primary/30" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-pastel-primary mb-4">No analysis data yet</h2>
          <p className="text-pastel-primary/60 max-w-md mx-auto mb-8">
            Click the refresh button to generate a comprehensive 30-day marketing strategy report using your current sales data.
          </p>
          <Button onClick={fetchAnalysis}>Generate First Report</Button>
        </div>
      )}

      {loading && (
        <div className="py-32 flex flex-col items-center gap-6 no-print">
          <Loader2 className="w-12 h-12 animate-spin text-pastel-primary" />
          <p className="text-pastel-primary font-medium animate-pulse">Aggregating sales data and consulting Gemini AI...</p>
        </div>
      )}

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-pastel-secondary/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-pastel-bg rounded-lg text-pastel-primary"><DollarSign className="w-5 h-5" /></div>
                  <span className="text-xs font-bold text-pastel-primary/40 uppercase tracking-widest">30-Day Revenue</span>
                </div>
                <p className="text-3xl font-heading font-bold text-pastel-primary">${analysis.rawStats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-pastel-secondary/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-pastel-bg rounded-lg text-pastel-primary"><Package className="w-5 h-5" /></div>
                  <span className="text-xs font-bold text-pastel-primary/40 uppercase tracking-widest">Total Orders</span>
                </div>
                <p className="text-3xl font-heading font-bold text-pastel-primary">{analysis.rawStats.totalOrders}</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-pastel-secondary/5 lg:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-pastel-bg rounded-lg text-pastel-primary"><TrendingUp className="w-5 h-5" /></div>
                  <span className="text-xs font-bold text-pastel-primary/40 uppercase tracking-widest">Top Selling Category</span>
                </div>
                <div className="flex items-baseline gap-3">
                   <p className="text-3xl font-heading font-bold text-pastel-primary">{analysis.bestCategory}</p>
                   <span className="text-sm text-pastel-primary/60 italic">{analysis.why}</span>
                </div>
              </div>
            </div>

            {/* AI Insights Sections */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Campaign & Strategy */}
              <div className="space-y-8">
                <div className="bg-pastel-primary text-white p-10 rounded-[3rem] shadow-lg relative overflow-hidden group">
                  <Target className="absolute -right-8 -top-8 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform" />
                  <div className="relative z-10 space-y-6">
                    <h2 className="text-3xl font-heading font-bold border-b border-white/20 pb-6">Proposed Campaign</h2>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">{analysis.campaignSuggestion.name}</h3>
                      <p className="text-white/80 leading-relaxed">Primary Channel: {analysis.campaignSuggestion.channel}</p>
                      <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest">
                        Target: {analysis.campaignSuggestion.targetAudience}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-pastel-secondary/5">
                  <h2 className="text-2xl font-heading font-bold text-pastel-primary mb-6 flex items-center gap-3">
                    <Tag className="w-6 h-6" /> Discount Strategy
                  </h2>
                  <div className="p-6 bg-pastel-bg rounded-2xl border-l-4 border-pastel-primary">
                    <p className="text-pastel-primary font-medium leading-relaxed italic">
                      &quot;{analysis.discountStrategy}&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Instagram Strategy */}
              <div className="bg-pastel-card p-10 rounded-[3rem] shadow-soft border border-pastel-secondary/5 space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-heading font-bold text-pastel-primary flex items-center gap-3">
                    <Camera className="w-6 h-6" /> Instagram Roadmap
                  </h2>
                </div>
                <div className="space-y-6">
                  {analysis.instagramIdeas.map((idea: string, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm space-y-3">
                      <div className="flex justify-between items-center border-b border-pastel-bg pb-3">
                        <span className="text-[10px] font-bold text-pastel-primary/40 uppercase tracking-widest">Post {i+1}</span>
                      </div>
                      <p className="text-sm text-pastel-primary/70">{idea}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <p className="text-center text-xs text-pastel-primary/40 py-8 italic no-print">
              Recommendations are generated by Gemini AI based on current sales patterns. Review carefully before deploying.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .container { max-width: 100% !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
}

export const dynamic = 'force-dynamic';
