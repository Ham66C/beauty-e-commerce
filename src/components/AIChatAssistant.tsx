"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Button } from "./ui/Button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Which serum is best for acne?",
  "Recommend a routine for dry skin",
  "Best products for fine lines",
  "Show me natural cleansers",
];

export const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [skinType, setSkinType] = useState("");
  const [concerns, setConcerns] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleStartChat = () => {
    if (skinType) {
      setShowForm(false);
      setMessages([{ role: "assistant", content: `Hi there! I see you have ${skinType} skin. How can I help you find the perfect ritual today?` }]);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          userContext: { skinType, concerns },
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setShowForm(true);
    setMessages([]);
    setSkinType("");
    setConcerns("");
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 p-4 bg-pastel-primary text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-pastel-primary rounded-full" />
        </div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold">
          Ask BEAUTÉ AI
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
            className="fixed bottom-28 right-8 z-50 w-full max-w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-soft overflow-hidden flex flex-col border border-pastel-secondary/10"
          >
            {/* Header */}
            <div className="bg-pastel-primary p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold">BEAUTÉ Advisor</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-70">AI-Powered Rituals</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={restart} className="p-2 hover:bg-white/10 rounded-full transition-colors"><RefreshCw className="w-4 h-4" /></button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-grow overflow-hidden relative flex flex-col bg-pastel-bg/30">
              <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {showForm ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="p-6 bg-white rounded-3xl shadow-sm border border-pastel-secondary/5 space-y-6">
                      <p className="text-pastel-primary font-medium">To give you the best advice, tell me a bit about your skin:</p>
                      <div className="space-y-4">
                        <select 
                          className="w-full p-3 bg-pastel-bg rounded-xl text-sm font-bold text-pastel-primary border-none outline-none focus:ring-2 ring-pastel-secondary"
                          value={skinType}
                          onChange={(e) => setSkinType(e.target.value)}
                        >
                          <option value="">Select Skin Type</option>
                          <option value="Dry">Dry</option>
                          <option value="Oily">Oily</option>
                          <option value="Combination">Combination</option>
                          <option value="Normal">Normal</option>
                        </select>
                        <input 
                          placeholder="Main concern (e.g., acne, aging)"
                          className="w-full p-3 bg-pastel-bg rounded-xl text-sm font-bold text-pastel-primary outline-none focus:ring-2 ring-pastel-secondary border-none"
                          value={concerns}
                          onChange={(e) => setConcerns(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleStartChat} className="w-full" disabled={!skinType}>
                        Start Conversation
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] p-4 rounded-3xl text-sm shadow-sm ${
                          m.role === "user" 
                            ? "bg-pastel-primary text-white rounded-br-none" 
                            : "bg-white text-pastel-primary rounded-bl-none border border-pastel-secondary/5"
                        }`}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-3xl rounded-bl-none border border-pastel-secondary/5">
                          <Loader2 className="w-4 h-4 animate-spin text-pastel-primary" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Suggestions */}
              {!showForm && messages.length < 3 && (
                <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="whitespace-nowrap px-4 py-2 bg-white rounded-full text-xs font-bold text-pastel-primary shadow-sm hover:bg-pastel-card transition-colors border border-pastel-secondary/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              {!showForm && (
                <div className="p-4 bg-white border-t border-pastel-secondary/10 flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask anything..."
                    className="flex-grow p-3 bg-pastel-bg rounded-2xl text-sm outline-none text-pastel-primary placeholder:text-pastel-primary/40"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                    className="p-3 bg-pastel-primary text-white rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
