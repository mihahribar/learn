# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EnglishGym is a React/TypeScript educational web game for elementary school students to practice English spelling and grammar. The UI is in Slovenian.

## Commands

```bash
npm run dev          # Start Vite dev server at localhost:5173
npm run build        # Type-check with tsc then build for production
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run format:check # Check formatting without writing (CI)
npm run type-check   # TypeScript type checking only
npm run type-coverage # Check type coverage (requires ≥95%)
npm run test         # Run tests once (CI mode)
npm run test:watch   # Run tests in watch mode
npm run analyze      # Build and open bundle visualizer
npm run preview      # Preview production build locally
```

Run a single test file:
```bash
npx vitest run src/hooks/useGameState.test.ts
```

## Tech Stack

- **React 19** with TypeScript
- **Vite** for dev server and builds
- **Tailwind CSS v4** for styling, with custom color palette (primary purple, accent, success, warning) defined in `tailwind.config.js`
- **Zod v4** for runtime validation of localStorage data (`utils/schemas.ts`)

## Architecture

### State Management
The app uses React Context with custom hooks for state management. Four contexts wrap the app in `App.tsx`:

- **GameProvider** (`contexts/GameContext.tsx`) - Current game mode, word progression, scoring, streaks. Uses `useGameState` hook internally.
- **ProgressProvider** (`contexts/ProgressContext.tsx`) - Persistent progress: total points, badges, word stats. Persists to localStorage.
- **SpeechProvider** (`contexts/SpeechContext.tsx`) - Web Speech API for pronunciation.
- **SoundProvider** (`contexts/SoundContext.tsx`) - Web Audio API for sound effects.

Each context has a corresponding custom hook in `hooks/` (`useGameState`, `useProgress`, `useSound`, `useSpeech`).

### Screen Navigation
Navigation is state-based (no router). `App.tsx` manages `currentScreen` state and `ScreenRouter.tsx` renders the appropriate screen component based on the `Screen` type.

### Game Modes
Four modes defined in `types/index.ts` as `GameMode`:
- `listen-spell` - Hear word, type spelling
- `pick-spelling` - Choose correct spelling from options
- `plural-forms` - Form plural of shown word
- `grammar-forms` - Fill in correct verb form

Each mode has a dedicated screen in `components/screens/`. Game screens share common logic via `BaseGameScreen.tsx`.

### Component Structure
- `components/screens/` - Full-page screens (HomeScreen, game mode screens, RoundCompleteScreen, BadgesScreen)
- `components/ui/` - Reusable UI primitives (Button, Card, Badge, Input, ProgressBar, ConfirmDialog)
- `components/game/` - Game-specific components (FeedbackMessage, ListenButton, OptionButton, ScoreDisplay, SpellingInput)

### Data Layer
- `data/words.ts` - Word list with difficulty, wrong spellings, plurals
- `data/grammarQuestions.ts` - Grammar exercises with correct/wrong answers
- `data/badges.ts` - Achievement definitions with condition functions
- `data/messages.ts` - All UI text (Slovenian)

### Utilities
- `utils/scoring.ts` - Point calculation; first-attempt correct answers earn more points
- `utils/storage.ts` - localStorage helpers with Zod-validated reads
- `utils/schemas.ts` - Zod schemas for `PersistedProgress` validation
- `utils/shuffle.ts` - Fisher-Yates shuffle for randomizing arrays

### Type System
`types/index.ts` defines the core types with discriminated unions (`GameItem`) and type guards (`isWord`, `isGrammarQuestion`) for type-safe handling of different game item types.

## Testing

Tests use Vitest with jsdom and Testing Library. Test files are colocated with source (`.test.ts` / `.test.tsx`). Setup is in `src/test/setup.ts`.

Integration tests use `.integration.test.tsx` suffix for more complex scenarios.
