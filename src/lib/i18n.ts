export type Lang = "en" | "ko";

export const DEFAULT_LANG: Lang = "en";

export const LANG_LABEL: Record<Lang, string> = {
  en: "EN",
  ko: "KO",
};

const STRINGS = {
  en: {
    appName: "Clarity Tools",
    tagline: "Minimal tools for URL and web inputs.",

    home: "Home",
    tools: "Tools",
    toolUrl: "URL",
    toolRedirect: "Redirect",
    toolJson: "JSON",
    toolEncode: "Encode",

    homeTitle: "Tools",
    homeSubtitle: "Fast, minimal, and built for clarity.",
    homeCardUrlTitle: "URL Clarity",
    homeCardUrlDesc: "Parse, sort, and decode complex URLs.",
    homeCardRedirectTitle: "Redirect Tracker",
    homeCardRedirectDesc: "Trace redirect chains and see Location headers.",
    homeCardJsonTitle: "JSON Viewer",
    homeCardJsonDesc: "Pretty-print and inspect JSON.",
    homeCardEncodeTitle: "Encode / Decode",
    homeCardEncodeDesc: "URL + Base64 encode/decode.",

    jsonTitle: "JSON Viewer",
    jsonInputLabel: "Paste JSON",
    jsonInputPlaceholder: "Paste JSON here…",
    jsonExample: "Try an example",
    jsonError: "Invalid JSON",
    jsonPretty: "Pretty",
    jsonTree: "Tree",

    encodeTitle: "Encode / Decode",
    encodeInputLabel: "Paste text",
    encodeInputPlaceholder: "Paste text here…",
    encodeMode: "Mode",
    encodeUrlEncode: "URL encode",
    encodeUrlDecode: "URL decode",
    encodeBase64Encode: "Base64 encode",
    encodeBase64Decode: "Base64 decode",
    encodePlusAsSpace: "For URL decode, treat + as space",
    encodeOutput: "Output",
    encodeError: "Couldn't decode with this mode.",

    redirectTitle: "Redirect Tracker",
    redirectInputLabel: "Paste a URL",
    redirectInputPlaceholder: "Paste a URL… (e.g. example.com)",
    redirectTrace: "Trace",
    redirectTracing: "Tracing…",
    redirectHops: "Hops",
    redirectFinal: "Final",
    redirectStatus: "Status",
    redirectLocation: "Location",
    redirectError: "Couldn't trace redirects.",

    inputLabel: "Paste a URL",
    inputPlaceholder:
      "Paste a URL… (e.g. example.com/search?q=hello+world&state=%257B%2522theme%2522%253A%2522dark%2522%257D)",
    example: "Try an example",
    clear: "Clear",

    options: "Options",
    language: "Language",
    sort: "Sort",
    sortOriginal: "Original",
    sortKey: "A→Z",
    plusAsSpace: "In query, treat + as space",

    assumedHttps: "No scheme found — assumed https://",

    overview: "Overview",
    scheme: "Scheme",
    host: "Host",
    path: "Path",
    fragment: "Fragment",
    query: "Query",
    queryParams: "Parameters",

    recipient: "Recipient",
    phoneNumber: "Number",

    inspector: "Inspector",
    inspectorHint: "Select a query parameter to see details.",
    raw: "Raw",
    decodedOnce: "Decoded (1×)",
    decoded: "Decoded",
    key: "Key",
    value: "Value",

    decodeAgain: "Decode again",
    tryJson: "Try JSON",
    tryUrl: "Try URL",
    openInJson: "Open in JSON Viewer",
    openInRedirect: "Open in Redirect Tracker",
    openInUrl: "Open in URL Clarity",
    openInNewTab: "Open in new tab",

    parseErrorTitle: "Couldn't parse this input as a URL.",
    parseErrorHint:
      "Tip: include a scheme (https://, mailto:, tel:) or a hostname like example.com",
  },
  ko: {
    appName: "Clarity Tools",
    tagline: "URL·웹 입력을 위한 미니멀 도구 모음.",

    home: "홈",
    tools: "도구",
    toolUrl: "URL",
    toolRedirect: "리다이렉트",
    toolJson: "JSON",
    toolEncode: "인코딩",

    homeTitle: "도구",
    homeSubtitle: "빠르고, 단정하고, 명확하게.",
    homeCardUrlTitle: "URL Clarity",
    homeCardUrlDesc: "URL을 분해하고 정렬·디코드해서 구조를 봐요.",
    homeCardRedirectTitle: "Redirect Tracker",
    homeCardRedirectDesc: "리다이렉트 체인과 Location 헤더를 추적해요.",
    homeCardJsonTitle: "JSON Viewer",
    homeCardJsonDesc: "JSON을 보기 좋게 정리하고 탐색해요.",
    homeCardEncodeTitle: "Encode / Decode",
    homeCardEncodeDesc: "URL·Base64 인코딩/디코딩 도구.",

    jsonTitle: "JSON Viewer",
    jsonInputLabel: "JSON 붙여넣기",
    jsonInputPlaceholder: "JSON을 붙여넣어 주세요…",
    jsonExample: "예시로 시작하기",
    jsonError: "JSON이 올바르지 않아요",
    jsonPretty: "정리된 보기",
    jsonTree: "트리 보기",

    encodeTitle: "Encode / Decode",
    encodeInputLabel: "텍스트 붙여넣기",
    encodeInputPlaceholder: "텍스트를 붙여넣어 주세요…",
    encodeMode: "모드",
    encodeUrlEncode: "URL 인코드",
    encodeUrlDecode: "URL 디코드",
    encodeBase64Encode: "Base64 인코드",
    encodeBase64Decode: "Base64 디코드",
    encodePlusAsSpace: "URL 디코드에서 +를 공백으로 해석",
    encodeOutput: "출력",
    encodeError: "이 모드로 디코드할 수 없어요.",

    redirectTitle: "Redirect Tracker",
    redirectInputLabel: "URL 붙여넣기",
    redirectInputPlaceholder: "URL을 붙여넣어 주세요… (예: example.com)",
    redirectTrace: "추적",
    redirectTracing: "추적 중…",
    redirectHops: "체인",
    redirectFinal: "최종",
    redirectStatus: "상태코드",
    redirectLocation: "Location",
    redirectError: "리다이렉트를 추적할 수 없어요.",

    inputLabel: "URL 붙여넣기",
    inputPlaceholder:
      "URL을 붙여넣어 주세요… (예: example.com/search?q=hello+world&state=%257B%2522theme%2522%253A%2522dark%2522%257D)",
    example: "예시로 시작하기",
    clear: "지우기",

    options: "옵션",
    language: "언어",
    sort: "정렬",
    sortOriginal: "원본 순서",
    sortKey: "키 기준(A→Z)",
    plusAsSpace: "쿼리에서 +를 공백으로 해석",

    assumedHttps: "스킴이 없어서 https:// 로 가정했어요",

    overview: "요약",
    scheme: "스킴",
    host: "호스트",
    path: "경로",
    fragment: "프래그먼트",
    query: "쿼리",
    queryParams: "파라미터",

    recipient: "받는 사람",
    phoneNumber: "전화번호",

    inspector: "상세",
    inspectorHint: "쿼리 파라미터를 선택하면 자세히 볼 수 있어요.",
    raw: "원본",
    decodedOnce: "디코드(1회)",
    decoded: "디코드",
    key: "키",
    value: "값",

    decodeAgain: "한 번 더 디코드",
    tryJson: "JSON으로 보기",
    tryUrl: "URL로 보기",
    openInJson: "JSON Viewer로 열기",
    openInRedirect: "Redirect Tracker로 열기",
    openInUrl: "URL Clarity로 열기",
    openInNewTab: "새 탭에서 열기",

    parseErrorTitle: "URL로 해석할 수 없어요.",
    parseErrorHint:
      "팁: 스킴(https://, mailto:, tel:) 또는 example.com 같은 호스트를 포함해 보세요.",
  },
} as const;

export type StringKey = keyof (typeof STRINGS)["en"];

export function t(lang: Lang, key: StringKey): string {
  return STRINGS[lang][key] ?? STRINGS.en[key];
}


