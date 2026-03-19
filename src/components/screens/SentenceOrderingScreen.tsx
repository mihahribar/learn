import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { SentenceExercise, RoundStats } from '../../types';
import {
  labels,
  getCorrectFeedback,
  getWrongFeedback,
  getShowCorrectMessage,
} from '../../data/messages';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { FeedbackMessage } from '../game/FeedbackMessage';
import { ListenButton } from '../game/ListenButton';
import { ScoreDisplay } from '../game/ScoreDisplay';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { shuffleNotInOrder } from '../../utils/shuffle';

export interface SentenceOrderingScreenProps {
  currentExercise: SentenceExercise | null;
  roundProgress: {
    current: number;
    total: number;
    score: number;
    points: number;
  };
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

interface WordTile {
  word: string;
  originalIndex: number;
}

const ADVANCE_DELAY_MS = 1500;

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


interface LastSubmitResult {
  correct: boolean;
  pointsEarned: number;
}

export function SentenceOrderingScreen({
  currentExercise,
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
}: SentenceOrderingScreenProps) {
  const [bankTiles, setBankTiles] = useState<WordTile[]>([]);
  const [placedTiles, setPlacedTiles] = useState<WordTile[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | 'show-answer' | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [incompleteWarning, setIncompleteWarning] = useState(false);
  const [answerDragOver, setAnswerDragOver] = useState(false);
  const [bankDragOver, setBankDragOver] = useState(false);
  const [shakeAnswer, setShakeAnswer] = useState(false);
  const [successAnswer, setSuccessAnswer] = useState(false);
  const [dropInsertIndex, setDropInsertIndex] = useState<number | null>(null);
  const dropInsertIndexRef = useRef<number | null>(null);
  const answerAreaRef = useRef<HTMLDivElement>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastExerciseId, setLastExerciseId] = useState<string | null>(null);
  const lastSubmitResultRef = useRef<LastSubmitResult | null>(null);

  // Reset state when exercise changes (state-during-render pattern)
  if (currentExercise && currentExercise.id !== lastExerciseId) {
    setLastExerciseId(currentExercise.id);
    const tiles: WordTile[] = currentExercise.correctWords.map((word, index) => ({
      word,
      originalIndex: index,
    }));
    setBankTiles(
      shuffleNotInOrder(tiles, (t) =>
        t.every((tile, i) => tile.originalIndex === i),
      ),
    );
    setPlacedTiles([]);
    setFeedbackMessage(null);
    setFeedbackType(null);
    setIsProcessing(false);
    setIncompleteWarning(false);
    setShakeAnswer(false);
    setSuccessAnswer(false);
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  const handleAdvance = useCallback(() => {
    if (roundProgress.current >= roundProgress.total) {
      const stats = onEndRound();
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

  const handlePlaceWord = useCallback(
    (tile: WordTile) => {
      if (isProcessing) return;
      setIncompleteWarning(false);
      setBankTiles((prev) => prev.filter((t) => t.originalIndex !== tile.originalIndex));
      setPlacedTiles((prev) => [...prev, tile]);
    },
    [isProcessing]
  );

  const handleReturnWord = useCallback(
    (tile: WordTile) => {
      if (isProcessing) return;
      setIncompleteWarning(false);
      setPlacedTiles((prev) => prev.filter((t) => t.originalIndex !== tile.originalIndex));
      setBankTiles((prev) => [...prev, tile]);
    },
    [isProcessing]
  );

  const handleSubmit = useCallback(() => {
    if (isProcessing || !currentExercise) return;

    if (bankTiles.length > 0) {
      setIncompleteWarning(true);
      return;
    }

    setIsProcessing(true);

    const answer = placedTiles.map((t) => t.word).join(' ');
    const result = onSubmitAnswer(answer);

    lastSubmitResultRef.current = {
      correct: result.correct,
      pointsEarned: result.pointsEarned,
    };

    if (result.correct) {
      playCorrectSound();
      setFeedbackMessage(getCorrectFeedback());
      setFeedbackType('correct');
      setSuccessAnswer(true);

      advanceTimeoutRef.current = setTimeout(() => {
        handleAdvance();
      }, ADVANCE_DELAY_MS);
    } else {
      playWrongSound();
      setShakeAnswer(true);
      setTimeout(() => setShakeAnswer(false), 500);

      if (result.shouldAdvance) {
        // Show correct answer
        const correctSentence = currentExercise.correctWords.join(' ');
        setFeedbackMessage(getShowCorrectMessage(correctSentence));
        setFeedbackType('show-answer');

        // Show the correct order
        const correctTiles = currentExercise.correctWords.map((word, index) => ({
          word,
          originalIndex: index,
        }));
        setPlacedTiles(correctTiles);
        setBankTiles([]);

        advanceTimeoutRef.current = setTimeout(() => {
          handleAdvance();
        }, ADVANCE_DELAY_MS * 1.5);
      } else {
        setFeedbackMessage(getWrongFeedback());
        setFeedbackType('wrong');
        setIsProcessing(false);
      }
    }
  }, [
    isProcessing,
    currentExercise,
    bankTiles.length,
    placedTiles,
    onSubmitAnswer,
    handleAdvance,
    playCorrectSound,
    playWrongSound,
  ]);

  const handleSpeak = useCallback(() => {
    if (placedTiles.length === 0) return;
    const text = placedTiles.map((t) => t.word).join(' ');
    speak(text);
  }, [placedTiles, speak]);

  // Drag and drop handlers
  const handleDragStart = useCallback(
    (e: React.DragEvent, tile: WordTile, source: 'bank' | 'placed') => {
      e.dataTransfer.setData('text/plain', JSON.stringify({ tile, source }));
      e.dataTransfer.effectAllowed = 'move';
    },
    []
  );


  const handleDragEnd = useCallback(() => {
    dropInsertIndexRef.current = null;
    setDropInsertIndex(null);
    setAnswerDragOver(false);
    setBankDragOver(false);
  }, []);

  const handleDropOnAnswer = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setAnswerDragOver(false);
      const insertIdx = dropInsertIndexRef.current;
      dropInsertIndexRef.current = null;
      setDropInsertIndex(null);
      if (isProcessing) return;
      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data.source === 'placed') {
          const tile = placedTiles.find(
            (t) => t.word === data.tile.word && t.originalIndex === data.tile.originalIndex
          );
          if (!tile) return;
          setPlacedTiles((prev) => {
            const without = prev.filter((t) => t !== tile);
            if (insertIdx != null) {
              // Adjust index since we removed the tile
              const currentIdx = prev.indexOf(tile);
              const adjustedIdx = insertIdx > currentIdx ? insertIdx - 1 : insertIdx;
              const result = [...without];
              result.splice(adjustedIdx, 0, tile);
              return result;
            }
            return [...without, tile];
          });
        } else if (data.source === 'bank') {
          const tile = bankTiles.find(
            (t) => t.word === data.tile.word && t.originalIndex === data.tile.originalIndex
          );
          if (!tile) return;
          setBankTiles((prev) => prev.filter((t) => t !== tile));
          setPlacedTiles((prev) => {
            if (insertIdx != null) {
              const result = [...prev];
              result.splice(insertIdx, 0, tile);
              return result;
            }
            return [...prev, tile];
          });
          setIncompleteWarning(false);
        }
      } catch {
        // ignore invalid drag data
      }
    },
    [isProcessing, bankTiles, placedTiles]
  );

  const handleDropOnBank = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setBankDragOver(false);
      if (isProcessing) return;
      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data.source === 'placed') {
          const tile = placedTiles.find(
            (t) => t.word === data.tile.word && t.originalIndex === data.tile.originalIndex
          );
          if (!tile) return;
          handleReturnWord(tile);
        }
      } catch {
        // ignore invalid drag data
      }
    },
    [isProcessing, placedTiles, handleReturnWord]
  );

  const handleDragOverAnswer = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    setAnswerDragOver(true);

    // Compute insert index from cursor position using offsetLeft (immune to CSS transforms)
    const container = answerAreaRef.current;
    if (!container) return;
    const tiles = container.querySelectorAll<HTMLButtonElement>('[data-placed-tile]');
    if (tiles.length === 0) {
      dropInsertIndexRef.current = null;
      setDropInsertIndex(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    // Use offset positions (immune to CSS transforms) for stable hit-testing.
    // Account for multi-row flex-wrap by checking both X and Y axes.
    const cursorX = e.clientX - containerRect.left + container.scrollLeft;
    const cursorY = e.clientY - containerRect.top + container.scrollTop;
    const hasVerticalLayout = tiles[0].offsetHeight > 0;

    let insertIdx = tiles.length; // default: after all tiles
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const midX = tile.offsetLeft + tile.offsetWidth / 2;

      if (!hasVerticalLayout) {
        // Single-row fallback (or jsdom where offsetHeight is 0): X-only comparison
        if (cursorX < midX) {
          insertIdx = i;
          break;
        }
      } else {
        const tileBottom = tile.offsetTop + tile.offsetHeight;
        if (cursorY < tileBottom) {
          // Cursor is above this tile's row, or on the same row and left of midpoint
          if (cursorX < midX || cursorY < tile.offsetTop) {
            insertIdx = i;
            break;
          }
        }
      }
    }
    dropInsertIndexRef.current = insertIdx;
    setDropInsertIndex(insertIdx);
  }, []);

  const handleDragOverBank = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setBankDragOver(true);
  }, []);

  const handleDragLeaveAnswer = useCallback((e: React.DragEvent) => {
    // Only clear when actually leaving the container, not when entering a child
    if (answerAreaRef.current && !answerAreaRef.current.contains(e.relatedTarget as Node)) {
      setAnswerDragOver(false);
      dropInsertIndexRef.current = null;
      setDropInsertIndex(null);
    }
  }, []);

  const handleDragLeaveBank = useCallback(() => {
    setBankDragOver(false);
  }, []);

  if (!currentExercise) {
    return null;
  }

  const displayPlacedWords = placedTiles.map((tile, index) => {
    let displayWord = tile.word;
    if (index === 0) {
      displayWord = displayWord.charAt(0).toUpperCase() + displayWord.slice(1);
    }
    return { ...tile, displayWord };
  });

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
          {labels.sentenceProgress(roundProgress.current, roundProgress.total)}
        </p>
      </header>

      {/* Main game card */}
      <Card padding="lg" shadow="lg" className="w-full max-w-md mx-auto flex-grow flex flex-col">
        <div className="flex-grow flex flex-col items-center space-y-4 sm:space-y-6">
          {/* Prompt */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">
            {labels.sentenceOrderingPrompt}
          </h2>

          {/* Answer area */}
          <div
            ref={answerAreaRef}
            data-testid="answer-area"
            className={`w-full min-h-[60px] p-3 border-2 border-dashed rounded-xl flex flex-wrap gap-2 items-center transition-all duration-200 ${
              successAnswer
                ? 'border-success bg-success-light animate-success-pulse'
                : answerDragOver
                  ? 'border-primary-500 bg-primary-100 scale-[1.02]'
                  : 'border-primary-300 bg-primary-50'
            } ${shakeAnswer ? 'animate-shake' : ''}`}
            onDrop={handleDropOnAnswer}
            onDragOver={handleDragOverAnswer}
            onDragLeave={handleDragLeaveAnswer}
          >
            {displayPlacedWords.map((tile, index) => {
              const shift =
                dropInsertIndex != null && dropInsertIndex <= index
                  ? 'translate-x-4'
                  : '';
              return (
                <button
                  key={`placed-${tile.originalIndex}`}
                  data-placed-tile
                  type="button"
                  className={`px-3 py-2 bg-primary-600 text-white rounded-lg font-medium text-base sm:text-lg shadow-md hover:bg-primary-700 active:scale-95 cursor-pointer animate-tile-settle draggable:opacity-50 draggable:scale-110 transition-transform duration-150 ${shift}`}
                  onClick={() => handleReturnWord(tile)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, tile, 'placed')}
                  onDragEnd={handleDragEnd}
                >
                  {tile.displayWord}
                </button>
              );
            })}
            {placedTiles.length > 0 && (
              <span className="text-xl font-bold text-gray-500 ml-1">
                {currentExercise.endPunctuation}
              </span>
            )}
            {placedTiles.length === 0 && (
              <p className="text-gray-400 text-sm italic w-full text-center">
                {labels.sentenceOrderingEmptyPrompt}
              </p>
            )}
          </div>

          {/* Speak button */}
          <ListenButton
            speaking={speaking}
            supported={speechSupported}
            onListen={handleSpeak}
            disabled={placedTiles.length === 0}
          />

          {/* Word bank */}
          <div
            data-testid="word-bank"
            className={`w-full p-3 rounded-xl flex flex-wrap gap-2 justify-center min-h-[50px] transition-all duration-200 ${
              bankDragOver ? 'bg-gray-100 scale-[1.02]' : 'bg-gray-50'
            }`}
            onDrop={handleDropOnBank}
            onDragOver={handleDragOverBank}
            onDragLeave={handleDragLeaveBank}
          >
            {bankTiles.map((tile) => (
              <button
                key={`bank-${tile.originalIndex}`}
                type="button"
                className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg font-medium text-base sm:text-lg shadow-sm hover:border-primary-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer animate-tile-pop"
                onClick={() => handlePlaceWord(tile)}
                draggable
                onDragStart={(e) => handleDragStart(e, tile, 'bank')}
                onDragEnd={handleDragEnd}
              >
                {tile.word}
              </button>
            ))}
          </div>

          {/* Incomplete warning */}
          {incompleteWarning && (
            <p className="text-warning-dark text-sm font-medium">{labels.placeAllWordsPrompt}</p>
          )}

          {/* Submit button */}
          <Button
            variant="primary"
            size="large"
            onClick={handleSubmit}
            className="w-full"
            disabled={isProcessing}
          >
            {labels.checkButton}
          </Button>

          {/* Feedback message */}
          {feedbackType && feedbackMessage && (
            <FeedbackMessage
              type={feedbackType}
              message={feedbackMessage}
              correctAnswer={
                feedbackType === 'show-answer'
                  ? currentExercise.correctWords.join(' ')
                  : undefined
              }
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

export default SentenceOrderingScreen;
