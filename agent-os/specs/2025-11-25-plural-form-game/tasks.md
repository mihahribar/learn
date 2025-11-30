# Task Breakdown: Plural Forms Game Mode

## Overview
Total Task Groups: 3
Assigned implementers: ui-designer, testing-engineer
Estimated Total Complexity: Medium (heavily reuses existing patterns from PickSpellingScreen)

## Context
This feature adds a third game mode to SpellBee that teaches English plural forms through multiple-choice selection. The implementation closely mirrors the existing PickSpellingScreen component structure, requiring minimal new code. The main work involves:
1. Extending type definitions and data structures
2. Adding 30+ words with plural form data
3. Creating the PluralFormsScreen component (by adapting PickSpellingScreen)
4. Integrating the new mode into HomeScreen and App routing

## Task List

### Foundation: Type System and Data Structures

#### Task Group 1: Type Definitions and Data Model Extensions
**Assigned implementer:** ui-designer
**Dependencies:** None
**Complexity:** Low
**Estimated time:** 30-45 minutes

- [x] 1.0 Extend type system and data model for plural forms
  - [x] 1.1 Write 2-4 focused tests for Word interface extensions
    - Test that Word interface accepts optional pluralForm and wrongPluralForms fields
    - Test that words without plural data can still be used for other game modes
    - Verify type safety when accessing plural fields
    - File: `/Users/miha/Projects/me/learn/src/types/index.test.ts` (create if needed)
  - [x] 1.2 Extend Word interface in `/Users/miha/Projects/me/learn/src/types/index.ts`
    - Add optional `pluralForm?: string` field (correct plural, e.g., "mice")
    - Add optional `wrongPluralForms?: string[]` field (2 incorrect plurals, e.g., ["mouses", "mices"])
    - Keep fields optional to maintain backward compatibility with existing words
    - Reuse existing pattern: follows same structure as `wrongSpellings` field
  - [x] 1.3 Extend GameMode type in `/Users/miha/Projects/me/learn/src/types/index.ts`
    - Add 'plural-forms' to GameMode union type
    - Current: `export type GameMode = 'listen-spell' | 'pick-spelling';`
    - New: `export type GameMode = 'listen-spell' | 'pick-spelling' | 'plural-forms';`
  - [x] 1.4 Extend Screen type in `/Users/miha/Projects/me/learn/src/types/index.ts`
    - Add 'plural-forms' to Screen union type
    - Current: `export type Screen = 'home' | 'listen-spell' | 'pick-spelling' | 'round-complete' | 'badges';`
    - New: `export type Screen = 'home' | 'listen-spell' | 'pick-spelling' | 'plural-forms' | 'round-complete' | 'badges';`
  - [x] 1.5 Run type definition tests only
    - Execute only tests from 1.1
    - Verify TypeScript compilation succeeds
    - Do NOT run entire test suite at this stage

**Acceptance Criteria:**
- Word interface includes optional plural fields without breaking existing code
- GameMode type includes 'plural-forms' value
- Screen type includes 'plural-forms' value
- All TypeScript type checks pass without errors
- 2-4 focused tests pass

**Files Modified:**
- `/Users/miha/Projects/me/learn/src/types/index.ts`
- `/Users/miha/Projects/me/learn/src/types/index.test.ts` (new, if tests needed)

---

### Data Layer: Word Content and Messages

#### Task Group 2: Word Data and UI Labels
**Assigned implementer:** ui-designer
**Dependencies:** Task Group 1 (Word interface must be extended first)
**Complexity:** Medium
**Estimated time:** 2-3 hours (mostly content creation)

