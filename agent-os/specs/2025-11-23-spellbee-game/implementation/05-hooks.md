# Task 5: State Management Hooks

## Overview
**Task Reference:** Task #5 from `agent-os/specs/2025-11-23-spellbee-game/tasks.md`
**Implemented By:** frontend-engineer (api-engineer role)
**Date:** 2025-11-23
**Status:** Complete

### Task Description
Implement custom React hooks for managing game state, speech synthesis, progress persistence, and sound effects for the SpellBee spelling game.

## Implementation Summary

This implementation creates four custom React hooks that form the core state management layer for the SpellBee game. The hooks are designed to be pure, testable, and follow React best practices.

The `useSpeech` hook wraps the Web Speech API to provide text-to-speech functionality for pronouncing English words. It handles browser compatibility, async voice loading, and provides a clean interface for the game components.

The `useProgress` hook manages persistent game progress using localStorage. It tracks total points, words completed, rounds played, badges earned, and daily streak for the "Daily Habit" badge. It gracefully handles scenarios where localStorage is not available.

The `useGameState` hook manages the active game session including round initialization, word progression, answer submission, scoring, and streak tracking. It integrates with the existing scoring utilities and word data.

The `useSound` hook (optional feature) provides sound effects using the Web Audio API, generating simple tones for correct/wrong answers, celebrations, and badge unlocks with mute toggle support.

## Files Changed/Created

### New Files
- `/Users/miha/Projects/me/learn/src/hooks/useSpeech.ts` - Web Speech API wrapper for text-to-speech functionality
- `/Users/miha/Projects/me/learn/src/hooks/useProgress.ts` - localStorage-based progress persistence and badge tracking
- `/Users/miha/Projects/me/learn/src/hooks/useGameState.ts` - Game session state management (rounds, scoring, streaks)
- `/Users/miha/Projects/me/learn/src/hooks/useSound.ts` - Web Audio API sound effects (optional enhancement)
- `/Users/miha/Projects/me/learn/src/hooks/index.ts` - Barrel export file for all hooks

### Modified Files
None

### Deleted Files
None

## Key Implementation Details

### useSpeech Hook
**Location:** `/Users/miha/Projects/me/learn/src/hooks/useSpeech.ts`

The speech hook provides:
- `speak(text)` function that pronounces text with rate=0.85 for clarity
- `speaking` boolean state indicating if speech is in progress
- `supported` boolean indicating browser support
- Automatic English voice selection (lang.startsWith('en'))
- Event listener for `voiceschanged` to handle async voice loading
- Cancellation of ongoing speech before starting new speech
- Cleanup on unmount to cancel speech and remove event listeners

**Rationale:** The Web Speech API has browser-specific quirks (voices load asynchronously in Chrome). This hook abstracts those complexities and provides a simple, consistent interface. The 0.85 rate is specified in the spec for child-friendly clarity.

### useProgress Hook
**Location:** `/Users/miha/Projects/me/learn/src/hooks/useProgress.ts`

The progress hook provides:
- `progress` object with all persisted data
- `storageAvailable` boolean for graceful degradation
- `addPoints(points)` to update total points
- `recordWordAttempt(wordId, correct)` to track word statistics
- `incrementRoundsPlayed()` to update round counter
- `checkAndAwardBadges(roundStats)` returning newly earned badges
- `updateStreak(correct)` for "Hot Hand" badge tracking
- `resetCurrentStreak()` for round start
- Daily consecutive play tracking for "Daily Habit" badge

The hook initializes with default progress if none exists and handles localStorage unavailability by still allowing gameplay without persistence.

**Rationale:** The spec requires progress to persist across sessions. The hook centralizes all progress mutations and automatically syncs to localStorage. The daily habit tracking uses ISO date strings for timezone consistency.

### useGameState Hook
**Location:** `/Users/miha/Projects/me/learn/src/hooks/useGameState.ts`

The game state hook provides:
- `currentMode` - active game mode ('listen-spell' | 'pick-spelling' | null)
- `currentWord` - the Word object for the current word
- `roundProgress` - { current, total, score, points } for display
- `isRoundComplete` - boolean when all 10 words are done
- `currentAttempts` - attempts for current word (max 2)
- `streak` and `maxStreak` - for badge tracking
- `startGame(mode)` - initializes a new round with 10 random words
- `submitAnswer(answer)` - checks answer, updates state, returns result
- `advanceToNextWord()` - moves to next word
- `endRound()` - returns final RoundStats for badge checking
- `resetGame()` - clears game state for returning home

**Rationale:** This hook encapsulates all game logic, making screen components simple consumers of state. The `submitAnswer` function returns a result object so components can display appropriate feedback before advancing.

### useSound Hook
**Location:** `/Users/miha/Projects/me/learn/src/hooks/useSound.ts`

The sound hook provides:
- `playCorrect()` - cheerful chime (880Hz sine wave)
- `playWrong()` - gentle low tone (220Hz sine wave)
- `playCelebration()` - ascending arpeggio for round complete
- `playBadge()` - triumphant chord for badge unlock
- `muted` state with `toggleMute()` function
- `supported` boolean for Web Audio API availability

**Rationale:** Web Audio API generates sounds procedurally without requiring audio file assets. The frequencies were chosen to be pleasant and child-friendly. This is marked as optional in the spec but enhances the game experience.

## Database Changes
N/A - This is a client-side only implementation using localStorage.

## Dependencies

### New Dependencies Added
None - All hooks use native browser APIs (Web Speech API, Web Audio API, localStorage) and React built-in hooks.

