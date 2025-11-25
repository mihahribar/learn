# WordGym

WordGym is an interactive web game that helps elementary school students practice spelling English words through engaging gameplay, audio pronunciation, and achievements. Built with React and TypeScript, the application features a fully Slovenian user interface.

## Key Features

- **Three Game Modes**
  - *Listen & Spell*: Uses Web Speech API to pronounce words for spelling practice
  - *Pick Spelling*: Choose the correct spelling from three options
  - *Plural Forms*: Practice forming plural versions of words
- **Points & Progress**: Each round includes 10 random words of varying difficulty. Progress tracking includes streaks, perfect rounds, and total points stored in `localStorage`
- **Badges & Achievements**: Defined in `src/data/badges.ts` with conditions like perfect rounds and consecutive days. New badges trigger special animations and sounds
- **Audio & Speech**: `useSpeech` and `useSound` hooks handle Web Speech and Web Audio APIs, with graceful fallbacks when browser APIs are unavailable
- **Accessibility & i18n**: Skip links, sr-only hints, large touch targets, and centralized messages in `src/data/messages.ts`

## Tech Stack

- React 19 + TypeScript
- Vite 7 for development server and build tooling
- Tailwind CSS 4 for component styling
- Vitest + Testing Library + jsdom for testing hooks and logic
- ESLint 9 (typescript-eslint, React Hooks) for code quality

## Prerequisites

- Node.js 20 or newer (recommended)
- npm 10 (included with Node)

## Installation & Running

```bash
npm install        # Install dependencies
npm run dev        # Start development server at http://localhost:5173
```

Vite enables HMR, so changes in `src/` will refresh automatically without manual reloading.

## Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Run `tsc -b` for type checking, then `vite build` for optimized production bundle in `dist/`
- `npm run preview` - Serve static build for final preview
- `npm run lint` - Check entire project with ESLint configuration
- `npm run test` - Run Vitest in CI mode (no watcher)
- `npm run test:watch` - Run Vitest in interactive mode with `--watch`

## Testing

Vitest is configured for jsdom environment, enabling testing of hook logic (`src/hooks/*.test.ts`). Testing Library provides helpers for DOM interactions. Recommended workflows:

```bash
npm run test          # One-time check (CI)
npm run test:watch    # Local test development
```

## Project Structure

```
learn/
├─ public/                # Static files and icons
├─ src/
│  ├─ components/         # UI components (screens, ui)
│  ├─ data/               # Word list, badges, messages
│  ├─ hooks/              # useGameState, useProgress, useSpeech, useSound
│  ├─ types/              # Game type definitions
│  ├─ utils/              # Scoring, storage, word selection
│  ├─ App.tsx             # Screen router
│  └─ main.tsx            # React entry point
├─ index.html             # Vite root document
├─ tailwind.config.js     # Theme and color palette
├─ vite.config.ts         # Development server configuration
└─ package.json
```

## Customizing Content

- **Words** - Add or update entries in `src/data/words.ts` (id, translation, difficulty, incorrect spellings). `useGameState` always selects 10 random words per round
- **Messages** - All text is in `src/data/messages.ts`; changes automatically reflect on screens
- **Badges** - Extend conditions in `src/data/badges.ts`. Each badge includes ID, name, description, icon, and `condition` function

## Storage & Browser Permissions

Progress is saved in `localStorage`. If the browser doesn't allow access (e.g., private browsing), the app degrades gracefully and displays a warning on the home screen. Web Speech and Web Audio APIs are used progressively - if unavailable, buttons and hints adjust accordingly.

## Build & Deployment

1. `npm run build` creates an optimized `dist/` directory
2. `npm run preview` locally verifies the production build
3. Deploy `dist/` contents to any static hosting (GitHub Pages, Netlify, etc.). The repo includes a `CNAME` file for GitHub Pages

## Helpful Tips

- Since the game uses audio, browsers often require a first click before Web Audio can play tones. `useSound` handles this, but encourage user interaction first
- In incognito mode or on older devices without Web Speech API, *Listen & Spell* mode will show a warning, so plan for manual word entry

Happy spelling!
