import { type ButtonHTMLAttributes, useRef, useEffect } from 'react';

export type OptionState = 'default' | 'correct' | 'incorrect' | 'disabled';

export interface OptionButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  prefix: string;
  state?: OptionState;
  onSelect: () => void;
}

const stateStyles: Record<OptionState, string> = {
  default:
    'bg-white border-gray-300 text-gray-800 ' +
    'hover:bg-primary-50 hover:border-primary-400 ' +
    'active:bg-primary-100',
  correct:
    'bg-success-light border-success text-success-dark ' +
    'cursor-default',
  incorrect:
    'bg-warning-light border-warning text-warning-dark ' +
    'cursor-default',
  disabled:
    'bg-gray-100 border-gray-200 text-gray-400 ' +
    'cursor-not-allowed',
};

export function OptionButton({
  label,
  prefix,
  state = 'default',
  onSelect,
  disabled,
  className = '',
  ...props
}: OptionButtonProps) {
  const isInteractive = state === 'default' && !disabled;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prevStateRef = useRef<OptionState>(state);

  // Trigger shake animation via DOM manipulation to avoid lint warning
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Only shake when transitioning to incorrect state
    if (state === 'incorrect' && prevStateRef.current !== 'incorrect') {
      button.classList.add('animate-option-shake');
      const timer = setTimeout(() => {
        button.classList.remove('animate-option-shake');
      }, 400);
      return () => {
        clearTimeout(timer);
        button.classList.remove('animate-option-shake');
      };
    }

    prevStateRef.current = state;
  }, [state]);

  const baseStyles =
    'flex items-center gap-4 w-full ' +
    'px-4 py-4 min-h-touch ' +
    'text-left text-lg font-medium ' +
    'border-2 rounded-xl ' +
    'transition-all duration-200 ' +
    'focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-primary-400';

  const combinedClassName = [
    baseStyles,
    stateStyles[state],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (isInteractive) {
      onSelect();
    }
  };

  const stateIcon = () => {
    if (state === 'correct') {
      return (
        <span
          className="text-success text-xl animate-bounce-in"
          aria-hidden="true"
        >
          {'\u2714'}
        </span>
      );
    }
    if (state === 'incorrect') {
      return (
        <span
          className="text-warning text-xl"
          aria-hidden="true"
        >
          {'\u2718'}
        </span>
      );
    }
    return null;
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={!isInteractive}
      onClick={handleClick}
      className={combinedClassName}
      aria-pressed={state === 'correct' || state === 'incorrect'}
      aria-label={`Moznost ${prefix}: ${label}`}
      {...props}
    >
      <span
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold"
        aria-hidden="true"
      >
        {prefix}
      </span>
      <span className="flex-grow">{label}</span>
      {stateIcon()}
    </button>
  );
}

export default OptionButton;
