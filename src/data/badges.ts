import type { Badge, PersistedProgress, RoundStats } from '../types';

/**
 * Badge definitions for the EnglishGym game
 * Each badge has a unique ID, Slovenian name/description, icon, and condition function
 */
export const badges: Badge[] = [
  {
    id: 'first-round',
    name: 'Prvi korak',
    description: 'Zaključi svojo prvo igro',
    icon: 'star',
    condition: (progress: PersistedProgress) => progress.roundsPlayed >= 1,
  },
  {
    id: 'ten-rounds',
    name: 'Vztrajnost',
    description: 'Zaključi 10 iger',
    icon: 'trophy',
    condition: (progress: PersistedProgress) => progress.roundsPlayed >= 10,
  },
  {
    id: 'perfect-round',
    name: 'Popolno!',
    description: 'Doseži 10/10 v eni igri',
    icon: 'crown',
    condition: (_progress: PersistedProgress, roundStats?: RoundStats) =>
      roundStats?.perfectRound === true,
  },
  {
    id: 'hundred-words',
    name: 'Besedni zaklad',
    description: 'Pravilno črkuj 100 besed',
    icon: 'book',
    condition: (progress: PersistedProgress) => progress.wordsCompleted >= 100,
  },
  {
    id: 'streak-five',
    name: 'Vroča roka',
    description: '5 pravilnih odgovorov zapored',
    icon: 'fire',
    condition: (progress: PersistedProgress, roundStats?: RoundStats) =>
      progress.longestStreak >= 5 || (roundStats?.maxStreak ?? 0) >= 5,
  },
  {
    id: 'five-hundred-words',
    name: 'Mojster črkovanja',
    description: 'Pravilno črkuj 500 besed',
    icon: 'medal',
    condition: (progress: PersistedProgress) => progress.wordsCompleted >= 500,
  },
  {
    id: 'daily-habit',
    name: 'Dnevna navada',
    description: 'Igraj 7 dni zapored',
    icon: 'calendar',
    condition: (progress: PersistedProgress) => progress.consecutiveDays >= 7,
  },
];

/**
 * Get a badge by its ID
 */
export function getBadgeById(id: string): Badge | undefined {
  return badges.find((badge) => badge.id === id);
}

/**
 * Get all earned badges from progress
 */
export function getEarnedBadges(progress: PersistedProgress): Badge[] {
  return badges.filter((badge) => progress.badges.includes(badge.id));
}

/**
 * Get all locked badges from progress
 */
export function getLockedBadges(progress: PersistedProgress): Badge[] {
  return badges.filter((badge) => !progress.badges.includes(badge.id));
}

/**
 * Check which new badges have been earned
 * Returns badges that pass their condition but are not yet in the earned list
 */
export function checkNewBadges(
  progress: PersistedProgress,
  roundStats?: RoundStats
): Badge[] {
  return badges.filter(
    (badge) =>
      !progress.badges.includes(badge.id) &&
      badge.condition(progress, roundStats)
  );
}

export default badges;
