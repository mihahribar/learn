import { type ButtonHTMLAttributes } from 'react';
import { labels } from '../../data/messages';

export interface ListenButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  speaking?: boolean;
  supported?: boolean;
  onListen: () => void;
}

const SpeakerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
    aria-hidden="true"
  >
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
  </svg>
);

export function ListenButton({
  speaking = false,
  supported = true,
  onListen,
  disabled,
  className = '',
  ...props
}: ListenButtonProps) {
  const isDisabled = disabled || !supported;

  const baseStyles =
    'inline-flex flex-col items-center justify-center gap-2 ' +
    'px-6 py-4 min-h-[72px] min-w-[120px] ' +
    'font-semibold text-lg rounded-2xl ' +
    'transition-all duration-200 ease-in-out ' +
    'focus:outline-none focus:ring-4 focus:ring-offset-2';

  const enabledStyles =
    'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 ' +
    'text-white focus:ring-primary-400';

  const disabledStyles = 'bg-gray-300 text-gray-500 cursor-not-allowed';

  const speakingStyles = speaking ? 'animate-pulse ring-4 ring-primary-300 ring-offset-2' : '';

  const combinedClassName = [
    baseStyles,
    isDisabled ? disabledStyles : enabledStyles,
    speakingStyles,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (!isDisabled) {
      onListen();
    }
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={combinedClassName}
      aria-label={labels.listenButton}
      aria-busy={speaking}
      title={!supported ? labels.speechNotSupported : undefined}
      {...props}
    >
      <SpeakerIcon />
      <span>{labels.listenButton}</span>
    </button>
  );
}

export default ListenButton;
