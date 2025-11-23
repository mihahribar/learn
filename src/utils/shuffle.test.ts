import { describe, it, expect } from 'vitest'
import { shuffle, pickRandom } from './shuffle'

describe('shuffle utilities', () => {
  describe('shuffle', () => {
    it('returns array of same length as input', () => {
      const input = [1, 2, 3, 4, 5]
      const result = shuffle(input)
      expect(result.length).toBe(input.length)
    })

    it('does not modify the original array', () => {
      const input = [1, 2, 3, 4, 5]
      const original = [...input]
      shuffle(input)
      expect(input).toEqual(original)
    })

    it('contains all original elements', () => {
      const input = [1, 2, 3, 4, 5]
      const result = shuffle(input)
      expect(result.sort()).toEqual(input.sort())
    })

    it('produces different order over multiple shuffles', () => {
      const input = Array.from({ length: 20 }, (_, i) => i)
      const results = new Set<string>()

      // Run multiple shuffles and collect unique orderings
      for (let i = 0; i < 10; i++) {
        results.add(JSON.stringify(shuffle(input)))
      }

      // With 20 elements, probability of all 10 being identical is astronomically low
      expect(results.size).toBeGreaterThan(1)
    })
  })

  describe('pickRandom', () => {
    it('returns requested number of items', () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const result = pickRandom(input, 5)
      expect(result.length).toBe(5)
    })

    it('returns all items when count exceeds array length', () => {
      const input = [1, 2, 3]
      const result = pickRandom(input, 10)
      expect(result.length).toBe(3)
    })

    it('returns items that exist in the original array', () => {
      const input = ['a', 'b', 'c', 'd', 'e']
      const result = pickRandom(input, 3)
      result.forEach((item) => {
        expect(input).toContain(item)
      })
    })

    it('returns unique items with no duplicates', () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const result = pickRandom(input, 5)
      const uniqueItems = new Set(result)
      expect(uniqueItems.size).toBe(result.length)
    })
  })
})
