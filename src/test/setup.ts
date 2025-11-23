import '@testing-library/jest-dom'

/**
 * Mock localStorage for testing
 */
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: function (key: string) {
    return this.store[key] || null
  },
  setItem: function (key: string, value: string) {
    this.store[key] = value
  },
  removeItem: function (key: string) {
    delete this.store[key]
  },
  clear: function () {
    this.store = {}
  },
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

/**
 * Mock SpeechSynthesis API for testing
 */
const speechSynthesisMock = {
  speaking: false,
  pending: false,
  paused: false,
  onvoiceschanged: null as (() => void) | null,
  getVoices: () => [
    {
      voiceURI: 'English (US)',
      name: 'English (US)',
      lang: 'en-US',
      localService: true,
      default: true,
    } as SpeechSynthesisVoice,
  ],
  speak: function () {
    this.speaking = true
    setTimeout(() => {
      this.speaking = false
    }, 100)
  },
  cancel: function () {
    this.speaking = false
  },
  pause: function () {
    this.paused = true
  },
  resume: function () {
    this.paused = false
  },
  addEventListener: function (_event: string, _handler: () => void) {},
  removeEventListener: function (_event: string, _handler: () => void) {},
}

Object.defineProperty(window, 'speechSynthesis', {
  value: speechSynthesisMock,
  writable: true,
})

/**
 * Mock SpeechSynthesisUtterance
 */
class MockSpeechSynthesisUtterance {
  text: string
  lang: string = 'en-US'
  voice: SpeechSynthesisVoice | null = null
  volume: number = 1
  rate: number = 1
  pitch: number = 1
  onstart: (() => void) | null = null
  onend: (() => void) | null = null
  onerror: ((event: { error: string }) => void) | null = null

  constructor(text: string) {
    this.text = text
  }
}

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: MockSpeechSynthesisUtterance,
  writable: true,
})

/**
 * Reset mocks before each test
 */
beforeEach(() => {
  localStorageMock.clear()
  speechSynthesisMock.speaking = false
  speechSynthesisMock.paused = false
})
