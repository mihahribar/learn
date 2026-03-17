import type { SentenceExercise } from '../types';

/**
 * Sentence ordering exercises for 6th-grade non-native English speakers.
 * Words are stored lowercase; the first word is auto-capitalized at display time.
 * Punctuation is stored separately in endPunctuation.
 */
export const sentenceExercises: SentenceExercise[] = [
  // === EASY (simple SVO, 3–6 words) ===
  { id: 'se-01', correctWords: ['the', 'cat', 'is', 'sleeping'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-02', correctWords: ['she', 'likes', 'red', 'apples'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-03', correctWords: ['the', 'dog', 'is', 'running'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-04', correctWords: ['i', 'have', 'a', 'brother'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-05', correctWords: ['we', 'play', 'every', 'day'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-06', correctWords: ['he', 'reads', 'many', 'books'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-07', correctWords: ['they', 'are', 'very', 'happy'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-08', correctWords: ['my', 'school', 'is', 'big'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-09', correctWords: ['the', 'bird', 'can', 'fly'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-10', correctWords: ['she', 'has', 'two', 'cats'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-11', correctWords: ['we', 'eat', 'lunch', 'together'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-12', correctWords: ['he', 'is', 'my', 'friend'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-13', correctWords: ['the', 'sun', 'is', 'shining'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-14', correctWords: ['i', 'like', 'ice', 'cream'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-15', correctWords: ['they', 'live', 'in', 'london'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-16', correctWords: ['she', 'is', 'very', 'tall'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-17', correctWords: ['the', 'water', 'is', 'cold'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-18', correctWords: ['i', 'go', 'to', 'school'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-19', correctWords: ['we', 'have', 'a', 'new', 'teacher'], endPunctuation: '.', difficulty: 'easy' },
  { id: 'se-20', correctWords: ['the', 'flowers', 'are', 'beautiful'], endPunctuation: '.', difficulty: 'easy' },

  // === MEDIUM (questions, negations, 5–8 words) ===
  { id: 'sm-01', correctWords: ['do', 'you', 'want', 'to', 'play', 'outside'], endPunctuation: '?', difficulty: 'medium' },
  { id: 'sm-02', correctWords: ['he', "doesn't", 'like', 'cold', 'weather'], endPunctuation: '.', difficulty: 'medium' },
  { id: 'sm-03', correctWords: ['can', 'you', 'help', 'me', 'please'], endPunctuation: '?', difficulty: 'medium' },
  { id: 'sm-04', correctWords: ['she', 'is', 'not', 'coming', 'to', 'school'], endPunctuation: '.', difficulty: 'medium' },
  { id: 'sm-05', correctWords: ['where', 'did', 'you', 'put', 'my', 'bag'], endPunctuation: '?', difficulty: 'medium' },
  { id: 'sm-06', correctWords: ['they', 'are', 'playing', 'in', 'the', 'park'], endPunctuation: '.', difficulty: 'medium' },
  { id: 'sm-07', correctWords: ['i', "don't", 'understand', 'this', 'question'], endPunctuation: '.', difficulty: 'medium' },
  { id: 'sm-08', correctWords: ['what', 'time', 'does', 'the', 'movie', 'start'], endPunctuation: '?', difficulty: 'medium' },
  { id: 'sm-09', correctWords: ['we', 'are', 'going', 'to', 'the', 'beach'], endPunctuation: '.', difficulty: 'medium' },
  { id: 'sm-10', correctWords: ['she', "can't", 'find', 'her', 'keys'], endPunctuation: '.', difficulty: 'medium' },
  { id: 'sm-11', correctWords: ['how', 'many', 'brothers', 'do', 'you', 'have'], endPunctuation: '?', difficulty: 'medium' },
  { id: 'sm-12', correctWords: ['the', 'children', 'are', 'eating', 'their', 'lunch'], endPunctuation: '.', difficulty: 'medium' },
  { id: 'sm-13', correctWords: ['my', 'mother', 'works', 'at', 'a', 'hospital'], endPunctuation: '.', difficulty: 'medium' },
  { id: 'sm-14', correctWords: ['did', 'you', 'finish', 'your', 'homework', 'yesterday'], endPunctuation: '?', difficulty: 'medium' },
  { id: 'sm-15', correctWords: ['he', "wasn't", 'at', 'school', 'today'], endPunctuation: '.', difficulty: 'medium' },
  { id: 'sm-16', correctWords: ['we', "don't", 'have', 'any', 'milk', 'left'], endPunctuation: '.', difficulty: 'medium' },
  { id: 'sm-17', correctWords: ['is', 'your', 'sister', 'older', 'than', 'you'], endPunctuation: '?', difficulty: 'medium' },
  { id: 'sm-18', correctWords: ['they', 'went', 'swimming', 'after', 'school'], endPunctuation: '.', difficulty: 'medium' },
  { id: 'sm-19', correctWords: ['i', 'have', 'never', 'been', 'to', 'paris'], endPunctuation: '.', difficulty: 'medium' },
  { id: 'sm-20', correctWords: ['why', 'are', 'you', 'so', 'tired', 'today'], endPunctuation: '?', difficulty: 'medium' },

  // === HARD (conditionals, passive voice, relative clauses, 6–10 words) ===
  { id: 'sh-01', correctWords: ['the', 'book', 'that', 'i', 'read', 'was', 'very', 'interesting'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-02', correctWords: ['if', 'it', 'rains', 'we', 'will', 'stay', 'inside'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-03', correctWords: ['the', 'letter', 'was', 'written', 'by', 'my', 'grandmother'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-04', correctWords: ['she', 'would', 'travel', 'if', 'she', 'had', 'more', 'money'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-05', correctWords: ['the', 'cake', 'was', 'made', 'by', 'my', 'mother'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-06', correctWords: ['i', 'will', 'call', 'you', 'when', 'i', 'get', 'home'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-07', correctWords: ['the', 'boy', 'who', 'sits', 'next', 'to', 'me', 'is', 'funny'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-08', correctWords: ['they', 'have', 'been', 'waiting', 'for', 'two', 'hours'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-09', correctWords: ['the', 'windows', 'were', 'broken', 'during', 'the', 'storm'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-10', correctWords: ['if', 'you', 'study', 'hard', 'you', 'will', 'pass', 'the', 'test'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-11', correctWords: ['the', 'dog', 'that', 'we', 'found', 'was', 'very', 'hungry'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-12', correctWords: ['she', 'has', 'already', 'finished', 'all', 'her', 'homework'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-13', correctWords: ['the', 'food', 'was', 'cooked', 'by', 'a', 'famous', 'chef'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-14', correctWords: ['we', 'could', 'go', 'to', 'the', 'cinema', 'tomorrow'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-15', correctWords: ['the', 'girl', 'who', 'won', 'the', 'race', 'is', 'my', 'friend'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-16', correctWords: ['he', 'had', 'never', 'seen', 'such', 'a', 'big', 'city'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-17', correctWords: ['the', 'homework', 'must', 'be', 'done', 'before', 'friday'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-18', correctWords: ['if', 'i', 'were', 'you', 'i', 'would', 'apologize'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-19', correctWords: ['the', 'museum', 'that', 'we', 'visited', 'was', 'really', 'old'], endPunctuation: '.', difficulty: 'hard' },
  { id: 'sh-20', correctWords: ['she', "hasn't", 'decided', 'what', 'to', 'wear', 'yet'], endPunctuation: '.', difficulty: 'hard' },
];

export default sentenceExercises;
