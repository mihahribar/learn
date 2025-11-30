# Tech Stack

## Framework & Runtime

- **Application Framework:** React 18+ with Vite
- **Language:** TypeScript (strict mode)
- **Package Manager:** npm

## Frontend

- **JavaScript Framework:** React with functional components and hooks
- **CSS Framework:** Tailwind CSS
- **UI Components:** Custom components (child-friendly, colorful design)
- **Routing:** React Router (if needed for navigation between modes)

## Audio & Speech

- **Text-to-Speech:** Web Speech API (SpeechSynthesis)
  - Native browser API, no external dependencies
  - English voice selection for accurate pronunciation
  - Fallback handling for unsupported browsers

## Data & Storage

- **Database:** None (fully client-side application)
- **Local Storage:** Browser localStorage API
  - Player progress and statistics
  - Earned badges and achievements
  - Session history
- **Word Data:** Static TypeScript/JSON files
  - Curated word lists with Slovenian translations
  - Difficulty categorization (easy, medium, hard)

## Testing & Quality

- **Test Framework:** Vitest (Vite-native, Jest-compatible)
- **Linting:** ESLint with TypeScript rules
- **Formatting:** Prettier (integrated with ESLint)

## Deployment & Hosting

- **Build Tool:** Vite
- **Hosting:** Static hosting (Vercel, Netlify, or GitHub Pages)
- **CI/CD:** GitHub Actions (optional, for automated deploys)

## Design Considerations

### Child-Friendly UI Requirements
- Large, tappable buttons (minimum 44px touch targets)
- High contrast, colorful palette
- Playful but readable typography
- Clear visual feedback for all interactions
- Encouraging, positive messaging in Slovenian and English

### Accessibility
- Keyboard navigation support
- Screen reader compatibility for text elements
- Audio cues paired with visual feedback
- No time pressure on spelling input

### Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Web Speech API support required for Listen & Spell mode
- localStorage required for progress saving

## Architecture Notes

### State Management
- React useState/useReducer for component state
- Context API for shared game state (scores, progress)
- No external state library needed for this scope

### File Structure
```
src/
  components/     # Reusable UI components
  pages/          # Game mode screens and navigation
  data/           # Word lists and translations
  hooks/          # Custom hooks (useAudio, useLocalStorage, etc.)
  utils/          # Helper functions (scoring, validation)
  types/          # TypeScript type definitions
```

### Performance
- Lazy loading for game modes (code splitting)
- Preload audio for smoother playback
- Minimal bundle size (no heavy dependencies)
