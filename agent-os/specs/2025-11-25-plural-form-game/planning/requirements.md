# Spec Requirements: Plural Form Game

## Initial Description
Create another game where the player needs to select the correct plural form. Add correct plural forms to all words on record and then also add a couple incorrect plural forms (for example mouse: mouses instead of mice). Keep the same simple style and remember the user is 11 years old.

## Product Context

This feature adds a third game mode to **SpellBee**, a bilingual spelling game for Slovenian-speaking children (ages 10-12) learning English. The product uses React, TypeScript, Vite, and Tailwind CSS, with Web Speech API for audio and localStorage for progress tracking. The game emphasizes encouragement-first design with no account required.

### Existing Game Modes:
1. **Listen & Spell Mode**: Hear English word, type the spelling (Speaker icon)
2. **Pick the Right Spelling Mode**: See Slovenian word, choose correct English spelling from options (Check/checkmark icon)

This new mode focuses on teaching plural forms, which are challenging for ESL learners due to irregular rules.

## Requirements Discussion

### First Round Questions

**Q1:** Should the game show both the singular form and the plural options, or just show the singular and ask for the plural?
**Answer:** Include both singular and plural forms plus wrong options (make them realistic)

**Q2:** For the singular form that's displayed, should we show it in English with the Slovenian translation in brackets? And should the plural options be in English only or also show Slovenian translations?
**Answer:** Show and say the singular form with the Slovenian word in brackets. The plural forms should NOT be translated (show English plural options).

**Q3:** How many wrong plural forms should we include per question? I'm thinking 2 wrong options + 1 correct = 3 total options (similar to the existing Pick the Right Spelling mode). Is that good?
**Answer:** 2 wrong plural forms - keep the same pattern (2 wrong + 1 correct = 3 total options)

**Q4:** What icon should represent this mode on the home screen? The other modes use speaker (Listen & Spell) and checkmark (Pick the Right Spelling) icons.
**Answer:** User doesn't know, wants a recommendation for the icon

**Q5:** Should plural forms have their own difficulty categorization (easy/medium/hard), or should we keep them all in one difficulty category since plurals are a specific grammar topic?
**Answer:** All plurals in one difficulty category (no easy/medium/hard split)

### Follow-up Questions

**Follow-up 1:** Should we use different colors/styling for correct vs incorrect answers, similar to the existing game modes?
**Answer:** [Assumed yes - maintain consistency with existing feedback patterns]

**Follow-up 2:** Should we use audio to read the singular form aloud (like Listen & Spell mode does)?
**Answer:** [Assumed yes based on "show and say the singular form"]

## Existing Code to Reference

**Similar Features Identified:**
Based on product context, the following features should be referenced:
- **Pick the Right Spelling Mode**: Very similar structure - shows a word/phrase, presents 3 options, validates selection
  - Component patterns: Option buttons, feedback display
  - Game flow: Round-based (10 words per round), scoring, immediate feedback
- **Home Screen mode selection**: Will need a new button with an icon
- **Word data structure**: Needs extension to include singular forms, correct plurals, and incorrect plural options
- **Scoring system**: Same points calculation (more points for first-try success)
- **Round completion**: Same end-of-round summary with Slovenian encouragement

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets to analyze. Design should follow existing SpellBee patterns:
- Child-friendly, colorful UI
- Large tappable buttons (44px minimum)
- High contrast
- Clear visual feedback for correct/incorrect answers
- Encouraging messages in Slovenian

## Icon Recommendation

Based on the existing pattern where:
- Listen & Spell uses a **Speaker icon** (represents audio/listening)
- Pick the Right Spelling uses a **Check icon** (represents validation/selection)

**Recommended icon for Plural Form Game**: **Layers/Stack icon** or **Multiple circles icon**

**Rationale:**
- Represents the concept of "multiple" or "more than one" (plural)
- Visually distinct from speaker and checkmark
- Simple, recognizable shape for an 11-year-old
- Available in Heroicons (the icon library already in use based on HomeScreen.tsx)

**Suggested Heroicons options:**
1. **Squares-2x2** (four squares in a grid - represents multiple items)
2. **Square-3-stack-3d** (stacked squares - represents plural/multiple)
3. **Circle-stack** (stacked circles - represents quantity)

**Recommended choice**: **Squares-2x2** - clearest visual representation of "multiple" that's age-appropriate and simple.

## Requirements Summary

### Functional Requirements

**Core Gameplay:**
- Display a singular English word with Slovenian translation in brackets
- Use Web Speech API to speak the singular English word aloud when displayed
- Present 3 English plural form options:
  - 1 correct plural form
  - 2 realistic incorrect plural forms (common mistakes like "mouses" instead of "mice")
- Allow user to select one option
- Validate selection and provide immediate visual feedback
- Award points based on accuracy (bonus for first-try success)
- Follow round-based structure: 10 words per round
- Show end-of-round summary with Slovenian encouragement message

**Data Requirements:**
- Extend word data structure to include:
  - Singular form (English)
  - Slovenian translation of singular
  - Correct plural form
  - 2 incorrect plural forms per word
