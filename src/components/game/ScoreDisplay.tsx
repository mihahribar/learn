import { type HTMLAttributes, useEffect, useState } from 'react';
import { labels } from '../../data/messages';

export interface ScoreDisplayProps extends HTMLAttributes<HTMLDivElement> {
  current: number;
  total: number;
  points: number;
  showPoints?: boolean;
}

export function ScoreDisplay({
  current,
  total,
  points,
  showPoints = true,
  className = '',
  ...props
}: ScoreDisplayProps) {
  const [displayedPoints, setDisplayedPoints] = useState(points);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (points !== displayedPoints) {
      setIsAnimating(true);
      const animationDuration = 300;
      const steps = 10;
      const increment = (points - displayedPoints) / steps;
      let currentStep = 0;

      const intervalId = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayedPoints(points);
          setIsAnimating(false);
          clearInterval(intervalId);
        } else {
          setDisplayedPoints((prev) => Math.round(prev + increment));
        }
      }, animationDuration / steps);

      return () => clearInterval(intervalId);
    }
  }, [points, displayedPoints]);

  const baseStyles = 'flex flex-col items-center gap-1';

  const combinedClassName = [baseStyles, className].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName} {...props}>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-primary-700">{current}</span>
        <span className="text-xl text-gray-500">/ {total}</span>
      </div>
      <p className="text-sm text-gray-600">{labels.currentScore}</p>
      {showPoints && (
        <div
          className={`mt-2 px-3 py-1 rounded-full bg-accent-yellow text-gray-900 font-semibold text-sm transition-transform duration-200 ${
            isAnimating ? 'scale-110' : 'scale-100'
          }`}
        >
          {displayedPoints} {labels.points}
        </div>
      )}
    </div>
  );
}

export default ScoreDisplay;
