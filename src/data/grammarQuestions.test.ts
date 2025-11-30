import { describe, it, expect } from 'vitest';
import { grammarQuestions } from './grammarQuestions';

describe('grammarQuestions data', () => {
  it('should have exactly 64 questions', () => {
    expect(grammarQuestions).toHaveLength(64);
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

  it('should have singular subjects use correct verb form', () => {
    const singularQuestions = grammarQuestions.filter((q) => q.subjectType === 'singular');
    singularQuestions.forEach((question) => {
      expect(['has got', "hasn't got", 'is']).toContain(question.correctAnswer);
    });
  });

  it('should have plural subjects use correct verb form', () => {
    const pluralQuestions = grammarQuestions.filter((q) => q.subjectType === 'plural');
    pluralQuestions.forEach((question) => {
      expect(['have got', "haven't got", 'are']).toContain(question.correctAnswer);
    });
  });

  it('should have first-person subjects use correct verb form', () => {
    const firstPersonQuestions = grammarQuestions.filter((q) => q.subjectType === 'first-person');
    firstPersonQuestions.forEach((question) => {
      expect(['have got', "haven't got", 'am']).toContain(question.correctAnswer);
    });
  });

  it('should have correct TO BE verb forms for each subject type', () => {
    const toBeQuestions = grammarQuestions.filter((q) => !q.correctAnswer.includes('got'));

    toBeQuestions.forEach((question) => {
      if (question.subjectType === 'first-person') {
        expect(question.correctAnswer).toBe('am');
        expect(question.wrongAnswers).toEqual(expect.arrayContaining(['is', 'are']));
      } else if (question.subjectType === 'singular') {
        expect(question.correctAnswer).toBe('is');
        expect(question.wrongAnswers).toEqual(expect.arrayContaining(['are', 'am']));
      } else if (question.subjectType === 'plural') {
        expect(question.correctAnswer).toBe('are');
        expect(question.wrongAnswers).toEqual(expect.arrayContaining(['is', 'am']));
      }
    });
  });
});
