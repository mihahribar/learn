# Task Breakdown: Grammar Multiple Choice Game - "Have Got / Has Got"

## Overview
Total Tasks: 4 task groups with 17 primary subtasks
Assigned roles: ui-designer, testing-engineer
Feature Type: Frontend feature with data content creation
Reuse Strategy: Maximum reuse from existing PluralFormsScreen pattern (80%+ code reuse)

## Task List

### Content Creation

#### Task Group 1: Grammar Questions Data
**Assigned implementer:** ui-designer
**Dependencies:** None

- [x] 1.0 Create grammar questions content and data structure
  - [x] 1.1 Write 2-8 focused tests for grammar questions data
    - Test data structure validation (question has required fields)
    - Test that correct answers differ from wrong answers
    - Test that all 30 questions have unique IDs
    - Limit to 2-8 highly focused tests maximum
  - [x] 1.2 Create GrammarQuestion interface in `/Users/miha/Projects/me/learn/src/types/index.ts`
    - Add interface with fields: id, sentence, correctAnswer, wrongAnswers, subjectType
    - Optionally extend existing Word interface if that provides better reusability
    - Consider adding 'grammar-forms' to existing data structures
  - [x] 1.3 Create grammar questions data file at `/Users/miha/Projects/me/learn/src/data/grammarQuestions.ts`
    - Create 30 total question examples (use 20 from examples.png as foundation)
    - Each question structure: { id, sentence, correctAnswer, wrongAnswers[], subjectType }
    - Ensure mix of singular subjects (requiring "has got"), plural subjects (requiring "have got"), and "I" (requiring "have got")
    - Include only affirmative forms for V1 (no haven't got/hasn't got)
    - Wrong answer options should include plausible variations: "have got", "has got", "having got", "got"
    - Reference sentences from `/Users/miha/Projects/me/learn/agent-os/specs/2025-11-27-grammar-multiple-choice-game/planning/visuals/examples.png`
  - [x] 1.4 Add export for grammar questions to `/Users/miha/Projects/me/learn/src/data/index.ts` (if exists)
    - Export grammarQuestions array for easy importing
  - [x] 1.5 Ensure grammar questions data tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify data structure is valid
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- 30 high-quality grammar questions created with correct answers and plausible wrong options
- Data structure follows TypeScript interface with proper typing
- Mix of singular/plural subjects and "I" first person
- Questions test "have got/has got" subject-verb agreement clearly
- The 2-8 tests written in 1.1 pass

### Type System and State Management

#### Task Group 2: Type System and Game State Integration
**Assigned implementer:** ui-designer
**Dependencies:** Task Group 1

- [x] 2.0 Extend type system and game state for grammar-forms mode
  - [x] 2.1 Write 2-8 focused tests for game state grammar-forms mode
    - Test that startGame('grammar-forms') initializes with grammar questions
    - Test that submitAnswer works correctly with grammar questions
    - Test scoring logic (2 points first attempt, 1 point second attempt)
    - Limit to 2-8 highly focused tests maximum
  - [x] 2.2 Update GameMode type in `/Users/miha/Projects/me/learn/src/types/index.ts`
    - Add 'grammar-forms' to GameMode union type: `export type GameMode = 'listen-spell' | 'pick-spelling' | 'plural-forms' | 'grammar-forms';`
  - [x] 2.3 Update Screen type in `/Users/miha/Projects/me/learn/src/types/index.ts`
    - Add 'grammar-forms' to Screen union type: `export type Screen = 'home' | 'listen-spell' | 'pick-spelling' | 'plural-forms' | 'grammar-forms' | 'round-complete' | 'badges';`
  - [x] 2.4 Extend useGameState hook in `/Users/miha/Projects/me/learn/src/hooks/useGameState.ts`
    - Import grammarQuestions from data file
    - Add case for 'grammar-forms' mode in startGame function
    - Filter/select 10 random grammar questions for the round (similar to words filtering)
    - Use same WORDS_PER_ROUND (10) and MAX_ATTEMPTS (2) constants
    - Ensure submitAnswer works with grammar question structure
    - Return current question data in format compatible with screen component
  - [x] 2.5 Update messages.ts in `/Users/miha/Projects/me/learn/src/data/messages.ts`
    - Add label: `grammarFormsButton: 'Dopolni stavke'` to labels object
    - Add prompt function if needed: `grammarPrompt: (sentence: string) => sentence`
    - Reuse existing correctMessages, wrongMessages, showCorrectMessages arrays
  - [x] 2.6 Ensure game state extension tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify grammar-forms mode initializes correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- 'grammar-forms' added to GameMode and Screen types
