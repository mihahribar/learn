import { describe, it, expect } from 'vitest';
import { grammarQuestions } from './grammarQuestions';

describe('grammarQuestions data', () => {
  it('should have exactly 104 questions', () => {
    expect(grammarQuestions).toHaveLength(104);
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

  it('should have have-got questions use correct verb forms per subject type', () => {
    const haveGotQuestions = grammarQuestions.filter((q) => q.correctAnswer.includes('got'));
    haveGotQuestions.forEach((question) => {
      if (question.subjectType === 'singular') {
        expect(['has got', "hasn't got"]).toContain(question.correctAnswer);
      } else {
        expect(['have got', "haven't got"]).toContain(question.correctAnswer);
      }
    });
  });

  it('should have correct TO BE verb forms for each subject type', () => {
    const toBeQuestions = grammarQuestions.filter((q) => ['am', 'is', 'are'].includes(q.correctAnswer));

    toBeQuestions.forEach((question) => {
      if (question.subjectType === 'first-person') {
        expect(question.correctAnswer).toBe('am');
      } else if (question.subjectType === 'singular') {
        expect(question.correctAnswer).toBe('is');
      } else if (question.subjectType === 'plural') {
        expect(question.correctAnswer).toBe('are');
      }
    });
  });

  it('should have present continuous questions use correct auxiliary per subject type', () => {
    const continuousQuestions = grammarQuestions.filter((q) => /^(am|is|are) \w+ing$/.test(q.correctAnswer));
    continuousQuestions.forEach((question) => {
      if (question.subjectType === 'first-person') {
        expect(question.correctAnswer).toMatch(/^am /);
      } else if (question.subjectType === 'singular') {
        expect(question.correctAnswer).toMatch(/^is /);
      } else if (question.subjectType === 'plural') {
        expect(question.correctAnswer).toMatch(/^are /);
      }
    });
  });
});
