import { type HTMLAttributes, useRef, useEffect } from 'react';
import type { FeedbackType } from '../../types';

export interface FeedbackMessageProps extends HTMLAttributes<HTMLDivElement> {
  type: FeedbackType;
  message: string;
  correctAnswer?: string;
}

const typeStyles: Record<Exclude<FeedbackType, null>, string> = {
  correct: 'bg-success-light border-success text-success-dark',
  wrong: 'bg-warning-light border-warning text-warning-dark',
  'show-answer': 'bg-primary-100 border-primary-500 text-primary-800',
};

const typeEmoji: Record<Exclude<FeedbackType, null>, string> = {
  correct: '\u2705',
  wrong: '\uD83D\uDCA1',
  'show-answer': '\uD83D\uDCD6',
};

/**
 * Simple sparkle particle component for success animation
 */
function SparkleParticle({
  delay,
  position,
}: {
  delay: number;
  position: 'left' | 'right' | 'top';
}) {
  const positionStyles = {
    left: 'left-2 top-1/2 -translate-y-1/2',
    right: 'right-2 top-1/2 -translate-y-1/2',
    top: 'left-1/2 -top-2 -translate-x-1/2',
  };

  return (
    <span
      className={`absolute ${positionStyles[position]} text-accent-yellow text-sm animate-bounce-in pointer-events-none`}
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
    >
      {'\u2728'}
    </span>
  );
}

export function FeedbackMessage({
  type,
  message,
  correctAnswer,
  className = '',
  ...props
}: FeedbackMessageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevTypeRef = useRef<FeedbackType>(null);

  // Manage sparkle display via DOM manipulation to avoid lint warning
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Show sparkles when transitioning to correct state
    if (type === 'correct' && prevTypeRef.current !== 'correct') {
      container.classList.add('show-sparkles');
      const timer = setTimeout(() => {
        container.classList.remove('show-sparkles');
      }, 800);
      return () => {
        clearTimeout(timer);
        container.classList.remove('show-sparkles');
      };
    }

    prevTypeRef.current = type;
  }, [type]);

  if (!type) {
    return null;
  }

  const baseStyles =
    'relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 ' +
    'animate-[fadeSlideIn_0.3s_ease-out]';

  // Add success pulse animation for correct answers
  const successAnimation = type === 'correct' ? 'animate-success-pulse' : '';

  const combinedClassName = [baseStyles, typeStyles[type], successAnimation, className]
    .filter(Boolean)
    .join(' ');

  // Always render sparkles for correct type, visibility controlled by CSS
  const showSparkles = type === 'correct';

  return (
    <div
      ref={containerRef}
      key={`${type}-${message}`}
      className={combinedClassName}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {/* Sparkle effects for correct answer - always in DOM when correct, visibility handled by animation */}
      {showSparkles && (
        <>
          <SparkleParticle delay={0} position="left" />
          <SparkleParticle delay={100} position="right" />
          <SparkleParticle delay={200} position="top" />
        </>
      )}

      <span
        className={`text-2xl flex-shrink-0 ${type === 'correct' ? 'animate-bounce-in' : ''}`}
        role="img"
        aria-hidden="true"
      >
        {typeEmoji[type]}
      </span>
      <div className="flex-grow">
        <p className="font-semibold text-base">{message}</p>
        {correctAnswer && type === 'show-answer' && (
          <p className="mt-1 text-lg font-bold">{correctAnswer}</p>
        )}
      </div>
    </div>
  );
}

export default FeedbackMessage;
