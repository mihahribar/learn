import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './useGameState';
import { isSentenceExercise } from '../types';

describe('useGameState - sentence-ordering mode', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('loads 10 SentenceExercises when starting sentence-ordering', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('sentence-ordering');
    });

    expect(result.current.currentMode).toBe('sentence-ordering');
    expect(result.current.currentWord).not.toBeNull();
    expect(isSentenceExercise(result.current.currentWord!)).toBe(true);
    expect(result.current.roundProgress.current).toBe(1);
    expect(result.current.roundProgress.total).toBe(10);
  });

  it('accepts correct answer as joined words', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('sentence-ordering');
    });

    const current = result.current.currentWord;
    if (!current || !isSentenceExercise(current)) {
      throw new Error('Expected SentenceExercise');
    }

    // Join the correct words to form the answer
    const correctAnswer = current.correctWords.join(' ');

    act(() => {
      const submitResult = result.current.submitAnswer(correctAnswer);
      expect(submitResult.correct).toBe(true);
      expect(submitResult.pointsEarned).toBe(10);
      expect(submitResult.shouldAdvance).toBe(true);
    });

    expect(result.current.roundProgress.score).toBe(1);
    expect(result.current.roundProgress.points).toBe(10);
  });

  it('awards 5 points on second attempt', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('sentence-ordering');
    });

    // First attempt - wrong
    act(() => {
      const firstResult = result.current.submitAnswer('wrong answer words');
      expect(firstResult.correct).toBe(false);
      expect(firstResult.shouldAdvance).toBe(false);
    });

    // Second attempt - correct
    const current = result.current.currentWord;
    if (!current || !isSentenceExercise(current)) {
      throw new Error('Expected SentenceExercise');
    }
    const correctAnswer = current.correctWords.join(' ');

    act(() => {
      const secondResult = result.current.submitAnswer(correctAnswer);
      expect(secondResult.correct).toBe(true);
      expect(secondResult.pointsEarned).toBe(5);
      expect(secondResult.attemptNumber).toBe(2);
    });

    expect(result.current.roundProgress.points).toBe(5);
  });

  it('forces advance after 2 failed attempts', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('sentence-ordering');
    });

    // Two wrong attempts
    act(() => {
      const first = result.current.submitAnswer('wrong');
      expect(first.shouldAdvance).toBe(false);
    });

    act(() => {
      const second = result.current.submitAnswer('still wrong');
      expect(second.shouldAdvance).toBe(true);
      expect(second.correct).toBe(false);
    });
  });

  it('returns correct answer string on submit', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('sentence-ordering');
    });

    const current = result.current.currentWord;
    if (!current || !isSentenceExercise(current)) {
      throw new Error('Expected SentenceExercise');
    }
    const expectedAnswer = current.correctWords.join(' ');

    act(() => {
      const submitResult = result.current.submitAnswer('wrong');
      expect(submitResult.correctAnswer).toBe(expectedAnswer);
    });
  });
});
