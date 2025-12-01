import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { GrammarFormsScreen } from './GrammarFormsScreen';
import type { GrammarQuestion } from '../../types';

describe('GrammarFormsScreen', () => {
  const mockQuestion: GrammarQuestion = {
    id: '1',
    sentence: 'My sisters _______ long hair.',
    correctAnswer: 'have got',
    wrongAnswers: ['has got', 'having got'],
    subjectType: 'plural',
  };

  const mockRoundProgress = {
    current: 1,
    total: 10,
    score: 0,
    points: 0,
  };

  const mockOnSubmitAnswer = vi.fn();
  const mockOnAdvanceWord = vi.fn();
  const mockOnRoundComplete = vi.fn();
  const mockOnEndRound = vi.fn();
  const mockOnGoBack = vi.fn();
  const mockPlayCorrectSound = vi.fn();
  const mockPlayWrongSound = vi.fn();

  const defaultProps = {
    currentQuestion: mockQuestion,
    roundProgress: mockRoundProgress,
    currentAttempts: 0,
    onSubmitAnswer: mockOnSubmitAnswer,
    onAdvanceWord: mockOnAdvanceWord,
    onRoundComplete: mockOnRoundComplete,
    onEndRound: mockOnEndRound,
    onGoBack: mockOnGoBack,
    playCorrectSound: mockPlayCorrectSound,
    playWrongSound: mockPlayWrongSound,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the sentence and option buttons', () => {
    render(<GrammarFormsScreen {...defaultProps} />);

    expect(screen.getByText(/My sisters _______ long hair/)).toBeInTheDocument();
    expect(screen.getByText('have got')).toBeInTheDocument();
    expect(screen.getByText('has got')).toBeInTheDocument();
    expect(screen.getByText('having got')).toBeInTheDocument();
  });

  it('should handle correct answer on first attempt', async () => {
    mockOnSubmitAnswer.mockReturnValue({
      correct: true,
      pointsEarned: 10,
      attemptNumber: 1,
      shouldAdvance: true,
      correctAnswer: 'have got',
    });

    render(<GrammarFormsScreen {...defaultProps} />);

    const correctButton = screen.getByText('have got');
    fireEvent.click(correctButton);

    expect(mockOnSubmitAnswer).toHaveBeenCalledWith('have got');
    expect(mockPlayCorrectSound).toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should handle wrong answer on first attempt and allow retry', async () => {
    mockOnSubmitAnswer.mockReturnValue({
      correct: false,
      pointsEarned: 0,
      attemptNumber: 1,
      shouldAdvance: false,
      correctAnswer: 'have got',
    });

    render(<GrammarFormsScreen {...defaultProps} />);

    const wrongButton = screen.getByText('has got');
    fireEvent.click(wrongButton);

    expect(mockOnSubmitAnswer).toHaveBeenCalledWith('has got');
    expect(mockPlayWrongSound).toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should show correct answer after two wrong attempts', async () => {
    mockOnSubmitAnswer.mockReturnValue({
      correct: false,
      pointsEarned: 0,
      attemptNumber: 2,
      shouldAdvance: true,
      correctAnswer: 'have got',
    });

    render(<GrammarFormsScreen {...defaultProps} />);

    const wrongButton = screen.getByText('has got');
    fireEvent.click(wrongButton);

    expect(mockPlayWrongSound).toHaveBeenCalled();
    await waitFor(() => {
      // Check that the correct answer is shown (either with "Zapomni si:" or "Pravilno se piše:" prefix)
      const feedbackElement = screen.getByRole('alert');
      expect(feedbackElement).toHaveTextContent('have got');
    });
  });

  it('should display round progress correctly', () => {
    render(<GrammarFormsScreen {...defaultProps} />);

    expect(screen.getByText('Stavek 1/10')).toBeInTheDocument();
  });

  it('should show quit dialog when back button is clicked', async () => {
    render(<GrammarFormsScreen {...defaultProps} />);

    const backButton = screen.getByText('Nazaj');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText('Želiš zaključiti igro?')).toBeInTheDocument();
    });
  });

  it('should call onGoBack when quit is confirmed', async () => {
    render(<GrammarFormsScreen {...defaultProps} />);

    const backButton = screen.getByText('Nazaj');
    fireEvent.click(backButton);

    await waitFor(() => {
      const confirmButton = screen.getByText('Zaključi igro');
      fireEvent.click(confirmButton);
    });

    expect(mockOnGoBack).toHaveBeenCalled();
  });
});
