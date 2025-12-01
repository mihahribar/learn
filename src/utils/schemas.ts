/**
 * Zod schemas for runtime validation of persisted data
 * Ensures data integrity when loading from localStorage
 */

import { z } from 'zod';

/**
 * Schema for word statistics
 */
export const wordStatsSchema = z.object({
  attempts: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
  lastPlayed: z.string(),
});

/**
 * Schema for persisted progress data
 * Validates all fields to ensure data integrity
 */
export const persistedProgressSchema = z.object({
  version: z.literal(1),
  totalPoints: z.number().int().nonnegative(),
  wordsCompleted: z.number().int().nonnegative(),
  roundsPlayed: z.number().int().nonnegative(),
  badges: z.array(z.string()),
  wordStats: z.record(z.string(), wordStatsSchema),
  lastPlayedDate: z.string(),
  currentStreak: z.number().int().nonnegative(),
  longestStreak: z.number().int().nonnegative(),
  consecutiveDays: z.number().int().nonnegative(),
});

/**
 * Type inference from schema
 */
export type ValidatedPersistedProgress = z.infer<typeof persistedProgressSchema>;

/**
 * Validates and parses persisted progress data
 * Returns validated data or null if validation fails
 *
 * @param data - Unknown data from localStorage
 * @returns Validated progress data or null
 */
export function validatePersistedProgress(data: unknown): ValidatedPersistedProgress | null {
  try {
    return persistedProgressSchema.parse(data);
  } catch (error) {
    console.warn('Invalid progress data:', error);
    return null;
  }
}

/**
 * Safely validates persisted progress with detailed error reporting
 * Returns validation result with success flag and data/errors
 *
 * @param data - Unknown data from localStorage
 * @returns Validation result with success flag
 */
export function safeValidateProgress(data: unknown): {
  success: boolean;
  data: ValidatedPersistedProgress | null;
  error: z.ZodError | null;
} {
  const result = persistedProgressSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
      error: null,
    };
  }

  return {
    success: false,
    data: null,
    error: result.error,
  };
}
