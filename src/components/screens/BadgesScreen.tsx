import type { PersistedProgress } from '../../types';
import { labels } from '../../data/messages';
import { badges } from '../../data/badges';
import { Button } from '../ui/Button';
import { Badge as BadgeComponent } from '../ui/Badge';

export interface BadgesScreenProps {
  progress: PersistedProgress;
  onGoBack: () => void;
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

const TrophyIcon = () => (
  <span className="text-3xl sm:text-4xl" role="img" aria-label="trophy">
    {'\uD83C\uDFC6'}
  </span>
);

export function BadgesScreen({ progress, onGoBack }: BadgesScreenProps) {
  const earnedBadgeIds = progress.badges;
  const earnedCount = earnedBadgeIds.length;
  const totalCount = badges.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100 flex flex-col p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="w-full max-w-2xl mx-auto mb-4 sm:mb-6">
        <Button
          variant="secondary"
          size="small"
          icon={<BackArrowIcon />}
          onClick={onGoBack}
          className="mb-4"
          aria-label={labels.backButton}
        >
          {labels.backButton}
        </Button>

        <div className="text-center">
          <div className="mb-2 animate-bounce-in">
            <TrophyIcon />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-700 mb-2">
            {labels.badgesTitle}
          </h1>
          <p className="text-base sm:text-lg text-gray-600" aria-live="polite">
            <span className="sr-only">Zasluzene znacke: </span>
            {earnedCount} / {totalCount}
          </p>
        </div>
      </header>

      {/* Badges grid */}
      <main className="w-full max-w-2xl mx-auto flex-grow">
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          role="list"
          aria-label="Seznam znack"
        >
          {badges.map((badge) => {
            const isEarned = earnedBadgeIds.includes(badge.id);
            return (
              <div key={badge.id} role="listitem">
                <BadgeComponent
                  name={badge.name}
                  description={badge.description}
                  icon={badge.icon}
                  earned={isEarned}
                  aria-label={
                    isEarned
                      ? `Zasluzena znacka: ${badge.name} - ${badge.description}`
                      : `Zaklenjena znacka: ${badge.name} - ${badge.description}`
                  }
                />
              </div>
            );
          })}
        </div>
      </main>

      {/* Stats summary at bottom */}
      <footer
        className="w-full max-w-2xl mx-auto mt-4 sm:mt-6"
        aria-label="Statistika"
      >
        <div className="bg-white rounded-2xl shadow-md p-3 sm:p-4">
          <div className="flex justify-around flex-wrap gap-2">
            <div className="text-center min-w-[80px]">
              <p className="text-xl sm:text-2xl font-bold text-primary-700">
                {progress.totalPoints}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                {labels.totalPoints}
              </p>
            </div>
            <div
              className="hidden sm:block h-12 w-px bg-gray-200"
              aria-hidden="true"
            />
            <div className="text-center min-w-[80px]">
              <p className="text-xl sm:text-2xl font-bold text-primary-700">
                {progress.roundsPlayed}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Odigrane igre</p>
            </div>
            <div
              className="hidden sm:block h-12 w-px bg-gray-200"
              aria-hidden="true"
            />
            <div className="text-center min-w-[80px]">
              <p className="text-xl sm:text-2xl font-bold text-primary-700">
                {progress.wordsCompleted}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Pravilne besede</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default BadgesScreen;
