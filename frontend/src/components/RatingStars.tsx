import React from 'react';

interface RatingStarsProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ value, max = 5, onChange, size = 20 }) => {
  const [hovered, setHovered] = React.useState(0);

  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const filled = star <= (hovered || value);
        return (
          <span
            key={star}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => onChange && setHovered(star)}
            onMouseLeave={() => onChange && setHovered(0)}
            className={`leading-none select-none ${onChange ? 'cursor-pointer' : 'cursor-default'} ${filled ? 'text-accent-400' : 'text-gray-300'}`}
            style={{ fontSize: size }}
          >
            ★
          </span>
        );
      })}
    </span>
  );
};

export default RatingStars;
