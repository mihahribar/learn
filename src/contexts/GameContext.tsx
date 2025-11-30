import { createContext, useContext, ReactNode } from 'react';
import { useGameState } from '../hooks/useGameState';
import type { GameMode, Word, GrammarQuestion, RoundStats } from '../types';

/**
 * Round progress information for display
 */
interface RoundProgress {
  current: number;
  total: number;
  score: number;
  points: number;
}

/**
 * Result of submitting an answer
 */
interface SubmitResult {
  correct: boolean;
  pointsEarned: number;
  attemptNumber: number;
  shouldAdvance: boolean;
  correctAnswer: string;
}

/**
 * Game context value type
 */
interface GameContextValue {
  currentMode: GameMode | null;
  currentWord: Word | GrammarQuestion | null;
  roundProgress: RoundProgress;
  isRoundComplete: boolean;
  currentAttempts: number;
  streak: number;
  maxStreak: number;
  startGame: (mode: GameMode) => void;
  submitAnswer: (answer: string) => SubmitResult;
  advanceToNextWord: () => void;
  endRound: () => RoundStats;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

/**
 * Provider component that wraps the game state logic
 */
export function GameProvider({ children }: { children: ReactNode }) {
  const gameState = useGameState();

  return <GameContext.Provider value={gameState}>{children}</GameContext.Provider>;
}

/**
 * Hook to access game context
 * Throws an error if used outside GameProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
