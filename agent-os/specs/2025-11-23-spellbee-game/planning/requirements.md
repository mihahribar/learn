# SpellBee Requirements

## User Request

The user wants to create a simple web game for their 11-year-old daughter to get better at English spelling. She is a non-native English speaker (Slovenian) so the game should include Slovenian translations and hints.

## Game Modes

### 1. Listen & Spell Mode ("Translate")

**Game loop (one round):**

1. The game picks a word (e.g. "computer")
2. Child sees:
   - A big "Listen" button
   - Optional Slovenian hint (e.g. "racunalnik")
3. She clicks Listen → hears the English word (text-to-speech)
4. She types the spelling in English
5. Clicks Check:
   - If correct → happy sound, green highlight, +points
   - If wrong → gentle feedback and a hint, then another try

After ~10 words per round, she gets a score screen:
"Bravo! Dosegla si 7/10."

### 2. Pick the Right Spelling Mode

Good for building confidence when words are new.

**Example:**
- Prompt: "Izberi pravilno crkovanje za 'zajtrk'." (Choose the correct spelling for 'breakfast')
- Options:
  - a) brekfast
  - b) breakfast
  - c) breakfeast
- Child clicks an option → immediate feedback

## Key Requirements

- Bilingual support (Slovenian translations and hints)
- Audio pronunciation via Web Speech API
- Points and scoring system
- Badge/achievement system
- Encouraging feedback in Slovenian
- Child-friendly, colorful UI with large buttons
- Progress saves locally (localStorage)
- No backend required

## Target User

- 11-year-old Slovenian speaker
- Learning English as a second language
- Needs spelling practice in a fun, engaging way

## Tech Stack

- React + TypeScript + Vite (existing setup)
- Tailwind CSS for styling
- Web Speech API for audio
- localStorage for persistence
