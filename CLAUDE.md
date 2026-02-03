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
npm run type-check   # TypeScript type checking only
npm run test         # Run tests once (CI mode)
npm run test:watch   # Run tests in watch mode
```

Run a single test file:
```bash
npx vitest run src/hooks/useGameState.test.ts
```

## Architecture

### State Management
The app uses React Context with custom hooks for state management. Four contexts wrap the app in `App.tsx`:

- **GameProvider** (`contexts/GameContext.tsx`) - Current game mode, word progression, scoring, streaks. Uses `useGameState` hook internally.
- **ProgressProvider** (`contexts/ProgressContext.tsx`) - Persistent progress: total points, badges, word stats. Persists to localStorage.
- **SpeechProvider** (`contexts/SpeechContext.tsx`) - Web Speech API for pronunciation.
- **SoundProvider** (`contexts/SoundContext.tsx`) - Web Audio API for sound effects.

### Screen Navigation
Navigation is state-based (no router). `App.tsx` manages `currentScreen` state and `ScreenRouter.tsx` renders the appropriate screen component based on the `Screen` type.

### Game Modes
Four modes defined in `types/index.ts` as `GameMode`:
- `listen-spell` - Hear word, type spelling
- `pick-spelling` - Choose correct spelling from options
- `plural-forms` - Form plural of shown word
- `grammar-forms` - Fill in correct verb form

Each mode has a dedicated screen in `components/screens/`.

### Data Layer
- `data/words.ts` - Word list with difficulty, wrong spellings, plurals
- `data/grammarQuestions.ts` - Grammar exercises with correct/wrong answers
- `data/badges.ts` - Achievement definitions with condition functions
- `data/messages.ts` - All UI text (Slovenian)

### Type System
`types/index.ts` defines the core types with discriminated unions (`GameItem`) and type guards (`isWord`, `isGrammarQuestion`) for type-safe handling of different game item types.

### Scoring
`utils/scoring.ts` handles point calculation. First-attempt correct answers earn more points.

## Testing

Tests use Vitest with jsdom and Testing Library. Test files are colocated with source (`.test.ts` / `.test.tsx`). Setup is in `src/test/setup.ts`.

Integration tests use `.integration.test.tsx` suffix for more complex scenarios.
