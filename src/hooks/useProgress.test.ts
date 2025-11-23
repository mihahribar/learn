import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProgress } from './useProgress'

describe('useProgress localStorage persistence', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('initializes with default progress when localStorage is empty', () => {
    const { result } = renderHook(() => useProgress())

    expect(result.current.progress.totalPoints).toBe(0)
    expect(result.current.progress.roundsPlayed).toBe(0)
    expect(result.current.progress.badges).toEqual([])
    expect(result.current.storageAvailable).toBe(true)
  })

  it('persists points to localStorage when addPoints is called', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.addPoints(100)
    })

    expect(result.current.progress.totalPoints).toBe(100)

    // Verify localStorage was updated
    const stored = JSON.parse(
      window.localStorage.getItem('spellbee_progress') || '{}'
    )
    expect(stored.totalPoints).toBe(100)
  })

  it('loads existing progress from localStorage on mount', () => {
    // Pre-populate localStorage
    const existingProgress = {
      version: 1,
      totalPoints: 500,
      wordsCompleted: 50,
      roundsPlayed: 5,
      badges: ['first-round'],
      wordStats: {},
      lastPlayedDate: new Date().toISOString().split('T')[0],
      currentStreak: 3,
      longestStreak: 5,
      consecutiveDays: 2,
    }
    window.localStorage.setItem(
      'spellbee_progress',
      JSON.stringify(existingProgress)
    )

    const { result } = renderHook(() => useProgress())

    expect(result.current.progress.totalPoints).toBe(500)
    expect(result.current.progress.roundsPlayed).toBe(5)
    expect(result.current.progress.badges).toContain('first-round')
  })

  it('increments rounds played and persists to storage', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.incrementRoundsPlayed()
    })

    expect(result.current.progress.roundsPlayed).toBe(1)

    // Verify persistence
    const stored = JSON.parse(
      window.localStorage.getItem('spellbee_progress') || '{}'
    )
    expect(stored.roundsPlayed).toBe(1)
  })

  it('records word attempts and updates wordsCompleted on correct answer', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.recordWordAttempt('word-1', true)
    })

    expect(result.current.progress.wordsCompleted).toBe(1)
    expect(result.current.progress.wordStats['word-1']).toBeDefined()
    expect(result.current.progress.wordStats['word-1'].correct).toBe(1)
  })

  it('updates streak correctly on consecutive correct answers', () => {
    const { result } = renderHook(() => useProgress())

    // Simulate 5 correct answers in a row
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.updateStreak(true)
      })
    }

    expect(result.current.progress.currentStreak).toBe(5)
    expect(result.current.progress.longestStreak).toBe(5)

    // Wrong answer resets current streak
    act(() => {
      result.current.updateStreak(false)
    })

    expect(result.current.progress.currentStreak).toBe(0)
    expect(result.current.progress.longestStreak).toBe(5)
  })
})
