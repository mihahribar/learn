import { useState, ReactNode } from 'react';
import { labels } from '../../data/messages';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { ScoreDisplay } from '../game/ScoreDisplay';
import { ConfirmDialog } from '../ui/ConfirmDialog';

/**
 * Common props shared by all game screens
 */
export interface BaseGameScreenProps {
  roundProgress: {
    current: number;
    total: number;
    score: number;
    points: number;
  };
  onGoBack: () => void;
  children: ReactNode;
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

/**
 * Base layout component for game screens
 * Provides common structure: header with progress, main card area, footer with score
 * and quit confirmation dialog
 */
export function BaseGameScreen({ roundProgress, onGoBack, children }: BaseGameScreenProps) {
  const [showQuitDialog, setShowQuitDialog] = useState(false);

  const handleConfirmQuit = () => {
    setShowQuitDialog(false);
    onGoBack();
  };

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
          {children}
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
        onConfirm={handleConfirmQuit}
        onCancel={() => setShowQuitDialog(false)}
        variant="warning"
      />
    </div>
  );
}