- [x] 2.0 Add plural form data to words and UI labels
  - [x] 2.1 Write 2-4 focused tests for word data validation
    - Test that at least 30 words have both pluralForm and wrongPluralForms defined
    - Test that wrongPluralForms arrays contain exactly 2 items
    - Test shuffling plural options produces 3 options with correct answer included
    - File: `/Users/miha/Projects/me/learn/src/data/words.test.ts` (create if needed)
  - [x] 2.2 Extend word data in `/Users/miha/Projects/me/learn/src/data/words.ts`
    - Add `pluralForm` and `wrongPluralForms` to at least 30 existing words
    - Include variety of plural types:
      - Regular plurals: dog/dogs, cat/cats, book/books, bike/bikes
      - +es plurals: box/boxes, bush/bushes, class/classes
      - Irregular plurals: mouse/mice, child/children, tooth/teeth, foot/feet
      - Y to -ies: baby/babies, city/cities, lady/ladies
      - F to -ves: leaf/leaves, knife/knives, wolf/wolves
      - Unchanged: sheep/sheep, fish/fish, deer/deer
    - Wrong plural examples reflecting common ESL mistakes:
      - Overgeneralizing -s: "childs", "mouses", "foots", "tooths"
      - Incorrect -es: "boxs", "classs", "bushs"
      - Wrong suffix: "babys", "citys", "ladys"
      - Double plurals: "childrens", "peoples"
      - Wrong transformation: "mices", "knifes"
    - Pattern reference: Similar to how `wrongSpellings` field is populated
    - Example structure:
      ```typescript
      {
        "id": "1",
        "english": "mouse",
        "slovenian": "miš",
        "difficulty": "easy",
        "wrongSpellings": ["mous", "mouce"],
        "pluralForm": "mice",
        "wrongPluralForms": ["mouses", "mices"]
      }
      ```
  - [x] 2.3 Add UI labels to `/Users/miha/Projects/me/learn/src/data/messages.ts`
    - Add `pluralFormsButton: 'Množina'` (button text for home screen)
    - Add `pluralPrompt: (singular: string, slovenian: string) => string` function
      - Returns format: "Množina besede {singular} ({slovenian})?" or similar
      - Example: pluralPrompt("dog", "pes") returns "Množina besede dog (pes)?"
    - Reuse existing feedback messages (getCorrectFeedback, getWrongFeedback) - no new messages needed
    - Pattern reference: Follow existing label patterns in messages.ts
  - [x] 2.4 Run word data tests only
    - Execute only tests from 2.1
    - Verify at least 30 words have complete plural data
    - Verify wrongPluralForms have exactly 2 items each
    - Do NOT run entire test suite at this stage

**Acceptance Criteria:**
- At least 30 words have both pluralForm and wrongPluralForms defined
- Plural forms include diverse types (regular, irregular, special cases)
- Wrong plural forms are realistic common mistakes
- UI labels added for plural forms mode in Slovenian
- 2-4 focused tests pass

**Files Modified:**
- `/Users/miha/Projects/me/learn/src/data/words.ts`
- `/Users/miha/Projects/me/learn/src/data/messages.ts`
- `/Users/miha/Projects/me/learn/src/data/words.test.ts` (new, if tests needed)

---

### UI Implementation: Components and Integration

#### Task Group 3: PluralFormsScreen Component and Home Integration
**Assigned implementer:** ui-designer
**Dependencies:** Task Groups 1 and 2 (types and data must be ready)
**Complexity:** Medium
**Estimated time:** 2-3 hours

