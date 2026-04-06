"use client";

import React, { useState } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { useRecommender } from "@/hooks/useRecommender";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, ChevronRight, RefreshCcw, Loader2 } from "lucide-react";

const SKIN_TYPES = ["Dry", "Oily", "Combination", "Normal", "Sensitive"];
const CONCERNS = ["Acne", "Aging", "Dullness", "Large Pores", "Sun Damage", "Dehydration"];

interface Recommendation {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string;
}

export const SkincareQuiz = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    skinType: "",
    concerns: [] as string[],
    sensitivity: "Medium",
  });
  const { mutate, data: recommendations, isPending, reset } = useRecommender();

  const handleToggleConcern = (concern: string) => {
    setFormData((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter((c) => c !== concern)
        : [...prev.concerns, concern],
    }));
  };

  const handleFinish = () => {
    mutate({ skinType: formData.skinType, concerns: formData.concerns });
    setStep(4);
  };

  const restart = () => {
    setStep(1);
    setFormData({ skinType: "", concerns: [], sensitivity: "Medium" });
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Skincare Quiz">
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h3 className="text-lg font-heading font-bold text-pastel-primary">What is your skin type?</h3>
              <div className="grid grid-cols-2 gap-3">
                {SKIN_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => { setFormData({ ...formData, skinType: type }); setStep(2); }}
                    className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold ${
                      formData.skinType === type ? "border-pastel-primary bg-pastel-primary text-white" : "border-pastel-bg text-pastel-primary hover:border-pastel-secondary"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h3 className="text-lg font-heading font-bold text-pastel-primary">What are your skin concerns?</h3>
              <div className="grid grid-cols-2 gap-3">
                {CONCERNS.map((concern) => (
                  <button
                    key={concern}
                    onClick={() => handleToggleConcern(concern)}
                    className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold flex items-center justify-between ${
                      formData.concerns.includes(concern) ? "border-pastel-primary bg-pastel-primary text-white" : "border-pastel-bg text-pastel-primary hover:border-pastel-secondary"
                    }`}
                  >
                    {concern}
                    {formData.concerns.includes(concern) && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
              <Button onClick={() => setStep(3)} className="w-full h-14" disabled={formData.concerns.length === 0}>
                Next Step <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 py-4">
              <h3 className="text-lg font-heading font-bold text-pastel-primary">Almost there! How sensitive is your skin?</h3>
              <div className="space-y-6">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  className="w-full accent-pastel-primary h-2 bg-pastel-bg rounded-lg cursor-pointer"
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setFormData({ ...formData, sensitivity: val === 1 ? "Low" : val === 2 ? "Medium" : "High" });
                  }}
                />
                <div className="flex justify-between text-xs font-bold text-pastel-primary uppercase tracking-widest">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
              <Button onClick={handleFinish} className="w-full h-16 text-lg gap-2" variant="primary">
                <Sparkles className="w-5 h-5" /> Analyze My Skin
              </Button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {isPending ? (
                <div className="py-20 flex flex-col items-center gap-6 text-center">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-pastel-primary opacity-20" />
                    <Sparkles className="w-8 h-8 text-pastel-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-pastel-primary">AI is analyzing your skin profile...</h3>
                    <p className="text-sm text-pastel-primary/60">Matching your needs with our clinical formulations.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-pastel-bg/50 p-6 rounded-3xl border border-pastel-secondary/10">
                    <h3 className="text-xl font-heading font-bold text-pastel-primary flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5" /> Your Personalized Ritual
                    </h3>
                    <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {(recommendations as Recommendation[])?.map((p) => (
                        <div key={p.id} className="bg-white p-3 rounded-2xl flex gap-4 items-center border border-pastel-secondary/5">
                           <div className="w-16 h-16 rounded-xl bg-pastel-card overflow-hidden relative flex-shrink-0">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={JSON.parse(p.images)[0]} alt={p.name} className="object-cover w-full h-full" />
                           </div>
                           <div className="flex-grow">
                             <h4 className="text-sm font-bold text-pastel-primary line-clamp-1">{p.name}</h4>
                             <p className="text-xs text-pastel-primary/60">{p.category}</p>
                           </div>
                           <p className="font-bold text-pastel-primary pr-2">${p.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={restart} variant="outline" className="flex-1 h-14 gap-2">
                      <RefreshCcw className="w-4 h-4" /> Retake Quiz
                    </Button>
                    <Button onClick={onClose} className="flex-1 h-14">Close Results</Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
