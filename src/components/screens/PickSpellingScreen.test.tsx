import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PickSpellingScreen } from './PickSpellingScreen';
import type { PickSpellingScreenProps } from './PickSpellingScreen';
import type { Word } from '../../types';

describe('PickSpellingScreen', () => {
  const mockWord: Word = {
    id: '1',
    english: 'apple',
    slovenian: 'jabolko',
    difficulty: 'easy',
    wrongSpellings: ['aple', 'appel'],
  };

  const defaultProps: Omit<PickSpellingScreenProps, 'currentAttempts'> = {
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

  it('should render with word data and options', () => {
    render(<PickSpellingScreen {...defaultProps} />);

    expect(screen.getByText(/Kako se črkuje/)).toBeInTheDocument();
    expect(screen.getByText(/"jabolko"/)).toBeInTheDocument();

    // Should have 3 option buttons (correct + 2 wrong)
    const buttons = screen.getAllByRole('button');
    // Filter out navigation buttons
    const optionButtons = buttons.filter(
      (btn) =>
        btn.textContent &&
        btn.textContent.length > 0 &&
        !btn.textContent.includes('Poslušaj') &&
        !btn.textContent.includes('Nazaj')
    );
    expect(optionButtons.length).toBe(3);
  });

  it('should render nothing when currentWord is null', () => {
    const { container } = render(<PickSpellingScreen {...defaultProps} currentWord={null} />);

    expect(container.firstChild).toBeNull();
  });

  it('should call speak when listen button is clicked', () => {
    const speak = vi.fn();
    render(<PickSpellingScreen {...defaultProps} speak={speak} />);

    const listenButton = screen.getByLabelText('Poslušaj');
    fireEvent.click(listenButton);

    expect(speak).toHaveBeenCalledWith('apple');
  });

  it('should handle correct answer selection', () => {
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
      <PickSpellingScreen
        {...defaultProps}
        onSubmitAnswer={onSubmitAnswer}
        playCorrectSound={playCorrectSound}
        onAdvanceWord={onAdvanceWord}
      />
    );

    // Find and click the correct option button (apple)
    const appleButton = screen.getByText((content, element) => {
      return element?.tagName === 'SPAN' && content === 'apple';
    });
    fireEvent.click(appleButton);

    expect(onSubmitAnswer).toHaveBeenCalledWith('apple');
    expect(playCorrectSound).toHaveBeenCalled();

    // Check for correct feedback
    const feedbackElement = screen.getByRole('alert');
    expect(feedbackElement).toBeInTheDocument();

    // Auto-advance after delay
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
      <PickSpellingScreen
        {...defaultProps}
        onSubmitAnswer={onSubmitAnswer}
        playWrongSound={playWrongSound}
      />
    );

    // Click a wrong option (aple)
    const wrongButton = screen.getByText((content, element) => {
      return element?.tagName === 'SPAN' && content === 'aple';
    });
    fireEvent.click(wrongButton);

    expect(onSubmitAnswer).toHaveBeenCalledWith('aple');
    expect(playWrongSound).toHaveBeenCalled();

    // Check for wrong feedback
    const feedbackElement = screen.getByRole('alert');
    expect(feedbackElement).toBeInTheDocument();
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
      <PickSpellingScreen
        {...defaultProps}
        onSubmitAnswer={onSubmitAnswer}
        playWrongSound={playWrongSound}
        onAdvanceWord={onAdvanceWord}
      />
    );

    // Click a wrong option
    const wrongButton = screen.getByText((content, element) => {
      return element?.tagName === 'SPAN' && content === 'aple';
    });
    fireEvent.click(wrongButton);

    expect(onSubmitAnswer).toHaveBeenCalledWith('aple');
    expect(playWrongSound).toHaveBeenCalled();

    // Should show correct answer in feedback
    const feedbackElement = screen.getByRole('alert');
    expect(feedbackElement).toHaveTextContent('apple');

    // Auto-advance after extended delay
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
      <PickSpellingScreen
        {...defaultProps}
        roundProgress={{ current: 10, total: 10, score: 9, points: 90 }}
        onSubmitAnswer={onSubmitAnswer}
        onEndRound={onEndRound}
        onRoundComplete={onRoundComplete}
      />
    );

    // Click correct option
    const appleButton = screen.getByText((content, element) => {
      return element?.tagName === 'SPAN' && content === 'apple';
    });
    fireEvent.click(appleButton);

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
    const onSubmitAnswer = vi.fn().mockReturnValue({
      correct: false,
      pointsEarned: 0,
      attemptNumber: 1,
      shouldAdvance: false,
      correctAnswer: 'apple',
    });
    const { rerender } = render(
      <PickSpellingScreen {...defaultProps} onSubmitAnswer={onSubmitAnswer} />
    );

    // Click a wrong option to set state
    const wrongButton = screen.getByText((content, element) => {
      return element?.tagName === 'SPAN' && content === 'aple';
    });
    fireEvent.click(wrongButton);

    // Verify feedback is shown
    expect(screen.getByRole('alert')).toBeInTheDocument();

    const newWord: Word = {
      id: '2',
      english: 'banana',
      slovenian: 'banana',
      difficulty: 'easy',
      wrongSpellings: ['bananna', 'bannana'],
    };

    rerender(<PickSpellingScreen {...defaultProps} currentWord={newWord} />);

    // State should be reset - no feedback, new word displayed
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should disable options during processing', () => {
    const onSubmitAnswer = vi.fn().mockReturnValue({
      correct: true,
      pointsEarned: 10,
      attemptNumber: 1,
      shouldAdvance: false,
      correctAnswer: 'apple',
    });

    render(<PickSpellingScreen {...defaultProps} onSubmitAnswer={onSubmitAnswer} />);

    // Click an option
    const appleButton = screen.getByText((content, element) => {
      return element?.tagName === 'SPAN' && content === 'apple';
    });
    fireEvent.click(appleButton);

    // All options should be disabled after selection
    const buttons = screen.getAllByRole('button');
    const optionButtons = buttons.filter(
      (btn) =>
        btn.textContent &&
        btn.textContent.length > 0 &&
        !btn.textContent.includes('Poslušaj') &&
        !btn.textContent.includes('Nazaj')
    );

    optionButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('should display all spelling options', () => {
    render(<PickSpellingScreen {...defaultProps} />);

    // Verify all options are present (correct + wrong spellings)
    expect(screen.getByText((content, element) => {
      return element?.tagName === 'SPAN' && content === 'apple';
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.tagName === 'SPAN' && content === 'aple';
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.tagName === 'SPAN' && content === 'appel';
    })).toBeInTheDocument();
  });
});
