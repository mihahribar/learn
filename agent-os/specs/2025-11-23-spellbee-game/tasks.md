# Task Breakdown: SpellBee - Bilingual Spelling Game

## Overview

**Total Task Groups:** 10
**Estimated Total Tasks:** 45 sub-tasks
**Tech Stack:** React 19 + TypeScript + Vite (existing setup), Tailwind CSS (to add), Web Speech API, localStorage
**Target User:** 11-year-old Slovenian speaker learning English spelling

## Assigned Roles

Since no `implementers.yml` file exists in the project, tasks are assigned to logical specialist roles:

- **frontend-engineer**: Core React components, hooks, state management
- **ui-designer**: Visual design, styling, animations, responsive layout
- **testing-engineer**: Test coverage review and gap analysis

---

## Task List

### Foundation Layer

#### Task Group 1: Project Setup and Configuration
**Assigned implementer:** frontend-engineer
**Dependencies:** None
**Effort:** M

- [x] 1.0 Complete project foundation setup
  - [x] 1.1 Install and configure Tailwind CSS
    - Install tailwindcss, postcss, autoprefixer
    - Create tailwind.config.js with custom color palette (purple/violet primary, yellow/green/pink accents)
    - Configure content paths for purging
    - Update index.css with Tailwind directives
  - [x] 1.2 Create project directory structure
    - Create `src/components/ui/` directory
    - Create `src/components/game/` directory
    - Create `src/components/screens/` directory
    - Create `src/hooks/` directory
    - Create `src/data/` directory
    - Create `src/utils/` directory
    - Create `src/types/` directory
  - [x] 1.3 Define TypeScript interfaces in `src/types/index.ts`
    - Word interface (id, english, slovenian, difficulty, wrongSpellings)
    - GameState interface (currentMode, currentRound)
    - PersistedProgress interface (version, totalPoints, wordsCompleted, roundsPlayed, badges, wordStats, lastPlayedDate)
    - Badge interface (id, name, description, icon, condition)
    - GameMode type ('listen-spell' | 'pick-spelling')
  - [x] 1.4 Create utility functions
    - `src/utils/shuffle.ts`: Fisher-Yates shuffle for word randomization
    - `src/utils/storage.ts`: localStorage helpers (get, set, remove with JSON parsing)
    - `src/utils/scoring.ts`: Points calculation (10 first try, 5 second try, bonuses)

**Acceptance Criteria:**
- Tailwind CSS compiles and purges correctly
- All directories exist and follow spec structure
- TypeScript interfaces match spec data structures
- Utility functions are typed and functional

---

#### Task Group 2: Game Data Layer
**Assigned implementer:** frontend-engineer
**Dependencies:** Task Group 1
**Effort:** M

- [x] 2.0 Complete game data implementation
  - [x] 2.1 Create word list in `src/data/words.ts`
    - Minimum 50 words with english, slovenian, difficulty, wrongSpellings
    - Include easy, medium, and hard difficulty distribution
    - Ensure wrongSpellings are realistic common mistakes
    - Export typed array of Word objects
  - [x] 2.2 Create badge definitions in `src/data/badges.ts`
    - "Prvi korak" (First Step): 1 round completed
    - "Vztrajnost" (Persistence): 10 rounds completed
    - "Popolno!" (Perfect): 10/10 in a round
    - "Besedni zaklad" (Word Treasure): 100 words correct
    - "Vroca roka" (Hot Hand): 5 correct in a row
    - "Mojster crkovanja" (Spelling Master): 500 words correct
    - "Dnevna navada" (Daily Habit): 7 days streak
    - Export condition functions for each badge
  - [x] 2.3 Create Slovenian messages in `src/data/messages.ts`
    - Correct answer messages: "Odlicno!", "Super!", "Pravilno!", "Bravo!", "Tako je!"
    - Wrong answer messages: "Skoraj! Poskusi znova.", "Ni cisto prav. Se enkrat!", "Dobro si blizu!"
    - Show correct messages: "Pravilno se pise: [word]", "Zapomni si: [word]"
    - Round complete messages based on score thresholds
    - All UI labels (buttons, headers, prompts)

