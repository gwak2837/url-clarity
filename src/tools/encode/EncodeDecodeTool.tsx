'use client';

import { useAppShell } from '@/components/shell/AppShell';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Toggle } from '@/components/ui/Toggle';
import { t } from '@/lib/i18n';
import { decodeQueryComponent } from '@/lib/url/inspect';
import { useMemo, useState } from 'react';

type Mode = 'url-encode' | 'url-decode' | 'b64-encode' | 'b64-decode';

function base64EncodeUtf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function base64DecodeUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function EncodeDecodeTool() {
  const { lang, takeTransferredInput } = useAppShell();

  const [mode, setMode] = useState<Mode>('url-decode');
  const [plusAsSpace, setPlusAsSpace] = useState(true);
  const [input, setInput] = useState(() => takeTransferredInput('encode') ?? '');

  const result = useMemo(() => {
    const raw = input;
    if (!raw) return { ok: true as const, text: '' };

    try {
      if (mode === 'url-encode') {
        return { ok: true as const, text: encodeURIComponent(raw) };
      }
      if (mode === 'url-decode') {
        const decoded = decodeQueryComponent(raw, { plusAsSpace });
        return decoded.ok ? { ok: true as const, text: decoded.text } : { ok: false as const, text: decoded.text };
      }
      if (mode === 'b64-encode') {
        return { ok: true as const, text: base64EncodeUtf8(raw) };
      }
      // b64-decode
      return { ok: true as const, text: base64DecodeUtf8(raw.trim()) };
    } catch {
      return { ok: false as const, text: '' };
    }
  }, [input, mode, plusAsSpace]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t(lang, 'encodeTitle')}</h1>
      </div>

      <section className="rounded-3xl border border-(--border) bg-(--surface) p-4 shadow-sm backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <label className="shrink-0 whitespace-nowrap text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {t(lang, 'encodeInputLabel')}
            </label>
            <SegmentedControl<Mode>
              ariaLabel={t(lang, 'encodeMode')}
              value={mode}
              onChange={setMode}
              options={[
                { value: 'url-encode', label: t(lang, 'encodeUrlEncode') },
                { value: 'url-decode', label: t(lang, 'encodeUrlDecode') },
                { value: 'b64-encode', label: t(lang, 'encodeBase64Encode') },
                { value: 'b64-decode', label: t(lang, 'encodeBase64Decode') },
              ]}
            />
          </div>

          {mode === 'url-decode' ? (
            <div className="flex flex-wrap items-center gap-2">
              <Toggle checked={plusAsSpace} onChange={setPlusAsSpace} label={t(lang, 'encodePlusAsSpace')} />
            </div>
          ) : null}

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(lang, 'encodeInputPlaceholder')}
            rows={6}
            className="w-full resize-y rounded-2xl border border-(--border) bg-white/70 px-4 py-3 font-mono text-sm leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white dark:bg-neutral-950/60 dark:text-neutral-50 dark:placeholder:text-neutral-600 dark:focus:border-neutral-600 dark:focus:bg-neutral-950"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-sm backdrop-blur">
        <div className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          {t(lang, 'encodeOutput')}
        </div>
        {!result.ok ? (
          <div className="text-sm text-neutral-700 dark:text-neutral-300">{t(lang, 'encodeError')}</div>
        ) : null}
        <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-neutral-900 dark:text-neutral-50">
          {result.text || '—'}
        </pre>
      </section>
    </div>
  );
}


