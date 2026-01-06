'use client';

export function Badge(props: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-(--border) bg-(--surface) px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
      {props.children}
    </span>
  );
}


