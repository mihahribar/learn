import { useEffect, useState } from 'react';
import type { Badge, RoundStats } from '../../types';
import { labels, getRoundCompleteMessage } from '../../data/messages';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface RoundCompleteScreenProps {
  roundStats: RoundStats;
  roundPoints: number;
  newBadges: Badge[];
  onPlayAgain: () => void;
  onGoHome: () => void;
  playCelebration: () => void;
  playBadgeSound: () => void;
}

const StarIcon = () => (
  <span className="text-5xl" role="img" aria-label="star">
    {'\u2B50'}
  </span>
);

const CrownIcon = () => (
  <span className="text-5xl" role="img" aria-label="crown">
    {'\uD83D\uDC51'}
  </span>
);

const iconMap: Record<string, string> = {
  star: '\u2B50',
  trophy: '\uD83C\uDFC6',
  crown: '\uD83D\uDC51',
  book: '\uD83D\uDCDA',
  fire: '\uD83D\uDD25',
  medal: '\uD83C\uDFC5',
  calendar: '\uD83D\uDCC5',
};

/**
 * Simple confetti particle component
 */
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  return (
    <div
      className="absolute animate-confetti pointer-events-none"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay}ms`,
        fontSize: '1.5rem',
      }}
      aria-hidden="true"
    >
      <span style={{ color }}>{'\u2022'}</span>
    </div>
  );
}

export function RoundCompleteScreen({
  roundStats,
  roundPoints,
  newBadges,
  onPlayAgain,
  onGoHome,
  playCelebration,
  playBadgeSound,
}: RoundCompleteScreenProps) {
  const [showBadges, setShowBadges] = useState(false);
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  // Play celebration sound on mount
  useEffect(() => {
    playCelebration();

    // Animate points counter
    const targetPoints = roundPoints;
    const duration = 800;
    const steps = 20;
    const increment = targetPoints / steps;
    let currentStep = 0;

    const intervalId = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedPoints(targetPoints);
        clearInterval(intervalId);
      } else {
        setAnimatedPoints(Math.round(increment * currentStep));
      }
    }, duration / steps);

    // Hide confetti after animation
    const confettiTimer = setTimeout(() => setShowConfetti(false), 2000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(confettiTimer);
    };
  }, [roundPoints, playCelebration]);

  // Show badges with delay and play sound
  useEffect(() => {
    if (newBadges.length > 0) {
      const timer = setTimeout(() => {
        setShowBadges(true);
        playBadgeSound();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [newBadges, playBadgeSound]);

  const encouragingMessage = getRoundCompleteMessage(roundStats.score);
  const confettiColors = ['#a855f7', '#22c55e', '#fbbf24', '#ec4899'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 50}
              color={confettiColors[i % confettiColors.length]}
            />
          ))}
        </div>
      )}

      <Card padding="lg" shadow="lg" className="w-full max-w-md text-center relative z-10">
        {/* Celebration header */}
        <header className="mb-6">
          <div className="mb-4 animate-bounce-in">
            {roundStats.perfectRound ? <CrownIcon /> : <StarIcon />}
          </div>
          <h1 className="text-4xl font-bold text-primary-700 mb-2">
            {labels.roundCompleteTitle}
          </h1>
        </header>

        {/* Score display */}
        <section className="mb-6" aria-label="Rezultat">
          <p className="text-2xl font-semibold text-gray-800 mb-2">
            {labels.scoreDisplay(roundStats.score)}
          </p>
          <p className="text-lg text-gray-600">{encouragingMessage}</p>
        </section>

        {/* Points earned with bounce animation */}
        <section
          className="bg-accent-yellow rounded-2xl p-4 mb-6 animate-[pointBounce_0.6s_ease-out]"
          aria-label="Zasluzene tocke"
        >
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {labels.pointsEarned(animatedPoints)}
          </p>
          {roundStats.perfectRound && (
            <p className="text-sm font-medium text-gray-700 animate-pulse">
              {labels.perfectRoundBonus}
            </p>
          )}
        </section>

        {/* New badges section with glow animation */}
        {newBadges.length > 0 && showBadges && (
          <section className="mb-6 animate-[fadeSlideIn_0.5s_ease-out]" aria-label="Nove znacke">
            <p className="text-lg font-semibold text-primary-700 mb-3">
              {labels.newBadgeEarned}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {newBadges.map((badge, index) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-3 bg-primary-50 rounded-xl animate-badge-glow"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <span className="text-4xl mb-2" role="img" aria-label={badge.icon}>
                    {iconMap[badge.icon] || badge.icon}
                  </span>
                  <p className="font-bold text-sm text-gray-800">{badge.name}</p>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Action buttons */}
        <nav className="space-y-3" aria-label="Dejanja">
          <Button
            variant="primary"
            size="large"
            onClick={onPlayAgain}
            className="w-full"
          >
            {labels.playAgainButton}
          </Button>
          <Button
            variant="secondary"
            size="medium"
            onClick={onGoHome}
            className="w-full"
          >
            {labels.homeButton}
          </Button>
        </nav>
      </Card>
    </div>
  );
}

export default RoundCompleteScreen;
