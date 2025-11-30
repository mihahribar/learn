import type { Screen, GameMode, RoundStats, Badge } from '../types';
import { isWord, isGrammarQuestion } from '../types';
import { useGame } from '../contexts/GameContext';
import { useProgressContext } from '../contexts/ProgressContext';
import { useSpeechContext } from '../contexts/SpeechContext';
import { useSoundContext } from '../contexts/SoundContext';

import { HomeScreen } from './screens/HomeScreen';
import { ListenSpellScreen } from './screens/ListenSpellScreen';
import { PickSpellingScreen } from './screens/PickSpellingScreen';
import { PluralFormsScreen } from './screens/PluralFormsScreen';
import { GrammarFormsScreen } from './screens/GrammarFormsScreen';
import { RoundCompleteScreen } from './screens/RoundCompleteScreen';
import { BadgesScreen } from './screens/BadgesScreen';

interface ScreenRouterProps {
  currentScreen: Screen;
  lastRoundStats: RoundStats | null;
  lastRoundPoints: number;
  newlyEarnedBadges: Badge[];
  onStartGame: (mode: GameMode) => void;
  onNavigate: (screen: Screen) => void;
  onRoundComplete: (stats: RoundStats) => void;
  onRecordWordAttempt: (answer: string) => {
    correct: boolean;
    pointsEarned: number;
    attemptNumber: number;
    shouldAdvance: boolean;
    correctAnswer: string;
  };
  onGrammarAttempt: (answer: string) => {
    correct: boolean;
    pointsEarned: number;
    attemptNumber: number;
    shouldAdvance: boolean;
    correctAnswer: string;
  };
  onPlayAgain: () => void;
  onGoHome: () => void;
}

/**
 * Routes to the appropriate screen based on current state
 * Centralizes all screen rendering logic
 */
export function ScreenRouter({
  currentScreen,
  lastRoundStats,
  lastRoundPoints,
  newlyEarnedBadges,
  onStartGame,
  onNavigate,
  onRoundComplete,
  onRecordWordAttempt,
  onGrammarAttempt,
  onPlayAgain,
  onGoHome,
}: ScreenRouterProps) {
  const gameState = useGame();
  const progressHook = useProgressContext();
  const speech = useSpeechContext();
  const sound = useSoundContext();

  switch (currentScreen) {
    case 'home':
      return (
        <HomeScreen
          totalPoints={progressHook.progress.totalPoints}
          badgesCount={progressHook.progress.badges.length}
          onStartGame={onStartGame}
          onNavigate={onNavigate}
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
            gameState.currentWord && isWord(gameState.currentWord) ? gameState.currentWord : null
          }
          roundProgress={gameState.roundProgress}
          currentAttempts={gameState.currentAttempts}
          onSubmitAnswer={onRecordWordAttempt}
          onAdvanceWord={gameState.advanceToNextWord}
          onRoundComplete={onRoundComplete}
          onEndRound={gameState.endRound}
          onGoBack={onGoHome}
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
            gameState.currentWord && isWord(gameState.currentWord) ? gameState.currentWord : null
          }
          roundProgress={gameState.roundProgress}
          currentAttempts={gameState.currentAttempts}
          onSubmitAnswer={onRecordWordAttempt}
          onAdvanceWord={gameState.advanceToNextWord}
          onRoundComplete={onRoundComplete}
          onEndRound={gameState.endRound}
          onGoBack={onGoHome}
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
            gameState.currentWord && isWord(gameState.currentWord) ? gameState.currentWord : null
          }
          roundProgress={gameState.roundProgress}
          currentAttempts={gameState.currentAttempts}
          onSubmitAnswer={onRecordWordAttempt}
          onAdvanceWord={gameState.advanceToNextWord}
          onRoundComplete={onRoundComplete}
          onEndRound={gameState.endRound}
          onGoBack={onGoHome}
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
            gameState.currentWord && isGrammarQuestion(gameState.currentWord)
              ? gameState.currentWord
              : null
          }
          roundProgress={gameState.roundProgress}
          currentAttempts={gameState.currentAttempts}
          onSubmitAnswer={onGrammarAttempt}
          onAdvanceWord={gameState.advanceToNextWord}
          onRoundComplete={onRoundComplete}
          onEndRound={gameState.endRound}
          onGoBack={onGoHome}
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
          onPlayAgain={onPlayAgain}
          onGoHome={onGoHome}
          playCelebration={sound.playCelebration}
          playBadgeSound={sound.playBadge}
        />
      );

    case 'badges':
      return <BadgesScreen progress={progressHook.progress} onGoBack={onGoHome} />;

    default:
      return (
        <HomeScreen
          totalPoints={progressHook.progress.totalPoints}
          badgesCount={progressHook.progress.badges.length}
          onStartGame={onStartGame}
          onNavigate={onNavigate}
          muted={sound.muted}
          onToggleMute={sound.toggleMute}
          soundSupported={sound.supported}
          storageAvailable={progressHook.storageAvailable}
          speechSupported={speech.supported}
        />
      );
  }
}
