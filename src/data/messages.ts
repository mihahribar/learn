/**
 * Slovenian UI text and messages for the SpellBee game
 * All user-facing text is centralized here for consistency
 */

/**
 * Messages shown when the user answers correctly
 */
export const correctMessages: string[] = [
  'Odlicno!',
  'Super!',
  'Pravilno!',
  'Bravo!',
  'Tako je!',
];

/**
 * Messages shown when the user answers incorrectly (first attempt)
 */
export const wrongMessages: string[] = [
  'Skoraj! Poskusi znova.',
  'Ni cisto prav. Se enkrat!',
  'Dobro si blizu!',
];

/**
 * Messages shown when revealing the correct answer
 */
export const showCorrectMessages: string[] = [
  'Pravilno se pise: ',
  'Zapomni si: ',
];

/**
 * Round complete messages based on score
 */
export const roundCompleteMessages = {
  excellent: (score: number) => `Odlicno! Dosegla si ${score}/10!`,
  good: (score: number) => `Dobro! Dosegla si ${score}/10. Se naprej tako!`,
  encouragement: (score: number) =>
    `Dosegla si ${score}/10. Naslednjic bo se boljse!`,
};

/**
 * UI labels for buttons, headers, and prompts
 */
export const labels = {
  // App title
  appTitle: 'SpellBee',

  // Home screen
  homeSubtitle: 'Ucimo se crkovati angleske besede!',
  listenSpellButton: 'Poslusaj in crkuj',
  pickSpellingButton: 'Izberi pravilno',
  badgesButton: 'Znacke',
  totalPoints: 'Skupne tocke',
  badgesEarned: 'Znacke',

  // Game screen
  wordProgress: (current: number, total: number) => `Beseda ${current}/${total}`,
  listenButton: 'Poslusaj',
  hintLabel: 'Namig',
  checkButton: 'Preveri',
  nextButton: 'Naprej',
  spellingPrompt: (word: string) => `Kako se crkuje "${word}"?`,
  currentScore: 'Rezultat',
  points: 'tocke',

  // Feedback
  emptyInputError: 'Vnesi odgovor',
  tryAgain: 'Poskusi znova!',

  // Round complete screen
  roundCompleteTitle: 'Bravo!',
  scoreDisplay: (score: number) => `Dosegla si ${score}/10`,
  pointsEarned: (points: number) => `+${points} tock`,
  perfectRoundBonus: '+20 bonus za popoln krog!',
  newBadgeEarned: 'Nova znacka!',
  playAgainButton: 'Igraj znova',
  homeButton: 'Domov',

  // Badges screen
  badgesTitle: 'Moje znacke',
  badgeLocked: 'Zaklenjena',
  backButton: 'Nazaj',

  // Settings and misc
  soundOn: 'Zvok vklopljen',
  soundOff: 'Zvok izklopljen',
  speechNotSupported: 'Govor ni podprt v tem brskalniku',
  storageNotAvailable: 'Napredek se ne bo shranil (localStorage ni na voljo)',
};

/**
 * Get a random message from an array
 */
export function getRandomMessage(messages: string[]): string {
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
}

/**
 * Get a correct answer feedback message
 */
export function getCorrectFeedback(): string {
  return getRandomMessage(correctMessages);
}

/**
 * Get a wrong answer feedback message
 */
export function getWrongFeedback(): string {
  return getRandomMessage(wrongMessages);
}

/**
 * Get a "show correct answer" message
 */
export function getShowCorrectMessage(correctWord: string): string {
  const prefix = getRandomMessage(showCorrectMessages);
  return `${prefix}${correctWord}`;
}

/**
 * Get round complete message based on score
 */
export function getRoundCompleteMessage(score: number): string {
  if (score >= 8) {
    return roundCompleteMessages.excellent(score);
  }
  if (score >= 5) {
    return roundCompleteMessages.good(score);
  }
  return roundCompleteMessages.encouragement(score);
}

export default labels;
