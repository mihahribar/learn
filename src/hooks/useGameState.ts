import { useState, useCallback, useMemo } from 'react';
import type { GameMode, Word, CurrentRound, RoundStats } from '../types';
import { pickRandom } from '../utils/shuffle';
import { isAnswerCorrect, calculateAttemptPoints } from '../utils/scoring';
import { words } from '../data/words';

/**
 * Number of words per round
 */
const WORDS_PER_ROUND = 10;

/**
 * Maximum attempts allowed per word
 */
const MAX_ATTEMPTS = 2;

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
 * Return type for the useGameState hook
 */
interface UseGameStateReturn {
  currentMode: GameMode | null;
  currentWord: Word | null;
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

/**
 * Custom hook for managing game state during gameplay
 * Handles rounds, word progression, scoring, and streaks
 */
export function useGameState(): UseGameStateReturn {
  const [currentMode, setCurrentMode] = useState<GameMode | null>(null);
  const [currentRound, setCurrentRound] = useState<CurrentRound | null>(null);

  /**
   * Get the current word based on round state
   */
  const currentWord = useMemo((): Word | null => {
    if (!currentRound) return null;
    return currentRound.words[currentRound.currentIndex] || null;
  }, [currentRound]);

  /**
   * Calculate round progress for display
   */
  const roundProgress = useMemo((): RoundProgress => {
    if (!currentRound) {
      return { current: 0, total: WORDS_PER_ROUND, score: 0, points: 0 };
    }
    return {
      current: currentRound.currentIndex + 1,
      total: WORDS_PER_ROUND,
      score: currentRound.score,
      points: currentRound.points,
    };
  }, [currentRound]);

  /**
   * Check if the round is complete
   */
  const isRoundComplete = useMemo((): boolean => {
    if (!currentRound) return false;
    return currentRound.currentIndex >= WORDS_PER_ROUND;
  }, [currentRound]);

  /**
   * Get current attempts for the current word
   */
  const currentAttempts = useMemo((): number => {
    if (!currentRound) return 0;
    return currentRound.attempts[currentRound.currentIndex] || 0;
  }, [currentRound]);

  /**
   * Get current streak
   */
  const streak = useMemo((): number => {
    return currentRound?.streak || 0;
  }, [currentRound]);

  /**
   * Get max streak achieved in this round
   */
  const maxStreak = useMemo((): number => {
    return currentRound?.maxStreak || 0;
  }, [currentRound]);

  /**
   * Start a new game with the specified mode
   */
  const startGame = useCallback((mode: GameMode) => {
    // Filter words based on game mode
    let availableWords = words;
    if (mode === 'plural-forms') {
      // Only include words with plural form data
      availableWords = words.filter(
        (word) => word.pluralForm && word.wrongPluralForms && word.wrongPluralForms.length === 2
      );
    }

    const roundWords = pickRandom(availableWords, WORDS_PER_ROUND);

    const newRound: CurrentRound = {
      words: roundWords,
      currentIndex: 0,
      score: 0,
      points: 0,
      attempts: new Array(WORDS_PER_ROUND).fill(0),
      streak: 0,
      maxStreak: 0,
    };

    setCurrentMode(mode);
    setCurrentRound(newRound);
  }, []);

  /**
   * Submit an answer for the current word
   * Returns result with correctness, points, and whether to advance
   */
  const submitAnswer = useCallback(
    (answer: string): SubmitResult => {
      if (!currentRound || !currentWord) {
        return {
          correct: false,
          pointsEarned: 0,
          attemptNumber: 0,
          shouldAdvance: false,
          correctAnswer: '',
        };
      }

      const attemptNumber = currentRound.attempts[currentRound.currentIndex] + 1;

      // For plural-forms mode, check against pluralForm, otherwise check against english
      const correctAnswer = currentMode === 'plural-forms' && currentWord.pluralForm
        ? currentWord.pluralForm
        : currentWord.english;

      const correct = isAnswerCorrect(answer, correctAnswer);
      let pointsEarned = 0;

      setCurrentRound((prev) => {
        if (!prev) return prev;

        const newAttempts = [...prev.attempts];
        newAttempts[prev.currentIndex] = attemptNumber;

        let newScore = prev.score;
        let newPoints = prev.points;
        let newStreak = prev.streak;
        let newMaxStreak = prev.maxStreak;

        if (correct) {
          newScore += 1;
          pointsEarned = calculateAttemptPoints(attemptNumber);
          newPoints += pointsEarned;
          newStreak += 1;
          newMaxStreak = Math.max(newMaxStreak, newStreak);
        } else {
          newStreak = 0;
        }

        return {
          ...prev,
          attempts: newAttempts,
          score: newScore,
          points: newPoints,
          streak: newStreak,
          maxStreak: newMaxStreak,
        };
      });

      const shouldAdvance = correct || attemptNumber >= MAX_ATTEMPTS;

      return {
        correct,
        pointsEarned,
        attemptNumber,
        shouldAdvance,
        correctAnswer,
      };
    },
    [currentRound, currentWord, currentMode]
  );

  /**
   * Advance to the next word in the round
   */
  const advanceToNextWord = useCallback(() => {
    setCurrentRound((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
      };
    });
  }, []);

  /**
   * End the current round and return final stats
   */
  const endRound = useCallback((): RoundStats => {
    if (!currentRound) {
      return {
        score: 0,
        maxStreak: 0,
        perfectRound: false,
      };
    }

    const stats: RoundStats = {
      score: currentRound.score,
      maxStreak: currentRound.maxStreak,
      perfectRound: currentRound.score === WORDS_PER_ROUND,
    };

    return stats;
  }, [currentRound]);

  /**
   * Reset game state to initial
   */
  const resetGame = useCallback(() => {
    setCurrentMode(null);
    setCurrentRound(null);
  }, []);

  return {
    currentMode,
    currentWord,
    roundProgress,
    isRoundComplete,
    currentAttempts,
    streak,
    maxStreak,
    startGame,
    submitAnswer,
    advanceToNextWord,
    endRound,
    resetGame,
  };
}

export default useGameState;