- Include variety of plural types:
  - Regular plurals (+s, +es)
  - Irregular plurals (mouse/mice, child/children)
  - Words ending in y (baby/babies)
  - Words ending in f (leaf/leaves)
  - Unchanged plurals (sheep/sheep, fish/fish)
- Minimum 30 words to support multiple rounds

**UI Components:**
- Home screen button with Squares-2x2 icon (or similar "multiple items" icon)
- Game screen showing:
  - Singular word with Slovenian translation: "dog (pes)"
  - Audio button to replay singular word
  - 3 option buttons for plural choices
  - Score display
  - Progress indicator (word X of 10)
- Feedback display (correct/incorrect messages in Slovenian)
- Round completion screen with statistics

**User Flow:**
1. User selects "Plural Forms" mode from home screen
2. Game displays first singular word with translation
3. Audio automatically speaks the singular word
4. User sees 3 plural options and selects one
5. Immediate feedback: correct (green) or incorrect (red) with encouragement
6. If incorrect, allow retry (with reduced points)
7. Move to next word after correct answer or max attempts
8. After 10 words, show round summary with total points and encouragement
9. Option to play again or return to home

### Non-Functional Requirements

**Performance:**
- Preload audio for smooth playback
- Instant feedback on selection
- No lag between word transitions

**Accessibility:**
- Keyboard navigation support
- Screen reader compatibility
- Audio paired with visual text
- High contrast colors
- Large touch targets (44px minimum)

**Child-Friendly Design:**
- Encouraging, positive feedback (never punishing)
- Colorful, playful interface
- Clear, large typography
- Simple, age-appropriate vocabulary
- Slovenian encouragement messages

**Consistency:**
- Match existing game modes' visual style
- Use same scoring algorithm
- Follow same round structure (10 words)
- Same sound effects and feedback patterns
- Consistent button styles and animations

### Reusability Opportunities

**Components to Reuse:**
- Button component (from existing UI components)
- Card component
- OptionButton component (from Pick the Right Spelling mode)
- FeedbackMessage component
- ScoreDisplay component
- RoundCompleteScreen (with minor text changes)
- Badge and achievement system (existing)

**Backend/Logic to Reference:**
- Scoring utility functions (utils/scoring.ts)
- Shuffle utility (utils/shuffle.ts)
- Local storage utilities (utils/storage.ts)
- Game state management patterns from Pick the Right Spelling mode
- Audio playback logic from Listen & Spell mode

**Similar Features to Model After:**
- Pick the Right Spelling mode structure (most similar)
- Home screen mode selection pattern
- Round-based gameplay flow

### Scope Boundaries

**In Scope:**
- New game mode: Plural Form selection
- Extend word data structure with plural forms
- Add mode button to home screen with new icon
- Implement 3-option selection interface
- Audio pronunciation of singular form
- Scoring and round completion
- Progress tracking (localStorage)
- Achievement/badge eligibility for new mode

**Out of Scope:**
- Difficulty levels for plurals (all in one category)
- Explaining plural rules (just practice)
- Typing plural forms (only selection)
- Possessive forms (only plurals)
- Irregular verb forms (only noun plurals)
- Translation of plural options to Slovenian
- New badge types (use existing achievement system)
- Changes to existing Listen & Spell or Pick the Right Spelling modes

### Technical Considerations

**Integration Points:**
- Home screen: Add new mode button with icon
- Types file: Extend GameMode type to include 'plural-forms'
- Word data: Add plural fields to Word interface
- Routing: Add plural-forms mode to game navigation
- Storage: Track stats for plural-forms mode separately

**Technology Stack:**
- React functional components with hooks
- TypeScript (strict mode)
- Tailwind CSS for styling
- Web Speech API for audio
- localStorage for progress
- Same project structure as existing modes

**Similar Code Patterns:**
- Follow existing component structure in src/components/
- Use same state management approach (useState/Context API)
- Match naming conventions from existing modes
- Follow existing file organization patterns

**Browser Compatibility:**
- Modern evergreen browsers
- Requires Web Speech API support (same as Listen & Spell)
- Requires localStorage (same as other modes)

### Age Appropriateness (11-year-old user)

**Keep Simple:**
- Clear instructions in Slovenian
- Obvious visual feedback
- No complex rules or time pressure
- Encouraging tone for all feedback
- Simple, familiar vocabulary
- Large, easy-to-tap buttons

**Educational Value:**
- Reinforces irregular plural patterns through practice
- Realistic wrong options teach common mistakes to avoid
- Repetition builds confidence
- Immediate feedback supports learning

## Notes for Spec Writer

1. The new mode should be named "plural-forms" (kebab-case) for consistency
2. Icon recommendation: Squares-2x2 from Heroicons (represents "multiple")
3. Model the implementation closely after Pick the Right Spelling mode
4. Maintain all existing visual and interaction patterns
5. Ensure Slovenian translations for all new UI text
6. No need to create new achievement types - plural-forms games should count toward existing badges
7. Consider DRY principle - extract shared logic between Pick the Right Spelling and Plural Forms if implementing both uses similar patterns
