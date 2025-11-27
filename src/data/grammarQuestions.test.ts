import { describe, it, expect } from 'vitest';
import { grammarQuestions } from './grammarQuestions';

describe('grammarQuestions data', () => {
  it('should have exactly 30 questions', () => {
    expect(grammarQuestions).toHaveLength(30);
  });

  it('should have all required fields for each question', () => {
    grammarQuestions.forEach((question) => {
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('sentence');
      expect(question).toHaveProperty('correctAnswer');
      expect(question).toHaveProperty('wrongAnswers');
      expect(question).toHaveProperty('subjectType');
      expect(typeof question.id).toBe('string');
      expect(typeof question.sentence).toBe('string');
      expect(typeof question.correctAnswer).toBe('string');
      expect(Array.isArray(question.wrongAnswers)).toBe(true);
      expect(question.wrongAnswers).toHaveLength(2);
    });
  });

  it('should have unique IDs for all questions', () => {
    const ids = grammarQuestions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(grammarQuestions.length);
  });

  it('should have correct answers different from wrong answers', () => {
    grammarQuestions.forEach((question) => {
      expect(question.wrongAnswers).not.toContain(question.correctAnswer);
    });
  });

  it('should only use valid subject types', () => {
    const validTypes = ['singular', 'plural', 'first-person'];
    grammarQuestions.forEach((question) => {
      expect(validTypes).toContain(question.subjectType);
    });
  });

  it('should have singular subjects use "has got" or "hasn\'t got" as correct answer', () => {
    const singularQuestions = grammarQuestions.filter(
      (q) => q.subjectType === 'singular'
    );
    singularQuestions.forEach((question) => {
      expect(['has got', "hasn't got"]).toContain(question.correctAnswer);
    });
  });

  it('should have plural and first-person subjects use "have got" or "haven\'t got" as correct answer', () => {
    const pluralAndFirstPerson = grammarQuestions.filter(
      (q) => q.subjectType === 'plural' || q.subjectType === 'first-person'
    );
    pluralAndFirstPerson.forEach((question) => {
      expect(['have got', "haven't got"]).toContain(question.correctAnswer);
    });
  });
});
