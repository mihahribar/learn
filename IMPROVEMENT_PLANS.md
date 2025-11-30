# EnglishGym - Improvement Plans for Future Development

> **Last Updated:** 2025-11-28
> **Project:** EnglishGym - Bilingual English Learning Game for Slovenian Children

## Table of Contents

1. [Code Architecture & Quality](#1-code-architecture--quality)
2. [Testing & Quality Assurance](#2-testing--quality-assurance)
3. [Features & Functionality](#3-features--functionality)
4. [Performance & Optimization](#4-performance--optimization)
5. [Developer Experience](#5-developer-experience)
6. [Documentation](#6-documentation)
7. [Infrastructure & Deployment](#7-infrastructure--deployment)

---

## 1. Code Architecture & Quality

### 1.1 State Management Refactoring

**Current State:**
- Custom hooks (`useGameState`, `useProgress`) handle all state
- App.tsx has significant logic for orchestrating state
- Some duplication in state update patterns

**Improvements:**

#### Priority: HIGH
**Implement Context-based State Architecture**
- Create `GameContext` and `ProgressContext` to reduce prop drilling
- Centralize game orchestration logic currently in App.tsx
- Benefits:
  - Cleaner component interfaces
  - Easier testing of screen components
  - Better separation of concerns

**Files to Create/Modify:**
```
src/contexts/GameContext.tsx
src/contexts/ProgressContext.tsx
src/App.tsx (simplify)
```

**Implementation Strategy:**
1. Create GameContext with useGameState logic
2. Create ProgressContext with useProgress logic
3. Update screen components to use contexts
4. Remove unnecessary prop passing

#### Priority: MEDIUM
**Refactor App.tsx Screen Orchestration**
- Extract screen rendering to dedicated router component
- Reduce App.tsx from 247 lines to <100 lines
- Create `ScreenRouter` component for cleaner separation

**Benefits:**
- Improved readability
- Easier to add new screens
- Better testability

### 1.2 Type System Enhancements

**Current State:**
- Good basic TypeScript usage
- Some type guards needed (e.g., `'english' in currentWord`)
- Mixed Word/GrammarQuestion handling could be cleaner

**Improvements:**

#### Priority: MEDIUM
**Implement Discriminated Unions for Game Items**

Create proper type discrimination:
```typescript
// Current approach uses type guards
if ('english' in currentWord) { ... }

// Proposed: Use discriminated unions
type GameItem =
  | { type: 'word'; data: Word }
  | { type: 'grammar'; data: GrammarQuestion };
```

**Benefits:**
- Type-safe without runtime checks
- Better IDE autocomplete
- Clearer intent

#### Priority: LOW
**Add Zod for Runtime Validation**
- Validate localStorage data on load
- Ensure data integrity for persisted progress
- Protect against corrupted data

**Files to Modify:**
```
src/utils/storage.ts
package.json (add zod)
```

### 1.3 Component Architecture

**Current State:**
- 21 React components total
- Good separation of UI/game/screens
- Some duplication in screen components

**Improvements:**

#### Priority: HIGH
**Create Base GameScreen Component**

Extract common pattern from ListenSpellScreen, PickSpellingScreen, PluralFormsScreen:

```typescript
// Common elements:
// - ScoreDisplay
// - ProgressBar
// - Back button
// - Feedback messages
// - Sound effects
// - Answer submission logic
```

**Benefits:**
- Reduce duplication (~200-300 lines saved)
- Consistent UX across game modes
- Easier to add new game modes

**Implementation:**
```
src/components/screens/BaseGameScreen.tsx
src/components/screens/ListenSpellScreen.tsx (refactor)
src/components/screens/PickSpellingScreen.tsx (refactor)
src/components/screens/PluralFormsScreen.tsx (refactor)
```

#### Priority: MEDIUM
**Extract Layout Components**
- Create `GameLayout` for consistent header/footer
- Create `ScreenContainer` for common padding/spacing
- Ensure responsive design consistency

---

## 2. Testing & Quality Assurance

### 2.1 Test Coverage Expansion

**Current State:**
- 11 test files covering:
  - Core utilities (scoring, shuffle)
  - Hooks (useGameState, useProgress, useSpeech)
  - Some screen components
- Good foundation but gaps exist

**Improvements:**

#### Priority: HIGH
**Achieve 80%+ Test Coverage**

**Missing Coverage:**
1. **Screen Components** (Priority: HIGH)
   - HomeScreen.tsx (no tests)
   - ListenSpellScreen.tsx (no tests)
   - PickSpellingScreen.tsx (no tests)
   - RoundCompleteScreen.tsx (no tests)
   - BadgesScreen.tsx (no tests)

2. **UI Components** (Priority: MEDIUM)
   - Button.tsx (no tests)
   - Card.tsx (no tests)
   - Input.tsx (no tests)
   - Badge.tsx (no tests)
   - ConfirmDialog.tsx (no tests)

3. **Hooks** (Priority: HIGH)
   - useSound.ts (no tests)

4. **Utils** (Priority: LOW)
   - storage.ts (no tests - critical for data integrity!)

**Implementation Plan:**
```bash
# Create missing test files
src/components/screens/HomeScreen.test.tsx
src/components/screens/ListenSpellScreen.test.tsx
src/components/screens/PickSpellingScreen.test.tsx
src/components/screens/RoundCompleteScreen.test.tsx
src/components/screens/BadgesScreen.test.tsx
src/hooks/useSound.test.ts
src/utils/storage.test.ts
```

#### Priority: MEDIUM
**Add E2E Testing Framework**

**Recommendation:** Playwright

**Test Scenarios:**
1. Complete round flow (listen-spell mode)
2. Badge earning flow
3. Progress persistence
4. Mode switching
5. Error states and recovery

**Setup:**
```bash
npm install -D @playwright/test
```

**Files to Create:**
```
e2e/
  gameplay.spec.ts
  badges.spec.ts
  storage.spec.ts
  accessibility.spec.ts
playwright.config.ts
```

### 2.2 Code Quality Tools

#### Priority: HIGH
**Add Test Coverage Reporting**

```json
// vite.config.ts
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'json'],
    threshold: {
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80
    }
  }
}
```

#### Priority: MEDIUM
**Setup Continuous Integration**

Create GitHub Actions workflow:
```yaml
# .github/workflows/ci.yml
- Run tests
- Check types
- Run linter
- Generate coverage report
- Upload coverage to codecov
```

#### Priority: LOW
**Add Prettier for Formatting**

**Current:** ESLint only
**Proposed:** ESLint + Prettier

```bash
npm install -D prettier eslint-config-prettier
```

---

## 3. Features & Functionality

### 3.1 New Game Modes

#### Priority: HIGH
**Sentence Building Game**

**Description:** Arrange words to form grammatically correct English sentences

**Features:**
- Drag-and-drop word tiles
- Slovenian translation shown as hint
- Progressive difficulty (3-word → 7-word sentences)
- Grammar pattern focus (subject-verb-object, etc.)

**Implementation Size:** M (2-3 days)

**Files to Create:**
```
src/data/sentences.ts
src/components/screens/SentenceBuildingScreen.tsx
src/components/game/WordTile.tsx
```

#### Priority: MEDIUM
**Synonym/Antonym Matching**

**Description:** Match English words with their synonyms or antonyms

**Features:**
- Memory-style card matching
- Builds vocabulary breadth
- Category-based challenges (emotions, colors, actions)

**Implementation Size:** S (1-2 days)

#### Priority: LOW
**Conversation Practice**

**Description:** Fill-in-the-blank conversational English

**Features:**
- Real-world dialogue scenarios
- Common phrases and expressions
- Multiple choice or type-in answers

**Implementation Size:** M (2-3 days)

### 3.2 Enhanced Feedback & Learning

#### Priority: HIGH
**Adaptive Difficulty System**

**Current:** Random word selection from all difficulties
**Proposed:** Adapt based on user performance

**Algorithm:**
```typescript
// Track word-level accuracy
// If user struggles (< 40% accuracy): Show more easy words
// If user excels (> 80% accuracy): Show more hard words
// Target: 60-70% success rate for optimal learning
```

**Benefits:**
- Personalized learning experience
- Maintains engagement (not too hard, not too easy)
- Accelerated improvement

**Files to Modify:**
```
src/hooks/useGameState.ts
src/utils/wordSelection.ts (new)
src/types/index.ts
```

#### Priority: HIGH
**Learning Analytics Dashboard**

**Features:**
- Most challenging words
- Accuracy trends over time
- Words that need practice
- Time spent per difficulty
- Streak calendar visualization

**Implementation Size:** M (2-3 days)

**Files to Create:**
```
src/components/screens/StatsScreen.tsx
src/components/stats/AccuracyChart.tsx
src/components/stats/StreakCalendar.tsx
src/components/stats/WordList.tsx
src/utils/analytics.ts
```

#### Priority: MEDIUM
**Spaced Repetition System**

**Description:** Present previously incorrect words at optimal intervals

**Algorithm:**
- Track word difficulty per user
- Re-present failed words after: 1 day, 3 days, 7 days, 14 days
- Boost retention through optimal review timing

**Files to Modify:**
```
src/types/index.ts (add review schedule)
src/utils/spacedRepetition.ts (new)
src/hooks/useGameState.ts
```

### 3.3 Content Expansion

#### Priority: HIGH
**Expand Word Database**

**Current:** ~50 words
**Target:** 200-300 words

**Categories to Add:**
- School subjects (math, science, art)
- Daily routines (breakfast, homework, bedtime)
- Sports and hobbies
- Emotions and feelings
- Nature and animals
- Food and cooking
- Technology and modern life

**Format:**
```typescript
// Organize by themes
src/data/words/school.ts
src/data/words/daily-life.ts
src/data/words/nature.ts
// etc.
```

#### Priority: MEDIUM
**Add Audio Recordings**

**Current:** Web Speech API (synthetic)
**Proposed:** Native speaker recordings for key words

**Benefits:**
- More natural pronunciation
- Better learning experience
- Works offline

**Implementation:**
```
public/audio/
  word-1.mp3
  word-2.mp3
  ...
src/hooks/useAudio.ts (new)
```

**Fallback:** Web Speech API if audio file unavailable

#### Priority: LOW
**Grammar Question Expansion**

**Current:** ~15 grammar questions (TO BE verb)
**Target:** 100+ questions across grammar topics

**Topics:**
- Present simple/continuous
- Past simple
- Future forms
- Prepositions
- Articles (a/an/the)
- Comparatives/superlatives

### 3.4 User Experience Enhancements

#### Priority: HIGH
**Onboarding Tutorial**

**First-time User Experience:**
1. Welcome screen with mascot
2. Quick interactive demo of each game mode
3. Tips for using audio features
4. "Let's start playing!" CTA

**Implementation Size:** S (1 day)

**Files to Create:**
```
src/components/screens/OnboardingScreen.tsx
src/components/onboarding/TutorialStep.tsx
src/utils/storage.ts (track onboarding completion)
```

#### Priority: MEDIUM
**Customizable Settings**

**Features:**
- Volume control (separate for speech/sounds)
- Speech rate control (slower for beginners)
- Voice selection (different English accents)
- Color theme (light/dark/high-contrast)
- Animation speed (for accessibility)

**Files to Create:**
```
src/components/screens/SettingsScreen.tsx
src/contexts/SettingsContext.tsx
src/types/settings.ts
```

#### Priority: MEDIUM
**Streaks & Reminders**

**Features:**
- Daily play streak tracking (already implemented)
- Browser notification permission
- Daily reminder at chosen time
- Streak freeze items (1 per week)

**Implementation:**
```typescript
// Notification API
if ('Notification' in window) {
  Notification.requestPermission()
}
```

**Files to Create:**
```
src/utils/notifications.ts
src/components/settings/NotificationSettings.tsx
```

---

## 4. Performance & Optimization

### 4.1 Code Splitting & Lazy Loading

**Current State:**
- All screens loaded at initial bundle
- Bundle size: Check with `npm run build`

**Improvements:**

#### Priority: MEDIUM
**Lazy Load Screen Components**

```typescript
// App.tsx
const HomeScreen = lazy(() => import('./components/screens/HomeScreen'))
const ListenSpellScreen = lazy(() => import('./components/screens/ListenSpellScreen'))
// etc.

// Wrap in Suspense
<Suspense fallback={<LoadingScreen />}>
  {renderScreen()}
</Suspense>
```

**Expected Impact:**
- Initial load: -30-40%
- Faster first paint
- Better mobile experience

#### Priority: LOW
**Optimize Data Files**

**Current:** 1572 lines in words.ts
**Proposed:** Split by category + lazy load

```typescript
// Load only needed words
const { words } = await import(`./data/words/${category}.ts`)
```

### 4.2 Rendering Optimization

#### Priority: MEDIUM
**Memoization for Expensive Components**

**Candidates:**
- BadgesScreen (renders all badges)
- StatsScreen (if implemented)
- Word list rendering

```typescript
import { memo } from 'react'

export const BadgeCard = memo(({ badge }: Props) => {
  // component
})
```

#### Priority: LOW
**Virtual Scrolling for Long Lists**

If word count grows significantly:
```bash
npm install react-virtual
```

Use for:
- Badge list (if 50+ badges)
- Word statistics list
- History/progress lists

### 4.3 Asset Optimization

#### Priority: MEDIUM
**Image Optimization**

**Current:** No images beyond icons
**Future:** If adding illustrations/mascot

```bash
npm install -D vite-plugin-imagemin
```

**Configure:**
```typescript
// vite.config.ts
import imagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    imagemin({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: { plugins: [{ name: 'removeViewBox', active: false }] }
    })
  ]
})
```

#### Priority: LOW
**Add Service Worker for Offline Support**

**Benefits:**
- Works without internet
- Cache static assets
- Cache word data

**Implementation:**
```bash
npm install -D vite-plugin-pwa
```

---

## 5. Developer Experience

### 5.1 Development Tools

#### Priority: HIGH
**Add Component Documentation**

**Tool:** Storybook

```bash
npm install -D @storybook/react @storybook/addon-essentials
```

**Benefits:**
- Visual component testing
- Documentation for team members
- Isolation testing
- Design system reference

**Stories to Create:**
```
src/components/ui/Button.stories.tsx
src/components/ui/Card.stories.tsx
src/components/game/FeedbackMessage.stories.tsx
// etc.
```

#### Priority: MEDIUM
**Pre-commit Hooks**

```bash
npm install -D husky lint-staged
```

**Configuration:**
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

**Ensures:**
- No linting errors in commits
- Consistent formatting
- Type checking passes

#### Priority: MEDIUM
**Development Environment Setup**

**Create:**
```
.env.example
.nvmrc (Node version)
CONTRIBUTING.md
```

**Document:**
- How to set up development environment
- How to run tests
- How to add new game modes
- Code style guidelines

### 5.2 Code Quality Tools

#### Priority: HIGH
**Type Coverage Tool**

```bash
npm install -D type-coverage
```

```json
// package.json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-coverage": "type-coverage --detail"
  }
}
```

**Target:** 95%+ type coverage

#### Priority: MEDIUM
**Bundle Analysis**

```bash
npm install -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
})
```

**Use to:**
- Identify large dependencies
- Find optimization opportunities
- Track bundle size over time

---

## 6. Documentation

### 6.1 Code Documentation

#### Priority: HIGH
**Add JSDoc to All Public APIs**

**Current:** Some functions documented
**Target:** All exported functions, hooks, components

**Example:**
```typescript
/**
 * Calculates points earned based on attempt number
 *
 * @param attemptNumber - The attempt number (1-based)
 * @returns Points earned (10 for first attempt, 5 for second, 0 for third+)
 *
 * @example
 * ```typescript
 * calculateAttemptPoints(1) // Returns 10
 * calculateAttemptPoints(2) // Returns 5
 * calculateAttemptPoints(3) // Returns 0
 * ```
 */
export function calculateAttemptPoints(attemptNumber: number): number {
  // implementation
}
```

#### Priority: MEDIUM
**Architecture Decision Records (ADRs)**

**Create:** `docs/adr/`

**Document:**
- Why React + Vite + Tailwind?
- Why localStorage vs backend?
- Why Web Speech API vs audio files?
- State management approach
- Testing strategy

**Format:**
```markdown
# ADR-001: Use Web Speech API for Text-to-Speech

## Status
Accepted

## Context
Need native English pronunciation for words...

## Decision
Use browser Web Speech API...

## Consequences
Positive: No external dependencies, works offline after first load
Negative: Requires modern browser, synthetic voice...
```

### 6.2 User Documentation

#### Priority: HIGH
**Create User Guide**

**Audience:** Parents and teachers

**Sections:**
- Getting started
- Game modes explained
- Progress tracking
- Badge system
- Tips for learning
- Troubleshooting (audio not working, etc.)
- Privacy (no data collection)

**File:** `docs/USER_GUIDE.md`

#### Priority: MEDIUM
**Create FAQ**

**Common Questions:**
- Why doesn't audio work in my browser?
- How is progress saved?
- Can multiple children use the same browser?
- Is internet required?
- What age is this for?
- How do I add custom words?

**File:** `docs/FAQ.md`

### 6.3 Development Documentation

#### Priority: HIGH
**Update README.md**

**Current:** Good basic info
**Add:**
- Screenshots/GIFs of gameplay
- Link to live demo
- Contribution guidelines
- Roadmap status
- Architecture overview diagram

#### Priority: MEDIUM
**API Documentation**

**Generate from code:**
```bash
npm install -D typedoc
```

```json
// package.json
{
  "scripts": {
    "docs": "typedoc --out docs/api src"
  }
}
```

**Publishes:** API reference for hooks, utils, types

---

## 7. Infrastructure & Deployment

### 7.1 CI/CD Pipeline

#### Priority: HIGH
**GitHub Actions Workflow**

**Create:** `.github/workflows/ci.yml`

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Benefits:**
- Automated testing on every commit
- Automated deployment to GitHub Pages
- Prevents broken code from deploying

#### Priority: MEDIUM
**Dependency Updates Automation**

**Tool:** Dependabot

**Create:** `.github/dependabot.yml`

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

**Benefits:**
- Security updates automatically
- Keep dependencies current
- Reduces maintenance burden

### 7.2 Monitoring & Analytics

#### Priority: MEDIUM
**Error Tracking**

**Recommendation:** Sentry (free tier)

```bash
npm install @sentry/react
```

```typescript
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "...",
  environment: import.meta.env.MODE,
  // Only track errors in production
  enabled: import.meta.env.PROD
});
```

**Benefits:**
- Catch runtime errors
- Track browser compatibility issues
- Monitor Web Speech API failures

#### Priority: LOW
**Privacy-Friendly Analytics**

**Current:** None
**Proposed:** Plausible Analytics (GDPR-compliant)

**Track:**
- Game mode popularity
- Completion rates
- Badge unlock rates
- Browser/device usage

**Implementation:**
```html
<!-- index.html -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

**Note:** User privacy first - no personal data

### 7.3 Deployment Options

#### Priority: HIGH
**Optimize Build Configuration**

**Current:** Basic Vite config
**Improvements:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          game: ['./src/hooks/useGameState', './src/hooks/useProgress']
        }
      }
    }
  }
})
```

#### Priority: MEDIUM
**Setup Multiple Deployment Targets**

**Options:**
1. **GitHub Pages** (current) - Free, simple
2. **Vercel** - Better performance, preview deployments
3. **Netlify** - Form handling, split testing
4. **Cloudflare Pages** - Global CDN, fast

**Recommendation:** Add Vercel for preview deployments

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

## Implementation Priority Summary

### Phase 1: Foundation (Weeks 1-2)
**Focus:** Quality, testing, architecture

1. ✅ **HIGH:** Add missing test coverage (storage, screens, useSound)
2. ✅ **HIGH:** Setup CI/CD with GitHub Actions
3. ✅ **HIGH:** Add test coverage reporting
4. ✅ **HIGH:** Create BaseGameScreen component
5. ✅ **HIGH:** Implement Context-based state management

**Estimated Effort:** 3-4 developer days

### Phase 2: Learning Features (Weeks 3-4)
**Focus:** Educational improvements

1. ✅ **HIGH:** Adaptive difficulty system
2. ✅ **HIGH:** Learning analytics dashboard
3. ✅ **HIGH:** Expand word database to 200+ words
4. ✅ **HIGH:** Onboarding tutorial

**Estimated Effort:** 5-6 developer days

### Phase 3: New Content (Weeks 5-6)
**Focus:** New game modes

1. ✅ **HIGH:** Sentence building game mode
2. ✅ **MEDIUM:** Synonym/antonym matching
3. ✅ **MEDIUM:** Spaced repetition system
4. ✅ **MEDIUM:** Grammar question expansion

**Estimated Effort:** 5-7 developer days

### Phase 4: Polish & UX (Weeks 7-8)
**Focus:** User experience

1. ✅ **MEDIUM:** Customizable settings screen
2. ✅ **MEDIUM:** Streak reminders
3. ✅ **MEDIUM:** E2E testing with Playwright
4. ✅ **MEDIUM:** Add Storybook

**Estimated Effort:** 4-5 developer days

### Phase 5: Performance & Infrastructure (Weeks 9-10)
**Focus:** Optimization and monitoring

1. ✅ **MEDIUM:** Code splitting and lazy loading
2. ✅ **MEDIUM:** Error tracking (Sentry)
3. ✅ **MEDIUM:** Bundle analysis and optimization
4. ✅ **LOW:** Service worker for offline support

**Estimated Effort:** 3-4 developer days

---

## Quick Wins (Can Do Now)

These improvements are small, independent, and deliver immediate value:

1. **Add Prettier** (30 min)
   ```bash
   npm install -D prettier eslint-config-prettier
   ```

2. **Add .nvmrc** (5 min)
   ```
   20.10.0
   ```

3. **Add type-coverage script** (15 min)
   ```bash
   npm install -D type-coverage
   ```

4. **Add bundle analysis** (20 min)
   ```bash
   npm install -D rollup-plugin-visualizer
   ```

5. **Setup Dependabot** (10 min)
   Create `.github/dependabot.yml`

6. **Add more JSDoc comments** (1-2 hours)
   Document public APIs systematically

7. **Create CONTRIBUTING.md** (30 min)
   Guide for future contributors

8. **Add storage.ts tests** (1 hour)
   Critical for data integrity

9. **Create component Storybook setup** (1-2 hours)
   Visual component development

10. **Setup GitHub Actions CI** (1 hour)
    Automated testing on commits

---

## Long-Term Vision

### Year 1
- Expand to 500+ words across 20+ categories
- Add 5+ game modes
- Implement full spaced repetition system
- Mobile app (React Native port)
- Multi-language support (Croatian, Serbian)

### Year 2
- Teacher dashboard (class progress tracking)
- Parent/teacher accounts (optional)
- Custom word lists (import CSV)
- Multiplayer challenges
- Integration with school curricula

### Year 3
- AI-powered pronunciation analysis
- Conversational AI practice
- Video content integration
- Gamification expansion (levels, unlockables)
- Native mobile apps (iOS, Android)

---

## Metrics for Success

### Technical Metrics
- ✅ Test coverage: 80%+
- ✅ Type coverage: 95%+
- ✅ Build time: <30 seconds
- ✅ Bundle size: <500KB gzipped
- ✅ Lighthouse score: 95+ all categories
- ✅ Zero runtime errors in Sentry

### User Metrics (if analytics added)
- Daily active users
- Average session duration
- Game mode completion rates
- Badge unlock rates
- Return user rate (day 7, day 30)

### Educational Metrics
- Word accuracy improvement over time
- Streaks and consistency
- Difficult word identification
- Learning velocity (words/week)

---

## Notes

- **Current Codebase Quality:** Excellent foundation, well-structured
- **Main Strengths:** Good TypeScript usage, clean component architecture, comprehensive hooks
- **Main Gaps:** Test coverage, documentation, content volume
- **Overall Assessment:** Production-ready MVP with clear path for expansion

**This document should be updated quarterly as improvements are implemented.**
