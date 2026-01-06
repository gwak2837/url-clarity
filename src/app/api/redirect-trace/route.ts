import { normalizeUserInput } from '@/lib/url/inspect';
import { NextResponse } from 'next/server';
import { lookup } from 'node:dns/promises';

export interface RedirectHop {
  url: string;
  status: number;
  location: string | null;
  nextUrl: string | null;
}

export interface RedirectTraceResponse {
  ok: true;
  input: string;
  normalizedInput: string;
  hops: RedirectHop[];
  finalUrl: string;
  stoppedReason:
    | 'non_redirect'
    | 'missing_location'
    | 'max_hops'
    | 'loop'
    | 'blocked'
    | 'invalid_next_url'
    | 'fetch_error';
}

export interface RedirectTraceErrorResponse {
  ok: false;
  error: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isIpV4(hostname: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
}

function ipV4ToInt(ip: string): number | null {
  const parts = ip.split('.').map((n) => Number(n));
  if (parts.length !== 4) return null;
  if (parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) return null;
  return ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

function inRange(ipInt: number, base: string, maskBits: number): boolean {
  const baseInt = ipV4ToInt(base);
  if (baseInt == null) return false;
  const mask = maskBits === 0 ? 0 : (~0 << (32 - maskBits)) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

function isPrivateIpV4(ip: string): boolean {
  const ipInt = ipV4ToInt(ip);
  if (ipInt == null) return true;
  return (
    inRange(ipInt, '127.0.0.0', 8) ||
    inRange(ipInt, '10.0.0.0', 8) ||
    inRange(ipInt, '172.16.0.0', 12) ||
    inRange(ipInt, '192.168.0.0', 16) ||
    inRange(ipInt, '169.254.0.0', 16) ||
    inRange(ipInt, '0.0.0.0', 8)
  );
}

function isPrivateIpV6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === '::1') return true;
  if (lower.startsWith('fe80:')) return true; // link-local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // unique local
  return false;
}

async function isBlockedHost(hostname: string): Promise<boolean> {
  const host = hostname.toLowerCase();
  if (!host) return true;
  if (host === 'localhost' || host.endsWith('.localhost')) return true;

  // If it's a literal IP, check directly.
  if (isIpV4(host)) return isPrivateIpV4(host);
  if (host.includes(':')) return isPrivateIpV6(host);

  // DNS resolve and block private / loopback addresses.
  try {
    const results = await lookup(host, { all: true });
    if (results.length === 0) return true;
    for (const r of results) {
      if (r.family === 4 && isPrivateIpV4(r.address)) return true;
      if (r.family === 6 && isPrivateIpV6(r.address)) return true;
    }
  } catch {
    // If DNS lookup fails, block by default for safety.
    return true;
  }

  return false;
}

function normalizeInputToUrl(input: string): { normalized: string; assumptions: string[] } {
  const { normalized, assumptions } = normalizeUserInput(input);
  return { normalized, assumptions: assumptions.map((a) => a.type) };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<RedirectTraceErrorResponse>(
      { ok: false, error: 'invalid_json' },
      { status: 400 }
    );
  }

  const obj = isRecord(body) ? body : {};
  const input = typeof obj.url === 'string' ? obj.url : '';
  const maxHops = typeof obj.maxHops === 'number' ? Math.min(Math.max(obj.maxHops, 1), 20) : 10;
  const timeoutMs = typeof obj.timeoutMs === 'number' ? Math.min(Math.max(obj.timeoutMs, 1000), 15000) : 8000;

  if (!input.trim()) {
    return NextResponse.json<RedirectTraceErrorResponse>({ ok: false, error: 'empty' }, { status: 400 });
  }

  const { normalized } = normalizeInputToUrl(input);

  let currentUrl: URL;
  try {
    currentUrl = new URL(normalized);
  } catch {
    return NextResponse.json<RedirectTraceErrorResponse>({ ok: false, error: 'invalid_url' }, { status: 400 });
  }

  if (currentUrl.protocol !== 'http:' && currentUrl.protocol !== 'https:') {
    return NextResponse.json<RedirectTraceErrorResponse>(
      { ok: false, error: 'unsupported_protocol' },
      { status: 400 }
    );
  }

  const visited = new Set<string>();
  const hops: RedirectHop[] = [];

  let stoppedReason: RedirectTraceResponse['stoppedReason'] = 'non_redirect';

  for (let i = 0; i < maxHops; i += 1) {
    const urlStr = currentUrl.toString();
    if (visited.has(urlStr)) {
      stoppedReason = 'loop';
      break;
    }
    visited.add(urlStr);

    if (await isBlockedHost(currentUrl.hostname)) {
      stoppedReason = 'blocked';
      break;
    }

    let res: Response;
    try {
      res = await fetch(urlStr, {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          // Keep it minimal and explicit.
          accept: '*/*',
        },
      });
    } catch {
      stoppedReason = 'fetch_error';
      break;
    }

    const status = res.status;
    const location = res.headers.get('location');

    let nextUrl: string | null = null;
    if (location) {
      try {
        nextUrl = new URL(location, urlStr).toString();
      } catch {
        stoppedReason = 'invalid_next_url';
        hops.push({ url: urlStr, status, location, nextUrl: null });
        break;
      }
    }

    hops.push({ url: urlStr, status, location, nextUrl });

    const isRedirect = status >= 300 && status < 400;
    if (!isRedirect) {
      stoppedReason = 'non_redirect';
      break;
    }

    if (!location || !nextUrl) {
      stoppedReason = 'missing_location';
      break;
    }

    const next = new URL(nextUrl);
    if (next.protocol !== 'http:' && next.protocol !== 'https:') {
      stoppedReason = 'blocked';
      break;
    }

    currentUrl = next;
    stoppedReason = i === maxHops - 1 ? 'max_hops' : stoppedReason;
  }

  const finalUrl = hops.length > 0 ? (hops[hops.length - 1].nextUrl ?? hops[hops.length - 1].url) : normalized;

  return NextResponse.json<RedirectTraceResponse>({
    ok: true,
    input,
    normalizedInput: normalized,
    hops,
    finalUrl,
    stoppedReason,
  });
}


