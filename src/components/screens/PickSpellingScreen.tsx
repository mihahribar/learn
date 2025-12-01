import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { Word, RoundStats } from '../../types';
import {
  labels,
  getCorrectFeedback,
  getWrongFeedback,
  getShowCorrectMessage,
} from '../../data/messages';
import { ListenButton } from '../game/ListenButton';
import { OptionButton, type OptionState } from '../game/OptionButton';
import { FeedbackMessage } from '../game/FeedbackMessage';
import { shuffle } from '../../utils/shuffle';
import { BaseGameScreen } from './BaseGameScreen';

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
    <BaseGameScreen roundProgress={roundProgress} onGoBack={onGoBack}>
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
    </BaseGameScreen>
  );
}

export default PickSpellingScreen;