- useGameState hook supports 'grammar-forms' mode with proper question filtering
- Messages file includes new label for home screen button
- Same scoring and attempt logic as existing games
- The 2-8 tests written in 2.1 pass

### UI Components and Screen

#### Task Group 3: GrammarFormsScreen Component
**Assigned implementer:** ui-designer
**Dependencies:** Task Group 2

- [x] 3.0 Create GrammarFormsScreen component
  - [x] 3.1 Write 2-8 focused tests for GrammarFormsScreen component
    - Test option selection and state changes
    - Test 2-attempt logic (correct on first, wrong then correct, wrong twice)
    - Test auto-advance timing behavior
    - Limit to 2-8 highly focused tests maximum
  - [x] 3.2 Create GrammarFormsScreen.tsx at `/Users/miha/Projects/me/learn/src/components/screens/GrammarFormsScreen.tsx`
    - Copy structure from PluralFormsScreen.tsx as starting template
    - Define GrammarFormsScreenProps interface (mirror PluralFormsScreenProps pattern)
    - Props needed: currentQuestion, roundProgress, currentAttempts, onSubmitAnswer, onAdvanceWord, onRoundComplete, onEndRound, onGoBack, playCorrectSound, playWrongSound
    - State: optionStates, feedbackMessage, feedbackType, isProcessing, showQuitDialog
    - Use hooks: useState, useCallback, useRef, useEffect, useMemo
  - [x] 3.3 Implement question display logic
    - Display sentence with blank/placeholder for answer (instead of single word)
    - Show three shuffled options (a/b/c format) using existing OptionButton component
    - Use shuffle utility from `/Users/miha/Projects/me/learn/src/utils/shuffle.ts`
    - Memoize shuffled options to prevent unnecessary recalculation
  - [x] 3.4 Implement 2-attempt selection logic
    - Handle option selection with 2-attempt system
    - First attempt: correct = green + encouraging feedback + auto-advance (1500ms)
    - First attempt: wrong = red + try again message + allow second attempt
    - Second attempt: correct = green + encouraging feedback + auto-advance (1500ms)
    - Second attempt: wrong = red on selected + green on correct + show answer message + auto-advance (2250ms)
    - Use existing FeedbackMessage component for feedback display
  - [x] 3.5 Implement UI layout matching PluralFormsScreen pattern
    - Header section: Back button ("Nazaj"), Progress bar, Title ("Stavek X/10")
    - Main card: White card with sentence display, three stacked option buttons
    - Footer section: Score display ("X / 10" with "Rezultat" label), Yellow points badge ("X točke")
    - Use existing components: Button, Card, ProgressBar, OptionButton, FeedbackMessage, ScoreDisplay, ConfirmDialog
    - Reference visual: `/Users/miha/Projects/me/learn/agent-os/specs/2025-11-27-grammar-multiple-choice-game/planning/visuals/PluralFormsScreen.png`
  - [x] 3.6 Implement quit dialog flow
    - Show confirmation dialog when back button clicked
    - Use existing ConfirmDialog component
    - On confirm: call onGoBack to return to home
    - On cancel: close dialog and continue game
  - [x] 3.7 Add accessibility features
    - Proper ARIA labels on all interactive elements
    - Keyboard navigation support (Tab, Enter, Escape)
    - Screen reader announcements for score and feedback
    - Minimum 44x44px touch targets for mobile
    - Semantic HTML (header, main, footer)
  - [x] 3.8 Apply responsive styling
    - Mobile-first approach with Tailwind CSS
    - Breakpoints: sm: (640px), md: (768px), lg: (1024px)
    - Maximum card width: max-w-md (448px)
    - Adequate padding: p-4 sm:p-6 lg:p-8
    - Match existing color scheme: purple primary (#8B5CF6), white background, yellow points badge (#F59E0B)
  - [x] 3.9 Ensure GrammarFormsScreen component tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify critical component behaviors work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- GrammarFormsScreen component renders with correct layout matching PluralFormsScreen
- 2-attempt logic works correctly with appropriate feedback and timing
- Auto-advance timing feels natural (1500ms correct, 2250ms show-answer)
- UI matches visual design with purple theme, white cards, yellow points badge
- Responsive design works on mobile, tablet, and desktop
- Keyboard navigation and screen reader support implemented
- The 2-8 tests written in 3.1 pass

### Integration and Navigation

#### Task Group 4: App Integration and Navigation
**Assigned implementer:** ui-designer
**Dependencies:** Task Group 3

- [x] 4.0 Integrate GrammarFormsScreen into app
  - [x] 4.1 Update HomeScreen.tsx at `/Users/miha/Projects/me/learn/src/components/screens/HomeScreen.tsx`
    - Add fourth game mode button after plural-forms button
    - Button properties: appropriate variant, icon (Pencil/Document/similar), label from messages.grammarFormsButton
    - Wire up onClick: `() => onStartGame('grammar-forms')`
    - Maintain existing layout and spacing
  - [x] 4.2 Update App.tsx routing at `/Users/miha/Projects/me/learn/src/App.tsx`
    - Import GrammarFormsScreen component
    - Add screen case for 'grammar-forms' mode in screen rendering logic
    - Render GrammarFormsScreen with same props pattern as PluralFormsScreen
    - Connect to existing navigation and state management (useGameState, useSpeech, useSound)
    - Ensure navigation flow: Home → GrammarFormsScreen → RoundCompleteScreen
  - [x] 4.3 Manual testing of full flow
    - Test: Click "Dopolni stavke" button on home screen
    - Test: Complete a full round of 10 questions
    - Test: Verify 2-attempt system works correctly
    - Test: Verify scoring calculates correctly (2 points first attempt, 1 point second)
    - Test: Verify auto-advance timing feels natural
    - Test: Verify quit dialog prevents accidental exit
    - Test: Verify round completion shows accurate statistics
    - Test: Verify "play again" starts new round with different questions
    - Test: Verify responsive design on mobile and desktop
    - Test: Verify keyboard navigation works (Tab, Enter, Escape)

**Acceptance Criteria:**
- Home screen displays new "Dopolni stavke" button
- Button launches grammar-forms game mode correctly
- Full game flow works: start → play 10 questions → complete → home or play again
- Navigation between screens works smoothly
- All existing game modes still work (no regressions)
- Manual testing confirms all core functionality

### Testing Review

#### Task Group 5: Test Review & Gap Analysis
**Assigned implementer:** testing-engineer
**Dependencies:** Task Groups 1-4

- [x] 5.0 Review existing tests and fill critical gaps only
  - [x] 5.1 Review tests from Task Groups 1-4
    - Review the 2-8 tests written by ui-designer for grammar questions data (Task 1.1)
    - Review the 2-8 tests written by ui-designer for game state (Task 2.1)
    - Review the 2-8 tests written by ui-designer for GrammarFormsScreen (Task 3.1)
    - Total existing tests: approximately 6-24 tests
  - [x] 5.2 Analyze test coverage gaps for grammar-forms feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to this grammar game feature
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
    - Consider: full round completion, score calculation across attempts, question randomization, navigation flow
  - [x] 5.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows
    - Integration test: complete full round of 10 questions and verify stats
    - Integration test: verify question shuffling provides different questions per round
    - Integration test: verify navigation from home → game → completion → home
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
  - [x] 5.4 Run feature-specific tests only
    - Run ONLY tests related to grammar-forms feature (tests from 1.1, 2.1, 3.1, and 5.3)
    - Expected total: approximately 16-34 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass
    - Verify no console errors or warnings during test execution

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 16-34 tests total)
- Critical user workflows for grammar game feature are covered
- No more than 10 additional tests added by testing-engineer
- Testing focused exclusively on grammar-forms feature requirements
- Full round completion flow has test coverage
- No console errors during gameplay or testing

