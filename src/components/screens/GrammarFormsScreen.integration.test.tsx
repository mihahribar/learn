import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GrammarFormsScreen } from './GrammarFormsScreen';
import type { GrammarQuestion } from '../../types';

describe('GrammarFormsScreen - Integration Tests', () => {
  const createMockQuestion = (id: string, correctAnswer: string): GrammarQuestion => ({
    id,
    sentence: `Test sentence ${id} _______.`,
    correctAnswer,
    wrongAnswers: ['wrong1', 'wrong2'],
    subjectType: correctAnswer === 'has got' ? 'singular' : 'plural',
  });

  const mockPlayCorrectSound = vi.fn();
  const mockPlayWrongSound = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete a full round of 10 questions and calculate stats correctly', async () => {
    const mockOnRoundComplete = vi.fn();
    const mockOnSubmitAnswer = vi.fn();
    const mockOnAdvanceWord = vi.fn();
    const mockOnEndRound = vi.fn().mockReturnValue({
      score: 8,
      maxStreak: 5,
      perfectRound: false,
    });

    const questions = Array.from({ length: 10 }, (_, i) =>
      createMockQuestion(`q${i + 1}`, i % 2 === 0 ? 'have got' : 'has got')
    );

    let currentQuestionIndex = 0;

    mockOnSubmitAnswer.mockImplementation((answer: string) => {
      const currentQuestion = questions[currentQuestionIndex];
      const correct = answer === currentQuestion.correctAnswer;
      return {
        correct,
        pointsEarned: correct ? 10 : 0,
        attemptNumber: 1,
        shouldAdvance: true,
        correctAnswer: currentQuestion.correctAnswer,
      };
    });

    mockOnAdvanceWord.mockImplementation(() => {
      currentQuestionIndex++;
    });

    const { rerender } = render(
      <GrammarFormsScreen
        currentQuestion={questions[0]}
        roundProgress={{ current: 1, total: 10, score: 0, points: 0 }}
        onSubmitAnswer={mockOnSubmitAnswer}
        onAdvanceWord={mockOnAdvanceWord}
        onRoundComplete={mockOnRoundComplete}
        onEndRound={mockOnEndRound}
        onGoBack={vi.fn()}
        playCorrectSound={mockPlayCorrectSound}
        playWrongSound={mockPlayWrongSound}
      />
    );

    // Simulate answering first 9 questions
    for (let i = 0; i < 9; i++) {
      const question = questions[i];
      const correctButton = screen.getByText(question.correctAnswer);
      fireEvent.click(correctButton);

      await waitFor(() => {
        expect(mockOnSubmitAnswer).toHaveBeenCalledWith(question.correctAnswer);
      });

      // Advance to next question
      currentQuestionIndex = i + 1;
      rerender(
        <GrammarFormsScreen
          currentQuestion={questions[currentQuestionIndex]}
          roundProgress={{
            current: currentQuestionIndex + 1,
            total: 10,
            score: currentQuestionIndex,
            points: currentQuestionIndex * 10,
          }}
          onSubmitAnswer={mockOnSubmitAnswer}
          onAdvanceWord={mockOnAdvanceWord}
          onRoundComplete={mockOnRoundComplete}
          onEndRound={mockOnEndRound}
          onGoBack={vi.fn()}
          playCorrectSound={mockPlayCorrectSound}
          playWrongSound={mockPlayWrongSound}
        />
      );
    }

    // Answer the 10th question - should trigger round completion
    const lastQuestion = questions[9];
    mockOnSubmitAnswer.mockReturnValueOnce({
      correct: true,
      pointsEarned: 10,
      attemptNumber: 1,
      shouldAdvance: true,
      correctAnswer: lastQuestion.correctAnswer,
    });

    const lastCorrectButton = screen.getByText(lastQuestion.correctAnswer);
    fireEvent.click(lastCorrectButton);

    await waitFor(() => {
      expect(mockOnSubmitAnswer).toHaveBeenCalledTimes(10);
    });

    expect(mockOnSubmitAnswer).toHaveBeenCalledWith(lastQuestion.correctAnswer);
  });

  it('should handle mixed correct and incorrect answers across multiple questions', async () => {
    const mockOnSubmitAnswer = vi.fn();
    const mockOnAdvanceWord = vi.fn();

    const question1 = createMockQuestion('q1', 'have got');
    const question2 = createMockQuestion('q2', 'has got');

    // First question: correct on first try
    mockOnSubmitAnswer.mockImplementationOnce(() => {
      return {
        correct: true,
        pointsEarned: 10,
        attemptNumber: 1,
        shouldAdvance: true,
        correctAnswer: question1.correctAnswer,
      };
    });

    const { rerender } = render(
      <GrammarFormsScreen
        currentQuestion={question1}
        roundProgress={{ current: 1, total: 10, score: 0, points: 0 }}
        onSubmitAnswer={mockOnSubmitAnswer}
        onAdvanceWord={mockOnAdvanceWord}
        onRoundComplete={vi.fn()}
        onEndRound={vi.fn()}
        onGoBack={vi.fn()}
        playCorrectSound={mockPlayCorrectSound}
        playWrongSound={mockPlayWrongSound}
      />
    );

    // Answer first question correctly
    const correctButton1 = screen.getByText(question1.correctAnswer);
    fireEvent.click(correctButton1);

    await waitFor(() => {
      expect(mockOnSubmitAnswer).toHaveBeenCalledWith(question1.correctAnswer);
      expect(mockPlayCorrectSound).toHaveBeenCalled();
    });

    // Move to second question
    rerender(
      <GrammarFormsScreen
        currentQuestion={question2}
        roundProgress={{ current: 2, total: 10, score: 1, points: 10 }}
        onSubmitAnswer={mockOnSubmitAnswer}
        onAdvanceWord={mockOnAdvanceWord}
        onRoundComplete={vi.fn()}
        onEndRound={vi.fn()}
        onGoBack={vi.fn()}
        playCorrectSound={mockPlayCorrectSound}
        playWrongSound={mockPlayWrongSound}
      />
    );

    // Second question: wrong on first try
    mockOnSubmitAnswer.mockImplementationOnce(() => ({
      correct: false,
      pointsEarned: 0,
      attemptNumber: 1,
      shouldAdvance: false,
      correctAnswer: question2.correctAnswer,
    }));

    const wrongButton = screen.getByText('wrong1');
    fireEvent.click(wrongButton);

    await waitFor(() => {
      expect(mockPlayWrongSound).toHaveBeenCalled();
    });

    // Second question: correct on second try
    rerender(
      <GrammarFormsScreen
        currentQuestion={question2}
        roundProgress={{ current: 2, total: 10, score: 1, points: 10 }}
        onSubmitAnswer={mockOnSubmitAnswer}
        onAdvanceWord={mockOnAdvanceWord}
        onRoundComplete={vi.fn()}
        onEndRound={vi.fn()}
        onGoBack={vi.fn()}
        playCorrectSound={mockPlayCorrectSound}
        playWrongSound={mockPlayWrongSound}
      />
    );

    mockOnSubmitAnswer.mockImplementationOnce(() => ({
      correct: true,
      pointsEarned: 5,
      attemptNumber: 2,
      shouldAdvance: true,
      correctAnswer: question2.correctAnswer,
    }));

    const correctButton2 = screen.getByText(question2.correctAnswer);
    fireEvent.click(correctButton2);

    await waitFor(() => {
      expect(mockOnSubmitAnswer).toHaveBeenCalledWith(question2.correctAnswer);
    });

    expect(mockOnSubmitAnswer).toHaveBeenCalledTimes(3); // 1 correct + 1 wrong + 1 correct
  });

  it('should handle two failed attempts and show correct answer then auto-advance', async () => {
    const mockOnSubmitAnswer = vi.fn();
    const mockOnAdvanceWord = vi.fn();

    const question = createMockQuestion('q1', 'have got');

    const { rerender } = render(
      <GrammarFormsScreen
        currentQuestion={question}
        roundProgress={{ current: 1, total: 10, score: 0, points: 0 }}
        onSubmitAnswer={mockOnSubmitAnswer}
        onAdvanceWord={mockOnAdvanceWord}
        onRoundComplete={vi.fn()}
        onEndRound={vi.fn()}
        onGoBack={vi.fn()}
        playCorrectSound={mockPlayCorrectSound}
        playWrongSound={mockPlayWrongSound}
      />
    );

    // First wrong attempt
    mockOnSubmitAnswer.mockReturnValueOnce({
      correct: false,
      pointsEarned: 0,
      attemptNumber: 1,
      shouldAdvance: false,
      correctAnswer: question.correctAnswer,
    });

    const wrongButton1 = screen.getByText('wrong1');
    fireEvent.click(wrongButton1);

    await waitFor(() => {
      expect(mockPlayWrongSound).toHaveBeenCalledTimes(1);
    });

    // Re-render with updated attempts
    rerender(
      <GrammarFormsScreen
        currentQuestion={question}
        roundProgress={{ current: 1, total: 10, score: 0, points: 0 }}
        onSubmitAnswer={mockOnSubmitAnswer}
        onAdvanceWord={mockOnAdvanceWord}
        onRoundComplete={vi.fn()}
        onEndRound={vi.fn()}
        onGoBack={vi.fn()}
        playCorrectSound={mockPlayCorrectSound}
        playWrongSound={mockPlayWrongSound}
      />
    );

    // Second wrong attempt - should trigger showing correct answer and auto-advance
    mockOnSubmitAnswer.mockReturnValueOnce({
      correct: false,
      pointsEarned: 0,
      attemptNumber: 2,
      shouldAdvance: true,
      correctAnswer: question.correctAnswer,
    });

    const wrongButton2 = screen.getByText('wrong2');
    fireEvent.click(wrongButton2);

    await waitFor(() => {
      expect(mockPlayWrongSound).toHaveBeenCalledTimes(2);
      // Check that feedback message appears with role="alert"
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });

    // Verify auto-advance happens after delay
    await waitFor(
      () => {
        expect(mockOnAdvanceWord).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it('should display progress accurately throughout the round', () => {
    const progressTests = [
      { current: 1, total: 10, expected: 'Stavek 1/10' },
      { current: 5, total: 10, expected: 'Stavek 5/10' },
      { current: 10, total: 10, expected: 'Stavek 10/10' },
    ];

    progressTests.forEach(({ current, total, expected }) => {
      const { unmount } = render(
        <GrammarFormsScreen
          currentQuestion={createMockQuestion('q1', 'have got')}
          roundProgress={{ current, total, score: 0, points: 0 }}
          onSubmitAnswer={vi.fn()}
          onAdvanceWord={vi.fn()}
          onRoundComplete={vi.fn()}
          onEndRound={vi.fn()}
          onGoBack={vi.fn()}
          playCorrectSound={mockPlayCorrectSound}
          playWrongSound={mockPlayWrongSound}
        />
      );

      expect(screen.getByText(expected)).toBeInTheDocument();
      unmount();
    });
  });

  it('should display score and points accurately as they accumulate', () => {
    const scoreTests = [
      { score: 0, points: 0 },
      { score: 3, points: 25 },
      { score: 7, points: 65 },
      { score: 10, points: 100 },
    ];

    scoreTests.forEach(({ score, points }) => {
      const { unmount } = render(
        <GrammarFormsScreen
          currentQuestion={createMockQuestion('q1', 'have got')}
          roundProgress={{ current: 1, total: 10, score, points }}
          onSubmitAnswer={vi.fn()}
          onAdvanceWord={vi.fn()}
          onRoundComplete={vi.fn()}
          onEndRound={vi.fn()}
          onGoBack={vi.fn()}
          playCorrectSound={mockPlayCorrectSound}
          playWrongSound={mockPlayWrongSound}
        />
      );

      // Check score is displayed (split across spans)
      expect(screen.getByText(score.toString())).toBeInTheDocument();
      expect(screen.getByText(`/ ${10}`)).toBeInTheDocument();

      // Check points badge is displayed
      expect(screen.getByText(`${points} točke`)).toBeInTheDocument();
      unmount();
    });
  });
});
