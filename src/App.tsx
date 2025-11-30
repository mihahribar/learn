import { useState, useCallback } from 'react';
import type { Screen, GameMode, RoundStats, Badge } from './types';
import { GameProvider, ProgressProvider, SpeechProvider, SoundProvider } from './contexts';
import { useGame } from './contexts/GameContext';
import { useProgressContext } from './contexts/ProgressContext';
import { useSpeechContext } from './contexts/SpeechContext';
import { useSoundContext } from './contexts/SoundContext';
import { calculateRoundTotal } from './utils/scoring';

import { HomeScreen } from './components/screens/HomeScreen';
import { ListenSpellScreen } from './components/screens/ListenSpellScreen';
import { PickSpellingScreen } from './components/screens/PickSpellingScreen';
import { PluralFormsScreen } from './components/screens/PluralFormsScreen';
import { GrammarFormsScreen } from './components/screens/GrammarFormsScreen';
import { RoundCompleteScreen } from './components/screens/RoundCompleteScreen';
import { BadgesScreen } from './components/screens/BadgesScreen';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [lastRoundStats, setLastRoundStats] = useState<RoundStats | null>(null);
  const [lastRoundPoints, setLastRoundPoints] = useState(0);
  const [newlyEarnedBadges, setNewlyEarnedBadges] = useState<Badge[]>([]);

  const gameState = useGame();
  const progressHook = useProgressContext();
  const speech = useSpeechContext();
  const sound = useSoundContext();

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

  // Render appropriate screen based on current state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            totalPoints={progressHook.progress.totalPoints}
            badgesCount={progressHook.progress.badges.length}
            onStartGame={handleStartGame}
            onNavigate={handleNavigate}
            muted={sound.muted}
            onToggleMute={sound.toggleMute}
            soundSupported={sound.supported}
            storageAvailable={progressHook.storageAvailable}
            speechSupported={speech.supported}
          />
        );

      case 'listen-spell':
        return (
          <ListenSpellScreen
            currentWord={
              gameState.currentWord && 'english' in gameState.currentWord
                ? gameState.currentWord
                : null
            }
            roundProgress={gameState.roundProgress}
            currentAttempts={gameState.currentAttempts}
            onSubmitAnswer={handleRecordWordAttempt}
            onAdvanceWord={gameState.advanceToNextWord}
            onRoundComplete={handleRoundComplete}
            onEndRound={gameState.endRound}
            onGoBack={handleGoHome}
            speak={speech.speak}
            speaking={speech.speaking}
            speechSupported={speech.supported}
            playCorrectSound={sound.playCorrect}
            playWrongSound={sound.playWrong}
          />
        );

      case 'pick-spelling':
        return (
          <PickSpellingScreen
            currentWord={
              gameState.currentWord && 'english' in gameState.currentWord
                ? gameState.currentWord
                : null
            }
            roundProgress={gameState.roundProgress}
            currentAttempts={gameState.currentAttempts}
            onSubmitAnswer={handleRecordWordAttempt}
            onAdvanceWord={gameState.advanceToNextWord}
            onRoundComplete={handleRoundComplete}
            onEndRound={gameState.endRound}
            onGoBack={handleGoHome}
            speak={speech.speak}
            speaking={speech.speaking}
            speechSupported={speech.supported}
            playCorrectSound={sound.playCorrect}
            playWrongSound={sound.playWrong}
          />
        );

      case 'plural-forms':
        return (
          <PluralFormsScreen
            currentWord={
              gameState.currentWord && 'english' in gameState.currentWord
                ? gameState.currentWord
                : null
            }
            roundProgress={gameState.roundProgress}
            currentAttempts={gameState.currentAttempts}
            onSubmitAnswer={handleRecordWordAttempt}
            onAdvanceWord={gameState.advanceToNextWord}
            onRoundComplete={handleRoundComplete}
            onEndRound={gameState.endRound}
            onGoBack={handleGoHome}
            speak={speech.speak}
            speaking={speech.speaking}
            speechSupported={speech.supported}
            playCorrectSound={sound.playCorrect}
            playWrongSound={sound.playWrong}
          />
        );

      case 'grammar-forms':
        return (
          <GrammarFormsScreen
            currentQuestion={
              gameState.currentWord && 'correctAnswer' in gameState.currentWord
                ? gameState.currentWord
                : null
            }
            roundProgress={gameState.roundProgress}
            currentAttempts={gameState.currentAttempts}
            onSubmitAnswer={handleGrammarAttempt}
            onAdvanceWord={gameState.advanceToNextWord}
            onRoundComplete={handleRoundComplete}
            onEndRound={gameState.endRound}
            onGoBack={handleGoHome}
            playCorrectSound={sound.playCorrect}
            playWrongSound={sound.playWrong}
          />
        );

      case 'round-complete':
        return (
          <RoundCompleteScreen
            roundStats={lastRoundStats || { score: 0, maxStreak: 0, perfectRound: false }}
            roundPoints={lastRoundPoints}
            newBadges={newlyEarnedBadges}
            onPlayAgain={handlePlayAgain}
            onGoHome={handleGoHome}
            playCelebration={sound.playCelebration}
            playBadgeSound={sound.playBadge}
          />
        );

      case 'badges':
        return <BadgesScreen progress={progressHook.progress} onGoBack={handleGoHome} />;

      default:
        return (
          <HomeScreen
            totalPoints={progressHook.progress.totalPoints}
            badgesCount={progressHook.progress.badges.length}
            onStartGame={handleStartGame}
            onNavigate={handleNavigate}
            muted={sound.muted}
            onToggleMute={sound.toggleMute}
            soundSupported={sound.supported}
            storageAvailable={progressHook.storageAvailable}
            speechSupported={speech.supported}
          />
        );
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* Skip link for keyboard accessibility */}
      <a href="#main-content" className="skip-link">
        Preskoči na vsebino
      </a>
      <main id="main-content" className="animate-screen-enter" key={currentScreen}>
        {renderScreen()}
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