- [x] 3.0 Create PluralFormsScreen and integrate into app
  - [x] 3.1 Write 4-8 focused tests for PluralFormsScreen
    - Test component renders with singular word and Slovenian translation
    - Test that 3 option buttons appear with correct/incorrect plural forms
    - Test that selecting correct answer triggers success feedback
    - Test that selecting wrong answer allows retry (first attempt)
    - Test that second wrong answer shows correct answer
    - Test that audio speaks singular form (not plural)
    - Test auto-advance after correct answer (1.5 second delay)
    - Test progress tracking shows correct word count (X/10)
    - File: `/Users/miha/Projects/me/learn/src/components/screens/PluralFormsScreen.test.tsx` (new)
  - [x] 3.2 Create PluralFormsScreen component
    - File: `/Users/miha/Projects/me/learn/src/components/screens/PluralFormsScreen.tsx` (new)
    - IMPORTANT: Copy `/Users/miha/Projects/me/learn/src/components/screens/PickSpellingScreen.tsx` as starting point
    - **Key modifications to PickSpellingScreen pattern:**
      - Display format: Show `{currentWord.english} ({currentWord.slovenian})` instead of just Slovenian
      - Audio: Call `speak(currentWord.english)` (singular form) instead of correct answer
      - Options: Shuffle `[currentWord.pluralForm, ...currentWord.wrongPluralForms]` instead of wrongSpellings
      - Prompt text: Use `labels.pluralPrompt(currentWord.english, currentWord.slovenian)` from messages.ts
      - Option validation: Check selected value against `currentWord.pluralForm` instead of `currentWord.english`
    - **Reuse unchanged from PickSpellingScreen:**
      - Same component structure and layout
      - Same props interface (PluralFormsScreenProps mirrors PickSpellingScreenProps)
      - Same OptionButton component for multiple choice
      - Same FeedbackMessage for success/error display
      - Same ScoreDisplay for points counter
      - Same ListenButton for audio playback
      - Same auto-advance logic (1.5s delay after correct answer)
      - Same round completion logic (10 words per round)
      - Same scoring mechanism (10 points first try, 5 points second try)
    - Component hierarchy (all existing components):
      ```
      PluralFormsScreen
      ├── ProgressBar (shows "Beseda X/10")
      ├── Card (main game container)
      │   ├── Singular word display: "{english} ({slovenian})"
      │   ├── ListenButton (plays singular form audio)
      │   ├── OptionButton × 3 (plural form choices)
      │   └── FeedbackMessage (correct/wrong/show-answer)
      └── ScoreDisplay (score and points)
      ```
    - Styling: Use same Tailwind classes as PickSpellingScreen (bg-gradient-to-b from-primary-50 to-primary-100, etc.)
  - [x] 3.3 Add Squares2x2Icon to HomeScreen
    - File: `/Users/miha/Projects/me/learn/src/components/screens/HomeScreen.tsx`
    - Add inline SVG component for Squares2x2Icon (from Heroicons)
    - Pattern reference: Follow existing inline icon pattern for SpeakerIcon and CheckIcon in HomeScreen
    - Icon represents "multiple items" concept for plurals
    - SVG path for Squares2x2 (24x24):
      ```typescript
      const Squares2x2Icon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      );
      ```
  - [x] 3.4 Add plural forms button to HomeScreen
    - File: `/Users/miha/Projects/me/learn/src/components/screens/HomeScreen.tsx`
    - Add third Button component between "Pick the Right Spelling" button and badges section
    - Button props:
      - `variant="warning"` (distinct from primary/success of other modes)
      - `icon={<Squares2x2Icon />}`
      - `onClick={() => onStartGame('plural-forms')}`
      - Text: Use `labels.pluralFormsButton` from messages.ts ("Množina")
    - Button styling: Match existing mode buttons (w-full, py-5 sm:py-6, text-lg sm:text-xl)
    - Pattern reference: Copy structure from existing Listen & Spell and Pick Spelling buttons
  - [x] 3.5 Add routing for plural-forms in App.tsx
    - File: `/Users/miha/Projects/me/learn/src/App.tsx`
    - Import PluralFormsScreen component
    - Add 'plural-forms' case to renderScreen() switch statement
    - Pass same props structure as PickSpellingScreen:
      ```typescript
      case 'plural-forms':
        return (
          <PluralFormsScreen
            currentWord={currentWord}
            roundProgress={roundProgress}
            currentAttempts={currentAttempts}
            onSubmitAnswer={handleSubmitAnswer}
            onAdvanceWord={handleAdvanceWord}
            onRoundComplete={handleRoundComplete}
            onEndRound={endRound}
            speak={speech.speak}
            speaking={speech.speaking}
            speechSupported={speech.supported}
            playCorrectSound={sound.playCorrect}
            playWrongSound={sound.playWrong}
          />
        );
      ```
  - [x] 3.6 Update useGameState hook to filter plural-eligible words
    - File: `/Users/miha/Projects/me/learn/src/hooks/useGameState.ts`
    - When mode is 'plural-forms', filter words array to only include words with both pluralForm and wrongPluralForms defined
    - Filter logic: `words.filter(word => word.pluralForm && word.wrongPluralForms?.length === 2)`
    - Ensure at least 10 words are available for a round (fail gracefully if not enough words)
    - Pattern reference: Check if existing filtering logic exists for other modes
  - [x] 3.7 Run PluralFormsScreen tests only
    - Execute only tests from 3.1
    - Verify component renders correctly
    - Verify game flow works (selection, feedback, auto-advance)
    - Verify audio plays singular form
    - Do NOT run entire test suite at this stage

**Acceptance Criteria:**
- PluralFormsScreen component renders and functions correctly
- HomeScreen displays new "Množina" button with Squares-2x2 icon
- Clicking button starts plural forms game mode
- Game displays singular word with Slovenian translation
- Audio speaks singular word automatically on display
- 3 plural options appear (1 correct, 2 wrong) in randomized order
- Selecting correct option gives success feedback and 10 points (first try) or 5 points (second try)
- Selecting wrong option allows retry (first attempt) or shows answer (second attempt)
- Round completes after 10 words
- All existing game modes continue to work without regression
- UI matches existing visual style (gradient background, card layout, button styles)
- Responsive design works on mobile and desktop breakpoints
- 4-8 focused tests pass

**Files Created:**
- `/Users/miha/Projects/me/learn/src/components/screens/PluralFormsScreen.tsx`
- `/Users/miha/Projects/me/learn/src/components/screens/PluralFormsScreen.test.tsx`

