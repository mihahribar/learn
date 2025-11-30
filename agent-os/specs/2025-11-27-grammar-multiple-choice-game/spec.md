# Specification: Grammar Multiple Choice Game - "Have Got / Has Got"

## Goal
Create a new grammar exercise game that helps users learn subject-verb agreement with "have got/has got" through multiple choice sentence completion. The game follows the same proven mechanics and UI pattern as the existing PluralFormsScreen to maintain consistency and leverage familiar user patterns.

## User Stories
- As a learner, I want to practice "have got" vs "has got" grammar so that I can improve my understanding of subject-verb agreement
- As a learner, I want to complete sentences by choosing from multiple choice options so that I can quickly identify the correct grammatical form
- As a learner, I want to get immediate feedback on my answers so that I can learn from my mistakes
- As a learner, I want to see my progress and score so that I feel motivated to improve
- As a learner, I want the game to match the familiar pattern of other games so that I can focus on learning rather than figuring out new mechanics

## Core Requirements

### Functional Requirements
- Display sentences with blanks to be filled with correct "have got" or "has got" form
- Present three multiple choice options (a/b/c) with one correct answer and two grammatical variations as wrong answers
- Wrong answer options should include variations like "have got", "has got", "having got", "got", etc.
- Allow 2 attempts per question (same as PluralFormsScreen)
- Show encouraging feedback after first incorrect attempt with option to retry
- After second incorrect attempt, reveal the correct answer and auto-advance
- Auto-advance after correct answer with brief delay (1500ms)
- Display 10 questions per round
- Track and display score throughout the round (correct answers out of 10)
- Track and display points (2 points for first attempt, 1 point for second attempt)
- Add dedicated home screen button labeled "Dopolni stavke" for launching this game mode
- Support multiple rounds using a pool of 30 total sentence examples
- Include back button with quit confirmation dialog to prevent accidental exits

### Non-Functional Requirements
- UI must exactly match PluralFormsScreen layout and visual design
- Maintain consistent purple primary color, white background, yellow accent for scoring
- Follow same responsive design patterns with mobile-first approach
- Use same spacing, typography, and component styling as existing games
- Ensure keyboard navigation and screen reader accessibility
- Maintain 60fps performance during animations and transitions
- English language only for V1 (no Slovenian translations needed)

### Content Requirements
- Create 30 total sentence examples testing "have got/has got" usage
- Use the 20 examples from the provided worksheet (examples.png) as foundation
- Create 10 additional examples to reach 30 total
- Ensure mix of:
  - Singular subjects requiring "has got" (e.g., "My friend", "She", "He", "The cat")
  - Plural subjects requiring "have got" (e.g., "My parents", "They", "We")
  - First person singular "I" requiring "have got"
  - Mix of affirmative contexts
- Include variety of sentence structures and vocabulary
- Ensure subject-verb agreement rules are clearly and consistently tested
- Do not include negative forms (haven't got/hasn't got) in V1 to keep scope focused

## Visual Design

### Layout Structure
The game screen follows the exact pattern shown in `planning/visuals/PluralFormsScreen.png`:

**Header Section:**
- Back button ("Nazaj") in top left with left arrow icon
- Progress indicator showing "X/10" and percentage with horizontal purple progress bar
- Title showing "Beseda X/10" centered below progress

**Main Card:**
- Large white card with rounded corners and shadow
- Sentence displayed with blank indicated by underline or placeholder
- Audio/listen button (if needed for pronunciation, otherwise omit)
- Three stacked multiple choice buttons (a/b/c format):
  - Full width buttons with rounded borders
  - Letter indicators in purple circles on left side
  - Clear spacing between options
  - Visual states: default, hover, selected-correct (green), selected-incorrect (red), disabled (grey)

**Footer Section:**
- Score display showing "X / 10" with "Rezultat" label
- Yellow points badge showing "X točke"

**Feedback Display:**
- Feedback messages appear below options
- Green checkmark for correct answers
- Red X for incorrect answers
- Info message when showing correct answer

