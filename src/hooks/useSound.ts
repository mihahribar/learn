import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Sound effect frequencies and durations for Web Audio API
 */
const SOUND_CONFIG = {
  correct: {
    frequency: 880,
    duration: 0.15,
    type: 'sine' as OscillatorType,
    gain: 0.3,
  },
  wrong: {
    frequency: 220,
    duration: 0.2,
    type: 'sine' as OscillatorType,
    gain: 0.2,
  },
  celebration: {
    frequencies: [523.25, 659.25, 783.99, 1046.5],
    duration: 0.15,
    type: 'sine' as OscillatorType,
    gain: 0.25,
  },
  badge: {
    frequencies: [392, 523.25, 659.25],
    duration: 0.2,
    type: 'triangle' as OscillatorType,
    gain: 0.3,
  },
} as const;

/**
 * Return type for the useSound hook
 *
 * @property playCorrect - Plays a short, cheerful chime for correct answers
 * @property playWrong - Plays a gentle, low tone for wrong answers
 * @property playCelebration - Plays an ascending arpeggio for round completion
 * @property playBadge - Plays a triumphant chord for badge unlocks
 * @property muted - Current mute state (true if sounds are disabled)
 * @property toggleMute - Function to toggle mute on/off
 * @property supported - Whether Web Audio API is available in this browser
 */
interface UseSoundReturn {
  playCorrect: () => void;
  playWrong: () => void;
  playCelebration: () => void;
  playBadge: () => void;
  muted: boolean;
  toggleMute: () => void;
  supported: boolean;
}

/**
 * Custom React hook for playing game sound effects using Web Audio API
 *
 * Provides simple, cheerful sound effects for game events (correct/wrong answers,
 * celebrations, badge unlocks) using synthesized tones. Automatically handles
 * browser compatibility, muting, and AudioContext lifecycle.
 *
 * Features:
 * - Lazy AudioContext initialization (only created on first use)
 * - Automatic AudioContext resume for browsers that suspend it
 * - Graceful degradation when Web Audio API is unavailable
 * - Mute/unmute functionality
 * - No external audio files required
 *
 * @returns Object with sound playback functions and state
 *
 * @example
 * ```tsx
 * function GameScreen() {
 *   const sound = useSound()
 *
 *   const handleCorrectAnswer = () => {
 *     sound.playCorrect()
 *     // ... update score
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={sound.toggleMute}>
 *         {sound.muted ? 'Unmute' : 'Mute'}
 *       </button>
 *       {!sound.supported && (
 *         <p>Sound effects not available in this browser</p>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useSound(): UseSoundReturn {
  const [muted, setMuted] = useState(false);
  const [supported] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!(
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    );
  });
  const audioContextRef = useRef<AudioContext | null>(null);

  /**
   * Cleanup AudioContext on unmount
   */
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  /**
   * Get or create AudioContext
   */
  const getAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  /**
   * Play a single tone at specified frequency
   */
  const playTone = useCallback(
    (
      frequency: number,
      duration: number,
      type: OscillatorType,
      gain: number,
      startTime?: number
    ) => {
      if (muted || !supported) return;

      const ctx = getAudioContext();
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(gain, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const start = startTime ?? ctx.currentTime;
      oscillator.start(start);
      oscillator.stop(start + duration);
    },
    [muted, supported, getAudioContext]
  );

  /**
   * Play correct answer sound (short cheerful chime)
   */
  const playCorrect = useCallback(() => {
    const { frequency, duration, type, gain } = SOUND_CONFIG.correct;
    playTone(frequency, duration, type, gain);
  }, [playTone]);

  /**
   * Play wrong answer sound (gentle low tone)
   */
  const playWrong = useCallback(() => {
    const { frequency, duration, type, gain } = SOUND_CONFIG.wrong;
    playTone(frequency, duration, type, gain);
  }, [playTone]);

  /**
   * Play celebration sound (ascending arpeggio)
   */
  const playCelebration = useCallback(() => {
    if (muted || !supported) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    const { frequencies, duration, type, gain } = SOUND_CONFIG.celebration;

    frequencies.forEach((freq, index) => {
      const startTime = ctx.currentTime + index * duration * 0.8;
      playTone(freq, duration, type, gain, startTime);
    });
  }, [muted, supported, getAudioContext, playTone]);

  /**
   * Play badge unlock sound (triumphant chord)
   */
  const playBadge = useCallback(() => {
    if (muted || !supported) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    const { frequencies, duration, type, gain } = SOUND_CONFIG.badge;

    frequencies.forEach((freq, index) => {
      const startTime = ctx.currentTime + index * 0.1;
      playTone(freq, duration * 1.5, type, gain, startTime);
    });
  }, [muted, supported, getAudioContext, playTone]);

  /**
   * Toggle mute state
   */
  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  return {
    playCorrect,
    playWrong,
    playCelebration,
    playBadge,
    muted,
    toggleMute,
    supported,
  };
}

export default useSound;
