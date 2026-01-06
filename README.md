# Clarity Tools

URL·웹 입력을 빠르게 분석/정리하는 미니멀 도구 모음입니다.

## 포함된 도구

- **URL Clarity**: URL을 분해하고(스킴/호스트/경로/쿼리/프래그먼트), 쿼리 파라미터를 정렬·디코드해서 구조를 확인합니다.
- **Redirect Tracker**: 리다이렉트 체인을 추적하고 각 hop의 상태코드와 `Location` 헤더를 보여줍니다. (보안상 `localhost`/사설 IP/loopback 차단)
- **JSON Viewer**: JSON을 pretty-print 또는 트리로 탐색합니다.
- **Encode / Decode**: URL/Base64 인코딩·디코딩을 제공합니다. (URL 디코드에서 `+`→공백 옵션)

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 을 여세요.

## SEO / Google Analytics / AdSense 설정

환경변수는 `env.example` 을 참고해 `.env.local` 에 설정하세요.

- **SEO**
  - `NEXT_PUBLIC_SITE_URL`: canonical/sitemap/robots 기준 URL
  - `GET /sitemap.xml`, `GET /robots.txt` 제공
  - 기본 Open Graph 이미지는 `src/app/opengraph-image.tsx`
- **Google Analytics**
  - `NEXT_PUBLIC_GA_ID` 설정 시 `@next/third-parties/google` 로 GA 스크립트를 로드합니다.
- **Google AdSense**
  - `NEXT_PUBLIC_ADSENSE_CLIENT` 설정 시 AdSense 스크립트를 로드합니다.
  - `NEXT_PUBLIC_ADSENSE_SLOT_HOME` 를 설정하면 홈(`/`)에 1개의 광고 슬롯을 표시합니다(선택).

## 스크립트

- `npm run dev`: 개발 서버
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버
- `npm run lint`: 린트

## Redirect Tracker API

`POST /api/redirect-trace`

```json
{ "url": "https://example.com", "maxHops": 10, "timeoutMs": 8000 }
```

## 기술 스택

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