**Acceptance Criteria:**
- 50+ words with proper Slovenian translations
- All 7 badges defined with working condition functions
- Complete Slovenian message set for all game states
- No hardcoded strings in component code (all from messages.ts)

---

### Core UI Components

#### Task Group 3: Reusable UI Components
**Assigned implementer:** ui-designer
**Dependencies:** Task Group 1
**Effort:** M

- [x] 3.0 Complete reusable UI component library
  - [x] 3.1 Create Button component (`src/components/ui/Button.tsx`)
    - Variants: primary (purple), secondary (gray), success (green), warning (orange)
    - Sizes: small, medium, large (44x44px minimum touch target)
    - Support for icons (left/right position)
    - Disabled state styling
    - Focus ring for keyboard accessibility
    - Hover and active states with transitions
  - [x] 3.2 Create Card component (`src/components/ui/Card.tsx`)
    - Configurable padding (sm, md, lg)
    - Rounded corners (consistent border-radius)
    - Optional shadow variants
    - Background color options
  - [x] 3.3 Create Input component (`src/components/ui/Input.tsx`)
    - Large font size (minimum 16px to prevent iOS zoom)
    - Clear focus states with visible ring
    - Error state styling (orange border)
    - Success state styling (green border)
    - Placeholder support
    - Accessible label association
  - [x] 3.4 Create ProgressBar component (`src/components/ui/ProgressBar.tsx`)
    - Visual progress indicator (X/10)
    - Animated fill transition
    - Color variants based on progress
    - Accessible role="progressbar" with aria attributes
  - [x] 3.5 Create Badge component (`src/components/ui/Badge.tsx`)
    - Earned state (full color with icon)
    - Locked state (grayscale)
    - Badge name and description display
    - Hover animation for earned badges

**Acceptance Criteria:**
- All components follow single responsibility principle
- Components have proper TypeScript props interfaces
- 44x44px minimum touch targets on interactive elements
- Keyboard navigation works on all interactive components
- Color contrast meets WCAG AA standards

---

#### Task Group 4: Game-Specific Components
**Assigned implementer:** ui-designer
**Dependencies:** Task Group 3
**Effort:** M

- [x] 4.0 Complete game-specific components
  - [x] 4.1 Create ListenButton component (`src/components/game/ListenButton.tsx`)
    - Large button with speaker icon
    - "Poslusaj" label in Slovenian
    - Visual feedback during speech (pulsing/animated)
    - Disabled state when speech not supported
    - Will use useSpeech hook (to be created later)
  - [x] 4.2 Create SpellingInput component (`src/components/game/SpellingInput.tsx`)
    - Wraps Input component with spelling-specific logic
    - Large, centered text input
    - Shows validation feedback (correct/incorrect border)
    - Auto-focus on mount
    - Handles Enter key submission
  - [x] 4.3 Create OptionButton component (`src/components/game/OptionButton.tsx`)
    - Large clickable option for multiple choice
    - Letter prefix (a, b, c)
    - Correct/incorrect state styling after selection
    - Disabled after selection made
  - [x] 4.4 Create FeedbackMessage component (`src/components/game/FeedbackMessage.tsx`)
    - Success variant: green with checkmark, "Odlicno!" type messages
    - Error variant: orange with retry prompt
    - Show correct answer variant
    - Animated entrance (fade in or slide)
    - Emoji support for emotional feedback
  - [x] 4.5 Create ScoreDisplay component (`src/components/game/ScoreDisplay.tsx`)
    - Current round score (X/10)
    - Points earned this round
    - Animated point addition

**Acceptance Criteria:**
- Components integrate with game hooks
- Proper state management for selection/feedback
- Animations are subtle and child-friendly
- Slovenian text used throughout

---

### Custom Hooks