## Execution Order

Recommended implementation sequence:
1. Content Creation (Task Group 1) - Create grammar questions data
2. Type System and State Management (Task Group 2) - Extend types and game state
3. UI Components and Screen (Task Group 3) - Build GrammarFormsScreen component
4. Integration and Navigation (Task Group 4) - Connect to app and test full flow
5. Test Review & Gap Analysis (Task Group 5) - Review tests and fill critical gaps

## Technical Notes

### Reusability Strategy
This feature maximizes code reuse from existing PluralFormsScreen:
- **Components**: Reuse Button, Card, ProgressBar, OptionButton, FeedbackMessage, ScoreDisplay, ConfirmDialog (100% reuse)
- **Hooks**: Extend useGameState for new mode, reuse useSound, useProgress (90% reuse)
- **Utilities**: Reuse shuffle, scoring utilities (100% reuse)
- **Patterns**: Follow exact same 2-attempt logic, auto-advance timing, quit dialog flow (100% reuse)
- **New Code**: Only GrammarFormsScreen component and grammarQuestions data file are truly new

### Key File Paths
- **New Component**: `/Users/miha/Projects/me/learn/src/components/screens/GrammarFormsScreen.tsx`
- **New Data**: `/Users/miha/Projects/me/learn/src/data/grammarQuestions.ts`
- **Update Types**: `/Users/miha/Projects/me/learn/src/types/index.ts`
- **Update Game State**: `/Users/miha/Projects/me/learn/src/hooks/useGameState.ts`
- **Update Messages**: `/Users/miha/Projects/me/learn/src/data/messages.ts`
- **Update Home**: `/Users/miha/Projects/me/learn/src/components/screens/HomeScreen.tsx`
- **Update Routing**: `/Users/miha/Projects/me/learn/src/App.tsx`
- **Reference Visual**: `/Users/miha/Projects/me/learn/agent-os/specs/2025-11-27-grammar-multiple-choice-game/planning/visuals/PluralFormsScreen.png`
- **Reference Content**: `/Users/miha/Projects/me/learn/agent-os/specs/2025-11-27-grammar-multiple-choice-game/planning/visuals/examples.png`

