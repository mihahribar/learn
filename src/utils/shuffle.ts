/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 * Creates a new shuffled array without modifying the original
 *
 * @param array - The array to shuffle
 * @returns A new shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Pick a random subset of items from an array
 *
 * @param array - The source array
 * @param count - Number of items to pick
 * @returns A new array with randomly selected items
 */
export function pickRandom<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
