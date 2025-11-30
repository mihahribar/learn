# Specification: Plural Forms Game Mode

## Goal
Add a third game mode to SpellBee that teaches English plural forms through multiple-choice selection. Users will see a singular English word with its Slovenian translation, hear it spoken aloud, and select the correct plural form from three options (one correct, two realistic wrong answers).

## User Stories
- As a 11-year-old Slovenian student learning English, I want to practice plural forms in a game format so that I can master both regular and irregular plurals.
- As a student, I want to see the singular word with its Slovenian translation so that I understand what word I'm forming the plural for.
- As a student, I want to hear the singular word spoken aloud so that I can associate the pronunciation with the spelling.
- As a student, I want to choose from multiple plural options so that I can learn common mistakes to avoid.
- As a student, I want the same encouraging feedback and scoring system so that the game feels familiar and consistent.
- As a student, I want to see my progress and earn points just like the other game modes.

## Core Requirements

### Functional Requirements
- Display singular English word with Slovenian translation in brackets (e.g., "dog (pes)")
- Automatically speak the singular English word using Web Speech API when word is displayed
- Provide "Listen" button to replay the singular word pronunciation
- Present 3 English plural form options in randomized order:
  - 1 correct plural form
  - 2 realistic incorrect plural forms (common mistakes like "mouses" instead of "mice")
- Allow user to select one option per attempt
- Validate selection and provide immediate visual feedback (green for correct, red/orange for incorrect)
- Support 2 attempts per word:
  - First attempt: Award 10 points for correct answer, allow retry for incorrect
  - Second attempt: Award 5 points for correct answer, show correct answer if wrong
- Follow round-based structure: 10 words per round
- Randomize word order within each round
- Display progress indicator showing current word number (e.g., "Beseda 3/10")
- Show running score and points display
- Calculate and display round completion statistics
- Show encouraging Slovenian feedback messages
- Auto-advance to next word after correct answer (1.5 second delay)
- Track statistics for plural forms game mode separately in localStorage

### Non-Functional Requirements
- Performance: Instant response to button clicks, smooth transitions between words
- Accessibility: Keyboard navigation support, high contrast colors, large touch targets (44px minimum), screen reader compatibility
- Child-friendly design: Encouraging positive feedback, colorful playful interface, clear large typography, no punishing messages
- Consistency: Match existing game modes' visual style, same scoring algorithm, same sound effects and animations
- Browser compatibility: Modern evergreen browsers with Web Speech API and localStorage support

## Visual Design

### UI Layout
No mockups provided. Follow existing SpellBee patterns from PickSpellingScreen:

**Home Screen Addition:**
- Add third game mode button between existing modes and badges section
- Button variant: "accent" or "info" color (distinct from primary/success of other modes)
- Icon: Squares-2x2 (from Heroicons) representing "multiple items"
- Button text: "Množina" (Plural forms in Slovenian)
- Large, tappable button matching existing size (w-full, py-5 sm:py-6, text-lg sm:text-xl)

**Game Screen Layout:**
- Header: Progress bar and "Beseda X/10" label
- Main card (centered, max-w-md):
  - Singular word display: Large text showing "word (slovenian)" format
  - Listen button: Reuse existing ListenButton component
  - 3 option buttons: Vertical stack with 3px spacing
  - Feedback message: Shows below options when answer is submitted
- Footer: Score display showing correct answers and total points

**Visual Elements:**
- Background: Gradient from primary-50 to primary-100 (consistent with other modes)
- Card: White with large padding and shadow
- Option buttons:
  - Default: White background with gray border
  - Correct: Green (success-light background, success border)
  - Incorrect: Orange/yellow (warning-light background, warning border)
  - Disabled: Gray with reduced opacity
- Typography: Clear, large, age-appropriate fonts
- Responsive breakpoints: Mobile-first, scales up for sm/md/lg screens

## Reusable Components

### Existing Code to Leverage

**UI Components (Reuse as-is):**
- `/src/components/ui/Card.tsx` - Main game card container
- `/src/components/ui/Button.tsx` - Home screen mode button
- `/src/components/ui/ProgressBar.tsx` - Round progress indicator
- `/src/components/game/OptionButton.tsx` - Multiple choice option buttons (PERFECT for this use case)
- `/src/components/game/FeedbackMessage.tsx` - Success/error feedback display
- `/src/components/game/ScoreDisplay.tsx` - Score and points counter
- `/src/components/game/ListenButton.tsx` - Audio playback button
- `/src/components/screens/RoundCompleteScreen.tsx` - End of round summary

**Hooks (Reuse as-is):**
- `/src/hooks/useGameState.ts` - Game state management, round logic, scoring
- `/src/hooks/useProgress.ts` - Progress tracking, localStorage persistence
- `/src/hooks/useSpeech.ts` - Web Speech API wrapper for audio
- `/src/hooks/useSound.ts` - Sound effects (correct/wrong chimes)