### Color Scheme
- Primary: Purple (#8B5CF6 or similar from existing theme)
- Background: Light purple gradient (from-primary-50 to-primary-100)
- Correct state: Green (#10B981 or existing success color)
- Incorrect state: Red (#EF4444 or existing error color)
- Points badge: Yellow/Gold (#F59E0B or existing warning color)
- Cards: White with shadow
- Text: Gray-700 to Gray-800 for readability

### Typography
- Question text: Large, prominent, centered (text-lg sm:text-xl)
- Option text: Medium, left-aligned (text-base sm:text-lg)
- Progress text: Small to medium (text-sm sm:text-base)
- Score: Large, bold (text-2xl sm:text-3xl)

### Responsive Design
- Mobile-first approach with breakpoints at sm: (640px), md: (768px), lg: (1024px)
- Maximum card width: max-w-md (28rem / 448px)
- Adequate padding on all sides (p-4 sm:p-6 lg:p-8)
- Touchable button sizes (minimum 44px height)

## Reusable Components

### Existing Components to Leverage
Based on analysis of PluralFormsScreen.tsx and related files:

**UI Components** (`/src/components/ui/`):
- `Button.tsx` - For back button, navigation actions
- `Card.tsx` - For main game card container
- `ProgressBar.tsx` - For round progress display
- `ConfirmDialog.tsx` - For quit game confirmation

**Game Components** (`/src/components/game/`):
- `OptionButton.tsx` - For a/b/c multiple choice buttons (exact same pattern)
- `FeedbackMessage.tsx` - For showing correct/wrong/show-answer feedback
- `ScoreDisplay.tsx` - For bottom score and points display
- `ListenButton.tsx` - Optional, only if audio pronunciation is needed

**Hooks** (`/src/hooks/`):
- `useGameState.ts` - For managing round state, scoring, attempts, streaks
  - Needs extension to support new 'grammar-forms' mode
  - Will handle 10 words per round, 2 attempts max, scoring logic
- `useProgress.ts` - For tracking and persisting user progress
- `useSound.ts` - For playing correct/wrong sound effects
- `useSpeech.ts` - Optional, only if audio needed for sentences

**Data/Utils**:
- `/src/data/messages.ts` - For Slovenian UI labels and feedback messages
  - Add new label for "Dopolni stavke" button
  - Reuse existing feedback messages (correctMessages, wrongMessages, showCorrectMessages)
- `/src/utils/shuffle.ts` - For randomizing question order and option positions
- `/src/utils/scoring.ts` - For calculating points (2 for first attempt, 1 for second)

**Existing Patterns to Follow**:
- State management pattern from PluralFormsScreen
- 2-attempt logic with auto-advance
- Feedback timing and animations
- Quit dialog flow
- Round completion flow to RoundCompleteScreen

### New Components Required

**GrammarFormsScreen Component** (`/src/components/screens/GrammarFormsScreen.tsx`):
- New screen component following PluralFormsScreen structure exactly
- Receives props similar to PluralFormsScreenProps
- Displays sentence with blank instead of singular word
- Uses same OptionButton pattern for a/b/c choices
- Reuses same game logic flow (attempts, feedback, auto-advance)
- Why new: Displays sentences instead of single words, different question format

**Grammar Questions Data** (`/src/data/grammarQuestions.ts`):
- New data file containing 30 sentence examples
- Each question has: id, sentence template, blank position, correct answer, wrong answers, subject type
- Structure:
  ```typescript
  interface GrammarQuestion {
    id: string;
    sentence: string;  // Full sentence with placeholder for answer
    correctAnswer: string;  // e.g., "have got" or "has got"
    wrongAnswers: string[];  // e.g., ["has got", "having got"] or ["have got", "got"]
    subjectType: 'singular' | 'plural' | 'first-person';  // For learning analytics
  }
  ```
- Why new: New content type not in existing word list

## Technical Approach

### Data Structure

**Type Definitions** (`/src/types/index.ts`):
- Add `'grammar-forms'` to `GameMode` type union
- Add `GrammarQuestion` interface (or extend Word interface if appropriate)
- Existing types (CurrentRound, RoundStats, FeedbackType) can be reused

**Grammar Questions Data**:
Create 30 questions based on provided examples with structure:
```typescript
{
  id: "1",
  sentence: "My sisters _______ long hair.",
  correctAnswer: "have got",
  wrongAnswers: ["has got", "having got"],
  subjectType: "plural"
}
```

### Component Architecture

**New Screen Component**: `GrammarFormsScreen.tsx`
- Follow PluralFormsScreen.tsx structure exactly (340 lines reference)
- Props interface matching PluralFormsScreenProps pattern
- State: optionStates, feedbackMessage, feedbackType, isProcessing, showQuitDialog
- Use same hooks: useState, useCallback, useRef, useEffect, useMemo
- Shuffle options using existing shuffle utility
- Handle option selection with 2-attempt logic
- Auto-advance with timeout (1500ms correct, 2250ms show-answer)
- Render same component tree: header → card → footer

**Game State Integration**:
- Extend useGameState hook to support 'grammar-forms' mode
- Filter/select grammar questions instead of words when mode is 'grammar-forms'
- Reuse same scoring, attempts, and streak logic
- Return current question data in format screen component expects

**Home Screen Integration**:
- Add new button to HomeScreen.tsx navigation section
- Button properties:
  - Variant: Could use 'accent' or existing variant
  - Icon: Pencil/edit icon or document icon
  - Label: "Dopolni stavke" from messages.ts
  - onClick: `() => onStartGame('grammar-forms')`
  - Position: After plural-forms button (4th game button)

### Game Flow

1. **Start**: User clicks "Dopolni stavke" on home screen
2. **Initialization**: useGameState loads 10 random questions from 30-question pool
3. **Question Display**: Show sentence with blank, 3 shuffled options (a/b/c)
4. **User Interaction**: User clicks an option
5. **First Attempt**:
   - If correct: Show green state, encouraging message, auto-advance after 1.5s
   - If wrong: Show red state, "try again" message, allow second attempt
6. **Second Attempt** (if first was wrong):
   - If correct: Show green state, encouraging message, auto-advance after 1.5s
   - If wrong: Show red on selected, green on correct answer, "correct answer is..." message, auto-advance after 2.25s
7. **Advance**: Move to next question or complete round after 10 questions
8. **Round Complete**: Navigate to RoundCompleteScreen with stats
9. **Play Again or Home**: User chooses next action

### Scoring System
Reuse existing scoring logic:
- First attempt correct: 2 points
- Second attempt correct: 1 point
- Both attempts wrong: 0 points
- Perfect round (10/10): +20 bonus points
- Score tracked: X/10 (number correct)
- Points tracked: total points earned

### Testing Strategy
Following existing test patterns:
- Unit tests for GrammarFormsScreen component (similar to PluralFormsScreen.integration.test.tsx)
- Test option selection and state changes
- Test 2-attempt logic and feedback display
- Test auto-advance behavior
- Test quit dialog flow
- Integration test for full round completion
- Test grammar questions data structure validity

## Integration Points

### Existing Codebase Integration

**Type System** (`/src/types/index.ts`):
- Add `'grammar-forms'` to GameMode union type
- Define GrammarQuestion interface or extend Word interface with optional grammarQuestion fields

**Game State Hook** (`/src/hooks/useGameState.ts`):
- Add case for 'grammar-forms' mode in startGame function
- Filter grammar questions from data source
- Use same WORDS_PER_ROUND (10) and MAX_ATTEMPTS (2) constants
- Return questions in same format as words

**Home Screen** (`/src/components/screens/HomeScreen.tsx`):
- Add fourth game mode button between lines 233-234 (after plural-forms button)
- Import new icon if needed (Pencil, Document, or existing icon)
- Wire up to `onStartGame('grammar-forms')` handler

**App Routing** (`/src/App.tsx`):
- Add screen case for 'grammar-forms' mode
- Render GrammarFormsScreen with same props pattern as PluralFormsScreen
- Connect to existing navigation and state management

**Messages** (`/src/data/messages.ts`):
- Add new label: `grammarFormsButton: 'Dopolni stavke'`
- Add prompt function: `grammarPrompt: (sentence: string) => sentence` or similar
- Reuse existing correctMessages, wrongMessages, showCorrectMessages arrays

**Navigation Flow**:
- Home → GrammarFormsScreen (on button click)
- GrammarFormsScreen → Home (on quit confirm)
- GrammarFormsScreen → RoundCompleteScreen (after 10 questions)
- RoundCompleteScreen → Home or GrammarFormsScreen (play again)

## Out of Scope

### Explicitly Excluded from V1
- **Difficulty Levels**: All questions at same difficulty level
- **Time Limits**: No timed challenges or countdown timers
- **Mixed Grammar Topics**: Only "have got/has got", no other grammar rules
- **Negative Forms**: No "haven't got/hasn't got" in V1
- **Slovenian Translations**: English only, no bilingual support
- **Audio Pronunciation**: No text-to-speech for sentences (unless easy to add with existing useSpeech)
- **Question Explanations**: No grammar rule explanations or teaching content
- **Persistent Analytics**: No tracking of which questions are most difficult
- **User-Generated Content**: No ability to add custom questions
- **Difficulty Adaptation**: No adaptive difficulty based on performance
- **Leaderboards**: No comparative scoring or competition features
- **Session Persistence**: Round progress not saved if user leaves (same as existing games)

### Future Enhancements (Post-V1)
- Additional grammar topics (present simple, past simple, etc.)
- Negative forms support
- Slovenian translations for UI
- Grammar explanations and learning tips
- Question difficulty ratings
- Spaced repetition algorithm
- Custom question sets
- Performance analytics per question type

## Success Criteria

### Functional Success
- User can complete full round of 10 grammar questions
- 2-attempt system works correctly with appropriate feedback
- Score and points calculate accurately
- Auto-advance timing feels natural (not too fast or slow)
- Quit confirmation prevents accidental game exits
- Round completion shows accurate statistics
- Multiple rounds can be played with different question sets

### User Experience Success
- UI matches PluralFormsScreen exactly in layout and feel
- Transitions and animations feel smooth
- Feedback messages are encouraging and clear
- Progress through round is always visible
- No confusion about how to interact with game
- Mobile and desktop experiences both work well
- Accessible to keyboard and screen reader users

### Technical Success
- Code reuses 80%+ of existing patterns and components
- New GrammarFormsScreen follows same architecture as PluralFormsScreen
- No performance regressions (maintains 60fps)
- Tests achieve same coverage as PluralFormsScreen (integration + unit)
- Type safety maintained throughout (no 'any' types)
- No console errors or warnings during gameplay

### Content Success
- 30 high-quality sentence examples covering variety of subjects
- Clear and unambiguous correct answers
- Wrong answers are plausible but clearly incorrect
- Good mix of singular/plural subjects
- Natural, conversational sentence structures
- Age-appropriate vocabulary and contexts

## Implementation Notes

### Code Organization
```
/src
  /components
    /screens
      GrammarFormsScreen.tsx          # New screen component
      GrammarFormsScreen.test.tsx     # New test file
  /data
    grammarQuestions.ts                # New data file with 30 questions
    messages.ts                        # Update with new labels
  /types
    index.ts                           # Update GameMode type
  /hooks
    useGameState.ts                    # Extend for 'grammar-forms' mode
```

### Development Sequence
1. Create grammarQuestions.ts data file with 30 questions
2. Update types to include 'grammar-forms' GameMode
3. Create GrammarFormsScreen.tsx component (copy and adapt from PluralFormsScreen)
4. Update useGameState.ts to handle grammar-forms mode
5. Update messages.ts with new labels
6. Add button to HomeScreen.tsx
7. Update App.tsx routing to include new screen
8. Write integration and unit tests
9. Manual testing of full flow
10. Accessibility testing

### Key Design Decisions
- **Reuse over Reinvent**: Maximum code reuse from PluralFormsScreen to maintain consistency and reduce bugs
- **No Audio for V1**: Sentences are read visually, audio would complicate without clear benefit
- **English Only**: Limits translation overhead, can add Slovenian in V2
- **30 Questions**: Allows 3 full rounds without repetition, expandable later
- **Subject-Verb Agreement Focus**: Clear, testable grammar rule with binary correct/incorrect
- **a/b/c Format**: Consistent with existing games, familiar to users
- **Same Scoring**: Maintains motivation and badge earning parity with other game modes

### Accessibility Considerations
- Proper ARIA labels on all interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Screen reader announcements for score changes and feedback
- Sufficient color contrast on all text (WCAG AA minimum)
- Focus indicators clearly visible
- Touch targets minimum 44x44px for mobile
- Semantic HTML structure (header, main, footer)

### Performance Considerations
- Lazy load grammarQuestions data if large
- Memoize shuffled options to prevent unnecessary recalculation
- Use useCallback for event handlers to prevent re-renders
- Cleanup timeouts on unmount to prevent memory leaks
- Optimize animations to use transform/opacity for 60fps
- Keep component tree shallow for fast rendering

## Dependencies

### No New Dependencies Required
All required functionality available in existing stack:
- React (existing)
- TypeScript (existing)
- Tailwind CSS (existing)
- Existing UI component library
- Existing hooks and utilities

### Existing Dependencies Utilized
- React hooks (useState, useCallback, useMemo, useRef, useEffect)
- Tailwind CSS classes for styling
- TypeScript for type safety
- Existing shuffle utility
- Existing scoring utility
- Existing message/feedback systems