#### Task Group 5: State Management Hooks
**Assigned implementer:** frontend-engineer
**Dependencies:** Task Groups 1, 2
**Effort:** L

- [x] 5.0 Complete custom hooks implementation
  - [x] 5.1 Create useSpeech hook (`src/hooks/useSpeech.ts`)
    - Check for speechSynthesis support
    - Handle voiceschanged event for async voice loading
    - Find English voice (lang.startsWith('en'))
    - speak(text) function with rate=0.85 for clarity
    - speaking boolean state
    - supported boolean state
    - Cancel ongoing speech before new speech
  - [x] 5.2 Create useProgress hook (`src/hooks/useProgress.ts`)
    - Load progress from localStorage on mount
    - Save progress to localStorage on changes
    - Initialize default progress if none exists
    - addPoints(points) function
    - recordWordAttempt(wordId, correct) function
    - incrementRoundsPlayed() function
    - checkAndAwardBadges() function returning newly earned badges
    - Track streak for "Hot Hand" badge
    - Track daily play for "Daily Habit" badge
    - Handle localStorage not available gracefully
  - [x] 5.3 Create useGameState hook (`src/hooks/useGameState.ts`)
    - currentMode state ('listen-spell' | 'pick-spelling' | null)
    - startGame(mode) initializes round with 10 random words
    - currentWord returns current word object
    - submitAnswer(answer) checks answer, updates score, advances
    - attempts tracking per word (max 2)
    - roundProgress: { current, total, score, points }
    - isRoundComplete boolean
    - endRound() resets game state
    - Track streak within round for badge
  - [x] 5.4 Create useSound hook (`src/hooks/useSound.ts`) - Optional
    - playCorrect() for success sound
    - playWrong() for error sound
    - playCelebration() for round complete
    - playBadge() for badge unlock
    - muted state with toggle
    - Use Web Audio API or preloaded audio files

**Acceptance Criteria:**
- Hooks are pure and testable
- useProgress correctly persists to localStorage
- useSpeech handles browser compatibility
- useGameState manages complete game flow
- State updates trigger proper re-renders

---

### Screen Implementations

#### Task Group 6: Home Screen
**Assigned implementer:** frontend-engineer
**Dependencies:** Task Groups 3, 4, 5
**Effort:** S

- [x] 6.0 Complete Home Screen implementation
  - [x] 6.1 Create HomeScreen component (`src/components/screens/HomeScreen.tsx`)
    - Game title "SpellBee" with bee emoji/icon
    - Two large game mode buttons:
      - "Poslusaj in crkuj" (Listen & Spell) with speaker icon
      - "Izberi pravilno" (Pick the Right Spelling) with checkmark icon
    - Stats summary section showing total points and badges count
    - Link/button to Badges screen
    - Optional settings button (sound toggle)
  - [x] 6.2 Integrate with App.tsx routing
    - Simple state-based routing (no React Router needed)
    - Screen state: 'home' | 'listen-spell' | 'pick-spelling' | 'round-complete' | 'badges'
    - Conditional rendering based on screen state
  - [x] 6.3 Apply responsive design
    - Mobile-first layout
    - Center content vertically on larger screens
    - Adjust button sizes for tablet/desktop

**Acceptance Criteria:**
- Home screen displays correctly on mobile and desktop
- Game mode buttons navigate to correct screens
- Stats reflect actual progress from useProgress
- Child-friendly, colorful appearance

---

#### Task Group 7: Listen & Spell Game Mode
**Assigned implementer:** frontend-engineer
**Dependencies:** Task Groups 4, 5, 6
**Effort:** L

