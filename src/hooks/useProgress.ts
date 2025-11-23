import { useState, useEffect, useCallback } from 'react';
import type { PersistedProgress, RoundStats, Badge } from '../types';
import { getProgress, saveProgress, isStorageAvailable } from '../utils/storage';
import { checkNewBadges } from '../data/badges';

/**
 * Default progress state for new users
 */
const DEFAULT_PROGRESS: PersistedProgress = {
  version: 1,
  totalPoints: 0,
  wordsCompleted: 0,
  roundsPlayed: 0,
  badges: [],
  wordStats: {},
  lastPlayedDate: '',
  currentStreak: 0,
  longestStreak: 0,
  consecutiveDays: 0,
};

/**
 * Return type for the useProgress hook
 */
interface UseProgressReturn {
  progress: PersistedProgress;
  storageAvailable: boolean;
  addPoints: (points: number) => void;
  recordWordAttempt: (wordId: string, correct: boolean) => void;
  incrementRoundsPlayed: () => void;
  checkAndAwardBadges: (roundStats?: RoundStats) => Badge[];
  updateStreak: (correct: boolean) => void;
  resetCurrentStreak: () => void;
}

/**
 * Get the current date as ISO string (date only, no time)
 */
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Check if two ISO date strings are consecutive days
 */
function areConsecutiveDays(date1: string, date2: string): boolean {
  if (!date1 || !date2) return false;

  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  return diffDays === 1;
}

/**
 * Check if two ISO date strings are the same day
 */
function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

/**
 * Custom hook for managing persistent game progress
 * Handles localStorage read/write with graceful fallback
 */
export function useProgress(): UseProgressReturn {
  const [progress, setProgress] = useState<PersistedProgress>(DEFAULT_PROGRESS);
  const [storageAvailable, setStorageAvailable] = useState(true);

  /**
   * Load progress from localStorage on mount
   */
  useEffect(() => {
    const available = isStorageAvailable();
    setStorageAvailable(available);

    if (!available) {
      return;
    }

    const savedProgress = getProgress<PersistedProgress>();
    if (savedProgress && savedProgress.version === 1) {
      const today = getTodayDate();
      const lastPlayed = savedProgress.lastPlayedDate;

      let updatedProgress = { ...savedProgress };

      if (lastPlayed && !isSameDay(lastPlayed, today)) {
        if (areConsecutiveDays(lastPlayed, today)) {
          updatedProgress = {
            ...updatedProgress,
            consecutiveDays: updatedProgress.consecutiveDays + 1,
            lastPlayedDate: today,
          };
        } else {
          updatedProgress = {
            ...updatedProgress,
            consecutiveDays: 1,
            lastPlayedDate: today,
          };
        }
        saveProgress(updatedProgress);
      } else if (!lastPlayed) {
        updatedProgress = {
          ...updatedProgress,
          consecutiveDays: 1,
          lastPlayedDate: today,
        };
        saveProgress(updatedProgress);
      }

      setProgress(updatedProgress);
    } else {
      const initialProgress = {
        ...DEFAULT_PROGRESS,
        lastPlayedDate: getTodayDate(),
        consecutiveDays: 1,
      };
      saveProgress(initialProgress);
      setProgress(initialProgress);
    }
  }, []);

  /**
   * Save progress to localStorage whenever it changes
   */
  const persistProgress = useCallback(
    (newProgress: PersistedProgress) => {
      setProgress(newProgress);
      if (storageAvailable) {
        saveProgress(newProgress);
      }
    },
    [storageAvailable]
  );

  /**
   * Add points to total
   */
  const addPoints = useCallback(
    (points: number) => {
      setProgress((prev) => {
        const newProgress = {
          ...prev,
          totalPoints: prev.totalPoints + points,
        };
        if (storageAvailable) {
          saveProgress(newProgress);
        }
        return newProgress;
      });
    },
    [storageAvailable]
  );

  /**
   * Record a word attempt (correct or incorrect)
   */
  const recordWordAttempt = useCallback(
    (wordId: string, correct: boolean) => {
      setProgress((prev) => {
        const existingStats = prev.wordStats[wordId] || {
          attempts: 0,
          correct: 0,
          lastPlayed: '',
        };

        const newWordStats = {
          ...prev.wordStats,
          [wordId]: {
            attempts: existingStats.attempts + 1,
            correct: existingStats.correct + (correct ? 1 : 0),
            lastPlayed: getTodayDate(),
          },
        };

        const newProgress = {
          ...prev,
          wordStats: newWordStats,
          wordsCompleted: correct ? prev.wordsCompleted + 1 : prev.wordsCompleted,
        };

        if (storageAvailable) {
          saveProgress(newProgress);
        }
        return newProgress;
      });
    },
    [storageAvailable]
  );

  /**
   * Increment rounds played counter
   */
  const incrementRoundsPlayed = useCallback(() => {
    setProgress((prev) => {
      const newProgress = {
        ...prev,
        roundsPlayed: prev.roundsPlayed + 1,
        lastPlayedDate: getTodayDate(),
      };
      if (storageAvailable) {
        saveProgress(newProgress);
      }
      return newProgress;
    });
  }, [storageAvailable]);

  /**
   * Update streak tracking (for "Hot Hand" badge)
   */
  const updateStreak = useCallback(
    (correct: boolean) => {
      setProgress((prev) => {
        if (correct) {
          const newCurrentStreak = prev.currentStreak + 1;
          const newLongestStreak = Math.max(prev.longestStreak, newCurrentStreak);

          const newProgress = {
            ...prev,
            currentStreak: newCurrentStreak,
            longestStreak: newLongestStreak,
          };

          if (storageAvailable) {
            saveProgress(newProgress);
          }
          return newProgress;
        } else {
          const newProgress = {
            ...prev,
            currentStreak: 0,
          };
          if (storageAvailable) {
            saveProgress(newProgress);
          }
          return newProgress;
        }
      });
    },
    [storageAvailable]
  );

  /**
   * Reset current streak (called at round start)
   */
  const resetCurrentStreak = useCallback(() => {
    setProgress((prev) => {
      const newProgress = {
        ...prev,
        currentStreak: 0,
      };
      if (storageAvailable) {
        saveProgress(newProgress);
      }
      return newProgress;
    });
  }, [storageAvailable]);

  /**
   * Check badge conditions and award any newly earned badges
   * Returns array of newly earned badges
   */
  const checkAndAwardBadges = useCallback(
    (roundStats?: RoundStats): Badge[] => {
      const newBadges = checkNewBadges(progress, roundStats);

      if (newBadges.length > 0) {
        const newBadgeIds = newBadges.map((badge) => badge.id);
        const newProgress = {
          ...progress,
          badges: [...progress.badges, ...newBadgeIds],
        };
        persistProgress(newProgress);
      }

      return newBadges;
    },
    [progress, persistProgress]
  );

  return {
    progress,
    storageAvailable,
    addPoints,
    recordWordAttempt,
    incrementRoundsPlayed,
    checkAndAwardBadges,
    updateStreak,
    resetCurrentStreak,
  };
}

export default useProgress;
