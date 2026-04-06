import React from "react";
import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  max?: number;
}

export const RatingStars = ({ rating, max = 5 }: RatingStarsProps) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 1; i <= max; i++) {
    if (i <= fullStars) {
      stars.push(<Star key={i} className="w-4 h-4 fill-pastel-primary text-pastel-primary" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<StarHalf key={i} className="w-4 h-4 fill-pastel-primary text-pastel-primary" />);
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-pastel-secondary" />);
    }
  }

  return <div className="flex gap-0.5">{stars}</div>;
};
