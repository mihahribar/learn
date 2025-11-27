import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './useGameState';

describe('useGameState - grammar-forms mode', () => {
  it('should initialize with grammar questions when starting grammar-forms mode', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('grammar-forms');
    });

    expect(result.current.currentMode).toBe('grammar-forms');
    expect(result.current.currentWord).not.toBeNull();
    expect(result.current.currentWord).toHaveProperty('sentence');
    expect(result.current.currentWord).toHaveProperty('correctAnswer');
    expect(result.current.currentWord).toHaveProperty('wrongAnswers');
  });

  it('should submit answer correctly with grammar questions', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('grammar-forms');
    });

    const currentQuestion = result.current.currentWord;
    if (!currentQuestion || !('correctAnswer' in currentQuestion)) {
      throw new Error('Current question is invalid');
    }

    let submitResult: ReturnType<typeof result.current.submitAnswer>;
    act(() => {
      submitResult = result.current.submitAnswer(currentQuestion.correctAnswer);
    });

    expect(submitResult!.correct).toBe(true);
    expect(submitResult!.pointsEarned).toBe(10);
    expect(submitResult!.shouldAdvance).toBe(true);
  });

  it('should award 10 points for correct first attempt', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('grammar-forms');
    });

    const currentQuestion = result.current.currentWord;
    if (!currentQuestion || !('correctAnswer' in currentQuestion)) {
      throw new Error('Current question is invalid');
    }

    let submitResult: ReturnType<typeof result.current.submitAnswer>;
    act(() => {
      submitResult = result.current.submitAnswer(currentQuestion.correctAnswer);
    });

    expect(submitResult!.correct).toBe(true);
    expect(submitResult!.pointsEarned).toBe(10);
    expect(result.current.roundProgress.points).toBe(10);
    expect(result.current.roundProgress.score).toBe(1);
  });

  it('should award 5 points for correct second attempt', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('grammar-forms');
    });

    const currentQuestion = result.current.currentWord;
    if (!currentQuestion || !('correctAnswer' in currentQuestion)) {
      throw new Error('Current question is invalid');
    }

    const wrongAnswer = 'correctAnswer' in currentQuestion
      ? currentQuestion.wrongAnswers[0]
      : 'wrong';

    act(() => {
      result.current.submitAnswer(wrongAnswer);
    });

    let submitResult: ReturnType<typeof result.current.submitAnswer>;
    act(() => {
      submitResult = result.current.submitAnswer(currentQuestion.correctAnswer);
    });

    expect(submitResult!.correct).toBe(true);
    expect(submitResult!.pointsEarned).toBe(5);
    expect(result.current.roundProgress.points).toBe(5);
    expect(result.current.roundProgress.score).toBe(1);
  });

  it('should handle wrong answers correctly', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('grammar-forms');
    });

    const currentQuestion = result.current.currentWord;
    if (!currentQuestion || !('correctAnswer' in currentQuestion)) {
      throw new Error('Current question is invalid');
    }

    const wrongAnswer = 'correctAnswer' in currentQuestion
      ? currentQuestion.wrongAnswers[0]
      : 'wrong';

    let submitResult: ReturnType<typeof result.current.submitAnswer>;
    act(() => {
      submitResult = result.current.submitAnswer(wrongAnswer);
    });

    expect(submitResult!.correct).toBe(false);
    expect(submitResult!.pointsEarned).toBe(0);
    expect(submitResult!.shouldAdvance).toBe(false);
    expect(result.current.roundProgress.score).toBe(0);
  });

  it('should advance after two wrong attempts', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('grammar-forms');
    });

    const currentQuestion = result.current.currentWord;
    if (!currentQuestion || !('correctAnswer' in currentQuestion)) {
      throw new Error('Current question is invalid');
    }

    const wrongAnswer1 = 'correctAnswer' in currentQuestion
      ? currentQuestion.wrongAnswers[0]
      : 'wrong1';
    const wrongAnswer2 = 'correctAnswer' in currentQuestion
      ? currentQuestion.wrongAnswers[1]
      : 'wrong2';

    act(() => {
      result.current.submitAnswer(wrongAnswer1);
    });

    let submitResult: ReturnType<typeof result.current.submitAnswer>;
    act(() => {
      submitResult = result.current.submitAnswer(wrongAnswer2);
    });

    expect(submitResult!.correct).toBe(false);
    expect(submitResult!.shouldAdvance).toBe(true);
    expect(result.current.roundProgress.score).toBe(0);
  });

  it('should track round progress correctly', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('grammar-forms');
    });

    expect(result.current.roundProgress.current).toBe(1);
    expect(result.current.roundProgress.total).toBe(10);

    const currentQuestion = result.current.currentWord;
    if (currentQuestion && 'correctAnswer' in currentQuestion) {
      act(() => {
        result.current.submitAnswer(currentQuestion.correctAnswer);
      });

      act(() => {
        result.current.advanceToNextWord();
      });

      expect(result.current.roundProgress.current).toBe(2);
    }
  });
});
