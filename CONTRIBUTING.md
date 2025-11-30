# Contributing to EnglishGym

Thank you for your interest in contributing to EnglishGym! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Adding New Content](#adding-new-content)
- [Project Structure](#project-structure)

---

## Getting Started

### Prerequisites

- **Node.js** 20.10.0 or newer (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- **npm** 10.0.0 or newer (included with Node.js)
- A modern code editor (we recommend [VS Code](https://code.visualstudio.com/))

### Installation

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/learn.git
   cd learn
   ```

3. If you have `nvm` installed, use the correct Node version:
   ```bash
   nvm use
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

---

## Development Workflow

### Creating a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### Making Changes

1. Make your changes in your feature branch
2. Run tests frequently:
   ```bash
   npm run test:watch
   ```

3. Check types:
   ```bash
   npm run type-check
   ```

4. Format your code:
   ```bash
   npm run format
   ```

5. Lint your code:
   ```bash
   npm run lint
   ```

### Before Committing

Run all quality checks:

```bash
npm run type-check && npm run lint && npm run format:check && npm test && npm run build
```

All checks must pass before submitting a pull request.

---

## Code Style Guidelines

### TypeScript

- **Use strict TypeScript**: All code must pass `tsc --noEmit` with no errors
- **Avoid `any` types**: Use proper types or `unknown` when type is truly dynamic
- **Export types**: Export interfaces and types that might be used elsewhere
- **Use type inference**: Let TypeScript infer types when obvious

Example:
```typescript
// Good
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  // TypeScript infers the return type
}

// Avoid
const handleClick = (event: any) => {
  // ...
}
```

### React

- **Use functional components**: No class components
- **Use hooks**: Leverage React hooks for state and effects
- **Keep components focused**: Each component should have a single responsibility
- **Extract reusable logic**: Create custom hooks for shared logic

### Formatting

- **Use Prettier**: All code is automatically formatted with Prettier
- **Run before committing**: `npm run format`
- **Configuration**: See `.prettierrc` for settings
- **Line length**: Max 100 characters (enforced by Prettier)

### Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `HomeScreen.tsx`)
- **Hooks**: camelCase with `use` prefix (`useGameState.ts`, `useSound.ts`)
- **Utilities**: camelCase (`scoring.ts`, `storage.ts`)
- **Constants**: UPPER_SNAKE_CASE (`const MAX_ATTEMPTS = 3`)
- **Types/Interfaces**: PascalCase (`GameMode`, `PersistedProgress`)

---

## Testing Requirements

### Test Coverage

- **All new utilities must have tests**: Aim for 90%+ coverage
- **Hooks should be tested**: Use `@testing-library/react` for hook testing
- **Critical paths must be tested**: Game logic, scoring, storage

### Writing Tests

Tests are written using Vitest and Testing Library:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

describe('useGameState', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useGameState());

    expect(result.current.currentMode).toBeNull();
    expect(result.current.roundProgress.current).toBe(0);
  });
});
```

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

---

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates, etc.

### Examples

```
feat(game): add sentence building game mode

Implements a new game mode where users arrange words to form
grammatically correct sentences.

Closes #42
```

```
fix(storage): handle quota exceeded error gracefully

Previously the app would crash when localStorage was full.
Now it shows a warning message to the user.
```

```
docs(readme): update installation instructions
```

---

## Pull Request Process

### Before Submitting

1. ✅ All tests pass (`npm test`)
2. ✅ Type checking passes (`npm run type-check`)
3. ✅ Linting passes (`npm run lint`)
4. ✅ Code is formatted (`npm run format:check`)
5. ✅ Build succeeds (`npm run build`)
6. ✅ Your branch is up to date with `main`

### Creating a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a pull request on GitHub
3. Fill out the PR template completely
4. Link any related issues

### PR Title Format

Use the same format as commit messages:

```
feat(game): add sentence building mode
fix(storage): handle quota exceeded error
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Added unit tests
- [ ] Manual testing completed
- [ ] All existing tests pass

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

- PRs require at least one review before merging
- Address all review comments
- Keep PRs focused and reasonably sized
- Be responsive to feedback

---

## Adding New Content

### Adding New Words

Words are stored in `src/data/words.ts`. Each word requires:

```typescript
{
  id: "unique-id",
  english: "telephone",
  slovenian: "telefon",
  difficulty: "easy" | "medium" | "hard",
  wrongSpellings: ["telefone", "telphone"], // 2 common mistakes
  pluralForm: "telephones",  // Optional
  wrongPluralForms: ["telefones", "telephons"]  // Optional, requires pluralForm
}
```

**Guidelines:**
- IDs must be unique
- Provide accurate Slovenian translations
- Choose difficulty based on complexity and frequency
- Wrong spellings should be realistic mistakes children might make
- Include plural forms for common nouns

### Adding New Game Modes

1. **Create screen component** in `src/components/screens/`
2. **Update types** in `src/types/index.ts`:
   ```typescript
   export type GameMode = 'listen-spell' | 'pick-spelling' | 'your-new-mode';
   export type Screen = 'home' | 'listen-spell' | 'your-new-mode' | ...;
   ```
3. **Add to App.tsx router** with proper props and handlers
4. **Add tests** for the new mode
5. **Update documentation**

### Adding New Badges

Badges are defined in `src/data/badges.ts`:

```typescript
{
  id: 'unique-badge-id',
  name: 'Badge Name',
  description: 'Badge description in Slovenian',
  icon: '🏆',
  condition: (progress, roundStats) => {
    // Return true when badge should be awarded
    return progress.totalPoints >= 100;
  }
}
```

**Badge Condition Function:**
- Receives `progress` (all-time stats) and `roundStats` (current round)
- Must be pure function (no side effects)
- Should be performant (called after every round)

---

## Project Structure

```
learn/
├── .github/
│   ├── workflows/         # CI/CD workflows
│   └── dependabot.yml     # Automated dependency updates
├── public/                # Static assets
├── src/
│   ├── components/
│   │   ├── game/          # Game-specific components (ScoreDisplay, etc.)
│   │   ├── screens/       # Full-screen views (HomeScreen, etc.)
│   │   └── ui/            # Reusable UI components (Button, Card, etc.)
│   ├── data/
│   │   ├── badges.ts      # Badge definitions
│   │   ├── words.ts       # Word database
│   │   ├── grammarQuestions.ts  # Grammar questions
│   │   └── messages.ts    # UI text in Slovenian
│   ├── hooks/
│   │   ├── useGameState.ts      # Game logic and round management
│   │   ├── useProgress.ts       # Progress tracking and persistence
│   │   ├── useSound.ts          # Sound effects
│   │   └── useSpeech.ts         # Text-to-speech
│   ├── utils/
│   │   ├── scoring.ts     # Scoring calculations
│   │   ├── storage.ts     # localStorage utilities
│   │   └── shuffle.ts     # Array shuffling
│   ├── types/
│   │   └── index.ts       # TypeScript type definitions
│   ├── test/
│   │   └── setup.ts       # Test environment setup
│   ├── App.tsx            # Main app component and router
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── .nvmrc                 # Node version specification
├── .prettierrc            # Prettier configuration
├── eslint.config.js       # ESLint configuration
├── vite.config.ts         # Vite bundler configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

### File Organization Principles

- **Colocation**: Keep related files close together
- **Separation of concerns**: UI components, business logic, and data are separate
- **Flat structure**: Avoid deep nesting when possible
- **Clear naming**: File names should indicate their purpose

---

## Getting Help

- **Issues**: Check existing [issues](https://github.com/miha-co/learn/issues) or create a new one
- **Discussions**: Use [GitHub Discussions](https://github.com/miha-co/learn/discussions) for questions
- **Documentation**: See [README.md](README.md) for project overview

---

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Assume good intentions

Thank you for contributing to EnglishGym! 🎉
