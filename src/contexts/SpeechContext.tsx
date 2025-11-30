import { createContext, useContext, ReactNode } from 'react';
import { useSpeech } from '../hooks/useSpeech';

/**
 * Speech context value type
 */
interface SpeechContextValue {
  speak: (text: string) => void;
  speaking: boolean;
  supported: boolean;
}

const SpeechContext = createContext<SpeechContextValue | undefined>(undefined);

/**
 * Provider component that wraps the speech synthesis logic
 */
export function SpeechProvider({ children }: { children: ReactNode }) {
  const speechState = useSpeech();

  return <SpeechContext.Provider value={speechState}>{children}</SpeechContext.Provider>;
}

/**
 * Hook to access speech context
 * Throws an error if used outside SpeechProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useSpeechContext(): SpeechContextValue {
  const context = useContext(SpeechContext);
  if (context === undefined) {
    throw new Error('useSpeechContext must be used within a SpeechProvider');
  }
  return context;
}
