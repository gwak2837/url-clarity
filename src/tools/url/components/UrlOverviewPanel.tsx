'use client';

import { Badge } from '@/components/ui/Badge';
import { t, type Lang } from '@/lib/i18n';
import { cn } from '@/lib/ui/cn';
import { safeExternalHref } from '@/tools/url/utils/safeExternalHref';
import type { InspectResult, QueryParam } from '@/lib/url/inspect';

export function UrlOverviewPanel(props: {
  lang: Lang;
  hasInput: boolean;
  inspected: InspectResult;
  sortMode: 'original' | 'key';
  displayedParams: QueryParam[];
  selectedParamIndex: number | null;
  onSelectParam: (index: number) => void;
}) {
  const { lang, hasInput, inspected, sortMode, displayedParams, selectedParamIndex, onSelectParam } = props;

  return (
    <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-sm backdrop-blur">
      <h2 className="whitespace-nowrap text-sm font-semibold text-neutral-700 dark:text-neutral-200">{t(lang, 'overview')}</h2>

      {!hasInput ? (
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">{t(lang, 'inspectorHint')}</p>
      ) : !inspected.ok ? (
        <div className="mt-3 rounded-2xl border border-(--border) bg-white/60 p-4 text-sm text-neutral-700 dark:bg-neutral-950/60 dark:text-neutral-200">
          <div className="font-medium">{t(lang, 'parseErrorTitle')}</div>
          <div className="mt-2 text-neutral-600 dark:text-neutral-400">{t(lang, 'parseErrorHint')}</div>
        </div>
      ) : (
        <div className="mt-4 text-sm">
          {/* Apple-esque separators for scanability */}
          <div className="divide-y divide-black/5 dark:divide-white/10">
            <div className="flex items-baseline justify-between gap-4 py-2">
              <div className="shrink-0 whitespace-nowrap text-neutral-500 dark:text-neutral-400">{t(lang, 'scheme')}</div>
              <div className="font-mono text-neutral-900 dark:text-neutral-50">{inspected.value.scheme}</div>
            </div>

            {inspected.value.kind === 'mailto' ? (
              <div className="flex items-baseline justify-between gap-4 py-2">
                <div className="shrink-0 whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                  {t(lang, 'recipient')}
                </div>
                <div className="min-w-0 break-all font-mono text-neutral-900 dark:text-neutral-50">
                  {inspected.value.mailto?.to.text ?? '—'}
                </div>
              </div>
            ) : inspected.value.kind === 'tel' ? (
              <div className="flex items-baseline justify-between gap-4 py-2">
                <div className="shrink-0 whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                  {t(lang, 'phoneNumber')}
                </div>
                <div className="min-w-0 break-all font-mono text-neutral-900 dark:text-neutral-50">
                  {inspected.value.tel?.number.text ?? '—'}
                </div>
              </div>
            ) : (
              <div className="flex items-baseline justify-between gap-4 py-2">
                <div className="shrink-0 whitespace-nowrap text-neutral-500 dark:text-neutral-400">{t(lang, 'host')}</div>
                <div className="min-w-0 break-all font-mono text-neutral-900 dark:text-neutral-50">
                  {formatHost(inspected.value.hostname, inspected.value.port)}
                </div>
              </div>
            )}

            <div className="flex items-baseline justify-between gap-4 py-2">
              <div className="shrink-0 whitespace-nowrap text-neutral-500 dark:text-neutral-400">{t(lang, 'path')}</div>
              <div className="min-w-0 break-all font-mono text-neutral-900 dark:text-neutral-50">
                {inspected.value.pathnameDecoded.text || '—'}
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-4 py-2">
              <div className="shrink-0 whitespace-nowrap text-neutral-500 dark:text-neutral-400">{t(lang, 'query')}</div>
              <div className="font-mono text-neutral-900 dark:text-neutral-50">{inspected.value.query.params.length}</div>
            </div>

            <div className="flex items-baseline justify-between gap-4 py-2">
              <div className="shrink-0 whitespace-nowrap text-neutral-500 dark:text-neutral-400">{t(lang, 'fragment')}</div>
              <div className="min-w-0 break-all font-mono text-neutral-900 dark:text-neutral-50">
                {inspected.value.hash.raw ? `#${inspected.value.hash.raw}` : '—'}
              </div>
            </div>
          </div>

          {inspected.value.pathSegments.length > 0 ? (
            <div className="pt-4">
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{t(lang, 'path')}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {inspected.value.pathSegments.map((seg, i) => (
                  <span
                    key={`${seg.raw}-${i}`}
                    className="inline-block max-w-full break-all rounded-full border border-(--border) bg-white/50 px-2.5 py-1 font-mono text-xs text-neutral-800 dark:bg-neutral-950/50 dark:text-neutral-100"
                  >
                    {seg.decoded.text}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="pt-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="shrink-0 whitespace-nowrap text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {t(lang, 'queryParams')}
              </div>
              {sortMode === 'key' ? <Badge>A→Z</Badge> : null}
            </div>

            {displayedParams.length === 0 ? (
              <div className="text-sm text-neutral-500 dark:text-neutral-400">—</div>
            ) : (
              <div className="space-y-2">
                {displayedParams.map((p) => {
                  const active = p.index === selectedParamIndex;
                  const badges = [
                    p.hints.looksLikeUrl ? 'URL' : null,
                    p.hints.looksLikeJson ? 'JSON' : null,
                    p.hints.hasPercentEncoding ? 'ENC' : null,
                  ].filter(Boolean) as string[];

                  const externalHref = safeExternalHref(p.value.decoded.text);

                  return (
                    <div key={p.index} className="flex items-stretch gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectParam(p.index)}
                        className={cn(
                          'flex-1 rounded-2xl border px-3 py-2 text-left transition',
                          active
                            ? 'border-neutral-300 bg-white/80 dark:border-neutral-700 dark:bg-neutral-950/60'
                            : 'border-(--border) bg-white/40 hover:bg-white/70 dark:bg-neutral-950/30 dark:hover:bg-neutral-950/50'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="break-all font-mono text-sm leading-relaxed text-neutral-900 dark:text-neutral-50">
                              {p.key.decoded.text || '—'}
                            </div>
                            <div className="break-all font-mono text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                              {p.value.decoded.text || '—'}
                            </div>
                          </div>
                          {badges.length > 0 ? (
                            <div className="flex flex-wrap items-center justify-end gap-1">
                              {badges.slice(0, 2).map((b) => (
                                <Badge key={b}>{b}</Badge>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </button>

                      {externalHref ? (
                        <a
                          href={externalHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t(lang, 'openInNewTab')}
                          title={t(lang, 'openInNewTab')}
                          className="flex w-10 items-center justify-center rounded-2xl border border-(--border) bg-white/40 text-sm text-neutral-700 transition hover:bg-white/70 dark:bg-neutral-950/30 dark:text-neutral-200 dark:hover:bg-neutral-950/50"
                        >
                          ↗
                        </a>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function formatHost(hostname: string, port: string): string {
  if (!hostname) return '—';
  return port ? `${hostname}:${port}` : hostname;
}


