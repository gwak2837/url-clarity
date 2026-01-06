'use client';

import { useAppShell } from '@/components/shell/AppShell';
import { AdSenseAd } from '@/components/ads/AdSenseAd';
import { t } from '@/lib/i18n';

function Card(props: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="group w-full rounded-3xl border border-(--border) bg-(--surface) p-6 text-left shadow-sm backdrop-blur transition hover:bg-white/70 dark:hover:bg-neutral-950/60"
    >
      <div className="text-base font-semibold tracking-tight">{props.title}</div>
      <div className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {props.description}
      </div>
      <div className="mt-5 text-sm font-medium text-neutral-900 dark:text-neutral-50">
        →
      </div>
    </button>
  );
}

export function HomeHub() {
  const { lang, openTool } = useAppShell();
  const homeAdSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {t(lang, 'homeTitle')}
        </h1>
        <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
          {t(lang, 'homeSubtitle')}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          title={t(lang, 'homeCardUrlTitle')}
          description={t(lang, 'homeCardUrlDesc')}
          onClick={() => openTool('url')}
        />
        <Card
          title={t(lang, 'homeCardRedirectTitle')}
          description={t(lang, 'homeCardRedirectDesc')}
          onClick={() => openTool('redirect')}
        />
        <Card
          title={t(lang, 'homeCardJsonTitle')}
          description={t(lang, 'homeCardJsonDesc')}
          onClick={() => openTool('json')}
        />
        <Card
          title={t(lang, 'homeCardEncodeTitle')}
          description={t(lang, 'homeCardEncodeDesc')}
          onClick={() => openTool('encode')}
        />
      </div>

      {homeAdSlot ? (
        <div className="mt-8 rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-sm backdrop-blur">
          <AdSenseAd slot={homeAdSlot} />
        </div>
      ) : null}
    </div>
  );
}


