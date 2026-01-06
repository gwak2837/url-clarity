export type UrlKind = "http" | "mailto" | "tel" | "custom";

export type Assumption =
  | { type: "assumed_https"; value: "https://" }
  | { type: "assumed_https_protocol"; value: "https:" };

export type DecodeError =
  | { type: "invalid_percent_encoding" }
  | { type: "unknown" };

export interface DecodedText {
  ok: boolean;
  text: string;
  error?: DecodeError;
}

export interface QueryParamHints {
  hasPercentEncoding: boolean;
  hasPlus: boolean;
  decodedDiffers: boolean;
  looksLikeJson: boolean;
  looksLikeUrl: boolean;
}

export interface QueryParam {
  /** Stable id based on original order (0..n-1) */
  index: number;
  rawPair: string;
  key: { raw: string; decoded: DecodedText };
  value: { raw: string; decoded: DecodedText };
  hints: QueryParamHints;
}

export interface InspectOptions {
  plusAsSpace: boolean;
}

export interface UrlStructure {
  input: string;
  normalizedInput: string;
  assumptions: Assumption[];

  kind: UrlKind;
  protocol: string; // includes trailing colon, e.g. "https:"
  scheme: string; // without colon, e.g. "https"
  href: string;

  // Authority-ish
  username: string;
  password: string;
  host: string;
  hostname: string;
  port: string;

  // Path
  pathnameRaw: string;
  pathnameDecoded: DecodedText;
  pathSegments: Array<{ raw: string; decoded: DecodedText }>;

  // Query + hash from the *normalized input* (preserves order/duplicates)
  query: { raw: string | null; params: QueryParam[] };
  hash: { raw: string | null; decoded: DecodedText | null };

  // Scheme-specific convenience
  mailto?: { to: DecodedText };
  tel?: { number: DecodedText };
}

export type InspectResult =
  | { ok: true; value: UrlStructure }
  | { ok: false; error: { message: string } };

const SCHEME_RE = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;
const PERCENT_ENC_RE = /%[0-9a-fA-F]{2}/;

function isSchemePresent(input: string): boolean {
  return SCHEME_RE.test(input);
}

