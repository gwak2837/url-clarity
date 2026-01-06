'use client';

import { useEffect, useMemo } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function AdSenseAd(props: {
  slot: string;
  className?: string;
  format?: 'auto' | string;
  fullWidthResponsive?: boolean;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  const enabled = Boolean(client && props.slot);

  const key = useMemo(() => `${client ?? ''}:${props.slot}`, [client, props.slot]);

  useEffect(() => {
    if (!enabled) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ignore; AdSense can throw in dev or if blocked by extensions.
    }
  }, [enabled, key]);

  if (!enabled) return null;

  return (
    <ins
      className={classNames('adsbygoogle', props.className)}
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={props.slot}
      data-ad-format={props.format ?? 'auto'}
      data-full-width-responsive={props.fullWidthResponsive ?? true}
    />
  );
}


