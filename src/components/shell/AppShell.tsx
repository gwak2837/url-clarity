'use client';

import { DEFAULT_LANG, LANG_LABEL, t, type Lang } from '@/lib/i18n';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ToolId = 'home' | 'url' | 'redirect' | 'json' | 'encode';

const TOOL_ROUTES: Record<ToolId, string> = {
  home: '/',
  url: '/tools/url',
  redirect: '/tools/redirect',
  json: '/tools/json',
  encode: '/tools/encode',
};

const STORAGE_KEYS = {
  lang: 'clarity-tools.lang',
} as const;

const TRANSFER_KEY_PREFIX = 'clarity-tools.transfer:';

function readStoredLang(): Lang | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(STORAGE_KEYS.lang);
  return v === 'ko' || v === 'en' ? v : null;
}

function setTransfer(tool: ToolId, value: string) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(`${TRANSFER_KEY_PREFIX}${tool}`, value);
}

function takeTransfer(tool: ToolId): string | null {
  if (typeof window === 'undefined') return null;
  const key = `${TRANSFER_KEY_PREFIX}${tool}`;
  const v = window.sessionStorage.getItem(key);
  if (v != null) window.sessionStorage.removeItem(key);
  return v;
}

function toolFromPath(pathname: string): ToolId {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/tools/url')) return 'url';
  if (pathname.startsWith('/tools/redirect')) return 'redirect';
  if (pathname.startsWith('/tools/json')) return 'json';
  if (pathname.startsWith('/tools/encode')) return 'encode';
  return 'home';
}

export interface AppShellApi {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Navigate to a tool, optionally transferring input (via sessionStorage). */
  openTool: (tool: ToolId, input?: string) => void;
  /** Read transferred input for the current tool (consumed once). */
  takeTransferredInput: (tool: ToolId) => string | null;
}

const AppShellContext = createContext<AppShellApi | null>(null);

export function useAppShell(): AppShellApi {
  const v = useContext(AppShellContext);
  if (!v) throw new Error('useAppShell must be used within <AppShell>.');
  return v;
}

export function AppShell(props: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [lang, setLang] = useState<Lang>(() => readStoredLang() ?? DEFAULT_LANG);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.lang, lang);
  }, [lang]);

  const currentTool: ToolId = useMemo(() => toolFromPath(pathname), [pathname]);

  const api: AppShellApi = useMemo(
    () => ({
      lang,
      setLang,
      openTool: (tool, input) => {
        if (typeof input === 'string') setTransfer(tool, input);
        router.push(TOOL_ROUTES[tool]);
      },
      takeTransferredInput: (tool) => takeTransfer(tool),
    }),
    [lang, router]
  );

  return (
    <AppShellContext.Provider value={api}>
      <div className="min-h-screen bg-linear-to-b from-neutral-50 to-white text-neutral-900 dark:from-neutral-950 dark:to-black dark:text-neutral-50">
        <header className="sticky top-0 z-10 border-b border-(--border) bg-(--surface) backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold tracking-tight">Clarity Tools</div>
              <div className="sm:hidden">
                <SegmentedControl
                  ariaLabel={t(lang, 'language')}
                  value={lang}
                  onChange={setLang}
                  options={[
                    { value: 'en', label: LANG_LABEL.en },
                    { value: 'ko', label: LANG_LABEL.ko },
                  ]}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SegmentedControl<ToolId>
                ariaLabel={t(lang, 'tools')}
                value={currentTool}
                onChange={(tool) => api.openTool(tool)}
                options={[
                  { value: 'home', label: t(lang, 'home') },
                  { value: 'url', label: t(lang, 'toolUrl') },
                  { value: 'redirect', label: t(lang, 'toolRedirect') },
                  { value: 'json', label: t(lang, 'toolJson') },
                  { value: 'encode', label: t(lang, 'toolEncode') },
                ]}
              />

              <div className="hidden sm:block">
                <SegmentedControl
                  ariaLabel={t(lang, 'language')}
                  value={lang}
                  onChange={setLang}
                  options={[
                    { value: 'en', label: LANG_LABEL.en },
                    { value: 'ko', label: LANG_LABEL.ko },
                  ]}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">{props.children}</main>
      </div>
    </AppShellContext.Provider>
  );
}


