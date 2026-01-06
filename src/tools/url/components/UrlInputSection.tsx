'use client';

import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Toggle } from '@/components/ui/Toggle';
import { t, type Lang } from '@/lib/i18n';
import { cn } from '@/lib/ui/cn';
import { EXAMPLE_URL } from '@/tools/url/constants';

export type UrlSortMode = 'original' | 'key';

export function UrlInputSection(props: {
  lang: Lang;
  input: string;
  onChangeInput: (value: string) => void;
  onUseExample: () => void;
  onClear: () => void;
  canClear: boolean;

  sortMode: UrlSortMode;
  onChangeSortMode: (mode: UrlSortMode) => void;

  plusAsSpace: boolean;
  onChangePlusAsSpace: (value: boolean) => void;

  showAssumedHttpsHint: boolean;
}) {
  const {
    lang,
    input,
    onChangeInput,
    onUseExample,
    onClear,
    canClear,
    sortMode,
    onChangeSortMode,
    plusAsSpace,
    onChangePlusAsSpace,
    showAssumedHttpsHint,
  } = props;

  return (
    <section className="rounded-3xl border border-(--border) bg-(--surface) p-4 shadow-sm backdrop-blur sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{t(lang, 'inputLabel')}</label>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onUseExample}
              className="h-9 rounded-full border border-(--border) bg-white/60 px-3 text-sm font-medium text-neutral-800 transition hover:bg-white dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-900"
            >
              {t(lang, 'example')}
            </button>
            <button
              type="button"
              onClick={onClear}
              disabled={!canClear}
              className={cn(
                'h-9 rounded-full border border-(--border) px-3 text-sm font-medium transition',
                canClear
                  ? 'bg-white/60 text-neutral-800 hover:bg-white dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-900'
                  : 'cursor-not-allowed bg-white/20 text-neutral-400 dark:bg-neutral-900/20 dark:text-neutral-600'
              )}
            >
              {t(lang, 'clear')}
            </button>
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => onChangeInput(e.target.value)}
          placeholder={t(lang, 'inputPlaceholder')}
          rows={3}
          className="w-full resize-y rounded-2xl border border-(--border) bg-white/70 px-4 py-3 font-mono text-sm leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white dark:bg-neutral-950/60 dark:text-neutral-50 dark:placeholder:text-neutral-600 dark:focus:border-neutral-600 dark:focus:bg-neutral-950"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedControl<UrlSortMode>
              ariaLabel={t(lang, 'sort')}
              value={sortMode}
              onChange={onChangeSortMode}
              options={[
                { value: 'original', label: t(lang, 'sortOriginal') },
                { value: 'key', label: t(lang, 'sortKey') },
              ]}
            />

            <Toggle checked={plusAsSpace} onChange={onChangePlusAsSpace} label={t(lang, 'plusAsSpace')} />
          </div>

          {showAssumedHttpsHint ? (
            <div className="text-sm text-neutral-600 dark:text-neutral-400">{t(lang, 'assumedHttps')}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function getUrlExample(): string {
  return EXAMPLE_URL;
}
