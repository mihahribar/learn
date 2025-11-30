# Specification: SpellBee - Bilingual Spelling Game

## Goal

Create a child-friendly web game that helps an 11-year-old Slovenian speaker (Zala) improve her English spelling through two engaging game modes: "Listen & Spell" and "Pick the Right Spelling". The game provides bilingual support (Slovenian/English), audio pronunciation, gamification elements, and persistent progress tracking.

## User Stories

- As Zala, I want to hear an English word spoken aloud so that I can practice spelling words I have heard
- As Zala, I want to see the Slovenian translation as a hint so that I understand what word I am spelling
- As Zala, I want to type my spelling attempt and get immediate feedback so that I learn from my mistakes
- As Zala, I want to choose from multiple spelling options so that I can practice recognition when learning new words
- As Zala, I want to earn points and badges so that I feel motivated to keep practicing
- As Zala, I want to see my progress saved so that I can continue where I left off
- As Zala, I want encouraging feedback in Slovenian so that I feel supported even when I make mistakes

## Core Requirements

### Functional Requirements

- Two distinct game modes: "Listen & Spell" and "Pick the Right Spelling"
- Audio pronunciation of English words using Web Speech API
- Slovenian translations displayed as hints for each word
- Points system with scoring feedback after each round
- Badge/achievement system for milestones
- Progress persistence using localStorage
- Encouraging feedback messages in Slovenian
- 10 words per round with end-of-round score summary

### Non-Functional Requirements

- Child-friendly UI with large, colorful buttons (minimum 44x44px touch targets)
- Responsive design working on tablet and desktop
- Fast loading (no backend dependencies)
- Accessible keyboard navigation
- High color contrast for readability
- Works offline once loaded (all data client-side)

## Visual Design

### Design Principles

- Bright, cheerful color palette (primary: purple/violet, accents: yellow, green, pink)
- Large, rounded buttons with clear icons
- Playful but readable typography (minimum 16px base font)
- Generous whitespace and padding
- Visual feedback animations (success sparkles, gentle error shake)
- Emoji usage for emotional feedback

### Screen Layouts

#### 1. Home Screen
- Game title "SpellBee" with bee icon/mascot
- Two large game mode buttons:
  - "Poslušaj in črkuj" (Listen & Spell) with speaker icon
  - "Izberi pravilno" (Pick the Right Spelling) with checkmark icon
- Stats summary: total points, badges earned
- Settings button (optional: sound toggle)

#### 2. Listen & Spell Game Screen
- Progress indicator: "Beseda 3/10"
- Large "Poslušaj" (Listen) button with speaker icon
- Slovenian hint text: "Namig: računalnik"
- Text input field with large font
- "Preveri" (Check) button
- Current round score display

#### 3. Pick the Right Spelling Game Screen
- Progress indicator: "Beseda 5/10"
- Slovenian word prompt: "Kako se črkuje 'zajtrk'?"
- "Poslušaj" button to hear the English word
- Three large option buttons (a, b, c) with spelling variants
- Current round score display

#### 4. Feedback States
- Correct answer: green highlight, checkmark icon, "Odlično!" message, happy sound
- Wrong answer: gentle orange highlight, hint text, "Poskusi znova!" message
- Second wrong answer: show correct spelling, move to next word

#### 5. Round Complete Screen
- Large celebratory message: "Bravo!"
- Score display: "Dosegla si 8/10"
- Points earned this round
- New badge notification (if earned)
- "Igraj znova" (Play Again) button
- "Domov" (Home) button

#### 6. Badges/Achievements Screen (accessible from home)
- Grid of badge icons (earned = color, locked = gray)
- Badge names and descriptions in Slovenian

## Data Structures

### Word Data Format

```typescript
interface Word {
  id: string;
  english: string;           // The correct English spelling
  slovenian: string;         // Slovenian translation (hint)
  difficulty: 'easy' | 'medium' | 'hard';
  wrongSpellings?: string[]; // For "Pick the Right Spelling" mode (2 wrong options)
}
```

### Word List Example

```typescript
const words: Word[] = [
  {
    id: "1",
    english: "breakfast",
    slovenian: "zajtrk",
    difficulty: "medium",
    wrongSpellings: ["brekfast", "breakfeast"]
  },
  {
    id: "2",
    english: "computer",
    slovenian: "računalnik",
    difficulty: "medium",
    wrongSpellings: ["computter", "computor"]
  },
  {
    id: "3",
    english: "beautiful",
    slovenian: "lep, čudovit",
    difficulty: "hard",
    wrongSpellings: ["beautifull", "beutiful"]
  }
  // ... minimum 50 words for variety
];
```

### Game State

```typescript
interface GameState {
  currentMode: 'listen-spell' | 'pick-spelling' | null;
  currentRound: {
    words: Word[];           // 10 words for current round
    currentIndex: number;    // 0-9
    score: number;           // correct answers this round
    attempts: number[];      // attempts per word (1 or 2)
  } | null;
}
```

