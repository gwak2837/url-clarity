export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return 'http://localhost:3000';

  try {
    void new URL(raw);
    return raw.replace(/\/+$/, '');
  } catch {
    return 'http://localhost:3000';
  }
}

export function getMetadataBase(): URL {
  return new URL(getSiteUrl());
}

export const SITE_NAME = 'Clarity Tools';
