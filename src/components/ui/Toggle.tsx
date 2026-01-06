'use client';

import { cn } from '@/lib/ui/cn';

export function Toggle(props: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  const { checked, onChange, label } = props;

  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-3 rounded-full border border-(--border) bg-(--surface) px-3 py-2 text-sm text-neutral-700 transition hover:bg-white/80 dark:text-neutral-200 dark:hover:bg-neutral-900/70"
    >
      <span
        className={cn(
          'relative inline-flex h-5 w-9 flex-none items-center rounded-full transition',
          checked ? 'bg-neutral-900 dark:bg-neutral-200' : 'bg-neutral-300 dark:bg-neutral-700'
        )}
      >
        <span
          className={cn(
            'h-4 w-4 rounded-full shadow-sm ring-1 ring-black/10 transition dark:ring-white/15',
            checked ? 'translate-x-4 bg-white dark:bg-neutral-900' : 'translate-x-0.5 bg-white dark:bg-neutral-50'
          )}
        />
      </span>
      <span className="text-left">{label}</span>
    </button>
  );
}


