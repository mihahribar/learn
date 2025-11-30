/**
 * localStorage helper utilities with JSON parsing
 *
 * Provides safe access to browser localStorage with automatic JSON
 * serialization/deserialization and graceful error handling for
 * scenarios where localStorage might be unavailable (private browsing,
 * quota exceeded, etc.)
 *
 * @module storage
 */

/**
 * The localStorage key used for storing game progress
 * @constant
 */
const STORAGE_KEY = 'spellbee_progress';

/**
 * Checks if localStorage is available and functional
 *
 * Tests localStorage by attempting to write and remove a test value.
 * This catches scenarios where localStorage exists but throws errors
 * (e.g., private browsing mode, quota exceeded).
 *
 * @returns True if localStorage is available and working, false otherwise
 *
 * @example
 * ```typescript
 * if (isStorageAvailable()) {
 *   // Safe to use storage functions
 *   saveProgress(data)
 * } else {
 *   // Show warning to user about disabled storage
 *   console.warn('Storage unavailable')
 * }
 * ```
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves and parses a value from localStorage
 *
 * Automatically handles JSON parsing and provides type safety through
 * generics. Returns null for any error condition including missing keys,
 * invalid JSON, or unavailable storage.
 *
 * @template T - The expected type of the stored value
 * @param key - The localStorage key to retrieve
 * @returns The parsed value of type T, or null if not found or invalid
 *
 * @example
 * ```typescript
 * interface UserSettings {
 *   theme: string
 *   volume: number
 * }
 *
 * const settings = getStorageItem<UserSettings>('settings')
 * if (settings) {
 *   console.log(settings.theme) // Type-safe access
 * }
 * ```
 */
export function getStorageItem<T>(key: string): T | null {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
}

/**
 * Stores a value in localStorage with automatic JSON stringification
 *
 * Safely stores any JSON-serializable value with automatic error handling.
 * Returns a boolean to indicate success or failure.
 *
 * @template T - The type of value being stored
 * @param key - The localStorage key to use
 * @param value - The value to store (must be JSON-serializable)
 * @returns True if successfully stored, false on any error
 *
 * @example
 * ```typescript
 * const success = setStorageItem('user', { name: 'John', age: 30 })
 * if (!success) {
 *   console.error('Failed to save user data')
 * }
 * ```
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes a value from localStorage
 *
 * Safely removes an item from localStorage with error handling.
 * Returns true even if the key doesn't exist (idempotent operation).
 *
 * @param key - The localStorage key to remove
 * @returns True if operation succeeded, false if storage unavailable
 *
 * @example
 * ```typescript
 * if (removeStorageItem('temp-data')) {
 *   console.log('Temporary data cleared')
 * }
 * ```
 */
export function removeStorageItem(key: string): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves the saved game progress from localStorage
 *
 * Convenience wrapper for getStorageItem using the standard progress key.
 * Use with PersistedProgress type for full type safety.
 *
 * @template T - The progress data type (typically PersistedProgress)
 * @returns The progress data or null if not found
 *
 * @example
 * ```typescript
 * import type { PersistedProgress } from '../types'
 *
 * const progress = getProgress<PersistedProgress>()
 * if (progress) {
 *   console.log(`Total points: ${progress.totalPoints}`)
 * }
 * ```
 */
export function getProgress<T>(): T | null {
  return getStorageItem<T>(STORAGE_KEY);
}

/**
 * Saves game progress to localStorage
 *
 * Convenience wrapper for setStorageItem using the standard progress key.
 *
 * @template T - The progress data type (typically PersistedProgress)
 * @param progress - The progress data to save
 * @returns True if successfully saved, false otherwise
 *
 * @example
 * ```typescript
 * const newProgress: PersistedProgress = {
 *   version: 1,
 *   totalPoints: 500,
 *   // ... other fields
 * }
 *
 * if (saveProgress(newProgress)) {
 *   console.log('Progress saved successfully')
 * }
 * ```
 */
export function saveProgress<T>(progress: T): boolean {
  return setStorageItem(STORAGE_KEY, progress);
}

/**
 * Clears all saved game progress from localStorage
 *
 * Convenience wrapper for removeStorageItem using the standard progress key.
 * Use this for logout, reset, or data clearing operations.
 *
 * @returns True if successfully cleared, false if storage unavailable
 *
 * @example
 * ```typescript
 * if (clearProgress()) {
 *   console.log('Game progress reset')
 * }
 * ```
 */
export function clearProgress(): boolean {
  return removeStorageItem(STORAGE_KEY);
}
