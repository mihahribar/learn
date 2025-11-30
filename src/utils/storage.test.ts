import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as storage from './storage';
import {
  isStorageAvailable,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  getProgress,
  saveProgress,
  clearProgress,
} from './storage';

describe('storage utilities', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('isStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true);
    });

  });

  describe('getStorageItem', () => {
    it('should return parsed data when item exists', () => {
      const testData = { name: 'test', value: 123 };
      window.localStorage.setItem('test-key', JSON.stringify(testData));

      const result = getStorageItem<typeof testData>('test-key');

      expect(result).toEqual(testData);
    });

    it('should return null when item does not exist', () => {
      const result = getStorageItem('non-existent-key');

      expect(result).toBeNull();
    });

    it('should return null when JSON parsing fails', () => {
      window.localStorage.setItem('invalid-json', '{invalid json}');

      const result = getStorageItem('invalid-json');

      expect(result).toBeNull();
    });

    it('should return null when localStorage is unavailable', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');
      spy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const result = getStorageItem('any-key');

      expect(result).toBeNull();
      spy.mockRestore();
    });

    it('should handle complex nested objects', () => {
      const complexData = {
        user: { name: 'John', age: 30 },
        items: [1, 2, 3],
        nested: { deep: { value: true } },
      };
      window.localStorage.setItem('complex', JSON.stringify(complexData));

      const result = getStorageItem<typeof complexData>('complex');

      expect(result).toEqual(complexData);
    });
  });

  describe('setStorageItem', () => {
    it('should store data successfully and return true', () => {
      const testData = { name: 'test', value: 456 };

      const result = setStorageItem('test-key', testData);

      expect(result).toBe(true);
      const stored = window.localStorage.getItem('test-key');
      expect(stored).toBe(JSON.stringify(testData));
    });

    it('should handle primitive values', () => {
      expect(setStorageItem('string', 'hello')).toBe(true);
      expect(setStorageItem('number', 42)).toBe(true);
      expect(setStorageItem('boolean', true)).toBe(true);
      expect(setStorageItem('null', null)).toBe(true);

      expect(getStorageItem('string')).toBe('hello');
      expect(getStorageItem('number')).toBe(42);
      expect(getStorageItem('boolean')).toBe(true);
      expect(getStorageItem('null')).toBe(null);
    });

    it('should handle arrays', () => {
      const arr = [1, 2, 3, 'four', { five: 5 }];

      setStorageItem('array', arr);

      expect(getStorageItem('array')).toEqual(arr);
    });

    it('should overwrite existing value', () => {
      setStorageItem('key', { value: 1 });
      setStorageItem('key', { value: 2 });

      expect(getStorageItem('key')).toEqual({ value: 2 });
    });
  });

  describe('removeStorageItem', () => {
    it('should remove item successfully and return true', () => {
      window.localStorage.setItem('test-key', 'test-value');

      const result = removeStorageItem('test-key');

      expect(result).toBe(true);
      expect(window.localStorage.getItem('test-key')).toBeNull();
    });

    it('should return true even if item does not exist', () => {
      const result = removeStorageItem('non-existent');

      expect(result).toBe(true);
    });

  });

  describe('getProgress', () => {
    it('should retrieve progress using the correct storage key', () => {
      const progressData = { totalPoints: 100, level: 5 };
      window.localStorage.setItem('spellbee_progress', JSON.stringify(progressData));

      const result = getProgress<typeof progressData>();

      expect(result).toEqual(progressData);
    });

    it('should return null when no progress exists', () => {
      const result = getProgress();

      expect(result).toBeNull();
    });

    it('should use the correct storage key', () => {
      const testData = { test: 'data' };
      window.localStorage.setItem('spellbee_progress', JSON.stringify(testData));

      const result = getProgress();

      expect(result).toEqual(testData);
      // Verify it doesn't get data from other keys
      window.localStorage.setItem('other_key', JSON.stringify({ other: 'value' }));
      const result2 = getProgress();
      expect(result2).toEqual(testData); // Still gets spellbee_progress
    });
  });

  describe('saveProgress', () => {
    it('should save progress using the correct storage key', () => {
      const progressData = { totalPoints: 200, level: 10 };

      const result = saveProgress(progressData);

      expect(result).toBe(true);
      const stored = window.localStorage.getItem('spellbee_progress');
      expect(JSON.parse(stored!)).toEqual(progressData);
    });

    it('should use the correct storage key', () => {
      const testData = { points: 100 };

      saveProgress(testData);

      // Verify it was saved to the correct key
      const stored = window.localStorage.getItem('spellbee_progress');
      expect(JSON.parse(stored!)).toEqual(testData);

      // Verify it doesn't affect other keys
      window.localStorage.setItem('other_key', 'other_value');
      saveProgress({ points: 200 });
      expect(window.localStorage.getItem('other_key')).toBe('other_value');
    });
  });

  describe('clearProgress', () => {
    it('should clear progress using the correct storage key', () => {
      window.localStorage.setItem('spellbee_progress', '{"data":"test"}');

      const result = clearProgress();

      expect(result).toBe(true);
      expect(window.localStorage.getItem('spellbee_progress')).toBeNull();
    });

    it('should return true even if progress does not exist', () => {
      const result = clearProgress();

      expect(result).toBe(true);
    });

    it('should use the correct storage key', () => {
      window.localStorage.setItem('spellbee_progress', '{"data":"test"}');
      window.localStorage.setItem('other_key', 'other_value');

      clearProgress();

      // Verify spellbee_progress was cleared
      expect(window.localStorage.getItem('spellbee_progress')).toBeNull();
      // Verify other keys weren't affected
      expect(window.localStorage.getItem('other_key')).toBe('other_value');
    });
  });

  describe('integration scenarios', () => {
    it('should handle full save-retrieve-clear cycle', () => {
      const progress = {
        totalPoints: 500,
        wordsCompleted: 50,
        badges: ['beginner', 'intermediate'],
      };

      // Save
      expect(saveProgress(progress)).toBe(true);

      // Retrieve
      const retrieved = getProgress<typeof progress>();
      expect(retrieved).toEqual(progress);

      // Clear
      expect(clearProgress()).toBe(true);

      // Verify cleared
      expect(getProgress()).toBeNull();
    });

    it('should handle multiple updates to the same key', () => {
      saveProgress({ version: 1 });
      expect(getProgress()).toEqual({ version: 1 });

      saveProgress({ version: 2 });
      expect(getProgress()).toEqual({ version: 2 });

      saveProgress({ version: 3 });
      expect(getProgress()).toEqual({ version: 3 });
    });

    it('should isolate progress from other storage keys', () => {
      const progress = { game: 'progress' };
      const otherData = { other: 'data' };

      setStorageItem('other-key', otherData);
      saveProgress(progress);

      expect(getProgress()).toEqual(progress);
      expect(getStorageItem('other-key')).toEqual(otherData);

      clearProgress();

      expect(getProgress()).toBeNull();
      expect(getStorageItem('other-key')).toEqual(otherData);
    });
  });
});