### localStorage Schema

```typescript
interface PersistedProgress {
  version: 1;
  totalPoints: number;
  wordsCompleted: number;
  roundsPlayed: number;
  badges: string[];          // Array of earned badge IDs
  wordStats: {
    [wordId: string]: {
      attempts: number;
      correct: number;
      lastPlayed: string;    // ISO date
    };
  };
  lastPlayedDate: string;    // ISO date
}
```

Storage key: `spellbee_progress`

### Badge Definitions

```typescript
interface Badge {
  id: string;
  name: string;              // Slovenian name
  description: string;       // Slovenian description
  icon: string;              // Emoji or icon name
  condition: (progress: PersistedProgress) => boolean;
}

const badges: Badge[] = [
  {
    id: "first-round",
    name: "Prvi korak",
    description: "Zaključi svojo prvo igro",
    icon: "star",
    condition: (p) => p.roundsPlayed >= 1
  },
  {
    id: "ten-rounds",
    name: "Vztrajnost",
    description: "Zaključi 10 iger",
    icon: "trophy",
    condition: (p) => p.roundsPlayed >= 10
  },
  {
    id: "perfect-round",
    name: "Popolno!",
    description: "Doseži 10/10 v eni igri",
    icon: "crown",
    condition: (p) => /* tracked separately */ false
  },
  {
    id: "hundred-words",
    name: "Besedni zaklad",
    description: "Pravilno črkuj 100 besed",
    icon: "book",
    condition: (p) => p.wordsCompleted >= 100
  },
  {
    id: "streak-five",
    name: "Vroča roka",
    description: "5 pravilnih odgovorov zapored",
    icon: "fire",
    condition: (p) => /* tracked separately */ false
  }
];
```

## Technical Implementation

### Component Architecture

```
src/
├── App.tsx                    # Root component, routing logic
├── main.tsx                   # Entry point
├── index.css                  # Global styles (Tailwind base)
├── components/
│   ├── ui/
│   │   ├── Button.tsx         # Reusable button component
│   │   ├── Card.tsx           # Card container component
│   │   ├── Input.tsx          # Text input component
│   │   ├── ProgressBar.tsx    # Visual progress indicator
│   │   └── Badge.tsx          # Badge display component
│   ├── game/
│   │   ├── ListenButton.tsx   # Audio playback button
│   │   ├── SpellingInput.tsx  # Input with validation feedback
│   │   ├── OptionButton.tsx   # Multiple choice option
│   │   ├── FeedbackMessage.tsx # Success/error messages
│   │   └── ScoreDisplay.tsx   # Points and round score
│   └── screens/
│       ├── HomeScreen.tsx     # Main menu
│       ├── ListenSpellScreen.tsx
│       ├── PickSpellingScreen.tsx
│       ├── RoundCompleteScreen.tsx
│       └── BadgesScreen.tsx
├── hooks/
│   ├── useGameState.ts        # Game state management
│   ├── useProgress.ts         # localStorage persistence
│   ├── useSpeech.ts           # Web Speech API wrapper
│   └── useSound.ts            # Sound effect playback
├── data/
│   ├── words.ts               # Word list data
│   ├── badges.ts              # Badge definitions
│   └── messages.ts            # Slovenian UI text
├── utils/
│   ├── shuffle.ts             # Array shuffle utility
│   ├── storage.ts             # localStorage helpers
│   └── scoring.ts             # Points calculation
└── types/
    └── index.ts               # TypeScript interfaces
```

### State Management

Use React's built-in state management with custom hooks:

- `useGameState`: Manages current game mode, round progress, current word index
- `useProgress`: Handles localStorage read/write, badge checking, stats updates
- App-level state lifted to `App.tsx`, passed down via props (no external state library needed)

### Key Hooks

#### useGameState

```typescript
// Manages the active game session
function useGameState() {
  // Returns:
  // - currentMode: 'listen-spell' | 'pick-spelling' | null
  // - startGame(mode): Initialize new round with 10 random words
  // - submitAnswer(answer): Check answer, update score, advance
  // - currentWord: Current word object
  // - roundProgress: { current: number, total: number, score: number }
  // - roundComplete: boolean
  // - endRound(): Finalize and return to home
}
```

#### useProgress

```typescript
// Manages persistent progress
function useProgress() {
  // Returns:
  // - progress: PersistedProgress object
  // - addPoints(points): Update total points
  // - recordWordAttempt(wordId, correct): Update word stats
  // - checkAndAwardBadges(): Check conditions, award new badges
  // - earnedBadges: Badge[] (already earned)
  // - newBadge: Badge | null (just earned, for notification)
}
```

#### useSpeech

```typescript
// Web Speech API wrapper
function useSpeech() {
  // Returns:
  // - speak(text): Speak the text in English
  // - speaking: boolean (currently speaking)
  // - supported: boolean (browser supports speech)
}
```

