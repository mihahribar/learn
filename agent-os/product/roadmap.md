# Product Roadmap

1. [x] Word Data Structure — Create TypeScript types and initial word list data with English words, Slovenian translations, difficulty levels, and audio-ready text. Include at least 30 words across easy/medium/hard categories. `S`

2. [x] Listen & Spell Core Gameplay — Implement the primary game mode: display a Listen button, play word audio via Web Speech API, show optional Slovenian hint, accept typed input, and validate spelling with correct/incorrect feedback. `M`

3. [x] Round System & Scoring — Add round-based play (10 words per round), points calculation (more points for first-try success), running score display, and end-of-round summary screen with Slovenian encouragement message. `S`

4. [x] Pick the Right Spelling Mode — Implement the multiple-choice game mode: display Slovenian word, show 3-4 English spelling options (one correct), validate selection, and provide immediate visual/audio feedback. `M`

5. [x] Game Mode Selection — Create a home screen with game mode selection, child-friendly navigation between modes, and consistent header/footer across the app. `S`

6. [x] Progress Persistence — Implement localStorage saving for game progress including total points, words practiced, accuracy statistics, and session history. Load saved data on app start. `S`

7. [x] Badge & Achievement System — Create milestone badges (first game, 10 games, 100 correct words, perfect round, etc.), display earned badges, and show celebratory animations when unlocking new achievements. `M`

8. [x] Difficulty Selection & Word Categories — Add difficulty level picker (easy/medium/hard), filter word lists by difficulty, and show current difficulty in game UI. Track per-difficulty statistics. `S`

9. [x] Enhanced Feedback & Hints — Improve wrong-answer experience with progressive hints, show correct spelling with highlighting of tricky letters, and add encouraging Slovenian messages. Allow retry attempts before moving on. `S`

10. [x] Visual Polish & Animations — Add child-friendly animations for correct/incorrect answers, celebratory effects for achievements, smooth transitions between screens, and playful UI elements. `M`

> Notes
> - Items 1-3 form the MVP: one working game mode with scoring
> - Item 4 adds the second game mode for variety
> - Items 5-6 provide navigation and persistence
> - Items 7-10 are enhancement features for engagement and polish
> - All estimates assume existing React + TypeScript + Vite + Tailwind setup
