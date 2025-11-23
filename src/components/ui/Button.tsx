import { type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning';
export type ButtonSize = 'small' | 'medium' | 'large';
export type IconPosition = 'left' | 'right';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white focus:ring-primary-400',
  secondary:
    'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800 focus:ring-gray-400',
  success:
    'bg-success hover:bg-success-dark active:bg-green-800 text-white focus:ring-success-light',
  warning:
    'bg-warning hover:bg-warning-dark active:bg-orange-800 text-white focus:ring-warning-light',
};

const sizeStyles: Record<ButtonSize, string> = {
  small: 'px-3 py-2 text-sm min-h-touch min-w-touch',
  medium: 'px-4 py-3 text-base min-h-touch min-w-touch',
  large: 'px-6 py-4 text-lg min-h-[56px] min-w-[56px]',
};

const disabledStyles = 'opacity-50 cursor-not-allowed';

export function Button({
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl ' +
    'transition-all duration-200 ease-in-out ' +
    'focus:outline-none focus:ring-4 focus:ring-offset-2';

  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabled ? disabledStyles : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      disabled={disabled}
      className={combinedClassName}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </button>
  );
}

export default Button;
