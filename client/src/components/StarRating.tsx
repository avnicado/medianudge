import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  readonly?: boolean;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ rating, readonly = false, onRate, size = 'sm' }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (starRating: number) => {
    if (!readonly && onRate) {
      onRate(starRating);
    }
  };

  const handleMouseEnter = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);
        
        return (
          <Star
            key={star}
            className={`${sizeClasses[size]} transition-colors ${
              readonly 
                ? '' 
                : 'cursor-pointer hover:scale-110'
            } ${
              isFilled 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
}
