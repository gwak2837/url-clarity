'use client';

import { useAppShell } from '@/components/shell/AppShell';
import { t } from '@/lib/i18n';
import { useMemo, useState } from 'react';

type TraceState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'done';
      data: {
        normalizedInput: string;
        finalUrl: string;
        hops: Array<{ url: string; status: number; location: string | null; nextUrl: string | null }>;
        stoppedReason: string;
      };
    };

const EXAMPLE_URL = 'http://example.com';

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function RedirectTrackerTool() {
  const { lang, openTool, takeTransferredInput } = useAppShell();

  const [input, setInput] = useState(() => takeTransferredInput('redirect') ?? '');
  const [state, setState] = useState<TraceState>({ status: 'idle' });

  const hasInput = input.trim().length > 0;

  const canTrace = hasInput && state.status !== 'loading';

  async function trace() {
    if (!hasInput) return;
    setState({ status: 'loading' });
    try {
      const res = await fetch('/api/redirect-trace', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: input, maxHops: 10, timeoutMs: 8000 }),
      });

      const json: unknown = await res.json();

      if (!res.ok || !isRecord(json) || json.ok !== true) {
        const msg = isRecord(json) && typeof json.error === 'string' ? json.error : 'error';
        setState({ status: 'error', message: msg });
        return;
      }

      const hopsRaw = Array.isArray(json.hops) ? json.hops : [];
      const hops = hopsRaw
        .filter((h): h is Record<string, unknown> => isRecord(h))
        .map((h) => ({
          url: typeof h.url === 'string' ? h.url : '',
          status: typeof h.status === 'number' ? h.status : 0,
          location: typeof h.location === 'string' ? h.location : null,
          nextUrl: typeof h.nextUrl === 'string' ? h.nextUrl : null,
        }));

      setState({
        status: 'done',
        data: {
          normalizedInput: typeof json.normalizedInput === 'string' ? json.normalizedInput : '',
          finalUrl: typeof json.finalUrl === 'string' ? json.finalUrl : '',
          hops,
          stoppedReason: typeof json.stoppedReason === 'string' ? json.stoppedReason : '',
        },
      });
    } catch {
      setState({ status: 'error', message: 'network_error' });
    }
  }

  const finalUrl = useMemo(() => (state.status === 'done' ? state.data.finalUrl : ''), [state]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t(lang, 'redirectTitle')}</h1>
        {finalUrl ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openTool('url', finalUrl)}
              className="h-9 rounded-full border border-(--border) bg-white/60 px-3 text-sm font-medium text-neutral-800 transition hover:bg-white dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-900"
            >
              {t(lang, 'openInUrl')}
            </button>
          </div>
        ) : null}
      </div>

      <section className="rounded-3xl border border-(--border) bg-(--surface) p-4 shadow-sm backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <label className="shrink-0 whitespace-nowrap text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {t(lang, 'redirectInputLabel')}
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setInput(EXAMPLE_URL)}
                className="h-9 rounded-full border border-(--border) bg-white/60 px-3 text-sm font-medium text-neutral-800 transition hover:bg-white dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-900"
              >
                {t(lang, 'example')}
              </button>
              <button
                type="button"
                onClick={trace}
                disabled={!canTrace}
                className={classNames(
                  'h-9 rounded-full border px-4 text-sm font-semibold transition',
                  canTrace
                    ? 'border-neutral-300 bg-white text-neutral-900 hover:bg-white/90 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-900/80'
                    : 'cursor-not-allowed border-(--border) bg-white/20 text-neutral-400 dark:bg-neutral-900/20 dark:text-neutral-600'
                )}
              >
                {state.status === 'loading' ? t(lang, 'redirectTracing') : t(lang, 'redirectTrace')}
              </button>
            </div>
          </div>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(lang, 'redirectInputPlaceholder')}
            className="h-12 w-full rounded-2xl border border-(--border) bg-white/70 px-4 font-mono text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white dark:bg-neutral-950/60 dark:text-neutral-50 dark:placeholder:text-neutral-600 dark:focus:border-neutral-600 dark:focus:bg-neutral-950"
          />
        </div>
      </section>

      {state.status === 'error' ? (
        <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-sm backdrop-blur">
          <div className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{t(lang, 'redirectError')}</div>
          <div className="mt-2 break-all font-mono text-xs text-neutral-600 dark:text-neutral-400">
            {state.message}
          </div>
        </section>
      ) : null}

      {state.status === 'done' ? (
        <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-sm backdrop-blur">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{t(lang, 'redirectHops')}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">{t(lang, 'redirectFinal')}: {state.data.finalUrl || '—'}</div>
          </div>

          <div className="relative space-y-4">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-0 h-full w-px bg-black/10 dark:bg-white/15"
            />
            {state.data.hops.length === 0 ? (
              <div className="text-sm text-neutral-500 dark:text-neutral-400">—</div>
            ) : (
              state.data.hops.map((h, idx) => (
                <div key={`${h.url}-${idx}`} className="relative pl-9">
                  <div className="absolute left-0 top-5 flex h-6 w-6 items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-neutral-900 dark:bg-neutral-50" />
                  </div>

                  <div className="rounded-3xl border border-(--border) bg-white/55 p-4 shadow-sm dark:bg-neutral-950/45">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            {idx + 1}
                          </div>
                          <span className="inline-flex items-center rounded-full border border-(--border) bg-(--surface) px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                            {t(lang, 'redirectStatus')}: <span className="ml-1 font-mono">{h.status}</span>
                          </span>
                        </div>

                        <div className="mt-2 break-all font-mono text-xs leading-relaxed text-neutral-900 dark:text-neutral-50">
                          {h.url}
                        </div>

                        <div className="mt-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                          {t(lang, 'redirectLocation')}
                        </div>
                        <div className="mt-1 break-all font-mono text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                          {h.location ?? '—'}
                        </div>

                        {h.nextUrl ? (
                          <div className="mt-2 break-all font-mono text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                            → {h.nextUrl}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}


