/**
 * Slovenian UI text and messages for the EnglishGym game
 * All user-facing text is centralized here for consistency
 */

/**
 * Messages shown when the user answers correctly
 */
export const correctMessages: string[] = [
  'Odlično!',
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
  'Ni čisto prav. Še enkrat!',
  'Čisto blizu si!',
];

/**
 * Messages shown when revealing the correct answer
 */
export const showCorrectMessages: string[] = [
  'Pravilno se piše: ',
  'Zapomni si: ',
];

/**
 * Round complete messages based on score
 */
export const roundCompleteMessages = {
  excellent: (score: number) => `Odlično! Dosegla si ${score}/10!`,
  good: (score: number) => `Dobro! Dosegla si ${score}/10. Še naprej tako!`,
  encouragement: (score: number) =>
    `Dosegla si ${score}/10. Naslednjič bo še boljše!`,
};

/**
 * UI labels for buttons, headers, and prompts
 */
export const labels = {
  // App title
  appTitle: 'EnglishGym',

  // Home screen
  homeSubtitle: 'Zabavni načini učenja angleščine!',
  listenSpellButton: 'Poslušaj in črkuj',
  pickSpellingButton: 'Izberi pravilno',
  pluralFormsButton: 'Množina',
  grammarFormsButton: 'Dopolni stavke',
  badgesButton: 'Značke',
  totalPoints: 'Skupne točke',
  badgesEarned: 'Značke',

  // Game screen
  wordProgress: (current: number, total: number) => `Beseda ${current}/${total}`,
  sentenceProgress: (current: number, total: number) => `Stavek ${current}/${total}`,
  listenButton: 'Poslušaj',
  hintLabel: 'Namig',
  checkButton: 'Preveri',
  nextButton: 'Naprej',
  spellingPrompt: (word: string) => `Kako se črkuje "${word}"?`,
  pluralPrompt: (singular: string, slovenian: string) =>
    `Množina besede ${singular} (${slovenian})?`,
  grammarPrompt: (sentence: string) => sentence,
  currentScore: 'Rezultat',
  points: 'točke',

  // Feedback
  emptyInputError: 'Vnesi odgovor',
  tryAgain: 'Poskusi znova!',

  // Round complete screen
  roundCompleteTitle: 'Bravo!',
  scoreDisplay: (score: number) => `Dosegla si ${score}/10`,
  pointsEarned: (points: number) => `+${points} točk`,
  perfectRoundBonus: '+20 bonus za popoln krog!',
  newBadgeEarned: 'Nova značka!',
  playAgainButton: 'Igraj znova',
  homeButton: 'Domov',

  // Badges screen
  badgesTitle: 'Moje značke',
  badgeLocked: 'Zaklenjena',
  backButton: 'Nazaj',

  // Confirmation dialog
  quitGameTitle: 'Želiš zaključiti igro?',
  quitGameMessage: 'Če se vrneš domov, boš izgubila ves napredek v tej igri.',
  cancelButton: 'Prekliči',
  confirmQuitButton: 'Zaključi igro',

  // Settings and misc
  soundOn: 'Zvok vklopljen',
  soundOff: 'Zvok izklopljen',
  speechNotSupported: 'Govor ni podprt v tem brskalniku',
  storageNotAvailable: 'Napredek se ne bo shranil',
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
