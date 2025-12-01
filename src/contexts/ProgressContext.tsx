import { createContext, useContext, type ReactNode } from 'react';
import { useProgress } from '../hooks/useProgress';
import type { PersistedProgress, RoundStats, Badge } from '../types';

/**
 * Progress context value type
 */
interface ProgressContextValue {
  progress: PersistedProgress;
  storageAvailable: boolean;
  addPoints: (points: number) => void;
  recordWordAttempt: (wordId: string, correct: boolean) => void;
  incrementRoundsPlayed: () => void;
  checkAndAwardBadges: (roundStats?: RoundStats) => Badge[];
  updateStreak: (correct: boolean) => void;
  resetCurrentStreak: () => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

/**
 * Provider component that wraps the progress state logic
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const progressState = useProgress();

  return <ProgressContext.Provider value={progressState}>{children}</ProgressContext.Provider>;
}

/**
 * Hook to access progress context
 * Throws an error if used outside ProgressProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useProgressContext(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return context;
}
