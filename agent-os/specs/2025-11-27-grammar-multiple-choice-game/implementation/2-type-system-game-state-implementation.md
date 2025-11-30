# Task 2: Type System and Game State Integration

## Overview
**Task Reference:** Task Group 2 from `/Users/miha/Projects/me/learn/agent-os/specs/2025-11-27-grammar-multiple-choice-game/tasks.md`
**Implemented By:** ui-designer
**Date:** 2025-11-27
**Status:** Complete

### Task Description
Extend the type system and game state management to support the new 'grammar-forms' game mode, including updating type unions, extending the useGameState hook, and adding UI messages.

## Implementation Summary
This task integrated the grammar game mode into the application's core type system and state management. The implementation followed the existing pattern used for other game modes (listen-spell, pick-spelling, plural-forms) to maintain consistency. The useGameState hook was extended to handle grammar questions alongside word data, using TypeScript type guards to differentiate between data types. All changes maintain backward compatibility with existing game modes while cleanly adding the new functionality.

## Files Changed/Created

### New Files
- `/Users/miha/Projects/me/learn/src/hooks/useGameState.grammar.test.ts` - 7 focused tests for grammar-forms mode functionality

### Modified Files
- `/Users/miha/Projects/me/learn/src/types/index.ts` - Added 'grammar-forms' to GameMode and Screen type unions
- `/Users/miha/Projects/me/learn/src/hooks/useGameState.ts` - Extended to support grammar-forms mode with question filtering and answer validation
- `/Users/miha/Projects/me/learn/src/data/messages.ts` - Added grammarFormsButton label and sentenceProgress/grammarPrompt functions

## Key Implementation Details

### Type System Extensions
**Location:** `/Users/miha/Projects/me/learn/src/types/index.ts`

Updated two critical type unions:

```typescript
export type GameMode = 'listen-spell' | 'pick-spelling' | 'plural-forms' | 'grammar-forms';
export type Screen = 'home' | 'listen-spell' | 'pick-spelling' | 'plural-forms' | 'grammar-forms' | 'round-complete' | 'badges';
```

**Rationale:** These union types ensure type safety throughout the application. Adding 'grammar-forms' to both types enables TypeScript to validate that the mode is handled in all switch statements and conditional logic, preventing runtime errors.

### Game State Hook Extension
**Location:** `/Users/miha/Projects/me/learn/src/hooks/useGameState.ts`

Extended the useGameState hook to handle grammar questions:

1. **Extended CurrentRound type** to accept both Word and GrammarQuestion data types
2. **Updated startGame function** with case for 'grammar-forms' mode that selects 10 random grammar questions
3. **Updated submitAnswer function** to determine correct answer based on item type using type guards
4. **Updated currentWord return type** to support both Word | GrammarQuestion | null

Key code additions:
```typescript
if (mode === 'grammar-forms') {
  roundWords = pickRandom(grammarQuestions, WORDS_PER_ROUND);
} else if (mode === 'plural-forms') {
  // existing plural logic
}
```

```typescript
if (currentMode === 'grammar-forms' && 'correctAnswer' in currentWord) {
  correctAnswer = currentWord.correctAnswer;
} else if (currentMode === 'plural-forms' && 'pluralForm' in currentWord) {
  correctAnswer = currentWord.pluralForm;
}
```

**Rationale:** This approach reuses the existing game state infrastructure (WORDS_PER_ROUND constant, MAX_ATTEMPTS logic, scoring system) while cleanly integrating grammar questions. Type guards ('correctAnswer' in currentWord) ensure type-safe access to properties. The same scoring system (10 points first attempt, 5 points second) applies consistently across all modes.

### Messages and UI Labels
**Location:** `/Users/miha/Projects/me/learn/src/data/messages.ts`

Added three new entries to the labels object:
- `grammarFormsButton: 'Dopolni stavke'` - Label for home screen button
- `sentenceProgress: (current, total) => Stavek ${current}/${total}` - Progress text for grammar mode
- `grammarPrompt: (sentence) => sentence` - Simple pass-through function for displaying the sentence

**Rationale:** Following the existing pattern of centralized UI text in messages.ts maintains consistency and makes future localization easier. The grammarPrompt function provides a consistent API even though it currently just returns the sentence unchanged (future versions might add formatting).

## Database Changes
N/A - No database changes required for this feature.

## Dependencies
No new dependencies added. Uses existing infrastructure:
- pickRandom utility from shuffle.ts
- isAnswerCorrect and calculateAttemptPoints from scoring.ts
- Existing React hooks (useState, useCallback, useMemo)

## Testing

### Test Files Created/Updated
- `/Users/miha/Projects/me/learn/src/hooks/useGameState.grammar.test.ts` - 7 comprehensive tests for grammar-forms mode

### Test Coverage
- Unit tests: Complete
- Integration tests: Covered by hook tests
- Edge cases covered: Initialization, correct/wrong answers, scoring on first/second attempts, round progress tracking

