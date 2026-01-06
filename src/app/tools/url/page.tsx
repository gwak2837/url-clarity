import { UrlClarityTool } from '@/tools/url/UrlClarityTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'URL Clarity',
  alternates: { canonical: '/tools/url' },
};

export default function Page() {
  return <UrlClarityTool />;
}


