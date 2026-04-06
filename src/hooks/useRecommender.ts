"use client";

import { useMutation } from "@tanstack/react-query";

interface RecommendationParams {
  skinType: string;
  concerns: string[];
  excludeProductId?: string;
  limit?: number;
}

export const useRecommender = () => {
  return useMutation({
    mutationFn: async (params: RecommendationParams) => {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      return res.json();
    },
  });
};