### Design Specifications
Reference the exact UI pattern from PluralFormsScreen.png:
- **Color Scheme**: Purple primary (#8B5CF6), white background, yellow points (#F59E0B), green correct (#10B981), red incorrect (#EF4444)
- **Layout**: Centered card-based design, max-width 448px, generous padding
- **Typography**: Question text prominent (text-lg sm:text-xl), options readable (text-base sm:text-lg)
- **Responsive**: Mobile-first, breakpoints at 640px (sm), 768px (md), 1024px (lg)
- **Animations**: Smooth transitions, 60fps performance, transform/opacity only

### Content Guidelines
30 grammar questions following these patterns:
- **Singular subjects**: "My friend _____ a bike." → "has got" (correct)
- **Plural subjects**: "My sisters _____ long hair." → "have got" (correct)
- **First person "I"**: "I _____ a big flat screen in my room." → "have got" (correct)
- **Wrong options**: Include plausible variations like "has got", "have got", "having got", "got"
- **Affirmative only**: No negative forms (haven't got/hasn't got) in V1

### Testing Strategy
- **Minimal tests during development**: 2-8 tests per task group (ui-designer writes these)
- **Strategic gap filling**: Up to 10 additional tests by testing-engineer for critical workflows
- **Total expected tests**: 16-34 tests for entire grammar-forms feature
- **No exhaustive coverage**: Skip edge cases, validation tests, accessibility tests unless business-critical
- **Feature-focused**: Only test grammar-forms feature, not entire application

### Standards Compliance
This task list aligns with project standards:
- **Component Design** (components.md): Single responsibility, reusability, clear interface, minimal props, state management
- **Coding Style** (coding-style.md): Consistent naming, meaningful names, small focused functions, DRY principle
- **Testing** (test-writing.md): Minimal tests during development, test only core flows, defer edge cases, test behavior not implementation
- **Tech Stack** (tech-stack.md): Uses existing React, TypeScript, Tailwind CSS stack (no new dependencies)
