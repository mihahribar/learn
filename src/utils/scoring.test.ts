import { describe, it, expect } from 'vitest'
import {
  calculateAttemptPoints,
  calculateRoundTotal,
  isAnswerCorrect,
  POINTS,
} from './scoring'

describe('scoring utilities', () => {
  describe('calculateAttemptPoints', () => {
    it('returns 10 points for first try correct answer', () => {
      expect(calculateAttemptPoints(1)).toBe(POINTS.FIRST_TRY)
      expect(calculateAttemptPoints(1)).toBe(10)
    })

    it('returns 5 points for second try correct answer', () => {
      expect(calculateAttemptPoints(2)).toBe(POINTS.SECOND_TRY)
      expect(calculateAttemptPoints(2)).toBe(5)
    })

    it('returns 0 points for attempts beyond second try', () => {
      expect(calculateAttemptPoints(3)).toBe(0)
      expect(calculateAttemptPoints(10)).toBe(0)
    })
  })

  describe('calculateRoundTotal', () => {
    it('adds round completion bonus to points', () => {
      const roundPoints = 50
      const result = calculateRoundTotal(5, roundPoints)
      expect(result).toBe(roundPoints + POINTS.ROUND_COMPLETE_BONUS)
    })

    it('adds perfect round bonus for 10/10 score', () => {
      const roundPoints = 100
      const result = calculateRoundTotal(10, roundPoints)
      expect(result).toBe(
        roundPoints + POINTS.ROUND_COMPLETE_BONUS + POINTS.PERFECT_ROUND_BONUS
      )
    })

    it('does not add perfect bonus for less than 10 correct', () => {
      const roundPoints = 90
      const result = calculateRoundTotal(9, roundPoints)
      expect(result).toBe(roundPoints + POINTS.ROUND_COMPLETE_BONUS)
    })
  })

  describe('isAnswerCorrect', () => {
    it('returns true for exact match', () => {
      expect(isAnswerCorrect('breakfast', 'breakfast')).toBe(true)
    })

    it('returns true for case-insensitive match', () => {
      expect(isAnswerCorrect('BREAKFAST', 'breakfast')).toBe(true)
      expect(isAnswerCorrect('Breakfast', 'BREAKFAST')).toBe(true)
    })

    it('returns true when input has leading/trailing whitespace', () => {
      expect(isAnswerCorrect('  breakfast  ', 'breakfast')).toBe(true)
      expect(isAnswerCorrect('breakfast', '  breakfast  ')).toBe(true)
    })

    it('returns false for incorrect spelling', () => {
      expect(isAnswerCorrect('brekfast', 'breakfast')).toBe(false)
      expect(isAnswerCorrect('breakfest', 'breakfast')).toBe(false)
    })
  })
})
