import { useState, useCallback, useRef, useEffect } from 'react';
import type { Word, FeedbackType, FeedbackState, RoundStats } from '../../types';
import {
  labels,
  getCorrectFeedback,
  getWrongFeedback,
  getShowCorrectMessage,
} from '../../data/messages';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { ListenButton } from '../game/ListenButton';
import { SpellingInput } from '../game/SpellingInput';
import { FeedbackMessage } from '../game/FeedbackMessage';
import { ScoreDisplay } from '../game/ScoreDisplay';

export interface ListenSpellScreenProps {
  currentWord: Word | null;
  roundProgress: {
    current: number;
    total: number;
    score: number;
    points: number;
  };
  currentAttempts: number;
  onSubmitAnswer: (answer: string) => {
    correct: boolean;
    pointsEarned: number;
    attemptNumber: number;
    shouldAdvance: boolean;
    correctAnswer: string;
  };
  onAdvanceWord: () => void;
  onRoundComplete: (stats: RoundStats) => void;
  onEndRound: () => RoundStats;
  speak: (text: string) => void;
  speaking: boolean;
  speechSupported: boolean;
  playCorrectSound: () => void;
  playWrongSound: () => void;
}

const ADVANCE_DELAY_MS = 1500;
const DEBOUNCE_MS = 300;

export function ListenSpellScreen({
  currentWord,
  roundProgress,
  currentAttempts: _currentAttempts,
  onSubmitAnswer,
  onAdvanceWord,
  onRoundComplete,
  onEndRound,
  speak,
  speaking,
  speechSupported,
  playCorrectSound,
  playWrongSound,
}: ListenSpellScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState>({
    type: null,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWordIdRef = useRef<string | null>(null);

  // Reset input when word changes
  useEffect(() => {
    if (currentWord && currentWord.id !== lastWordIdRef.current) {
      lastWordIdRef.current = currentWord.id;
      setInputValue('');
      setFeedback({ type: null, message: '' });
    }
  }, [currentWord]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  const handleListen = useCallback(() => {
    if (currentWord) {
      speak(currentWord.english);
    }
  }, [currentWord, speak]);

  const handleAdvance = useCallback(() => {
    // Check if this was the last word
    if (roundProgress.current >= roundProgress.total) {
      const stats = onEndRound();
      onRoundComplete(stats);
    } else {
      onAdvanceWord();
    }
  }, [roundProgress, onAdvanceWord, onRoundComplete, onEndRound]);

  const handleSubmit = useCallback(() => {
    if (isSubmitting || !currentWord) return;

    const trimmedInput = inputValue.trim();

    // Handle empty submission
    if (!trimmedInput) {
      setFeedback({
        type: 'wrong',
        message: labels.emptyInputError,
      });
      playWrongSound();
      return;
    }

    setIsSubmitting(true);

    const result = onSubmitAnswer(trimmedInput);

    if (result.correct) {
      playCorrectSound();
      setFeedback({
        type: 'correct',
        message: getCorrectFeedback(),
      });

      // Auto-advance after delay
      advanceTimeoutRef.current = setTimeout(() => {
        handleAdvance();
        setIsSubmitting(false);
      }, ADVANCE_DELAY_MS);
    } else {
      playWrongSound();

      if (result.shouldAdvance) {
        // Second wrong attempt - show correct answer
        setFeedback({
          type: 'show-answer',
          message: getShowCorrectMessage(result.correctAnswer),
          correctAnswer: result.correctAnswer,
        });

        // Auto-advance after showing answer
        advanceTimeoutRef.current = setTimeout(() => {
          handleAdvance();
          setIsSubmitting(false);
        }, ADVANCE_DELAY_MS * 1.5);
      } else {
        // First wrong attempt - allow retry
        setFeedback({
          type: 'wrong',
          message: getWrongFeedback(),
        });

        // Allow retry after short delay
        setTimeout(() => {
          setIsSubmitting(false);
        }, DEBOUNCE_MS);
      }
    }
  }, [
    inputValue,
    currentWord,
    isSubmitting,
    onSubmitAnswer,
    handleAdvance,
    playCorrectSound,
    playWrongSound,
  ]);

  if (!currentWord) {
    return null;
  }

  const feedbackType: FeedbackType = feedback.type;
  const isInputDisabled =
    isSubmitting || feedbackType === 'correct' || feedbackType === 'show-answer';

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100 flex flex-col p-4 sm:p-6 lg:p-8">
      {/* Progress section */}
      <header className="w-full max-w-md mx-auto mb-4 sm:mb-6">
        <ProgressBar
          current={roundProgress.current}
          total={roundProgress.total}
          labelPrefix=""
          showLabel={true}
          aria-label={`Napredek: ${roundProgress.current} od ${roundProgress.total}`}
        />
        <p className="text-center text-base sm:text-lg font-medium text-gray-700 mt-2">
          {labels.wordProgress(roundProgress.current, roundProgress.total)}
        </p>
      </header>

      {/* Main game card */}
      <Card
        padding="lg"
        shadow="lg"
        className="w-full max-w-md mx-auto flex-grow flex flex-col"
      >
        <div className="flex-grow flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          {/* Listen button */}
          <ListenButton
            speaking={speaking}
            supported={speechSupported}
            onListen={handleListen}
            aria-describedby="hint-text"
          />

          {/* Hint text */}
          <div className="text-center" id="hint-text" role="status" aria-live="polite">
            <p className="text-sm text-gray-500 mb-1">{labels.hintLabel}:</p>
            <p className="text-lg sm:text-xl font-semibold text-gray-800">
              {currentWord.slovenian}
            </p>
          </div>

          {/* Spelling input */}
          <SpellingInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            feedbackType={feedbackType}
            disabled={isInputDisabled}
            placeholder="..."
            autoFocus={true}
          />

          {/* Feedback message */}
          {feedback.type && (
            <FeedbackMessage
              type={feedback.type}
              message={feedback.message}
              correctAnswer={feedback.correctAnswer}
            />
          )}

          {/* Check button */}
          <Button
            variant="primary"
            size="large"
            onClick={handleSubmit}
            disabled={isInputDisabled}
            className="w-full max-w-xs text-base sm:text-lg"
            aria-label={labels.checkButton}
          >
            {labels.checkButton}
          </Button>
        </div>
      </Card>

      {/* Score display */}
      <footer className="w-full max-w-md mx-auto mt-4 sm:mt-6" aria-label="Rezultat">
        <ScoreDisplay
          current={roundProgress.score}
          total={roundProgress.total}
          points={roundProgress.points}
          showPoints={true}
        />
      </footer>
    </div>
  );
}

export default ListenSpellScreen;
