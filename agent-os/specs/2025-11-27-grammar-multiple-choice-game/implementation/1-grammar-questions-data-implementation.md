# Task 1: Grammar Questions Data

## Overview
**Task Reference:** Task Group 1 from `/Users/miha/Projects/me/learn/agent-os/specs/2025-11-27-grammar-multiple-choice-game/tasks.md`
**Implemented By:** ui-designer
**Date:** 2025-11-27
**Status:** Complete

### Task Description
Create the grammar questions content and data structure for the "have got / has got" grammar game, including the GrammarQuestion interface, data file with 30 questions, and comprehensive tests.

## Implementation Summary
This task involved creating the foundational data layer for the grammar game feature. The implementation followed the existing Word data structure pattern but adapted for grammar questions with sentence completion. All 30 questions were carefully crafted to test subject-verb agreement with "have got" vs "has got", ensuring a good mix of singular subjects (requiring "has got"), plural subjects (requiring "have got"), and first-person "I" (requiring "have got"). The questions include 20 sentences from the provided worksheet plus 10 additional sentences for variety. Each question provides two plausible wrong answers to create meaningful learning opportunities.

## Files Changed/Created

### New Files
- `/Users/miha/Projects/me/learn/src/data/grammarQuestions.ts` - Data file containing 30 grammar questions with correct/wrong answers
- `/Users/miha/Projects/me/learn/src/data/grammarQuestions.test.ts` - Test file with 7 focused tests validating data structure

### Modified Files
- `/Users/miha/Projects/me/learn/src/types/index.ts` - Added GrammarQuestion interface definition with required fields

## Key Implementation Details

### GrammarQuestion Interface
**Location:** `/Users/miha/Projects/me/learn/src/types/index.ts`

Added a new TypeScript interface to define the structure of grammar questions:

```typescript
export interface GrammarQuestion {
  id: string;
  sentence: string;
  correctAnswer: string;
  wrongAnswers: string[];
  subjectType: 'singular' | 'plural' | 'first-person';
}
```

**Rationale:** This interface provides type safety and ensures all grammar questions have a consistent structure. The `subjectType` field enables future analytics on which subject types users find most challenging. The structure mirrors the Word interface pattern while being specific to grammar exercises.

### Grammar Questions Data
**Location:** `/Users/miha/Projects/me/learn/src/data/grammarQuestions.ts`

Created 30 high-quality grammar questions covering various subjects and contexts:
- 20 questions based on the provided worksheet (examples.png)
- 10 additional questions for variety
- Mix of subject types: ~13 singular, ~12 plural, ~5 first-person
- Each question has 2 wrong answer options that are plausible but grammatically incorrect
- Wrong answers include variations like "has got", "have got", "having got", and "got"

Example question structure:
```typescript
{
  id: '1',
  sentence: 'My sisters _______ long hair.',
  correctAnswer: 'have got',
  wrongAnswers: ['has got', 'having got'],
  subjectType: 'plural',
}
```

**Rationale:** Using real-world, relatable sentences helps learners connect grammar rules to practical usage. The wrong answers are chosen to be common mistakes, making the learning more effective. The blank placement with underscores makes it clear where the answer should go.

### Test Coverage
**Location:** `/Users/miha/Projects/me/learn/src/data/grammarQuestions.test.ts`

Implemented 7 focused tests covering critical data validation:
1. Validates exactly 30 questions exist
2. Verifies all required fields present and correctly typed
3. Ensures each question has exactly 2 wrong answers
4. Confirms all question IDs are unique
5. Validates correct answers differ from wrong answers
6. Checks only valid subject types used (singular/plural/first-person)
7. Validates grammar rules: singular uses "has got", plural/first-person use "have got"

**Rationale:** These tests provide confidence that the data structure is correct and that grammar rules are properly applied. The tests focus on structural validity and business rules rather than exhaustive edge cases, following the minimal-testing strategy.

## Database Changes
N/A - This feature uses in-memory data structures only.

## Dependencies
No new dependencies added. Uses existing TypeScript and Vitest testing framework.

## Testing

### Test Files Created/Updated
- `/Users/miha/Projects/me/learn/src/data/grammarQuestions.test.ts` - 7 comprehensive data validation tests