### Configuration Changes
None

## Testing

### Test Files Created/Updated
None - Testing is assigned to the testing-engineer role (Task Group 11).

### Test Coverage
- Unit tests: N/A (to be created by testing-engineer)
- Integration tests: N/A (to be created by testing-engineer)
- Edge cases covered: N/A (to be tested by testing-engineer)

### Manual Testing Performed
- TypeScript compilation verified with `npm run build` - passes without errors
- Hook interfaces align with existing types from `src/types/index.ts`
- Hook imports from utilities (`shuffle.ts`, `storage.ts`, `scoring.ts`) verified
- Hook imports from data (`words.ts`, `badges.ts`) verified

## User Standards & Preferences Compliance

### Coding Style (coding-style.md)
**File Reference:** `agent-os/standards/global/coding-style.md`

**How Implementation Complies:**
- Consistent naming conventions: hooks use `use` prefix, functions use camelCase, constants use UPPER_SNAKE_CASE
- Small, focused functions: each hook function has a single responsibility
- No dead code: removed unused POINTS import from useGameState
- DRY principle: hooks reuse utilities from `src/utils/` rather than duplicating logic

**Deviations:** None

### Error Handling (error-handling.md)
**File Reference:** `agent-os/standards/global/error-handling.md`

**How Implementation Complies:**
- Graceful degradation: `useSpeech` returns `supported: false` when speech synthesis unavailable
- Graceful degradation: `useProgress` returns `storageAvailable: false` and continues working without persistence
- Fail fast: `useGameState.submitAnswer` returns early with default result if round/word is null
- User-friendly: storage failures are silent but indicated via `storageAvailable` boolean for UI warning

**Deviations:** None

### Commenting (commenting.md)
**File Reference:** `agent-os/standards/global/commenting.md`

**How Implementation Complies:**
- Self-documenting code: function and variable names are descriptive (`findEnglishVoice`, `areConsecutiveDays`)
- Minimal, helpful comments: JSDoc comments explain hook return values and purpose
- No comments about changes or fixes: comments are evergreen documentation

**Deviations:** None

### Validation (validation.md)
**File Reference:** `agent-os/standards/global/validation.md`

**How Implementation Complies:**
- Type validation: All hooks use TypeScript with proper type annotations
- Fail early: `submitAnswer` validates `currentRound` and `currentWord` exist before processing
- Consistent validation: Input trimming and case normalization delegated to existing `isAnswerCorrect` utility

**Deviations:** None

### Conventions (conventions.md)
**File Reference:** `agent-os/standards/global/conventions.md`

**How Implementation Complies:**
- Consistent project structure: hooks placed in `src/hooks/` per spec architecture
- Barrel export: `index.ts` provides clean imports for consumers

**Deviations:** None

## Integration Points

### APIs/Endpoints
N/A - These are client-side React hooks.

### External Services
- **Web Speech API** (`window.speechSynthesis`) - Browser-native text-to-speech
- **Web Audio API** (`AudioContext`) - Browser-native sound generation
- **localStorage** - Browser-native persistent storage

### Internal Dependencies
- `src/types/index.ts` - TypeScript interfaces (PersistedProgress, GameMode, Word, RoundStats, CurrentRound, Badge)
- `src/utils/shuffle.ts` - `pickRandom` function for selecting round words
- `src/utils/storage.ts` - `getProgress`, `saveProgress`, `isStorageAvailable` functions
- `src/utils/scoring.ts` - `isAnswerCorrect`, `calculateAttemptPoints` functions
- `src/data/words.ts` - Word list for game rounds
- `src/data/badges.ts` - `checkNewBadges` function for badge awarding

## Known Issues & Limitations

### Issues
None identified.

### Limitations
1. **Voice Selection**
   - Description: Only selects first English voice found
   - Reason: Simplifies implementation; most devices have at least one English voice
   - Future Consideration: Could add voice preference settings

2. **Sound Generation**
   - Description: Web Audio sounds may not play until user interaction (autoplay policy)
   - Reason: Browser security requirement
   - Future Consideration: First sound may fail; subsequent sounds work after user clicks

3. **Streak Persistence**
   - Description: `currentStreak` in useProgress is separate from round streak in useGameState
   - Reason: Round streak resets per round; progress streak is for badge tracking
   - Future Consideration: Could unify these in a single hook if confusing

## Performance Considerations
- All hooks use `useCallback` and `useMemo` to prevent unnecessary re-renders
- localStorage operations are synchronous but quick for small data sizes
- Web Speech API is async and non-blocking
- Web Audio API creates oscillators on-demand and cleans them up after playing

## Security Considerations
- No sensitive data stored in localStorage
- No external API calls
- All data is client-side only

## Dependencies for Other Tasks
- **Task Group 6 (Home Screen)**: Uses `useProgress` for displaying stats
- **Task Group 7 (Listen & Spell)**: Uses all four hooks
- **Task Group 8 (Pick Spelling)**: Uses `useGameState`, `useProgress`, `useSpeech`, `useSound`
- **Task Group 9 (Round Complete)**: Uses `useProgress.checkAndAwardBadges()`, `useSound.playCelebration()`
- **Task Group 11 (Testing)**: Will test these hooks

## Notes
- The hooks are designed to be used together but are decoupled enough to work independently
- `useSound` is marked as optional in the spec but was implemented for a complete experience
- The implementation follows the spec's speech configuration (rate=0.85) exactly
- All hooks gracefully handle browser compatibility issues