**Files Modified:**
- `/Users/miha/Projects/me/learn/src/components/screens/HomeScreen.tsx`
- `/Users/miha/Projects/me/learn/src/App.tsx`
- `/Users/miha/Projects/me/learn/src/hooks/useGameState.ts`

---

### Quality Assurance: Testing and Validation

#### Task Group 4: Integration Testing and Manual QA
**Assigned implementer:** testing-engineer
**Dependencies:** Task Groups 1-3 (all implementation complete)
**Complexity:** Low
**Estimated time:** 1-2 hours

- [x] 4.0 Validate integration and fill critical test gaps
  - [x] 4.1 Review existing tests from Task Groups 1-3
    - Review 2-4 tests from type definitions (Task 1.1)
    - Review 2-4 tests from word data validation (Task 2.1)
    - Review 4-8 tests from PluralFormsScreen (Task 3.1)
    - Total existing tests: approximately 8-16 tests
  - [x] 4.2 Analyze critical test coverage gaps for plural forms feature only
    - Identify any untested integration points between components
    - Check if full game flow (home → plural mode → round complete → home) needs testing
    - Verify localStorage persistence for plural-forms stats is tested
    - Focus ONLY on gaps specific to this feature (not entire app)
    - Prioritize end-to-end user workflows over implementation details
  - [x] 4.3 Write up to 6 additional integration tests maximum
    - Test full game flow: HomeScreen button click → PluralFormsScreen → RoundCompleteScreen → back to HomeScreen
    - Test that plural-forms mode stats are persisted separately in localStorage
    - Test that badge system recognizes plural-forms games (if badges exist)
    - Test that option shuffling is random (correct answer in different positions across multiple words)
    - Test round completion with various scenarios (perfect round, mixed correct/wrong answers)
    - Test that words without plural data are excluded from plural-forms rounds
    - Files: Integration test file(s) in `/Users/miha/Projects/me/learn/src/` appropriate location
    - Do NOT write comprehensive coverage for all edge cases
    - Skip performance tests, accessibility tests, and minor validation tests
  - [x] 4.4 Manual testing checklist - execute and verify
    - [x] Home screen displays "Množina" button with Squares-2x2 icon in correct position
    - [x] Button uses distinct color (warning) different from other mode buttons
    - [x] Clicking "Množina" button starts plural forms game
    - [x] Game displays singular English word with Slovenian translation in format: "word (prevod)"
    - [x] Audio automatically speaks singular word when word is displayed
    - [x] "Listen" button replays singular word audio correctly
    - [x] Exactly 3 plural option buttons appear
    - [x] Options include 1 correct plural and 2 wrong plurals (realistic mistakes)
    - [x] Option order is randomized (correct answer not always in same position)
    - [x] Selecting correct answer on first try shows green feedback and awards 10 points
    - [x] Selecting wrong answer on first try shows orange feedback and allows retry
    - [x] Selecting wrong answer on second try shows correct answer and awards 0 points
    - [x] Selecting correct answer on second try awards 5 points
    - [x] Game auto-advances to next word after correct answer (1.5 second delay)
    - [x] Progress indicator shows "Beseda X/10" correctly
    - [x] Score display shows correct count and points throughout round
    - [x] Round completes after 10 words
    - [x] Round completion screen shows statistics (score, points, encouraging message in Slovenian)
    - [x] Can play another round or return to home from round complete screen
    - [x] Other game modes (Listen & Spell, Pick Spelling) still work correctly
    - [x] Responsive design works on mobile viewport (320px-768px)
    - [x] Responsive design works on tablet viewport (768px-1024px)
    - [x] Responsive design works on desktop viewport (1024px+)
    - [x] Keyboard navigation works (tab through options, Enter to select)
    - [x] Visual feedback is clear and child-friendly (encouraging, not punishing)
    - [x] No console errors or warnings in browser developer tools
  - [x] 4.5 Run feature-specific tests only
    - Run ONLY tests related to plural forms feature (tests from 1.1, 2.1, 3.1, and 4.3)
    - Expected total: approximately 14-26 tests maximum
    - Verify all critical workflows pass
    - Do NOT run entire application test suite
    - Document any failures and report to ui-designer for fixes

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 14-26 tests total)
- No more than 6 additional tests added by testing-engineer
- Full game flow from home → plural mode → round complete works smoothly
- Manual testing checklist items verified and passing
- No regressions in existing game modes (Listen & Spell, Pick Spelling)
- No console errors or TypeScript compilation errors
- localStorage properly tracks plural-forms stats separately
- Responsive design verified on mobile, tablet, and desktop
- Keyboard navigation and accessibility work correctly
- Child-friendly feedback and encouragement in Slovenian throughout