- [x] 7.0 Complete Listen & Spell game mode
  - [x] 7.1 Create ListenSpellScreen component (`src/components/screens/ListenSpellScreen.tsx`)
    - Progress indicator: "Beseda X/10"
    - ListenButton for audio pronunciation
    - Slovenian hint text: "Namig: [slovenian]"
    - SpellingInput for user answer
    - "Preveri" (Check) button
    - Current round score display
  - [x] 7.2 Implement answer checking logic
    - Trim whitespace from input
    - Case-insensitive comparison
    - Handle empty submission with "Vnesi odgovor" message
    - Debounce check button to prevent rapid submissions
  - [x] 7.3 Implement feedback flow
    - Correct first try: Show success message, +10 points, auto-advance after delay
    - Wrong first try: Show encouragement, allow second attempt
    - Correct second try: Show success, +5 points, advance
    - Wrong second try: Show correct spelling, 0 points, advance
  - [x] 7.4 Implement round completion transition
    - After word 10, navigate to RoundCompleteScreen
    - Pass round stats (score, points, streak) to complete screen
    - Update progress via useProgress hook

**Acceptance Criteria:**
- Full game flow from word 1 to word 10
- Audio pronunciation works with Web Speech API
- Feedback messages display in Slovenian
- Points calculated correctly per attempt
- Round complete triggers correctly

---

#### Task Group 8: Pick the Right Spelling Game Mode
**Assigned implementer:** frontend-engineer
**Dependencies:** Task Groups 4, 5, 6, 7
**Effort:** M

- [x] 8.0 Complete Pick the Right Spelling game mode
  - [x] 8.1 Create PickSpellingScreen component (`src/components/screens/PickSpellingScreen.tsx`)
    - Progress indicator: "Beseda X/10"
    - Slovenian prompt: "Kako se crkuje '[slovenian]'?"
    - ListenButton to hear English pronunciation
    - Three OptionButton choices (correct + 2 wrong spellings)
    - Current round score display
  - [x] 8.2 Implement option randomization
    - Shuffle correct answer with wrongSpellings
    - Assign a, b, c labels after shuffle
    - Ensure correct answer position is random
  - [x] 8.3 Implement selection and feedback
    - Single selection allowed per word
    - Correct selection: Green highlight, success message, +10 points
    - Wrong first selection: Orange highlight, "Poskusi znova!"
    - Wrong second selection: Show correct, 0 points, advance
  - [x] 8.4 Connect to round completion
    - Same flow as Listen & Spell after word 10
    - Pass stats to RoundCompleteScreen

**Acceptance Criteria:**
- Three options display in random order
- Selection feedback is immediate and clear
- Maximum 2 attempts per word enforced
- Round complete triggers correctly

---

#### Task Group 9: Round Complete and Badges Screens
**Assigned implementer:** frontend-engineer
**Dependencies:** Task Groups 5, 6, 7, 8
**Effort:** M

- [x] 9.0 Complete Round Complete and Badges screens
  - [x] 9.1 Create RoundCompleteScreen component (`src/components/screens/RoundCompleteScreen.tsx`)
    - Large celebratory "Bravo!" message
    - Score display: "Dosegla si X/10"
    - Points earned this round
    - Perfect round bonus display if applicable (+20 points)
    - New badge notification with animation (if earned)
    - "Igraj znova" (Play Again) button
    - "Domov" (Home) button
  - [x] 9.2 Implement badge checking on round complete
    - Call useProgress.checkAndAwardBadges()
    - Display newly earned badges with celebration
    - Handle multiple badges earned at once
  - [x] 9.3 Create BadgesScreen component (`src/components/screens/BadgesScreen.tsx`)
    - Grid layout of all badges
    - Earned badges: Full color with icon
    - Locked badges: Grayscale with lock overlay
    - Badge names and descriptions in Slovenian
    - Back to home button
  - [x] 9.4 Implement encouraging message logic
    - Score >= 8: "Odlicno! Dosegla si X/10!"
    - Score >= 5: "Dobro! Dosegla si X/10. Se naprej tako!"
    - Score < 5: "Dosegla si X/10. Naslednjic bo se boljse!"

**Acceptance Criteria:**
- Round results display correctly
- New badges trigger celebration animation
- Badges screen shows all 7 badges with correct states
- Navigation back to home works correctly

---

### Polish and Testing