## Audio/Speech

### Web Speech API Integration

Use the SpeechSynthesis API for text-to-speech:

```typescript
// Speech configuration
const speechConfig = {
  lang: 'en-US',        // English pronunciation
  rate: 0.85,           // Slightly slower for clarity
  pitch: 1.0,
  volume: 1.0
};
```

### Implementation Details

- Check for `window.speechSynthesis` support on mount
- Use `speechSynthesis.getVoices()` to find an English voice
- Prefer voices with `lang.startsWith('en')`, fallback to default
- Handle the `voiceschanged` event (voices load asynchronously in some browsers)
- Provide visual feedback while speaking (button state change)
- Cancel any ongoing speech before starting new speech

### Sound Effects

Simple sound effects for feedback (optional enhancement):
- Correct answer: Short cheerful chime
- Wrong answer: Gentle "try again" tone
- Round complete: Celebration sound
- Badge earned: Achievement unlock sound

Implementation options:
- Use small MP3/WAV files in `/public/sounds/`
- Or use Web Audio API to generate simple tones
- Provide mute toggle in settings

## Gamification

### Points System

| Action | Points |
|--------|--------|
| Correct on first try | 10 points |
| Correct on second try | 5 points |
| Perfect round (10/10) | 20 bonus points |
| Completing a round | 5 bonus points |

### Scoring Rules

- Maximum 2 attempts per word
- After 2 wrong attempts, show correct answer and move on (0 points for that word)
- Round score: X/10 correct words
- Points tallied at end of round

### Badge System

Badges are checked after each round completes:

| Badge | Condition | Icon |
|-------|-----------|------|
| Prvi korak (First Step) | Complete 1 round | Star |
| Vztrajnost (Persistence) | Complete 10 rounds | Trophy |
| Popolno! (Perfect!) | Get 10/10 in a round | Crown |
| Besedni zaklad (Word Treasure) | 100 words spelled correctly | Book |
| Vroča roka (Hot Hand) | 5 correct in a row (any round) | Fire |
| Mojster črkovanja (Spelling Master) | 500 words spelled correctly | Medal |
| Dnevna navada (Daily Habit) | Play 7 days in a row | Calendar |

### Feedback Messages (Slovenian)

Correct answers:
- "Odlično!"
- "Super!"
- "Pravilno!"
- "Bravo!"
- "Tako je!"

Wrong answers (encouraging):
- "Skoraj! Poskusi znova."
- "Ni čisto prav. Še enkrat!"
- "Dobro si blizu!"

After showing correct answer:
- "Pravilno se piše: [word]"
- "Zapomni si: [word]"

Round complete:
- Score >= 8: "Odlično! Dosegla si [X]/10!"
- Score >= 5: "Dobro! Dosegla si [X]/10. Še naprej tako!"
- Score < 5: "Dosegla si [X]/10. Naslednjič bo še boljše!"

## Edge Cases

### Browser Compatibility

- **Speech Synthesis not supported**: Display visual-only mode message, show phonetic spelling hint instead
- **Voices not loaded**: Retry voice loading, use default voice as fallback
- **localStorage not available**: Game still playable, but progress not saved; show warning message

### Input Handling

- Trim whitespace from user input before comparison
- Case-insensitive comparison (convert both to lowercase)
- Handle empty submissions (show "Vnesi odgovor" message)
- Prevent multiple rapid submissions (debounce check button)

### Game Flow

- Navigating away mid-round: Round progress lost, but overall stats preserved
- Closing browser mid-round: Same behavior, round not counted
- Duplicate words in round: Shuffle algorithm ensures no repeats within a round
- Not enough words: Minimum 50 words required in word list to ensure variety

### Audio Edge Cases

- User clicks Listen multiple times rapidly: Cancel previous speech, start new
- Speech interrupted by answer submission: Allow both to proceed
- Browser tab not focused: Speech may be blocked by some browsers; handle gracefully

## Reusable Components

### Existing Code to Leverage

- Base React + TypeScript + Vite setup already configured
- ESLint configuration in place

### New Components Required

All game components need to be created as this is a new application. The existing codebase is a fresh Vite scaffold.

Key shared UI components to build for reuse:
- `Button`: Configurable for size, color variants, icons
- `Card`: Container with consistent padding and rounded corners
- `Input`: Styled text input with focus states
- `ProgressBar`: Visual progress indicator

## Out of Scope

- User accounts or authentication
- Backend/API integration
- Multiplayer features
- Custom word list editing by user
- Difficulty progression algorithm (all words mixed randomly)
- Parent dashboard or analytics
- Mobile app (web only, but responsive)
- Offline-first PWA features (service workers)
- Multiple language pairs (Slovenian-English only)

## Success Criteria

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
- [ ] Buttons and text are large enough for easy interaction
- [ ] Audio pronunciation is clear and at appropriate speed
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
