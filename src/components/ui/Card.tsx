import { type HTMLAttributes, type ReactNode } from 'react';

export type CardPadding = 'sm' | 'md' | 'lg';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg';
export type CardBackground = 'white' | 'primary' | 'gray';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  shadow?: CardShadow;
  background?: CardBackground;
  children: ReactNode;
}

const paddingStyles: Record<CardPadding, string> = {
  sm: 'p-3',
  md: 'p-4 md:p-6',
  lg: 'p-6 md:p-8',
};

const shadowStyles: Record<CardShadow, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const backgroundStyles: Record<CardBackground, string> = {
  white: 'bg-white',
  primary: 'bg-primary-50',
  gray: 'bg-gray-50',
};

export function Card({
  padding = 'md',
  shadow = 'md',
  background = 'white',
  children,
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-2xl';

  const combinedClassName = [
    baseStyles,
    paddingStyles[padding],
    shadowStyles[shadow],
    backgroundStyles[background],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
}

export default Card;
