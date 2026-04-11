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
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const filled = star <= (hovered || value);
        return (
          <span
            key={star}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => onChange && setHovered(star)}
            onMouseLeave={() => onChange && setHovered(0)}
            style={{
              fontSize: size,
              cursor: onChange ? 'pointer' : 'default',
              color: filled ? '#f4b400' : '#ccc',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            ★
          </span>
        );
      })}
    </span>
  );
};

export default RatingStars;
