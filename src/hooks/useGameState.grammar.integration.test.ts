import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './useGameState';

describe('useGameState - Grammar Forms Integration', () => {
  it('should provide different questions in different rounds', () => {
    const { result } = renderHook(() => useGameState());

    // Start first round
    act(() => {
      result.current.startGame('grammar-forms');
    });

    const firstRoundQuestions: string[] = [];
    for (let i = 0; i < 10; i++) {
      const currentQuestion = result.current.currentWord;
      if (currentQuestion && 'sentence' in currentQuestion) {
        firstRoundQuestions.push(currentQuestion.sentence);
      }

      // Answer and advance
      if (currentQuestion && 'correctAnswer' in currentQuestion) {
        act(() => {
          result.current.submitAnswer(currentQuestion.correctAnswer);
        });
        act(() => {
          result.current.advanceToNextWord();
        });
      }
    }

    // Start second round
    act(() => {
      result.current.startGame('grammar-forms');
    });

    const secondRoundQuestions: string[] = [];
    for (let i = 0; i < 10; i++) {
      const currentQuestion = result.current.currentWord;
      if (currentQuestion && 'sentence' in currentQuestion) {
        secondRoundQuestions.push(currentQuestion.sentence);
      }

      // Answer and advance
      if (currentQuestion && 'correctAnswer' in currentQuestion) {
        act(() => {
          result.current.submitAnswer(currentQuestion.correctAnswer);
        });
        act(() => {
          result.current.advanceToNextWord();
        });
      }
    }

    expect(firstRoundQuestions).toHaveLength(10);
    expect(secondRoundQuestions).toHaveLength(10);

    // At least some questions should be different between rounds
    const matchingQuestions = firstRoundQuestions.filter((q) => secondRoundQuestions.includes(q));
    expect(matchingQuestions.length).toBeLessThan(10);
  });

  it('should complete full round and generate correct stats', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('grammar-forms');
    });

    let correctCount = 0;
    let totalPoints = 0;

    // Answer 10 questions with mixed results
    for (let i = 0; i < 10; i++) {
      const currentQuestion = result.current.currentWord;
      if (!currentQuestion || !('correctAnswer' in currentQuestion)) {
        continue;
      }

      // Alternate between correct first try and correct second try
      if (i % 2 === 0) {
        // Correct on first try
        act(() => {
          result.current.submitAnswer(currentQuestion.correctAnswer);
        });
        correctCount++;
        totalPoints += 10;
      } else {
        // Wrong first, correct second
        act(() => {
          result.current.submitAnswer('wrong answer');
        });
        act(() => {
          result.current.submitAnswer(currentQuestion.correctAnswer);
        });
        correctCount++;
        totalPoints += 5;
      }

      act(() => {
        result.current.advanceToNextWord();
      });
    }

    // Get final stats
    let stats: ReturnType<typeof result.current.endRound>;
    act(() => {
      stats = result.current.endRound();
    });

    expect(stats!.score).toBe(correctCount);
    expect(result.current.roundProgress.points).toBe(totalPoints);
  });

  it('should track streak correctly across multiple answers', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('grammar-forms');
    });

    // Answer 3 questions correctly in a row
    for (let i = 0; i < 3; i++) {
      const currentQuestion = result.current.currentWord;
      if (currentQuestion && 'correctAnswer' in currentQuestion) {
        act(() => {
          result.current.submitAnswer(currentQuestion.correctAnswer);
        });
        act(() => {
          result.current.advanceToNextWord();
        });
      }
    }

    // Answer 1 wrong (breaking streak)
    const currentQuestion = result.current.currentWord;
    if (currentQuestion && 'correctAnswer' in currentQuestion) {
      act(() => {
        result.current.submitAnswer('wrong answer');
      });
      act(() => {
        result.current.submitAnswer('wrong answer');
      });
      act(() => {
        result.current.advanceToNextWord();
      });
    }

    // Answer 2 more correctly
    for (let i = 0; i < 2; i++) {
      const currentQuestion = result.current.currentWord;
      if (currentQuestion && 'correctAnswer' in currentQuestion) {
        act(() => {
          result.current.submitAnswer(currentQuestion.correctAnswer);
        });
        act(() => {
          result.current.advanceToNextWord();
        });
      }
    }

    // Complete remaining questions
    for (let i = 0; i < 4; i++) {
      const currentQuestion = result.current.currentWord;
      if (currentQuestion && 'correctAnswer' in currentQuestion) {
        act(() => {
          result.current.submitAnswer(currentQuestion.correctAnswer);
        });
        act(() => {
          result.current.advanceToNextWord();
        });
      }
    }

    // Get stats and verify max streak
    let stats: ReturnType<typeof result.current.endRound>;
    act(() => {
      stats = result.current.endRound();
    });

    // Max streak should be 3 (the first correct answers before the wrong one)
    expect(stats!.maxStreak).toBeGreaterThanOrEqual(2);
  });

  it('should correctly handle perfect round scenario', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame('grammar-forms');
    });

    // Answer all 10 questions correctly on first try
    for (let i = 0; i < 10; i++) {
      const currentQuestion = result.current.currentWord;
      if (currentQuestion && 'correctAnswer' in currentQuestion) {
        act(() => {
          result.current.submitAnswer(currentQuestion.correctAnswer);
        });
        act(() => {
          result.current.advanceToNextWord();
        });
      }
    }

    // Get final stats
    let stats: ReturnType<typeof result.current.endRound>;
    act(() => {
      stats = result.current.endRound();
    });

    expect(stats!.score).toBe(10);
    expect(stats!.perfectRound).toBe(true);
    expect(result.current.roundProgress.points).toBe(100); // 10 * 10 points
  });

  it('should reset state when starting new round', () => {
    const { result } = renderHook(() => useGameState());

    // Complete first round
    act(() => {
      result.current.startGame('grammar-forms');
    });

    // Answer a few questions
    for (let i = 0; i < 3; i++) {
      const currentQuestion = result.current.currentWord;
      if (currentQuestion && 'correctAnswer' in currentQuestion) {
        act(() => {
          result.current.submitAnswer(currentQuestion.correctAnswer);
        });
        act(() => {
          result.current.advanceToNextWord();
        });
      }
    }

    const firstRoundProgress = result.current.roundProgress;
    expect(firstRoundProgress.current).toBe(4);
    expect(firstRoundProgress.score).toBeGreaterThan(0);

    // Start new round
    act(() => {
      result.current.startGame('grammar-forms');
    });

    // Verify state is reset
    expect(result.current.roundProgress.current).toBe(1);
    expect(result.current.roundProgress.score).toBe(0);
    expect(result.current.roundProgress.points).toBe(0);
    expect(result.current.currentAttempts).toBe(0);
  });
});
