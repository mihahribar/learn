import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ListenSpellScreen } from './ListenSpellScreen';
import type { ListenSpellScreenProps } from './ListenSpellScreen';
import type { Word } from '../../types';

describe('ListenSpellScreen', () => {
  const mockWord: Word = {
    id: '1',
    english: 'apple',
    slovenian: 'jabolko',
    difficulty: 'easy',
    wrongSpellings: ['aple', 'appel'],
  };

  const defaultProps: Omit<ListenSpellScreenProps, 'currentAttempts'> = {
    currentWord: mockWord,
    roundProgress: {
      current: 1,
      total: 10,
      score: 0,
      points: 0,
    },
    onSubmitAnswer: vi.fn(),
    onAdvanceWord: vi.fn(),
    onRoundComplete: vi.fn(),
    onEndRound: vi.fn(),
    onGoBack: vi.fn(),
    speak: vi.fn(),
    speaking: false,
    speechSupported: true,
    playCorrectSound: vi.fn(),
    playWrongSound: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should render with word data', () => {
    render(<ListenSpellScreen {...defaultProps} />);

    expect(screen.getByText('Namig:')).toBeInTheDocument();
    expect(screen.getByText('jabolko')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Preveri')).toBeInTheDocument();
  });

  it('should render nothing when currentWord is null', () => {
    const { container } = render(<ListenSpellScreen {...defaultProps} currentWord={null} />);

    expect(container.firstChild).toBeNull();
  });

  it('should call speak when listen button is clicked', () => {
    const speak = vi.fn();
    render(<ListenSpellScreen {...defaultProps} speak={speak} />);

    const listenButton = screen.getByLabelText('Poslušaj');
    fireEvent.click(listenButton);

    expect(speak).toHaveBeenCalledWith('apple');
  });

  it('should update input value when typing', () => {
    render(<ListenSpellScreen {...defaultProps} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'app' } });

    expect(input).toHaveValue('app');
  });

  it('should show error feedback when submitting empty input', () => {
    const playWrongSound = vi.fn();
    render(<ListenSpellScreen {...defaultProps} playWrongSound={playWrongSound} />);

    const checkButton = screen.getByText('Preveri');
    fireEvent.click(checkButton);

    expect(screen.getByText('Vnesi odgovor')).toBeInTheDocument();
    expect(playWrongSound).toHaveBeenCalled();
  });

  it('should handle correct answer submission', () => {
    const onSubmitAnswer = vi.fn().mockReturnValue({
      correct: true,
      pointsEarned: 10,
      attemptNumber: 1,
      shouldAdvance: false,
      correctAnswer: 'apple',
    });
    const playCorrectSound = vi.fn();
    const onAdvanceWord = vi.fn();

    render(
      <ListenSpellScreen
        {...defaultProps}
        onSubmitAnswer={onSubmitAnswer}
        playCorrectSound={playCorrectSound}
        onAdvanceWord={onAdvanceWord}
      />
    );

    const input = screen.getByRole('textbox');
    const checkButton = screen.getByText('Preveri');

    fireEvent.change(input, { target: { value: 'apple' } });
    fireEvent.click(checkButton);

    expect(onSubmitAnswer).toHaveBeenCalledWith('apple');
    expect(playCorrectSound).toHaveBeenCalled();

    // Check for correct feedback (random message, so just check it exists)
    const feedbackElement = screen.getByRole('alert');
    expect(feedbackElement).toBeInTheDocument();

    // Input should be disabled after correct answer
    expect(input).toBeDisabled();

    // Advance after delay and check that advance was called
    act(() => {
      vi.runAllTimers();
    });
    expect(onAdvanceWord).toHaveBeenCalled();
  });

  it('should handle first wrong attempt and allow retry', () => {
    const onSubmitAnswer = vi.fn().mockReturnValue({
      correct: false,
      pointsEarned: 0,
      attemptNumber: 1,
      shouldAdvance: false,
      correctAnswer: 'apple',
    });
    const playWrongSound = vi.fn();

    render(
      <ListenSpellScreen
        {...defaultProps}
        onSubmitAnswer={onSubmitAnswer}
        playWrongSound={playWrongSound}
      />
    );

    const input = screen.getByRole('textbox');
    const checkButton = screen.getByText('Preveri');

    fireEvent.change(input, { target: { value: 'aple' } });
    fireEvent.click(checkButton);

    expect(onSubmitAnswer).toHaveBeenCalledWith('aple');
    expect(playWrongSound).toHaveBeenCalled();

    // Check for wrong feedback
    const feedbackElement = screen.getByRole('alert');
    expect(feedbackElement).toBeInTheDocument();

    // Input should be temporarily disabled
    expect(input).toBeDisabled();

    // After debounce, input should be enabled for retry
    act(() => {
      vi.runAllTimers();
    });
    expect(input).not.toBeDisabled();
  });

  it('should handle second wrong attempt and show correct answer', () => {
    const onSubmitAnswer = vi.fn().mockReturnValue({
      correct: false,
      pointsEarned: 0,
      attemptNumber: 2,
      shouldAdvance: true,
      correctAnswer: 'apple',
    });
    const playWrongSound = vi.fn();
    const onAdvanceWord = vi.fn();

    render(
      <ListenSpellScreen
        {...defaultProps}
        onSubmitAnswer={onSubmitAnswer}
        playWrongSound={playWrongSound}
        onAdvanceWord={onAdvanceWord}
      />
    );

    const input = screen.getByRole('textbox');
    const checkButton = screen.getByText('Preveri');

    fireEvent.change(input, { target: { value: 'aple' } });
    fireEvent.click(checkButton);

    expect(onSubmitAnswer).toHaveBeenCalledWith('aple');
    expect(playWrongSound).toHaveBeenCalled();

    // Should show correct answer in feedback
    const feedbackElement = screen.getByRole('alert');
    expect(feedbackElement).toHaveTextContent('apple');

    // Input should be disabled
    expect(input).toBeDisabled();

    // Advance after extended delay
    act(() => {
      vi.runAllTimers();
    });
    expect(onAdvanceWord).toHaveBeenCalled();
  });

  it('should complete round when last word is answered correctly', () => {
    const onSubmitAnswer = vi.fn().mockReturnValue({
      correct: true,
      pointsEarned: 10,
      attemptNumber: 1,
      shouldAdvance: false,
      correctAnswer: 'apple',
    });
    const onEndRound = vi.fn().mockReturnValue({
      score: 9,
      maxStreak: 5,
      perfectRound: false,
    });
    const onRoundComplete = vi.fn();

    render(
      <ListenSpellScreen
        {...defaultProps}
        roundProgress={{ current: 10, total: 10, score: 9, points: 90 }}
        onSubmitAnswer={onSubmitAnswer}
        onEndRound={onEndRound}
        onRoundComplete={onRoundComplete}
      />
    );

    const input = screen.getByRole('textbox');
    const checkButton = screen.getByText('Preveri');

    fireEvent.change(input, { target: { value: 'apple' } });
    fireEvent.click(checkButton);

    // Advance after delay
    act(() => {
      vi.runAllTimers();
    });

    expect(onEndRound).toHaveBeenCalled();
    expect(onRoundComplete).toHaveBeenCalledWith({
      score: 10, // 9 + 1 for the last correct answer
      maxStreak: 5,
      perfectRound: true,
    });
  });

  it('should reset state when word changes', () => {
    const { rerender } = render(<ListenSpellScreen {...defaultProps} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(input).toHaveValue('test');

    const newWord: Word = {
      id: '2',
      english: 'banana',
      slovenian: 'banana',
      difficulty: 'easy',
      wrongSpellings: ['bananna', 'bannana'],
    };

    rerender(<ListenSpellScreen {...defaultProps} currentWord={newWord} />);

    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByText('banana')).toBeInTheDocument();
  });

  it('should disable input during submission', () => {
    const onSubmitAnswer = vi.fn().mockReturnValue({
      correct: true,
      pointsEarned: 10,
      attemptNumber: 1,
      shouldAdvance: false,
      correctAnswer: 'apple',
    });

    render(<ListenSpellScreen {...defaultProps} onSubmitAnswer={onSubmitAnswer} />);

    const input = screen.getByRole('textbox');
    const checkButton = screen.getByRole('button', { name: 'Preveri' });

    fireEvent.change(input, { target: { value: 'apple' } });
    fireEvent.click(checkButton);

    expect(input).toBeDisabled();
    expect(checkButton).toBeDisabled();
  });

  it('should handle Enter key submission', () => {
    const onSubmitAnswer = vi.fn().mockReturnValue({
      correct: true,
      pointsEarned: 10,
      attemptNumber: 1,
      shouldAdvance: false,
      correctAnswer: 'apple',
    });

    render(<ListenSpellScreen {...defaultProps} onSubmitAnswer={onSubmitAnswer} />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'apple' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onSubmitAnswer).toHaveBeenCalledWith('apple');
  });

  it('should trim whitespace from input before submission', () => {
    const onSubmitAnswer = vi.fn().mockReturnValue({
      correct: true,
      pointsEarned: 10,
      attemptNumber: 1,
      shouldAdvance: false,
      correctAnswer: 'apple',
    });

    render(<ListenSpellScreen {...defaultProps} onSubmitAnswer={onSubmitAnswer} />);

    const input = screen.getByRole('textbox');
    const checkButton = screen.getByText('Preveri');

    fireEvent.change(input, { target: { value: '  apple  ' } });
    fireEvent.click(checkButton);

    expect(onSubmitAnswer).toHaveBeenCalledWith('apple');
  });
});