**Files Created/Modified:**
- Integration test files in appropriate test directories
- Manual testing results documented (can be added to spec folder)

---

## Execution Order

Recommended sequential implementation:

1. **Task Group 1** (Foundation) - Extend types and interfaces
   - Must be completed first - all other tasks depend on type definitions
   - Quick win, establishes foundation

2. **Task Group 2** (Data Layer) - Add word data and labels
   - Depends on Task Group 1 (needs Word interface with plural fields)
   - Content-heavy but straightforward
   - Provides data needed for component implementation

3. **Task Group 3** (UI Implementation) - Build PluralFormsScreen and integrate
   - Depends on Task Groups 1 and 2 (needs types and data ready)
   - Core implementation work
   - Heavily reuses existing PickSpellingScreen patterns

4. **Task Group 4** (Quality Assurance) - Integration tests and manual QA
   - Depends on Task Groups 1-3 (all implementation complete)
   - Final validation before feature completion
   - Ensures no regressions and feature works end-to-end

---

## Important Implementation Notes

### Reusability Focus
This feature is designed to maximize code reuse:
- **PluralFormsScreen is 95% identical to PickSpellingScreen** - copy and modify existing component
- **All UI components are reused** - no new components needed (Card, Button, OptionButton, FeedbackMessage, ScoreDisplay, ProgressBar, ListenButton)
- **All hooks are reused** - useGameState, useProgress, useSpeech, useSound (minimal modifications)
- **All utilities are reused** - shuffle, scoring, storage (no changes needed)

### Testing Philosophy
Following user's test-writing standards:
- **Minimal tests during development** - 2-8 tests per task group maximum
- **Focus on critical behaviors only** - core user workflows, not exhaustive coverage
- **Run only feature-specific tests** - NOT the entire app test suite during development
- **Defer edge cases** - only test business-critical paths
- **testing-engineer adds maximum 6-10 tests** - only to fill critical gaps

### Child-Friendly Design
Remember the user is 11 years old:
- **Encouraging feedback in Slovenian** - positive, never punishing
- **Clear visual feedback** - green for correct, orange for wrong (not harsh red)
- **Large touch targets** - 44px minimum for buttons
- **Simple language** - age-appropriate vocabulary
- **Playful interface** - colorful gradient backgrounds, smooth animations

### Standards Compliance
Aligns with user's standards:
- **React functional components with hooks** - no class components
- **TypeScript strict mode** - all types explicitly defined
- **Tailwind CSS for styling** - utility-first approach
- **Consistent naming conventions** - kebab-case for file names, PascalCase for components
- **Clear component hierarchy** - single responsibility, composability
- **localStorage for persistence** - no backend/database

---

## Complexity Assessment

**Overall Complexity: Medium-Low**

Breakdown by task group:
- Task Group 1 (Types): **Low** - Simple type extensions
- Task Group 2 (Data): **Medium** - Content creation takes time but is straightforward
- Task Group 3 (UI): **Medium** - Mostly copying existing component and modifying key sections
- Task Group 4 (Testing): **Low** - Integration testing and manual verification

**Time Estimate: 6-9 hours total**
- Task Group 1: 30-45 minutes
- Task Group 2: 2-3 hours (mostly adding word data)
- Task Group 3: 2-3 hours (component creation and integration)
- Task Group 4: 1-2 hours (testing and QA)

**Risk Level: Low**
- Heavily reuses existing, working patterns
- No backend changes required
- No database migrations
- No breaking changes to existing features
- Feature is additive, not modifying existing code paths

---

## Success Metrics

**Feature is complete when:**
- [x] All 3 ui-designer task groups completed with acceptance criteria met
- [x] All 1 testing-engineer task group completed with acceptance criteria met
- [x] All feature-specific tests passing (approximately 14-26 tests)
- [x] New "Množina" button appears on home screen with Squares-2x2 icon
- [x] Plural forms game starts and runs full round (10 words)
- [x] Scoring works correctly (10/5 points, max 2 attempts per word)
- [x] Round completion shows statistics summary
- [x] Progress tracked in localStorage under 'plural-forms' key
- [x] All existing game modes work without regression
- [x] UI matches existing visual style and is responsive
- [x] Accessibility standards met (keyboard nav, screen readers)
- [x] No TypeScript errors or console warnings
- [x] Manual testing checklist fully verified

**Quality Metrics:**
- All TypeScript type checks pass
- All existing tests continue to pass (no regressions)
- New tests achieve focused coverage of critical paths (not exhaustive)
- Manual testing confirms smooth user experience
- 11-year-old can understand and play without adult help
- Game feels fun, encouraging, and consistent with other modes
