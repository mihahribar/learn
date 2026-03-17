# Feature: Sentence Ordering

## Overview
A new "Sentence Ordering" game mode where students reconstruct English sentences by dragging scrambled words into the correct sequence. A speak button lets them hear their current arrangement at any time, reinforcing pronunciation alongside grammar and syntax.

## User Stories

### [P1] Sentence Ordering Gameplay
As a student, I want to arrange scrambled words into the correct sentence order so that I practice English sentence structure.

#### Acceptance Criteria
- Given the student selects "Sentence Ordering" from the home screen, When a round starts, Then 10 sentences are randomly selected and presented one at a time with words scrambled.
- Given a scrambled sentence is displayed, When the student drags a word to a position in the answer area, Then the word moves to that position and other words shift to accommodate.
- Given words are in the answer area, When the student drags a word to a different position, Then the arrangement updates.
- Given words are in the answer area, When the student drags a word back to the word bank, Then it returns to the pool.
- Given all words are placed, When the student submits, Then the answer is checked (case-insensitive, auto-capitalized first word, auto-appended punctuation).
- Given a correct first-attempt answer, Then 10 points. Second attempt: 5 points.
- Given 2 failed attempts, Then the correct sentence is revealed and the student advances.

#### Edge Cases
- Duplicate words: each instance is a separate tile.
- Minimum 3 words per sentence.
- Incomplete submission (words in bank): prompt to place all words.

---

### [P1] Speak Current Sentence
As a student, I want to tap a speak button to hear my current word arrangement read aloud so that I can check if it sounds right.

#### Acceptance Criteria
- Given words in the answer area, When the student taps speak, Then the arrangement is read aloud via Web Speech API.
- Given no words placed, Then the speak button is disabled.
- Given the student has submitted, When tapping speak, Then the correct sentence is read aloud.
- Given speech is playing, When tapping speak again, Then current speech stops and new is spoken.

#### Edge Cases
- Web Speech API unsupported: button hidden (matches SpeechContext).
- Partial sentences spoken as-is.

---

### [P1] Sentence Data Set
As a content author, I want ~60 age-appropriate sentences for 6th-grade non-native speakers covering varied tenses and structures.

#### Acceptance Criteria
- ≥60 sentences with unique `id`, `correctWords[]`, `endPunctuation`, `difficulty`.
- ~20 easy (SVO, 3–6 words), ~20 medium (questions/negations, 5–8 words), ~20 hard (conditionals/passive, 6–10 words).
- Punctuation stored separately in `endPunctuation` (`.`, `?`, `!`).
- All words lowercase in `correctWords`. First word auto-capitalized at display.
- Minimum 3 words per sentence, maximum 10.

#### Edge Cases
- Contractions ("don't", "isn't") are single tiles.

---

### [P2] Visual Drag Feedback
As a student, I want clear visual feedback when dragging words so the interaction feels responsive.

#### Acceptance Criteria
- Dragged tile lifts visually (shadow/scale) and follows pointer.
- Hover over drop zone shows insertion indicator (gap/highlight).
- Drop: settle animation confirms placement.
- Correct submission: success animation on sentence.
- Wrong submission: placed words shake briefly.
- Mouse and touch both supported.

#### Edge Cases
- Small screens: tiles wrap to multiple lines.
- Cancelled drag (outside drop zone): word returns with animation.

---

### [P3] Sentence-Specific Badges
As a student, I want badges for sentence-ordering achievements to stay motivated.

#### Acceptance Criteria
- First completed round → "Sentence Builder" badge.
- Perfect round (10/10 first-attempt) → "Sentence Master" badge.
- Follows existing badge pattern in `badges.ts`.

#### Edge Cases
- Badges persist, no duplicates.

---

## Key Entities
- **SentenceExercise**: `id`, `correctWords: string[]`, `endPunctuation: string`, `difficulty: Difficulty`. Used by GameContext, rendered by SentenceOrderingScreen.
- **GameMode (`'sentence-ordering'`)**: New variant in `GameMode` union. Wired through Screen, ScreenRouter, HomeScreen, useGameState.
- **WordTile**: UI state — `inBank` or `placed` with position index. Internal to SentenceOrderingScreen.

## Technical Notes
- **Stack**: React 19, TypeScript, Vite, Tailwind CSS v4, Zod v4.
- **Drag-and-drop**: Implement with native HTML5 Drag and Drop API + touch event polyfill. No external DnD library.
- **Files to create**: `data/sentenceExercises.ts`, `components/screens/SentenceOrderingScreen.tsx`.
- **Files to modify**: `types/index.ts` (GameMode, Screen, GameItem union, type guard), `hooks/useGameState.ts` (startGame filter), `components/ScreenRouter.tsx`, `components/screens/HomeScreen.tsx`, `data/messages.ts`, `data/badges.ts` (P3).
- **Existing patterns**: Follow `PickSpellingScreen` / `GrammarFormsScreen` structure. Use `BaseGameScreen` wrapper. Reuse `FeedbackMessage`, `ScoreDisplay`.
- **State management**: GameContext/useGameState handle round flow. SentenceExercise joins discriminated `GameItem` union with type guard `isSentenceExercise()`.
- **Scoring**: Reuse `utils/scoring.ts` — same points as other modes.
- **Persistence**: Extend Zod schema if tracking sentence-specific stats. `wordsCompleted` counter may need mode-aware logic.
- **Round size**: 10 items per round (existing constant).

## Success Criteria
- [x] SC-001: Student can complete a full 10-sentence round with scoring identical to other modes.
- [x] SC-002: Drag-and-drop works on desktop (mouse) and mobile (touch) without external libraries.
- [x] SC-003: Speak button reads current arrangement, disabled when empty.
- [x] SC-004: ≥60 sentences across 3 difficulty tiers, ≤10 words each, punctuation separate.
- [x] SC-005: Mode accessible from home screen, integrates with progress/badge systems.
