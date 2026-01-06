'use client';

import { cn } from '@/lib/ui/cn';

export function SegmentedControl<T extends string>(props: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  const { value, options, onChange, ariaLabel } = props;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center rounded-full border border-(--border) bg-(--surface) p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'h-8 select-none whitespace-nowrap rounded-full px-3 text-sm font-medium transition',
              active
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-50'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
