/**
 * Game mode types
 */
export type GameMode = 'listen-spell' | 'pick-spelling' | 'plural-forms' | 'grammar-forms';

/**
 * Word difficulty levels
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Word data structure for the spelling game
 */
export interface Word {
  id: string;
  english: string;
  slovenian: string;
  difficulty: Difficulty;
  wrongSpellings: string[];
  pluralForm?: string;
  wrongPluralForms?: string[];
}

/**
 * Grammar question data structure for grammar exercises
 */
export interface GrammarQuestion {
  id: string;
  sentence: string;
  correctAnswer: string;
  wrongAnswers: string[];
  subjectType: 'singular' | 'plural' | 'first-person';
}

/**
 * Statistics for an individual word
 */
export interface WordStats {
  attempts: number;
  correct: number;
  lastPlayed: string; // ISO date string
}

/**
 * Persisted progress stored in localStorage
 */
export interface PersistedProgress {
  version: 1;
  totalPoints: number;
  wordsCompleted: number;
  roundsPlayed: number;
  badges: string[];
  wordStats: Record<string, WordStats>;
  lastPlayedDate: string; // ISO date string
  currentStreak: number;
  longestStreak: number;
  consecutiveDays: number;
}

/**
 * Badge definition with condition function
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (progress: PersistedProgress, roundStats?: RoundStats) => boolean;
}

/**
 * Round statistics for badge checking
 */
export interface RoundStats {
  score: number;
  maxStreak: number;
  perfectRound: boolean;
}

/**
 * Current round state during gameplay
 */
export interface CurrentRound {
  words: Word[];
  currentIndex: number;
  score: number;
  points: number;
  attempts: number[];
  streak: number;
  maxStreak: number;
}

/**
 * Game state management
 */
export interface GameState {
  currentMode: GameMode | null;
  currentRound: CurrentRound | null;
}

/**
 * Screen navigation types
 */
export type Screen = 'home' | 'listen-spell' | 'pick-spelling' | 'plural-forms' | 'grammar-forms' | 'round-complete' | 'badges';

/**
 * Feedback state for answer submissions
 */
export type FeedbackType = 'correct' | 'wrong' | 'show-answer' | null;

/**
 * Feedback message data
 */
export interface FeedbackState {
  type: FeedbackType;
  message: string;
  correctAnswer?: string;
}
