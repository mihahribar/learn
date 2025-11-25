/**
 * Scoring utilities for the WordGym game
 *
 * Points system:
 * - Correct on first try: 10 points
 * - Correct on second try: 5 points
 * - Perfect round (10/10): 20 bonus points
 * - Completing a round: 5 bonus points
 */

/**
 * Points awarded for a correct answer based on attempt number
 */
export const POINTS = {
  FIRST_TRY: 10,
  SECOND_TRY: 5,
  PERFECT_ROUND_BONUS: 20,
  ROUND_COMPLETE_BONUS: 5,
} as const;

/**
 * Calculate points for a correct answer based on attempt number
 *
 * @param attemptNumber - Which attempt this is (1 or 2)
 * @returns Points awarded
 */
export function calculateAttemptPoints(attemptNumber: number): number {
  if (attemptNumber === 1) {
    return POINTS.FIRST_TRY;
  }
  if (attemptNumber === 2) {
    return POINTS.SECOND_TRY;
  }
  return 0;
}

/**
 * Calculate total round points including bonuses
 *
 * @param score - Number of correct answers (0-10)
 * @param roundPoints - Points earned from individual answers
 * @returns Total points including bonuses
 */
export function calculateRoundTotal(score: number, roundPoints: number): number {
  let total = roundPoints;

  // Add round completion bonus
  total += POINTS.ROUND_COMPLETE_BONUS;

  // Add perfect round bonus
  if (score === 10) {
    total += POINTS.PERFECT_ROUND_BONUS;
  }

  return total;
}

/**
 * Check if an answer is correct (case-insensitive, trimmed)
 *
 * @param userAnswer - The user's answer
 * @param correctAnswer - The correct answer
 * @returns true if the answer is correct
 */
export function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
  const normalizedUser = userAnswer.trim().toLowerCase();
  const normalizedCorrect = correctAnswer.trim().toLowerCase();
  return normalizedUser === normalizedCorrect;
}

/**
 * Get score tier based on round score (for message selection)
 *
 * @param score - Number of correct answers (0-10)
 * @returns Score tier: 'excellent' (8+), 'good' (5-7), 'encouragement' (<5)
 */
export function getScoreTier(score: number): 'excellent' | 'good' | 'encouragement' {
  if (score >= 8) {
    return 'excellent';
  }
  if (score >= 5) {
    return 'good';
  }
  return 'encouragement';
}
