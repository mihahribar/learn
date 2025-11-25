import type { GameMode, Screen } from '../../types';
import { labels } from '../../data/messages';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface HomeScreenProps {
  totalPoints: number;
  badgesCount: number;
  onStartGame: (mode: GameMode) => void;
  onNavigate: (screen: Screen) => void;
  muted: boolean;
  onToggleMute: () => void;
  soundSupported: boolean;
  storageAvailable?: boolean;
  speechSupported?: boolean;
}

const SpeakerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z" />
    <path d="M18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
);

const Squares2x2Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
    />
  </svg>
);

const SoundOnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
  </svg>
);

const SoundOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z" />
  </svg>
);

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 flex-shrink-0"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
      clipRule="evenodd"
    />
  </svg>
);

const GymIcon = () => (
  <span className="text-4xl sm:text-5xl" role="img" aria-label="flexed biceps">
    {'\uD83D\uDCAA'}
  </span>
);

const TrophyIcon = () => (
  <span className="text-xl sm:text-2xl" role="img" aria-label="trophy">
    {'\uD83C\uDFC6'}
  </span>
);

export function HomeScreen({
  totalPoints,
  badgesCount,
  onStartGame,
  onNavigate,
  muted,
  onToggleMute,
  soundSupported,
  storageAvailable = true,
  speechSupported = true,
}: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100 flex flex-col">
      {/* Settings button in top right */}
      {soundSupported && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <button
            type="button"
            onClick={onToggleMute}
            className="p-2.5 sm:p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-4 focus:ring-primary-400"
            aria-label={muted ? labels.soundOff : labels.soundOn}
            aria-pressed={muted}
            title={muted ? labels.soundOff : labels.soundOn}
          >
            {muted ? <SoundOffIcon /> : <SoundOnIcon />}
          </button>
        </div>
      )}

      {/* Main content - centered */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-6 sm:py-8">
        {/* Title section */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="mb-2 animate-bounce-in">
            <GymIcon />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-700 mb-2">
            {labels.appTitle}
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            {labels.homeSubtitle}
          </p>
        </header>

        {/* Warning banners for edge cases */}
        {(!storageAvailable || !speechSupported) && (
          <div
            className="w-full max-w-md mb-4 sm:mb-6 space-y-2"
            role="alert"
            aria-live="polite"
          >
            {!storageAvailable && (
              <div className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-warning-light border-2 border-warning rounded-xl text-warning-dark">
                <WarningIcon />
                <p className="text-xs sm:text-sm font-medium">
                  {labels.storageNotAvailable}
                </p>
              </div>
            )}
            {!speechSupported && (
              <div className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-primary-100 border-2 border-primary-400 rounded-xl text-primary-800">
                <WarningIcon />
                <p className="text-xs sm:text-sm font-medium">
                  {labels.speechNotSupported}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Game mode buttons */}
        <nav
          className="w-full max-w-md space-y-3 sm:space-y-4 mb-6 sm:mb-8"
          aria-label="Izberi nacin igre"
        >
          <Button
            variant="primary"
            size="large"
            icon={<SpeakerIcon />}
            onClick={() => onStartGame('listen-spell')}
            className="w-full py-5 sm:py-6 text-lg sm:text-xl"
            aria-describedby="listen-spell-desc"
          >
            {labels.listenSpellButton}
          </Button>
          <span id="listen-spell-desc" className="sr-only">
            Poslusaj anglesko besedo in jo pravilno crkovano vpisi
          </span>

          <Button
            variant="success"
            size="large"
            icon={<CheckIcon />}
            onClick={() => onStartGame('pick-spelling')}
            className="w-full py-5 sm:py-6 text-lg sm:text-xl"
            aria-describedby="pick-spelling-desc"
          >
            {labels.pickSpellingButton}
          </Button>
          <span id="pick-spelling-desc" className="sr-only">
            Izberi pravilno crkovano obliko besede med tremi moznostmi
          </span>

          <Button
            variant="warning"
            size="large"
            icon={<Squares2x2Icon />}
            onClick={() => onStartGame('plural-forms')}
            className="w-full py-5 sm:py-6 text-lg sm:text-xl"
            aria-describedby="plural-forms-desc"
          >
            {labels.pluralFormsButton}
          </Button>
          <span id="plural-forms-desc" className="sr-only">
            Izberi pravilno mnozino angleske besede med tremi moznostmi
          </span>
        </nav>

        {/* Stats section */}
        <Card
          padding="md"
          shadow="md"
          className="w-full max-w-md mb-3 sm:mb-4"
          aria-label="Tvoja statistika"
        >
          <div className="flex justify-around items-center">
            <div className="text-center">
              <p
                className="text-2xl sm:text-3xl font-bold text-primary-700"
                aria-label={`${totalPoints} skupnih tock`}
              >
                {totalPoints}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                {labels.totalPoints}
              </p>
            </div>
            <div className="h-10 sm:h-12 w-px bg-gray-200" aria-hidden="true" />
            <div className="text-center">
              <p
                className="text-2xl sm:text-3xl font-bold text-primary-700"
                aria-label={`${badgesCount} zasluzenih znack`}
              >
                {badgesCount}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                {labels.badgesEarned}
              </p>
            </div>
          </div>
        </Card>

        {/* Badges button */}
        <Button
          variant="secondary"
          size="medium"
          icon={<TrophyIcon />}
          onClick={() => onNavigate('badges')}
          className="w-full max-w-md"
          aria-label="Oglej si svoje znacke"
        >
          {labels.badgesButton}
        </Button>
      </div>
    </div>
  );
}

export default HomeScreen;
