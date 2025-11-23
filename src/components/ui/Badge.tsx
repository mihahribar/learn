import { type HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

const iconMap: Record<string, string> = {
  star: '\u2B50',
  trophy: '\uD83C\uDFC6',
  crown: '\uD83D\uDC51',
  book: '\uD83D\uDCDA',
  fire: '\uD83D\uDD25',
  medal: '\uD83C\uDFC5',
  calendar: '\uD83D\uDCC5',
  lock: '\uD83D\uDD12',
};

export function Badge({
  name,
  description,
  icon,
  earned,
  className = '',
  ...props
}: BadgeProps) {
  const displayIcon = earned ? iconMap[icon] || icon : iconMap.lock;

  const baseStyles =
    'flex flex-col items-center p-4 rounded-2xl text-center transition-all duration-300';

  const earnedStyles = earned
    ? 'bg-primary-50 hover:bg-primary-100 hover:scale-105 cursor-default'
    : 'bg-gray-100 grayscale opacity-60';

  const combinedClassName = [baseStyles, earnedStyles, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={combinedClassName} {...props}>
      <span
        className="text-4xl mb-3"
        role="img"
        aria-label={earned ? icon : 'locked'}
      >
        {displayIcon}
      </span>
      <h3 className="font-bold text-base text-gray-800 mb-1">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

export default Badge;
