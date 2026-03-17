import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SentenceOrderingScreen } from './SentenceOrderingScreen';
import type { SentenceExercise, RoundStats } from '../../types';

const mockExercise: SentenceExercise = {
  id: 'test-1',
  correctWords: ['the', 'cat', 'is', 'sleeping'],
  endPunctuation: '.',
  difficulty: 'easy',
};

const defaultProps = {
  currentExercise: mockExercise,
  roundProgress: { current: 1, total: 10, score: 0, points: 0 },
  onSubmitAnswer: vi.fn().mockReturnValue({
    correct: true,
    pointsEarned: 10,
    attemptNumber: 1,
    shouldAdvance: true,
    correctAnswer: 'the cat is sleeping',
  }),
  onAdvanceWord: vi.fn(),
  onRoundComplete: vi.fn(),
  onEndRound: vi.fn().mockReturnValue({ score: 0, maxStreak: 0, perfectRound: false }),
  onGoBack: vi.fn(),
  speak: vi.fn(),
  speaking: false,
  speechSupported: true,
  playCorrectSound: vi.fn(),
  playWrongSound: vi.fn(),
};

describe('SentenceOrderingScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders scrambled words as draggable tiles', () => {
    render(<SentenceOrderingScreen {...defaultProps} />);

    // All words should be visible in the word bank
    expect(screen.getByText('the')).toBeInTheDocument();
    expect(screen.getByText('cat')).toBeInTheDocument();
    expect(screen.getByText('is')).toBeInTheDocument();
    expect(screen.getByText('sleeping')).toBeInTheDocument();
  });

  it('renders null when no exercise provided', () => {
    const { container } = render(
      <SentenceOrderingScreen {...defaultProps} currentExercise={null} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows progress bar and score', () => {
    render(<SentenceOrderingScreen {...defaultProps} />);

    expect(screen.getByText('Stavek 1/10')).toBeInTheDocument();
  });

  it('moves word from bank to answer area when clicked', () => {
    render(<SentenceOrderingScreen {...defaultProps} />);

    const wordTile = screen.getByText('cat');
    fireEvent.click(wordTile);

    // Word should now be in the answer area (auto-capitalized as first word)
    const answerArea = screen.getByTestId('answer-area');
    expect(answerArea).toHaveTextContent('Cat');
  });

  it('returns word to bank when clicked in answer area', () => {
    render(<SentenceOrderingScreen {...defaultProps} />);

    // Click word to place it
    fireEvent.click(screen.getByText('the'));

    // Click it again in the answer area to return it
    const answerArea = screen.getByTestId('answer-area');
    const placedWord = answerArea.querySelector('button');
    expect(placedWord).not.toBeNull();
    fireEvent.click(placedWord!);

    // Word bank should have all words again
    const wordBank = screen.getByTestId('word-bank');
    expect(wordBank).toHaveTextContent('the');
  });

  it('shows prompt when submitting with words still in bank', () => {
    render(<SentenceOrderingScreen {...defaultProps} />);

    // Place only some words
    fireEvent.click(screen.getByText('the'));

    // Try to submit
    const submitButton = screen.getByText('Preveri');
    fireEvent.click(submitButton);

    expect(screen.getByText('Najprej razvrsti vse besede!')).toBeInTheDocument();
    expect(defaultProps.onSubmitAnswer).not.toHaveBeenCalled();
  });

  it('submits answer when all words are placed', () => {
    render(<SentenceOrderingScreen {...defaultProps} />);

    // Place all words
    fireEvent.click(screen.getByText('the'));
    fireEvent.click(screen.getByText('cat'));
    fireEvent.click(screen.getByText('is'));
    fireEvent.click(screen.getByText('sleeping'));

    const submitButton = screen.getByText('Preveri');
    fireEvent.click(submitButton);

    expect(defaultProps.onSubmitAnswer).toHaveBeenCalled();
  });

  it('speak button is disabled when no words are placed', () => {
    render(<SentenceOrderingScreen {...defaultProps} />);

    const speakButton = screen.getByLabelText('Poslušaj stavek');
    expect(speakButton).toBeDisabled();
  });

  it('speak button is enabled when words are placed', () => {
    render(<SentenceOrderingScreen {...defaultProps} />);

    fireEvent.click(screen.getByText('cat'));

    const speakButton = screen.getByLabelText('Poslušaj stavek');
    expect(speakButton).not.toBeDisabled();
  });

  it('speaks current arrangement when speak button clicked', () => {
    render(<SentenceOrderingScreen {...defaultProps} />);

    fireEvent.click(screen.getByText('the'));
    fireEvent.click(screen.getByText('cat'));

    const speakButton = screen.getByLabelText('Poslušaj stavek');
    fireEvent.click(speakButton);

    expect(defaultProps.speak).toHaveBeenCalledWith('the cat');
  });

  it('hides speak button when speech is not supported', () => {
    render(<SentenceOrderingScreen {...defaultProps} speechSupported={false} />);

    expect(screen.queryByLabelText('Poslušaj stavek')).not.toBeInTheDocument();
  });

  it('displays auto-capitalized first word and punctuation in answer area', () => {
    render(<SentenceOrderingScreen {...defaultProps} />);

    // Place the first word
    fireEvent.click(screen.getByText('the'));

    const answerArea = screen.getByTestId('answer-area');
    // First placed word should show capitalized
    expect(answerArea).toHaveTextContent('The');
    // Punctuation should be visible
    expect(answerArea).toHaveTextContent('.');
  });
});