**Utilities (Reuse as-is):**
- `/src/utils/shuffle.ts` - Randomize option order using Fisher-Yates algorithm
- `/src/utils/scoring.ts` - Calculate points (10 for first try, 5 for second try, bonuses)
- `/src/utils/storage.ts` - localStorage utilities (if exists)

**Data Files (Extend):**
- `/src/data/messages.ts` - Add new UI labels for plural forms mode
- `/src/data/words.ts` - Extend Word interface and data to include plural forms

**Similar Code Patterns to Model After:**
- `/src/components/screens/PickSpellingScreen.tsx` - VERY similar structure:
  - Shows a prompt (Slovenian word → singular + Slovenian translation)
  - Presents 3 shuffled options (wrong spellings → wrong plural forms)
  - Uses OptionButton for selection
  - Same feedback and auto-advance logic
  - Same scoring mechanism
  - Nearly identical game flow

### New Components Required

**New Screen Component:**
- `/src/components/screens/PluralFormsScreen.tsx`
  - Purpose: Main game screen for plural forms mode
  - Why new: Unique game logic (shows singular + Slovenian, options are plural forms)
  - Pattern: Model very closely after PickSpellingScreen.tsx structure
  - Key differences:
    - Display format: "singular (slovenian)" instead of just Slovenian word
    - Audio plays singular form instead of correct answer
    - Options show plural forms instead of spelling variants

**Icon Component (in HomeScreen.tsx):**
- Squares2x2Icon SVG component
  - Purpose: Visual icon for plural forms mode button
  - Why new: New game mode needs distinct icon
  - Pattern: Follow existing SpeakerIcon and CheckIcon inline SVG patterns in HomeScreen.tsx

## Technical Approach

### Database / Data Structure

**Extend Word Interface** in `/src/types/index.ts`:
```typescript
export interface Word {
  id: string;
  english: string;
  slovenian: string;
  difficulty: Difficulty;
  wrongSpellings: string[];
  // NEW FIELDS:
  pluralForm?: string;           // Correct plural (e.g., "mice")
  wrongPluralForms?: string[];   // 2 incorrect plurals (e.g., ["mouses", "mices"])
}
```

**Extend GameMode Type** in `/src/types/index.ts`:
```typescript
export type GameMode = 'listen-spell' | 'pick-spelling' | 'plural-forms';
```

**Extend Screen Type** in `/src/types/index.ts`:
```typescript
export type Screen = 'home' | 'listen-spell' | 'pick-spelling' | 'plural-forms' | 'round-complete' | 'badges';
```

**Word Data Requirements** in `/src/data/words.ts`:
- Add pluralForm and wrongPluralForms to at least 30 existing words
- Include variety of plural types:
  - Regular plurals: dog/dogs, cat/cats, book/books
  - +es plurals: box/boxes, bush/bushes, class/classes
  - Irregular plurals: mouse/mice, child/children, tooth/teeth, foot/feet
  - Y to -ies: baby/babies, city/cities, lady/ladies
  - F to -ves: leaf/leaves, knife/knives, wolf/wolves
  - Unchanged plurals: sheep/sheep, fish/fish, deer/deer
- Wrong plural examples should reflect common ESL mistakes:
  - Overgeneralizing -s: childs, mouses, foots
  - Incorrect -es: boxs, classs
  - Wrong suffix: babys, citys
  - Double plurals: childrens

### API / Data Flow

**No backend API required.** All data is client-side.

**Game Flow:**
1. User clicks "Množina" button on HomeScreen
2. App.tsx calls `handleStartGame('plural-forms')`
3. useGameState hook:
   - Filters words array to only words with pluralForm and wrongPluralForms defined
   - Randomly selects 10 words for the round
   - Initializes round state
4. App.tsx sets currentScreen to 'plural-forms'
5. PluralFormsScreen renders:
   - Displays current word singular + Slovenian
   - Calls speech.speak() to pronounce singular form
   - Shuffles [pluralForm, ...wrongPluralForms] into 3 options
   - Renders 3 OptionButtons
6. User selects an option:
   - PluralFormsScreen calls handleRecordWordAttempt()
   - Game state validates answer and returns result
   - Progress hook records attempt
   - Feedback is displayed (correct/wrong message)
   - If correct or max attempts: auto-advance after delay
7. After 10 words, round completes:
   - useGameState returns RoundStats
   - Progress hook calculates total points (with bonuses)
   - App.tsx navigates to RoundCompleteScreen
8. User can play again or return home

**State Management:**
- Game state: Managed by useGameState hook (same as other modes)
- Progress: Managed by useProgress hook with localStorage persistence
- Screen: Local state in App.tsx
- Option selection: Local state in PluralFormsScreen

### Frontend Implementation

**File Changes Required:**

1. **`/src/types/index.ts`**
   - Extend Word interface with optional plural fields
   - Add 'plural-forms' to GameMode union type
   - Add 'plural-forms' to Screen union type

2. **`/src/data/words.ts`**
   - Add pluralForm and wrongPluralForms to 30+ words
   - Ensure variety of plural types (regular, irregular, special cases)

