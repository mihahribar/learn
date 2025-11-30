import { forwardRef, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { Input, type InputState } from '../ui/Input';
import type { FeedbackType } from '../../types';

export interface SpellingInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  feedbackType: FeedbackType;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

function feedbackToInputState(feedback: FeedbackType): InputState {
  switch (feedback) {
    case 'correct':
      return 'success';
    case 'wrong':
    case 'show-answer':
      return 'error';
    default:
      return 'default';
  }
}

export const SpellingInput = forwardRef<HTMLInputElement, SpellingInputProps>(
  function SpellingInput(
    {
      value,
      onChange,
      onSubmit,
      feedbackType,
      disabled = false,
      placeholder = '',
      autoFocus = true,
    },
    forwardedRef
  ) {
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (forwardedRef as React.RefObject<HTMLInputElement>) || internalRef;
    const containerRef = useRef<HTMLDivElement>(null);
    const prevFeedbackRef = useRef<FeedbackType>(null);

    useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus, inputRef]);

    // Trigger animations via DOM manipulation to avoid lint warning
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // Only trigger animations on state transitions
      if (feedbackType !== prevFeedbackRef.current) {
        if (feedbackType === 'wrong') {
          container.classList.add('animate-shake');
          const timer = setTimeout(() => {
            container.classList.remove('animate-shake');
          }, 500);
          return () => {
            clearTimeout(timer);
            container.classList.remove('animate-shake');
          };
        }

        if (feedbackType === 'correct') {
          container.classList.add('animate-success-pulse');
          const timer = setTimeout(() => {
            container.classList.remove('animate-success-pulse');
          }, 600);
          return () => {
            clearTimeout(timer);
            container.classList.remove('animate-success-pulse');
          };
        }
      }

      prevFeedbackRef.current = feedbackType;
    }, [feedbackType]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && !disabled) {
        event.preventDefault();
        onSubmit();
      }
    };

    const inputState = feedbackToInputState(feedbackType);

    return (
      <div ref={containerRef} className="w-full max-w-md mx-auto">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          state={inputState}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="text-center text-xl font-medium"
          aria-label="Vpisi crkovano besedo"
        />
      </div>
    );
  }
);

export default SpellingInput;
