import { createContext, useContext, type ReactNode } from 'react';
import { useSound } from '../hooks/useSound';

/**
 * Sound context value type
 */
interface SoundContextValue {
  playCorrect: () => void;
  playWrong: () => void;
  playCelebration: () => void;
  playBadge: () => void;
  muted: boolean;
  toggleMute: () => void;
  supported: boolean;
}

const SoundContext = createContext<SoundContextValue | undefined>(undefined);

/**
 * Provider component that wraps the sound effects logic
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const soundState = useSound();

  return <SoundContext.Provider value={soundState}>{children}</SoundContext.Provider>;
}

/**
 * Hook to access sound context
 * Throws an error if used outside SoundProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useSoundContext(): SoundContextValue {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return context;
}
