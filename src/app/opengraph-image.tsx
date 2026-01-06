import { SITE_NAME } from '@/lib/site';
import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: -1.5,
            color: '#0a0a0a',
            lineHeight: 1.1,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: 'rgba(10,10,10,0.6)',
            lineHeight: 1.35,
            maxWidth: 900,
          }}
        >
          Minimal tools for URL and web inputs.
        </div>
        <div
          style={{
            marginTop: 48,
            width: '100%',
            height: 1,
            background: 'rgba(0,0,0,0.10)',
          }}
        />
        <div
          style={{
            marginTop: 24,
            fontSize: 18,
            color: 'rgba(10,10,10,0.5)',
          }}
        >
          /tools/url · /tools/redirect · /tools/json · /tools/encode
        </div>
      </div>
    ),
    size
  );
}


