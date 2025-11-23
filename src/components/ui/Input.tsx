import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
} from 'react';

export type InputState = 'default' | 'error' | 'success';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  state?: InputState;
  helperText?: ReactNode;
}

const stateStyles: Record<InputState, string> = {
  default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-400',
  error: 'border-warning focus:border-warning-dark focus:ring-warning-light',
  success: 'border-success focus:border-success-dark focus:ring-success-light',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, state = 'default', helperText, className = '', id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const helperId = `${inputId}-helper`;

  const baseStyles =
    'w-full px-4 py-3 text-lg border-2 rounded-xl ' +
    'bg-white transition-all duration-200 ' +
    'focus:outline-none focus:ring-4 focus:ring-offset-1 ' +
    'placeholder:text-gray-400 ' +
    'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed';

  const combinedClassName = [baseStyles, stateStyles[state], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-2 text-base font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={combinedClassName}
        aria-describedby={helperText ? helperId : undefined}
        aria-invalid={state === 'error' ? 'true' : undefined}
        {...props}
      />
      {helperText && (
        <p
          id={helperId}
          className={`mt-2 text-sm ${
            state === 'error'
              ? 'text-warning-dark'
              : state === 'success'
                ? 'text-success-dark'
                : 'text-gray-600'
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
