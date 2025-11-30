import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Speech configuration for English pronunciation
 */
const SPEECH_CONFIG = {
  lang: 'en-US',
  rate: 0.85,
  pitch: 1.0,
  volume: 1.0,
} as const;

/**
 * Voice loading retry configuration
 */
const VOICE_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelayMs: 500,
  timeoutMs: 5000,
} as const;

/**
 * Return type for the useSpeech hook
 */
interface UseSpeechReturn {
  speak: (text: string) => void;
  speaking: boolean;
  supported: boolean;
  voiceLoaded: boolean;
}

/**
 * Custom hook for Web Speech API text-to-speech
 * Provides English pronunciation for spelling words
 * Includes retry logic for voice loading in case voices load asynchronously
 */
export function useSpeech(): UseSpeechReturn {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voiceLoaded, setVoiceLoaded] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Find an English voice from the available voices
   * Prefers US English, then any English variant
   */
  const findEnglishVoice = useCallback(
    (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
      // First, try to find US English voice
      const usEnglishVoice = voices.find((v) => v.lang === 'en-US');
      if (usEnglishVoice) return usEnglishVoice;

      // Fall back to any English voice
      const englishVoice = voices.find((v) => v.lang.startsWith('en'));
      if (englishVoice) return englishVoice;

      // Return null if no English voice found
      return null;
    },
    []
  );

  /**
   * Load voices with retry mechanism
   */
  const loadVoicesWithRetry = useCallback(
    function retry() {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        return;
      }

      const voices = window.speechSynthesis.getVoices();

      if (voices.length > 0) {
        const englishVoice = findEnglishVoice(voices);
        setVoice(englishVoice);
        setVoiceLoaded(true);
        retryCountRef.current = 0;
      } else if (retryCountRef.current < VOICE_RETRY_CONFIG.maxRetries) {
        // Retry after delay if voices not yet loaded
        retryCountRef.current += 1;
        retryTimeoutRef.current = setTimeout(
          retry,
          VOICE_RETRY_CONFIG.retryDelayMs * retryCountRef.current
        );
      } else {
        // Max retries reached - mark as loaded but without specific voice
        // The speech synthesis will use the browser's default voice
        setVoiceLoaded(true);
      }
    },
    [findEnglishVoice]
  );

  /**
   * Initialize voices - handles async voice loading in some browsers
   */
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }

    setSupported(true);

    // Set up a timeout for voice loading
    const loadingTimeout = setTimeout(() => {
      if (!voiceLoaded) {
        // Even if voice not loaded, allow speech with default voice
        setVoiceLoaded(true);
      }
    }, VOICE_RETRY_CONFIG.timeoutMs);

    // Initial voice loading attempt
    loadVoicesWithRetry();

    // Listen for voiceschanged event (fires in Chrome/Edge when voices load)
    const handleVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const englishVoice = findEnglishVoice(voices);
        setVoice(englishVoice);
        setVoiceLoaded(true);
      }
    };

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      clearTimeout(loadingTimeout);
    };
  }, [findEnglishVoice, loadVoicesWithRetry, voiceLoaded]);

  /**
   * Speak the provided text using speech synthesis
   * Cancels any ongoing speech before starting new speech
   */
  const speak = useCallback(
    (text: string) => {
      if (!supported || typeof window === 'undefined') {
        return;
      }

      // Cancel any ongoing speech to prevent overlap
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = SPEECH_CONFIG.lang;
      utterance.rate = SPEECH_CONFIG.rate;
      utterance.pitch = SPEECH_CONFIG.pitch;
      utterance.volume = SPEECH_CONFIG.volume;

      // Apply voice if one was found
      if (voice) {
        utterance.voice = voice;
      }

      // Event handlers
      utterance.onstart = () => {
        setSpeaking(true);
      };

      utterance.onend = () => {
        setSpeaking(false);
      };

      utterance.onerror = (event) => {
        setSpeaking(false);
        // Only log non-canceled errors in development via Vite's import.meta.env
        if (import.meta.env.DEV && event.error !== 'canceled') {
          console.warn('Speech synthesis error:', event.error);
        }
      };

      utteranceRef.current = utterance;

      // Workaround for Chrome bug where speech synthesis stops working after ~15 seconds
      // Force a resume to ensure speech synthesis is active
      window.speechSynthesis.resume();

      window.speechSynthesis.speak(utterance);
    },
    [supported, voice]
  );

  return {
    speak,
    speaking,
    supported,
    voiceLoaded,
  };
}

export default useSpeech;
