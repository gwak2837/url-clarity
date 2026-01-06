import { normalizeUserInput } from '@/lib/url/inspect';

export function safeExternalHref(candidate: string): string | null {
  const raw = candidate.trim();
  if (!raw) return null;

  const { normalized } = normalizeUserInput(raw);
  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    return null;
  }

  const protocol = url.protocol.toLowerCase();
  if (protocol === 'http:' || protocol === 'https:' || protocol === 'mailto:' || protocol === 'tel:') {
    return url.toString();
  }

  return null;
}