#### Task Group 10: Visual Polish and Edge Cases
**Assigned implementer:** ui-designer
**Dependencies:** Task Groups 6-9
**Effort:** M

- [x] 10.0 Complete visual polish and edge case handling
  - [x] 10.1 Add animations and transitions
    - Success answer: Subtle sparkle/confetti effect
    - Wrong answer: Gentle shake animation on input
    - Page transitions: Fade or slide between screens
    - Badge unlock: Scale up with glow effect
    - Point addition: Animated counter increment
  - [x] 10.2 Ensure responsive design across breakpoints
    - Mobile: 320px - 768px (primary target)
    - Tablet: 768px - 1024px
    - Desktop: 1024px+
    - Test on iPad dimensions specifically (mentioned in spec)
  - [x] 10.3 Handle edge cases and browser compatibility
    - Speech synthesis not supported: Show message, allow game with visual-only mode
    - Voices not loaded: Retry with timeout, use default voice
    - localStorage not available: Show warning, game still playable
    - Empty word list edge case: Should not occur with 50+ words
  - [x] 10.4 Accessibility review
    - Verify all interactive elements keyboard accessible
    - Check visible focus indicators
    - Verify color contrast (WCAG AA)
    - Add aria-labels where needed
    - Test screen reader navigation on main elements
  - [x] 10.5 Final integration testing
    - Complete full game flow in both modes
    - Verify points persist across sessions
    - Verify badges unlock correctly
    - Test on Chrome, Safari, Firefox
    - Verify no console errors during gameplay

**Acceptance Criteria:**
- Animations are smooth and child-friendly
- Game works on mobile, tablet, and desktop
- Edge cases handled gracefully with user feedback
- Meets accessibility requirements from spec
- No console errors during normal gameplay

---

#### Task Group 11: Test Review and Gap Analysis
**Assigned implementer:** testing-engineer
**Dependencies:** Task Groups 1-10
**Effort:** S

- [x] 11.0 Review and verify feature completeness
  - [x] 11.1 Create focused tests for critical paths (max 6-8 tests)
    - Test useProgress localStorage persistence
    - Test useGameState round flow (start, answer, complete)
    - Test useSpeech browser compatibility check
    - Test scoring calculation (first try, second try, bonuses)
    - Test shuffle utility randomization
  - [x] 11.2 Manual testing of core user flows
    - Complete Listen & Spell round start to finish
    - Complete Pick the Right Spelling round start to finish
    - Verify badge unlock (complete first round for "Prvi korak")
    - Verify progress persists after browser refresh
    - Verify audio pronunciation works
  - [x] 11.3 Cross-browser verification
    - Chrome: Full functionality
    - Safari: Speech API may behave differently
    - Firefox: Verify voice selection
  - [x] 11.4 Run all tests and verify passing
    - Run focused test suite
    - Verify no regressions

**Acceptance Criteria:**
- Critical user flows work end-to-end
- localStorage persistence verified
- Cross-browser compatibility confirmed
- No blocking bugs in core functionality

---

## Execution Order

### Recommended Implementation Sequence

```
Phase 1: Foundation (Task Groups 1-2)
    |
    v
Phase 2: UI Components (Task Groups 3-4)
    |
    v
Phase 3: Hooks & State (Task Group 5)
    |
    v
Phase 4: Screens - Sequential Build
    |
    +--> Task Group 6: Home Screen
    |
    +--> Task Group 7: Listen & Spell (primary mode)
    |
    +--> Task Group 8: Pick the Right Spelling
    |
    +--> Task Group 9: Round Complete & Badges
    |
    v
Phase 5: Polish & Testing (Task Groups 10-11)
```

### Dependency Graph

```
[1: Project Setup] --> [2: Game Data]
        |                   |
        v                   v
   [3: UI Components] <-----+
        |
        v
   [4: Game Components]
        |
        v
   [5: Custom Hooks] --------+
        |                    |
        v                    v
   [6: Home Screen]     [7: Listen & Spell]
        |                    |
        v                    v
   [8: Pick Spelling] <------+
        |
        v
   [9: Round Complete & Badges]
        |
        v
   [10: Polish]
        |
        v
   [11: Testing]
```

