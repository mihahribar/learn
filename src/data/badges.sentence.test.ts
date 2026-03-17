import { describe, it, expect } from 'vitest';
import { badges, checkNewBadges } from './badges';
import type { PersistedProgress, RoundStats } from '../types';

const baseProgress: PersistedProgress = {
  version: 1,
  totalPoints: 0,
  wordsCompleted: 0,
  roundsPlayed: 0,
  badges: [],
  wordStats: {},
  lastPlayedDate: new Date().toISOString(),
  currentStreak: 0,
  longestStreak: 0,
  consecutiveDays: 0,
};

describe('Sentence ordering badges', () => {
  it('should include sentence-builder badge in definitions', () => {
    const badge = badges.find((b) => b.id === 'sentence-builder');
    expect(badge).toBeDefined();
    expect(badge!.name).toBe('Graditelj stavkov');
  });

  it('should include sentence-master badge in definitions', () => {
    const badge = badges.find((b) => b.id === 'sentence-master');
    expect(badge).toBeDefined();
    expect(badge!.name).toBe('Mojster stavkov');
  });

  it('should award sentence-builder after first sentence-ordering round', () => {
    const progress: PersistedProgress = {
      ...baseProgress,
      roundsPlayed: 1,
      sentenceRoundsPlayed: 1,
    };
    const newBadges = checkNewBadges(progress);
    const ids = newBadges.map((b) => b.id);
    expect(ids).toContain('sentence-builder');
  });

  it('should not award sentence-builder with zero sentence rounds', () => {
    const progress: PersistedProgress = {
      ...baseProgress,
      roundsPlayed: 5,
    };
    const newBadges = checkNewBadges(progress);
    const ids = newBadges.map((b) => b.id);
    expect(ids).not.toContain('sentence-builder');
  });

  it('should award sentence-master for perfect sentence-ordering round', () => {
    const progress: PersistedProgress = {
      ...baseProgress,
      sentenceRoundsPlayed: 1,
    };
    const roundStats: RoundStats = {
      score: 10,
      maxStreak: 10,
      perfectRound: true,
      mode: 'sentence-ordering',
    };
    const newBadges = checkNewBadges(progress, roundStats);
    const ids = newBadges.map((b) => b.id);
    expect(ids).toContain('sentence-master');
  });

  it('should not award sentence-master for non-perfect round', () => {
    const progress: PersistedProgress = {
      ...baseProgress,
      sentenceRoundsPlayed: 1,
    };
    const roundStats: RoundStats = {
      score: 8,
      maxStreak: 5,
      perfectRound: false,
      mode: 'sentence-ordering',
    };
    const newBadges = checkNewBadges(progress, roundStats);
    const ids = newBadges.map((b) => b.id);
    expect(ids).not.toContain('sentence-master');
  });

  it('should not award sentence-master for perfect round in other modes', () => {
    const progress: PersistedProgress = {
      ...baseProgress,
    };
    const roundStats: RoundStats = {
      score: 10,
      maxStreak: 10,
      perfectRound: true,
      mode: 'listen-spell',
    };
    const newBadges = checkNewBadges(progress, roundStats);
    const ids = newBadges.map((b) => b.id);
    expect(ids).not.toContain('sentence-master');
  });
});
