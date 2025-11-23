import { type HTMLAttributes } from 'react';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  current: number;
  total: number;
  showLabel?: boolean;
  labelPrefix?: string;
}

function getProgressColor(percentage: number): string {
  if (percentage >= 80) {
    return 'bg-success';
  }
  if (percentage >= 50) {
    return 'bg-accent-yellow';
  }
  return 'bg-primary-500';
}

export function ProgressBar({
  current,
  total,
  showLabel = true,
  labelPrefix = '',
  className = '',
  ...props
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const fillColor = getProgressColor(percentage);

  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm font-medium text-gray-700">
          <span>
            {labelPrefix}
            {current}/{total}
          </span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        className="h-3 overflow-hidden bg-gray-200 rounded-full"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${labelPrefix}${current} of ${total}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${fillColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
