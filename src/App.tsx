import { useState, useCallback } from 'react';
import type { Screen, GameMode, RoundStats, Badge } from './types';
import { GameProvider, ProgressProvider, SpeechProvider, SoundProvider } from './contexts';
import { useGame } from './contexts/GameContext';
import { useProgressContext } from './contexts/ProgressContext';
import { calculateRoundTotal } from './utils/scoring';
import { ScreenRouter } from './components/ScreenRouter';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [lastRoundStats, setLastRoundStats] = useState<RoundStats | null>(null);
  const [lastRoundPoints, setLastRoundPoints] = useState(0);
  const [newlyEarnedBadges, setNewlyEarnedBadges] = useState<Badge[]>([]);

  const gameState = useGame();
  const progressHook = useProgressContext();

  const handleStartGame = useCallback(
    (mode: GameMode) => {
      gameState.startGame(mode);
      progressHook.resetCurrentStreak();
      setCurrentScreen(mode);
    },
    [gameState, progressHook]
  );

  const handleNavigate = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  const handleRoundComplete = useCallback(
    (stats: RoundStats) => {
      // Calculate total points for the round
      const totalRoundPoints = calculateRoundTotal(stats.score, gameState.roundProgress.points);

      // Update progress
      progressHook.addPoints(totalRoundPoints);
      progressHook.incrementRoundsPlayed();

      // Check for new badges
      const newBadges = progressHook.checkAndAwardBadges(stats);

      // Store data for round complete screen
      setLastRoundStats(stats);
      setLastRoundPoints(totalRoundPoints);
      setNewlyEarnedBadges(newBadges);

      // Navigate to round complete screen
      setCurrentScreen('round-complete');
    },
    [gameState.roundProgress.points, progressHook]
  );

  const handleRecordWordAttempt = useCallback(
    (answer: string) => {
      const result = gameState.submitAnswer(answer);

      // Record the attempt for progress tracking (only for word-based modes)
      if (gameState.currentWord && 'english' in gameState.currentWord) {
        progressHook.recordWordAttempt(gameState.currentWord.id, result.correct);
        progressHook.updateStreak(result.correct);
      }

      return result;
    },
    [gameState, progressHook]
  );

  const handleGrammarAttempt = useCallback(
    (answer: string) => {
      const result = gameState.submitAnswer(answer);

      // Update streak for grammar attempts
      progressHook.updateStreak(result.correct);

      return result;
    },
    [gameState, progressHook]
  );

  const handlePlayAgain = useCallback(() => {
    if (gameState.currentMode) {
      handleStartGame(gameState.currentMode);
    } else {
      setCurrentScreen('home');
    }
  }, [gameState.currentMode, handleStartGame]);

  const handleGoHome = useCallback(() => {
    gameState.resetGame();
    setCurrentScreen('home');
  }, [gameState]);

  return (
    <div className="w-full min-h-screen">
      {/* Skip link for keyboard accessibility */}
      <a href="#main-content" className="skip-link">
        Preskoči na vsebino
      </a>
      <main id="main-content" className="animate-screen-enter" key={currentScreen}>
        <ScreenRouter
          currentScreen={currentScreen}
          lastRoundStats={lastRoundStats}
          lastRoundPoints={lastRoundPoints}
          newlyEarnedBadges={newlyEarnedBadges}
          onStartGame={handleStartGame}
          onNavigate={handleNavigate}
          onRoundComplete={handleRoundComplete}
          onRecordWordAttempt={handleRecordWordAttempt}
          onGrammarAttempt={handleGrammarAttempt}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
      </main>
    </div>
  );
}

/**
 * Main App component with context providers
 */
function App() {
  return (
    <GameProvider>
      <ProgressProvider>
        <SpeechProvider>
          <SoundProvider>
            <AppContent />
          </SoundProvider>
        </SpeechProvider>
      </ProgressProvider>
    </GameProvider>
  );
}

export default App;
