'use client';

import { Badge } from '@/components/ui/Badge';
import { t, type Lang } from '@/lib/i18n';
import { cn } from '@/lib/ui/cn';
import type { DecodedText, InspectResult, QueryParam } from '@/lib/url/inspect';

export function UrlInspectorPanel(props: {
  lang: Lang;

  selectedParam: QueryParam | null;

  extraDecodeCount: number;
  onDecodeAgain: () => void;

  showJson: boolean;
  onToggleShowJson: () => void;

  showNestedUrl: boolean;
  onToggleShowNestedUrl: () => void;

  inspectorValue: DecodedText | null;
  jsonPreview: string | null;
  nestedUrlPreview: InspectResult | null;

  onOpenJsonViewer: () => void;
  onOpenRedirectTracker: () => void;

  inspectorExternalHref: string | null;
}) {
  const {
    lang,
    selectedParam,
    extraDecodeCount,
    onDecodeAgain,
    showJson,
    onToggleShowJson,
    showNestedUrl,
    onToggleShowNestedUrl,
    inspectorValue,
    jsonPreview,
    nestedUrlPreview,
    onOpenJsonViewer,
    onOpenRedirectTracker,
    inspectorExternalHref,
  } = props;

  return (
    <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="shrink-0 whitespace-nowrap text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          {t(lang, 'inspector')}
        </h2>

        {selectedParam ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onDecodeAgain}
              className="h-9 rounded-full border border-(--border) bg-white/60 px-3 text-sm font-medium text-neutral-800 transition hover:bg-white dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-900"
            >
              {t(lang, 'decodeAgain')}
            </button>

            <button
              type="button"
              onClick={onToggleShowJson}
              className={cn(
                'h-9 rounded-full border px-3 text-sm font-medium transition',
                showJson
                  ? 'border-neutral-300 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50'
                  : 'border-(--border) bg-white/60 text-neutral-800 hover:bg-white dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-900'
              )}
            >
              {t(lang, 'tryJson')}
            </button>

            <button
              type="button"
              onClick={onToggleShowNestedUrl}
              className={cn(
                'h-9 rounded-full border px-3 text-sm font-medium transition',
                showNestedUrl
                  ? 'border-neutral-300 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50'
                  : 'border-(--border) bg-white/60 text-neutral-800 hover:bg-white dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-900'
              )}
            >
              {t(lang, 'tryUrl')}
            </button>

            {inspectorValue?.text ? (
              <>
                <button
                  type="button"
                  onClick={onOpenJsonViewer}
                  className="h-9 rounded-full border border-(--border) bg-white/60 px-3 text-sm font-medium text-neutral-800 transition hover:bg-white dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-900"
                >
                  {t(lang, 'openInJson')}
                </button>
                <button
                  type="button"
                  onClick={onOpenRedirectTracker}
                  className="h-9 rounded-full border border-(--border) bg-white/60 px-3 text-sm font-medium text-neutral-800 transition hover:bg-white dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-900"
                >
                  {t(lang, 'openInRedirect')}
                </button>

                {inspectorExternalHref ? (
                  <a
                    href={inspectorExternalHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(lang, 'openInNewTab')}
                    title={t(lang, 'openInNewTab')}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--border) bg-white/60 text-sm font-medium text-neutral-800 transition hover:bg-white dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-900"
                  >
                    ↗
                  </a>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      {!selectedParam ? (
        <div className="mt-4 rounded-2xl border border-(--border) bg-white/50 p-4 text-sm text-neutral-600 dark:bg-neutral-950/40 dark:text-neutral-400">
          {t(lang, 'inspectorHint')}
        </div>
      ) : (
        <div className="mt-4 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-(--border) bg-white/60 p-4 dark:bg-neutral-950/50">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t(lang, 'key')} · {t(lang, 'raw')}
              </div>
              <div className="mt-2 whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-neutral-900 dark:text-neutral-50">
                {selectedParam.key.raw || '—'}
              </div>
              <div className="mt-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t(lang, 'key')} · {t(lang, 'decodedOnce')}
              </div>
              <div className="mt-2 whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-neutral-900 dark:text-neutral-50">
                {selectedParam.key.decoded.text || '—'}
              </div>
            </div>

            <div className="rounded-2xl border border-(--border) bg-white/60 p-4 dark:bg-neutral-950/50">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t(lang, 'value')} · {t(lang, 'raw')}
              </div>
              <div className="mt-2 whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-neutral-900 dark:text-neutral-50">
                {selectedParam.value.raw || '—'}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {t(lang, 'value')} ·{' '}
                  {extraDecodeCount === 0 ? t(lang, 'decodedOnce') : `${t(lang, 'decoded')} (${1 + extraDecodeCount}×)`}
                </div>
                {extraDecodeCount > 0 ? <Badge>{1 + extraDecodeCount}×</Badge> : null}
              </div>

              <div className="mt-2 whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-neutral-900 dark:text-neutral-50">
                {inspectorValue?.text || '—'}
              </div>
            </div>
          </div>

          {showJson ? (
            <div className="rounded-2xl border border-(--border) bg-white/60 p-4 dark:bg-neutral-950/50">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">JSON</div>
              <pre className="mt-3 whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-neutral-900 dark:text-neutral-50">
                {jsonPreview ?? '—'}
              </pre>
            </div>
          ) : null}

          {showNestedUrl ? (
            <div className="rounded-2xl border border-(--border) bg-white/60 p-4 dark:bg-neutral-950/50">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">URL</div>
              <div className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">
                {nestedUrlPreview?.ok ? (
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="shrink-0 whitespace-nowrap text-neutral-500 dark:text-neutral-400">{t(lang, 'scheme')}</div>
                      <div className="font-mono text-neutral-900 dark:text-neutral-50">{nestedUrlPreview.value.scheme}</div>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="shrink-0 whitespace-nowrap text-neutral-500 dark:text-neutral-400">{t(lang, 'host')}</div>
                      <div className="min-w-0 break-all font-mono text-neutral-900 dark:text-neutral-50">
                        {formatHost(nestedUrlPreview.value.hostname, nestedUrlPreview.value.port)}
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="shrink-0 whitespace-nowrap text-neutral-500 dark:text-neutral-400">{t(lang, 'path')}</div>
                      <div className="min-w-0 break-all font-mono text-neutral-900 dark:text-neutral-50">
                        {nestedUrlPreview.value.pathnameDecoded.text || '—'}
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="shrink-0 whitespace-nowrap text-neutral-500 dark:text-neutral-400">{t(lang, 'query')}</div>
                      <div className="font-mono text-neutral-900 dark:text-neutral-50">{nestedUrlPreview.value.query.params.length}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-neutral-600 dark:text-neutral-400">—</div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

function formatHost(hostname: string, port: string): string {
  if (!hostname) return '—';
  return port ? `${hostname}:${port}` : hostname;
}