3. **`/src/data/messages.ts`**
   - Add label: `pluralFormsButton: 'Množina'`
   - Add label: `pluralPrompt: (singular: string, slovenian: string) => "Množina besede {singular} ({slovenian})?"` or similar
   - (Optional) Add plural-specific feedback messages if desired

4. **`/src/components/screens/HomeScreen.tsx`**
   - Add Squares2x2Icon SVG component (inline, following existing icon pattern)
   - Add third Button between pick-spelling and stats section
   - Button props: variant="info", icon={<Squares2x2Icon />}, onClick={() => onStartGame('plural-forms')}

5. **`/src/components/screens/PluralFormsScreen.tsx`** (NEW FILE)
   - Create new component by copying PickSpellingScreen.tsx structure
   - Modify to display singular word with Slovenian translation
   - Change audio to speak singular form instead of correct answer
   - Update shuffledOptions to use [currentWord.pluralForm, ...currentWord.wrongPluralForms]
   - Update prompt text to show singular + translation format
   - Reuse all existing components: Card, ProgressBar, ListenButton, OptionButton, FeedbackMessage, ScoreDisplay

6. **`/src/App.tsx`**
   - Import PluralFormsScreen
   - Add 'plural-forms' case to renderScreen() switch statement
   - Pass same props structure as PickSpellingScreen (nearly identical)

7. **`/src/hooks/useGameState.ts`** (OPTIONAL MODIFICATION)
   - If needed, add filtering logic to only select words with plural data when mode is 'plural-forms'
   - Alternative: Create separate words array in words.ts specifically for plural mode

**Component Hierarchy:**
```
App
├── HomeScreen
│   └── Button (Množina) [NEW]
└── PluralFormsScreen [NEW COMPONENT]
    ├── ProgressBar
    ├── Card
    │   ├── Singular word display [NEW DISPLAY FORMAT]
    │   ├── ListenButton
    │   ├── OptionButton (3x) [OPTIONS ARE PLURAL FORMS]
    │   └── FeedbackMessage
    └── ScoreDisplay
```

### Testing

**Unit Tests:**
- Test PluralFormsScreen component rendering
- Test option shuffling produces 3 options with correct answer included
- Test correct answer validation (first try = 10 points, second try = 5 points)
- Test auto-advance behavior after correct answer
- Test feedback messages display correctly
- Test speech synthesis calls singular form
- Test that mode is tracked separately in progress stats

**Integration Tests:**
- Test full game flow from home → plural mode → round complete → home
- Test localStorage persistence for plural-forms stats
- Test badge eligibility includes plural-forms games

**Manual Testing Checklist:**
- Verify all 3 options are visible and tappable
- Verify correct option is randomly positioned
- Verify wrong options are realistic mistakes
- Verify audio speaks singular form clearly
- Verify Slovenian translation is accurate
- Verify feedback is encouraging and age-appropriate
- Verify scoring matches other modes
- Verify round completion shows stats correctly
- Verify responsive design on mobile and desktop
- Verify accessibility (keyboard navigation, screen readers)

## Out of Scope

**Not Included in This Spec:**
- Difficulty levels for plural forms (all plurals in one category)
- Grammar explanations or rules teaching (only practice through game)
- Typing plural forms manually (only multiple choice selection)
- Possessive forms (only plurals)
- Irregular verb forms (only noun plurals)
- Translation of plural options to Slovenian (options show English plurals only)
- New badge types specific to plurals (use existing achievement system)
- Modifications to existing Listen & Spell or Pick the Right Spelling modes
- Hints or explanations for why an answer is correct/incorrect
- Statistics comparing plural types (regular vs irregular performance)
- Customizable number of words per round (remains 10 words)

**Future Enhancements (Not Now):**
- Advanced mode with typing plural forms instead of multiple choice
- Plural forms mixed with other grammar topics
- Customized difficulty based on student performance
- Detailed analytics on which plural types are most challenging

## Success Criteria

**Feature Complete When:**
- New "Množina" button appears on home screen with Squares-2x2 icon
- Clicking button starts plural forms game mode
- Game displays singular word with Slovenian translation
- Audio speaks singular word on display
- 3 plural options appear (1 correct, 2 wrong)
- User can select an option and receive immediate feedback
- Scoring follows same rules as other modes (10/5 points, max 2 attempts)
- Round completes after 10 words with statistics summary
- Progress is tracked and persisted in localStorage
- All existing game modes continue to work without regression
- UI matches existing visual style and is child-friendly
- Responsive design works on mobile and desktop
- Accessibility standards met (keyboard nav, screen readers, high contrast)

**Quality Metrics:**
- All TypeScript type checks pass without errors
- All existing tests continue to pass
- New component tests achieve >80% code coverage
- No console errors or warnings in browser
- Manual testing confirms all user flows work smoothly

**User Experience Goals:**
- 11-year-old can start game and understand instructions without adult help
- Game feels fun and encouraging, not stressful or punishing
- Feedback is clear and helps student learn from mistakes
- Consistent experience with other game modes (familiar interface)
- Loading and transitions feel instant and smooth