function looksLikeHostname(input: string): boolean {
  // Grab the "authority-ish" head: up to / ? #
  const head = input.split(/[/?#]/)[0] ?? "";
  if (!head) return false;
  if (head === "localhost") return true;
  if (/^\d{1,3}(\.\d{1,3}){3}(:\d+)?$/.test(head)) return true;
  // Very lightweight heuristic: contains a dot and no spaces
  if (head.includes(".") && !/\s/.test(head)) return true;
  return false;
}

export function normalizeUserInput(inputRaw: string): {
  normalized: string;
  assumptions: Assumption[];
} {
  const input = inputRaw.trim();
  const assumptions: Assumption[] = [];

  if (!input) return { normalized: "", assumptions };

  if (input.startsWith("//")) {
    assumptions.push({ type: "assumed_https_protocol", value: "https:" });
    return { normalized: `https:${input}`, assumptions };
  }

  if (isSchemePresent(input)) {
    return { normalized: input, assumptions };
  }

  if (looksLikeHostname(input)) {
    assumptions.push({ type: "assumed_https", value: "https://" });
    return { normalized: `https://${input}`, assumptions };
  }

  return { normalized: input, assumptions };
}

function splitQueryAndHash(
  urlString: string,
): { query: string | null; hash: string | null } {
  const hashIndex = urlString.indexOf("#");
  const beforeHash = hashIndex === -1 ? urlString : urlString.slice(0, hashIndex);
  const hash = hashIndex === -1 ? null : urlString.slice(hashIndex + 1);

  const qIndex = beforeHash.indexOf("?");
  const query = qIndex === -1 ? null : beforeHash.slice(qIndex + 1);

  return { query, hash };
}

export function decodeURIComponentSafe(raw: string): DecodedText {
  try {
    return { ok: true, text: decodeURIComponent(raw) };
  } catch {
    // decodeURIComponent throws URIError on invalid escape sequences
    return { ok: false, text: raw, error: { type: "invalid_percent_encoding" } };
  }
}

export function decodeQueryComponent(
  raw: string,
  opts: InspectOptions,
): DecodedText {
  const prepared = opts.plusAsSpace ? raw.replaceAll("+", " ") : raw;
  return decodeURIComponentSafe(prepared);
}

export function decodeNTimes(
  raw: string,
  times: number,
  opts: InspectOptions,
): DecodedText {
  let current: DecodedText = { ok: true, text: raw };
  for (let i = 0; i < times; i += 1) {
    current = decodeQueryComponent(current.text, opts);
    // Continue even if it fails; keep returning best-effort text
  }
  return current;
}

export function parseQueryString(
  queryRaw: string,
  opts: InspectOptions,
): QueryParam[] {
  if (!queryRaw) return [];

  const parts = queryRaw.split("&");
  const params: QueryParam[] = [];

  for (const part of parts) {
    if (!part) continue;
    const eq = part.indexOf("=");
    const keyRaw = eq === -1 ? part : part.slice(0, eq);
    const valueRaw = eq === -1 ? "" : part.slice(eq + 1);

    const keyDecoded = decodeQueryComponent(keyRaw, opts);
    const valueDecoded = decodeQueryComponent(valueRaw, opts);

    const decodedDiffers = keyDecoded.text !== keyRaw || valueDecoded.text !== valueRaw;
    const looksLikeJson = isJsonLike(valueDecoded.text);
    const looksLikeUrl = isUrlLike(valueDecoded.text);

    params.push({
      index: params.length,
      rawPair: part,
      key: { raw: keyRaw, decoded: keyDecoded },
      value: { raw: valueRaw, decoded: valueDecoded },
      hints: {
        hasPercentEncoding: PERCENT_ENC_RE.test(keyRaw) || PERCENT_ENC_RE.test(valueRaw),
        hasPlus: keyRaw.includes("+") || valueRaw.includes("+"),
        decodedDiffers,
        looksLikeJson,
        looksLikeUrl,
      },
    });
  }

  return params;
}

function isJsonLike(text: string): boolean {
  const s = text.trim();
  return s.startsWith("{") || s.startsWith("[");
}

function isUrlLike(text: string): boolean {
  const s = text.trim();
  if (!s) return false;
  if (s.startsWith("//")) return true;
  if (s.includes("://")) return true;
  if (SCHEME_RE.test(s)) return true;
  return false;
}

export function sortQueryParamsByKey(params: QueryParam[], locale: string): QueryParam[] {
  return [...params].sort((a, b) => {
    const aKey = a.key.decoded.text;
    const bKey = b.key.decoded.text;
    const cmp = aKey.localeCompare(bKey, locale, { sensitivity: "base" });
    if (cmp !== 0) return cmp;
    return a.index - b.index;
  });
}

export function inspectUrl(
  inputRaw: string,
  opts: InspectOptions,
): InspectResult {
  const input = inputRaw.trim();
  if (!input) return { ok: false, error: { message: "empty" } };

  const { normalized, assumptions } = normalizeUserInput(input);

  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    return { ok: false, error: { message: "invalid_url" } };
  }

  const scheme = url.protocol.replace(/:$/, "");
  const kind: UrlKind =
    scheme === "http" || scheme === "https"
      ? "http"
      : scheme === "mailto"
        ? "mailto"
        : scheme === "tel"
          ? "tel"
          : "custom";

  const { query, hash } = splitQueryAndHash(normalized);
  const queryParams = query ? parseQueryString(query, opts) : [];

  const pathnameRaw = url.pathname;
  const pathnameDecoded = decodeURIComponentSafe(pathnameRaw);
  const pathSegmentsRaw = pathnameRaw.split("/").filter((s) => s.length > 0);
  const pathSegments = pathSegmentsRaw.map((seg) => ({
    raw: seg,
    decoded: decodeURIComponentSafe(seg),
  }));

  const hashDecoded = hash == null ? null : decodeURIComponentSafe(hash);

  const base: UrlStructure = {
    input,
    normalizedInput: normalized,
    assumptions,

    kind,
    protocol: url.protocol,
    scheme,
    href: url.href,

    username: url.username,
    password: url.password,
    host: url.host,
    hostname: url.hostname,
    port: url.port,

    pathnameRaw,
    pathnameDecoded,
    pathSegments,

    query: { raw: query, params: queryParams },
    hash: { raw: hash, decoded: hashDecoded },
  };

  if (kind === "mailto") {
    return { ok: true, value: { ...base, mailto: { to: decodeURIComponentSafe(url.pathname) } } };
  }

  if (kind === "tel") {
    return { ok: true, value: { ...base, tel: { number: decodeURIComponentSafe(url.pathname) } } };
  }

  return { ok: true, value: base };
}


