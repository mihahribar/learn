import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { Word, RoundStats } from '../../types';
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
import { OptionButton, type OptionState } from '../game/OptionButton';
import { FeedbackMessage } from '../game/FeedbackMessage';
import { ScoreDisplay } from '../game/ScoreDisplay';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { shuffle } from '../../utils/shuffle';

export interface PickSpellingScreenProps {
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
  onGoBack: () => void;
  speak: (text: string) => void;
  speaking: boolean;
  speechSupported: boolean;
  playCorrectSound: () => void;
  playWrongSound: () => void;
}

interface ShuffledOption {
  label: string;
  value: string;
  prefix: string;
}

const ADVANCE_DELAY_MS = 1500;
const OPTION_PREFIXES = ['a', 'b', 'c'];

interface LastSubmitResult {
  correct: boolean;
  pointsEarned: number;
}

const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

export function PickSpellingScreen({
  currentWord,
  roundProgress,
  onSubmitAnswer,
  onAdvanceWord,
  onRoundComplete,
  onEndRound,
  onGoBack,
  speak,
  speaking,
  speechSupported,
  playCorrectSound,
  playWrongSound,
}: Omit<PickSpellingScreenProps, 'currentAttempts'>) {
  const [optionStates, setOptionStates] = useState<Record<string, OptionState>>({});
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | 'show-answer' | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWordIdRef = useRef<string | null>(null);
  const lastSubmitResultRef = useRef<LastSubmitResult | null>(null);

  // Generate shuffled options when word changes
  const shuffledOptions = useMemo((): ShuffledOption[] => {
    if (!currentWord) return [];

    const allSpellings = [currentWord.english, ...currentWord.wrongSpellings];
    const shuffledSpellings = shuffle(allSpellings);

    return shuffledSpellings.map((spelling, index) => ({
      label: spelling,
      value: spelling,
      prefix: OPTION_PREFIXES[index] || String(index + 1),
    }));
  }, [currentWord]);

  // Reset state when word changes
  useEffect(() => {
    if (currentWord && currentWord.id !== lastWordIdRef.current) {
      lastWordIdRef.current = currentWord.id;
      setOptionStates({});
      setFeedbackMessage(null);
      setFeedbackType(null);
      setIsProcessing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWord?.id]);

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
      // Fix stale closure: add the last answer's score if it was correct
      const lastResult = lastSubmitResultRef.current;
      if (lastResult && lastResult.correct) {
        stats.score += 1;
        stats.perfectRound = stats.score === roundProgress.total;
      }
      lastSubmitResultRef.current = null;
      onRoundComplete(stats);
    } else {
      onAdvanceWord();
    }
  }, [roundProgress, onAdvanceWord, onRoundComplete, onEndRound]);

  const handleOptionSelect = useCallback(
    (optionValue: string) => {
      if (isProcessing || !currentWord) return;

      setIsProcessing(true);

      const result = onSubmitAnswer(optionValue);

      // Store result for stale closure fix in handleAdvance
      lastSubmitResultRef.current = {
        correct: result.correct,
        pointsEarned: result.pointsEarned,
      };

      if (result.correct) {
        playCorrectSound();
        setOptionStates({ [optionValue]: 'correct' });
        setFeedbackMessage(getCorrectFeedback());
        setFeedbackType('correct');

        // Auto-advance after delay
        advanceTimeoutRef.current = setTimeout(() => {
          handleAdvance();
        }, ADVANCE_DELAY_MS);
      } else {
        playWrongSound();
        setOptionStates((prev) => ({ ...prev, [optionValue]: 'incorrect' }));

        if (result.shouldAdvance) {
          // Second wrong attempt - show correct answer
          setOptionStates((prev) => ({
            ...prev,
            [optionValue]: 'incorrect',
            [result.correctAnswer]: 'correct',
          }));
          setFeedbackMessage(getShowCorrectMessage(result.correctAnswer));
          setFeedbackType('show-answer');

          // Auto-advance after showing answer
          advanceTimeoutRef.current = setTimeout(() => {
            handleAdvance();
          }, ADVANCE_DELAY_MS * 1.5);
        } else {
          // First wrong attempt - allow retry
          setFeedbackMessage(getWrongFeedback());
          setFeedbackType('wrong');
          setIsProcessing(false);
        }
      }
    },
    [currentWord, isProcessing, onSubmitAnswer, handleAdvance, playCorrectSound, playWrongSound]
  );

  const getOptionState = (optionValue: string): OptionState => {
    if (optionStates[optionValue]) {
      return optionStates[optionValue];
    }
    // Disable unselected options after correct answer or show-answer
    if (feedbackType === 'correct' || feedbackType === 'show-answer') {
      return 'disabled';
    }
    return 'default';
  };

  if (!currentWord) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100 flex flex-col p-4 sm:p-6 lg:p-8">
      {/* Progress section */}
      <header className="w-full max-w-md mx-auto mb-4 sm:mb-6">
        <Button
          variant="secondary"
          size="small"
          icon={<BackArrowIcon />}
          onClick={() => setShowQuitDialog(true)}
          className="mb-4"
          aria-label={labels.backButton}
        >
          {labels.backButton}
        </Button>
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
      <Card padding="lg" shadow="lg" className="w-full max-w-md mx-auto flex-grow flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          {/* Slovenian prompt */}
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800" id="spelling-prompt">
              {labels.spellingPrompt(currentWord.slovenian)}
            </h2>
          </div>

          {/* Listen button */}
          <ListenButton speaking={speaking} supported={speechSupported} onListen={handleListen} />

          {/* Option buttons */}
          <div className="w-full space-y-3" role="group" aria-labelledby="spelling-prompt">
            {shuffledOptions.map((option) => (
              <OptionButton
                key={option.value}
                label={option.label}
                prefix={option.prefix}
                state={getOptionState(option.value)}
                onSelect={() => handleOptionSelect(option.value)}
              />
            ))}
          </div>

          {/* Feedback message */}
          {feedbackType && feedbackMessage && (
            <FeedbackMessage
              type={feedbackType}
              message={feedbackMessage}
              correctAnswer={feedbackType === 'show-answer' ? currentWord.english : undefined}
            />
          )}
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

      {/* Quit confirmation dialog */}
      <ConfirmDialog
        isOpen={showQuitDialog}
        title={labels.quitGameTitle}
        message={labels.quitGameMessage}
        confirmLabel={labels.confirmQuitButton}
        cancelLabel={labels.cancelButton}
        onConfirm={onGoBack}
        onCancel={() => setShowQuitDialog(false)}
        variant="warning"
      />
    </div>
  );
}

export default PickSpellingScreen;
