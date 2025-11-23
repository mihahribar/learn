/**
 * localStorage helper utilities with JSON parsing
 * Provides safe access to localStorage with graceful error handling
 */

const STORAGE_KEY = 'spellbee_progress';

/**
 * Check if localStorage is available
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
 * Get a value from localStorage with JSON parsing
 *
 * @param key - The storage key
 * @returns The parsed value or null if not found/invalid
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
 * Set a value in localStorage with JSON stringification
 *
 * @param key - The storage key
 * @param value - The value to store
 * @returns true if successful, false otherwise
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
 * Remove a value from localStorage
 *
 * @param key - The storage key
 * @returns true if successful, false otherwise
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
 * Get the game progress from localStorage
 */
export function getProgress<T>(): T | null {
  return getStorageItem<T>(STORAGE_KEY);
}

/**
 * Save the game progress to localStorage
 */
export function saveProgress<T>(progress: T): boolean {
  return setStorageItem(STORAGE_KEY, progress);
}

/**
 * Clear the game progress from localStorage
 */
export function clearProgress(): boolean {
  return removeStorageItem(STORAGE_KEY);
}