### Test Coverage
- Unit tests: Complete
- Integration tests: N/A for data layer
- Edge cases covered: Data structure validation, uniqueness constraints, business rule validation

### Manual Testing Performed
- Reviewed all 30 questions for grammatical correctness
- Verified sentences use natural, age-appropriate language
- Confirmed good variety of subjects and contexts
- Validated that wrong answers are plausible but incorrect

### Test Results
All 7 tests pass successfully:
```
✓ src/data/grammarQuestions.test.ts (7 tests) 6ms
  Test Files  1 passed (1)
       Tests  7 passed (7)
```

## User Standards & Preferences Compliance

### Frontend Components Standards
**File Reference:** `/Users/miha/Projects/me/learn/agent-os/standards/frontend/components.md`

**How Implementation Complies:**
The GrammarQuestion interface follows the "Single Responsibility" and "Clear Interface" principles by defining a focused data structure with explicit, well-documented fields. The interface is reusable across different parts of the application and provides a consistent API for working with grammar questions.

**Deviations:** None

### Global Coding Style Standards
**File Reference:** `/Users/miha/Projects/me/learn/agent-os/standards/global/coding-style.md`

**How Implementation Complies:**
The code uses consistent naming conventions (camelCase for fields, PascalCase for interface), meaningful descriptive names (GrammarQuestion, correctAnswer, subjectType), and the DRY principle by exporting a reusable data structure. Test descriptions clearly explain what each test validates.

**Deviations:** None

### Global Conventions Standards
**File Reference:** `/Users/miha/Projects/me/learn/agent-os/standards/global/conventions.md`

**How Implementation Complies:**
The grammar questions data is organized in a predictable location (`/src/data/grammarQuestions.ts`) following the existing project structure. TypeScript interfaces provide clear type documentation, and the data file exports a well-defined constant that can be easily imported.

**Deviations:** None

### Testing Standards
**File Reference:** `/Users/miha/Projects/me/learn/agent-os/standards/testing/test-writing.md`

**How Implementation Complies:**
Tests are minimal and focused on critical behaviors (data structure validity, business rules). Tests validate behaviors (correct grammar rules applied) rather than implementation details. Edge cases like performance and exhaustive validation are deferred in favor of core functionality tests.

**Deviations:** None

## Integration Points

### Data Export
- Exported `grammarQuestions` array is imported by `/Users/miha/Projects/me/learn/src/hooks/useGameState.ts` to provide questions for the grammar-forms game mode

### Type System
- `GrammarQuestion` interface is imported by components and hooks that need to work with grammar question data

## Known Issues & Limitations

### Issues
None identified.

### Limitations
1. **Fixed Question Set**
   - Description: 30 questions is a fixed set, users may see repetition after multiple rounds
   - Reason: V1 scope limitation, expandable in future versions
   - Future Consideration: Add more questions or implement question generation

2. **English Only**
   - Description: All questions are in English with no Slovenian translations
   - Reason: V1 scope focuses on English grammar learning
   - Future Consideration: Add bilingual support in future versions

3. **Affirmative Forms Only**
   - Description: No negative forms (haven't got/hasn't got) included
   - Reason: V1 scope limitation to keep focused on basic subject-verb agreement
   - Future Consideration: Add negative forms and question forms in V2

## Performance Considerations
The grammar questions array is loaded once at module initialization and kept in memory. With only 30 questions and minimal data per question, memory footprint is negligible (~3-4KB). No performance optimizations needed for this data size.

## Security Considerations
No security concerns - all data is static educational content with no user input, no sensitive information, and no external data sources.

## Dependencies for Other Tasks
- Task Group 2 (Type System and Game State Integration) depends on the GrammarQuestion interface and grammarQuestions data
- Task Group 3 (GrammarFormsScreen Component) depends on the GrammarQuestion type definition

## Notes
The grammar questions were carefully reviewed to ensure they use natural, conversational English appropriate for language learners. Subject variety helps prevent the game from feeling repetitive. The wrong answers are designed to test actual understanding rather than being obviously incorrect, making the learning experience more valuable.
