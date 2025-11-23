import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from './useGameState'

describe('useGameState', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('starts with null mode and no current word', () => {
    const { result } = renderHook(() => useGameState())

    expect(result.current.currentMode).toBeNull()
    expect(result.current.currentWord).toBeNull()
    expect(result.current.isRoundComplete).toBe(false)
  })

  it('initializes round with 10 words when game starts', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.startGame('listen-spell')
    })

    expect(result.current.currentMode).toBe('listen-spell')
    expect(result.current.currentWord).not.toBeNull()
    expect(result.current.roundProgress.current).toBe(1)
    expect(result.current.roundProgress.total).toBe(10)
  })

  it('tracks correct answers and advances through round', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.startGame('listen-spell')
    })

    const correctAnswer = result.current.currentWord!.english

    act(() => {
      const submitResult = result.current.submitAnswer(correctAnswer)
      expect(submitResult.correct).toBe(true)
      expect(submitResult.shouldAdvance).toBe(true)
    })

    act(() => {
      result.current.advanceToNextWord()
    })

    expect(result.current.roundProgress.current).toBe(2)
    expect(result.current.roundProgress.score).toBe(1)
    // First try gives 10 points
    expect(result.current.roundProgress.points).toBe(10)
  })

  it('allows second attempt on wrong answer', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.startGame('listen-spell')
    })

    // First attempt - wrong
    act(() => {
      const firstResult = result.current.submitAnswer('wronganswer')
      expect(firstResult.correct).toBe(false)
      expect(firstResult.attemptNumber).toBe(1)
      expect(firstResult.shouldAdvance).toBe(false)
    })

    expect(result.current.currentAttempts).toBe(1)

    // Second attempt - correct
    const correctAnswer = result.current.currentWord!.english

    act(() => {
      const secondResult = result.current.submitAnswer(correctAnswer)
      expect(secondResult.correct).toBe(true)
      expect(secondResult.attemptNumber).toBe(2)
      expect(secondResult.shouldAdvance).toBe(true)
    })

    // Check points were accumulated (5 for second try)
    expect(result.current.roundProgress.points).toBe(5)
  })

  it('completes round after 10 words and returns stats', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.startGame('pick-spelling')
    })

    // Answer all 10 words correctly on first try
    for (let i = 0; i < 10; i++) {
      const correctAnswer = result.current.currentWord!.english

      act(() => {
        result.current.submitAnswer(correctAnswer)
      })

      act(() => {
        result.current.advanceToNextWord()
      })
    }

    expect(result.current.isRoundComplete).toBe(true)

    let stats
    act(() => {
      stats = result.current.endRound()
    })

    expect(stats).toEqual({
      score: 10,
      maxStreak: 10,
      perfectRound: true,
    })
  })

  it('resets game state when resetGame is called', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.startGame('listen-spell')
    })

    expect(result.current.currentMode).toBe('listen-spell')

    act(() => {
      result.current.resetGame()
    })

    expect(result.current.currentMode).toBeNull()
    expect(result.current.currentWord).toBeNull()
  })
})
