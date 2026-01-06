'use client';

import { useAppShell } from '@/components/shell/AppShell';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { t } from '@/lib/i18n';
import { useMemo, useState } from 'react';

type ViewMode = 'pretty' | 'tree';

const EXAMPLE_JSON = `{
  "theme": "dark",
  "features": ["pkceLogin"],
  "return_url": "https://example.com/app/settings",
  "count": 3
}`;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function TreeNode(props: { name?: string; value: unknown; depth: number }) {
  const { name, value, depth } = props;

  const [open, setOpen] = useState(depth < 2);

  const isArray = Array.isArray(value);
  const isObj = isPlainObject(value);

  const label = name != null ? `${name}: ` : '';

  if (!isArray && !isObj) {
    return (
      <div className="break-all font-mono text-xs leading-relaxed">
        <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
        <span className="text-neutral-900 dark:text-neutral-50">
          {value === null ? 'null' : typeof value === 'string' ? `"${value}"` : String(value)}
        </span>
      </div>
    );
  }

  const entries = isArray ? (value as unknown[]).map((v, i) => [String(i), v] as const) : Object.entries(value as Record<string, unknown>);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-(--border) bg-white/50 px-3 py-2 text-left text-sm dark:bg-neutral-950/40"
      >
        <div className="min-w-0 break-all font-mono text-xs">
          <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
          <span className="text-neutral-900 dark:text-neutral-50">{isArray ? `Array(${entries.length})` : `Object(${entries.length})`}</span>
        </div>
        <div className="text-neutral-500 dark:text-neutral-400">{open ? '–' : '+'}</div>
      </button>

      {open ? (
        <div className="mt-2 space-y-2 pl-3">
          {entries.map(([k, v]) => (
            <TreeNode key={`${k}-${depth}`} name={k} value={v} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function JsonViewerTool() {
  const { lang, takeTransferredInput } = useAppShell();

  const [input, setInput] = useState(() => takeTransferredInput('json') ?? '');
  const [view, setView] = useState<ViewMode>('pretty');

  const parsed = useMemo(() => {
    const raw = input.trim();
    if (!raw) return { ok: true as const, value: null as unknown, pretty: '' };
    try {
      const value = JSON.parse(raw) as unknown;
      return { ok: true as const, value, pretty: JSON.stringify(value, null, 2) };
    } catch {
      return { ok: false as const, value: null as unknown, pretty: '' };
    }
  }, [input]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t(lang, 'jsonTitle')}</h1>
      </div>

      <section className="rounded-3xl border border-(--border) bg-(--surface) p-4 shadow-sm backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <label className="shrink-0 whitespace-nowrap text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {t(lang, 'jsonInputLabel')}
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setInput(EXAMPLE_JSON)}
                className="h-9 rounded-full border border-(--border) bg-white/60 px-3 text-sm font-medium text-neutral-800 transition hover:bg-white dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-900"
              >
                {t(lang, 'jsonExample')}
              </button>

              <SegmentedControl<ViewMode>
                ariaLabel="view"
                value={view}
                onChange={setView}
                options={[
                  { value: 'pretty', label: t(lang, 'jsonPretty') },
                  { value: 'tree', label: t(lang, 'jsonTree') },
                ]}
              />
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(lang, 'jsonInputPlaceholder')}
            rows={8}
            className="w-full resize-y rounded-2xl border border-(--border) bg-white/70 px-4 py-3 font-mono text-sm leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white dark:bg-neutral-950/60 dark:text-neutral-50 dark:placeholder:text-neutral-600 dark:focus:border-neutral-600 dark:focus:bg-neutral-950"
          />
        </div>
      </section>

      {!parsed.ok ? (
        <div className="rounded-3xl border border-(--border) bg-(--surface) p-5 text-sm text-neutral-700 shadow-sm backdrop-blur dark:text-neutral-200">
          <div className="font-medium">{t(lang, 'jsonError')}</div>
        </div>
      ) : view === 'pretty' ? (
        <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-sm backdrop-blur">
          <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-neutral-900 dark:text-neutral-50">
            {parsed.pretty || '—'}
          </pre>
        </section>
      ) : (
        <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-sm backdrop-blur">
          {input.trim().length === 0 ? (
            <div className="text-sm text-neutral-500 dark:text-neutral-400">—</div>
          ) : (
            <TreeNode value={parsed.value} depth={0} />
          )}
        </section>
      )}
    </div>
  );
}


