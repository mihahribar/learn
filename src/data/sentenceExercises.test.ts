import { describe, it, expect } from 'vitest';
import { sentenceExercises } from './sentenceExercises';
import { isSentenceExercise } from '../types';

describe('sentenceExercises data', () => {
  it('should have at least 60 sentences', () => {
    expect(sentenceExercises.length).toBeGreaterThanOrEqual(60);
  });

  it('should have all required fields for each exercise', () => {
    sentenceExercises.forEach((exercise) => {
      expect(exercise).toHaveProperty('id');
      expect(exercise).toHaveProperty('correctWords');
      expect(exercise).toHaveProperty('endPunctuation');
      expect(exercise).toHaveProperty('difficulty');
      expect(typeof exercise.id).toBe('string');
      expect(Array.isArray(exercise.correctWords)).toBe(true);
      expect(typeof exercise.endPunctuation).toBe('string');
      expect(typeof exercise.difficulty).toBe('string');
    });
  });

  it('should have unique IDs for all exercises', () => {
    const ids = sentenceExercises.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(sentenceExercises.length);
  });

  it('should have 3-10 words per sentence', () => {
    sentenceExercises.forEach((exercise) => {
      expect(exercise.correctWords.length).toBeGreaterThanOrEqual(3);
      expect(exercise.correctWords.length).toBeLessThanOrEqual(10);
    });
  });

  it('should have all words in lowercase', () => {
    sentenceExercises.forEach((exercise) => {
      exercise.correctWords.forEach((word) => {
        expect(word).toBe(word.toLowerCase());
      });
    });
  });

  it('should have valid end punctuation', () => {
    sentenceExercises.forEach((exercise) => {
      expect(['.', '?', '!']).toContain(exercise.endPunctuation);
    });
  });

  it('should have valid difficulty levels', () => {
    sentenceExercises.forEach((exercise) => {
      expect(['easy', 'medium', 'hard']).toContain(exercise.difficulty);
    });
  });

  it('should have roughly equal difficulty distribution', () => {
    const easy = sentenceExercises.filter((e) => e.difficulty === 'easy');
    const medium = sentenceExercises.filter((e) => e.difficulty === 'medium');
    const hard = sentenceExercises.filter((e) => e.difficulty === 'hard');

    expect(easy.length).toBeGreaterThanOrEqual(15);
    expect(medium.length).toBeGreaterThanOrEqual(15);
    expect(hard.length).toBeGreaterThanOrEqual(15);
  });

  it('should treat contractions as single tokens', () => {
    const withContractions = sentenceExercises.filter((e) =>
      e.correctWords.some((w) => w.includes("'"))
    );
    // Contractions like "don't", "isn't" should be single words
    withContractions.forEach((exercise) => {
      exercise.correctWords.forEach((word) => {
        if (word.includes("'")) {
          expect(word.split(' ')).toHaveLength(1);
        }
      });
    });
  });
});

describe('isSentenceExercise type guard', () => {
  it('should return true for SentenceExercise objects', () => {
    expect(
      isSentenceExercise({
        id: 'test',
        correctWords: ['the', 'cat', 'sat'],
        endPunctuation: '.',
        difficulty: 'easy',
      })
    ).toBe(true);
  });

  it('should return false for Word objects', () => {
    expect(
      isSentenceExercise({
        id: 'test',
        english: 'cat',
        slovenian: 'mačka',
        difficulty: 'easy',
        wrongSpellings: ['kat'],
      })
    ).toBe(false);
  });

  it('should return false for GrammarQuestion objects', () => {
    expect(
      isSentenceExercise({
        id: 'test',
        sentence: 'She ___ a cat.',
        correctAnswer: 'has got',
        wrongAnswers: ['have got', "hasn't got"],
        subjectType: 'singular',
      })
    ).toBe(false);
  });
});