---

## Effort Estimates Summary

| Task Group | Effort | Description |
|------------|--------|-------------|
| 1. Project Setup | M | Tailwind, directories, types, utilities |
| 2. Game Data | M | 50+ words, badges, messages |
| 3. UI Components | M | 5 reusable components |
| 4. Game Components | M | 5 game-specific components |
| 5. Custom Hooks | L | 4 complex hooks with state logic |
| 6. Home Screen | S | Single screen with navigation |
| 7. Listen & Spell | L | Full game mode with feedback |
| 8. Pick Spelling | M | Multiple choice variant |
| 9. Round Complete | M | Results and badges screens |
| 10. Visual Polish | M | Animations, responsive, edge cases |
| 11. Testing | S | Focused tests and verification |

**Legend:** S = Small (1-2 hours), M = Medium (2-4 hours), L = Large (4-8 hours)

---

## Files to Create

### New Files (in order of creation)

1. `tailwind.config.js` - Tailwind configuration
2. `postcss.config.js` - PostCSS configuration
3. `src/types/index.ts` - TypeScript interfaces
4. `src/utils/shuffle.ts` - Array shuffle utility
5. `src/utils/storage.ts` - localStorage helpers
6. `src/utils/scoring.ts` - Points calculation
7. `src/data/words.ts` - Word list (50+ words)
8. `src/data/badges.ts` - Badge definitions
9. `src/data/messages.ts` - Slovenian UI text
10. `src/components/ui/Button.tsx`
11. `src/components/ui/Card.tsx`
12. `src/components/ui/Input.tsx`
13. `src/components/ui/ProgressBar.tsx`
14. `src/components/ui/Badge.tsx`
15. `src/components/game/ListenButton.tsx`
16. `src/components/game/SpellingInput.tsx`
17. `src/components/game/OptionButton.tsx`
18. `src/components/game/FeedbackMessage.tsx`
19. `src/components/game/ScoreDisplay.tsx`
20. `src/hooks/useSpeech.ts`
21. `src/hooks/useProgress.ts`
22. `src/hooks/useGameState.ts`
23. `src/hooks/useSound.ts` (optional)
24. `src/components/screens/HomeScreen.tsx`
25. `src/components/screens/ListenSpellScreen.tsx`
26. `src/components/screens/PickSpellingScreen.tsx`
27. `src/components/screens/RoundCompleteScreen.tsx`
28. `src/components/screens/BadgesScreen.tsx`

### Files to Modify

1. `src/index.css` - Add Tailwind directives
2. `src/App.tsx` - Main routing and state
3. `src/App.css` - Remove or replace with Tailwind
4. `package.json` - Add Tailwind dependencies

---

## Success Criteria Checklist

From the spec, verify these are met:

### Functional Completion
- [ ] Home screen displays with both game mode options
- [ ] "Listen & Spell" mode plays 10 words with audio, input, and feedback
- [ ] "Pick the Right Spelling" mode presents 3 options per word
- [ ] Round complete screen shows score and any new badges
- [ ] Points and badges persist across browser sessions
- [ ] All UI text displays in Slovenian

### User Experience
- [ ] Child can complete a full round without adult help
- [ ] Feedback is encouraging, never discouraging
- [ ] Buttons and text are large enough for easy interaction (44x44px minimum)
- [ ] Audio pronunciation is clear and at appropriate speed (rate: 0.85)
- [ ] Game loads in under 2 seconds

### Technical Quality
- [ ] No console errors during normal gameplay
- [ ] Game works on Chrome, Safari, and Firefox
- [ ] Responsive layout works on iPad and desktop
- [ ] localStorage correctly persists and loads progress
- [ ] All TypeScript types are properly defined

### Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader can navigate main elements