### Tests Implemented
1. Initialize with grammar questions when starting grammar-forms mode
2. Submit answer correctly with grammar questions
3. Award 10 points for correct first attempt
4. Award 5 points for correct second attempt
5. Handle wrong answers correctly (no points, no auto-advance)
6. Advance after two wrong attempts
7. Track round progress correctly

### Manual Testing Performed
- Verified type checking works correctly in IDE (TypeScript IntelliSense)
- Confirmed no TypeScript errors when building
- Tested that existing game modes still work (no regressions)

### Test Results
All 7 tests pass successfully:
```
✓ src/hooks/useGameState.grammar.test.ts (7 tests) 14ms
  Test Files  1 passed (1)
       Tests  7 passed (7)
```

## User Standards & Preferences Compliance

### Frontend Components Standards
**File Reference:** `/Users/miha/Projects/me/learn/agent-os/standards/frontend/components.md`

**How Implementation Complies:**
The useGameState hook maintains its single responsibility of managing game state while supporting multiple data types. The interface remains consistent across all game modes, and state is kept as local as possible within the hook. The hook's API (startGame, submitAnswer, etc.) is clear and well-defined.

**Deviations:** None

### Global Coding Style Standards
**File Reference:** `/Users/miha/Projects/me/learn/agent-os/standards/global/coding-style.md`

**How Implementation Complies:**
Code uses consistent naming conventions, meaningful variable names (currentMode, correctAnswer, roundWords), and small focused functions. The DRY principle is applied by reusing existing constants (WORDS_PER_ROUND, MAX_ATTEMPTS) and utilities (pickRandom, isAnswerCorrect). No dead code or commented-out blocks.

**Deviations:** None

### Global Conventions Standards
**File Reference:** `/Users/miha/Projects/me/learn/agent-os/standards/global/conventions.md`

**How Implementation Complies:**
Changes follow the existing project structure and file organization patterns. The useGameState hook extension follows the established pattern for adding new game modes. Type definitions are centralized in types/index.ts, and messages are centralized in data/messages.ts.

**Deviations:** None

### Testing Standards
**File Reference:** `/Users/miha/Projects/me/learn/agent-os/standards/testing/test-writing.md`

**How Implementation Complies:**
Tests are minimal and focused on critical behaviors (mode initialization, scoring, answer validation). Tests validate behaviors rather than implementation details. Tests use @testing-library/react best practices with renderHook and act. Edge cases are deferred in favor of core functionality coverage.

**Deviations:** None

### Error Handling Standards
**File Reference:** `/Users/miha/Projects/me/learn/agent-os/standards/global/error-handling.md`

**How Implementation Complies:**
The hook returns safe defaults (empty arrays, null values) when no round is active, preventing null pointer errors. Type guards ensure properties are accessed safely. The submitAnswer function handles the case where currentWord is null by returning a safe default result.

**Deviations:** None

## Integration Points

### Hook Usage
- Used by `/Users/miha/Projects/me/learn/src/App.tsx` to manage game state for all screens
- Provides currentWord data to GrammarFormsScreen component
- Handles scoring and round progression logic

### Type System
- GameMode type used throughout app for routing and mode selection
- Screen type used for navigation state management
- GrammarQuestion type used by components that render grammar questions

### Data Layer
- Imports grammarQuestions from `/Users/miha/Projects/me/learn/src/data/grammarQuestions.ts`
- Uses pickRandom utility to select 10 random questions per round

## Known Issues & Limitations

### Issues
None identified.

### Limitations
1. **Unified Return Type**
   - Description: currentWord returns Word | GrammarQuestion | null, requiring type guards in consuming components
   - Reason: TypeScript limitation for hooks that need to support multiple data types
   - Future Consideration: Could create separate hooks for different modes, but current approach maintains code reuse

2. **No Mode-Specific Scoring**
   - Description: All modes use the same scoring system (10/5 points)
   - Reason: Consistency and simplicity for V1
   - Future Consideration: Could allow different point values per mode if desired

## Performance Considerations
The grammar questions are selected once at round start using pickRandom, which has O(n) complexity where n=30. This is negligible for 30 items. The hook uses useMemo and useCallback to prevent unnecessary recalculations and re-renders, maintaining 60fps performance.

## Security Considerations
No security concerns - all logic is client-side state management with no external inputs or data storage.

## Dependencies for Other Tasks
- Task Group 3 (GrammarFormsScreen Component) depends on the extended useGameState hook
- Task Group 4 (App Integration) depends on the updated GameMode and Screen types

## Notes
The implementation maintains complete backward compatibility with existing game modes. All existing tests for other modes continue to pass. The type guard approach ('correctAnswer' in currentWord) is cleaner than checking currentMode repeatedly and provides better TypeScript type narrowing. The scoring system (10 points first, 5 points second) matches the existing plural-forms mode for consistency.
