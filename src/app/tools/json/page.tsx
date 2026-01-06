import { JsonViewerTool } from '@/tools/json/JsonViewerTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Viewer',
  alternates: { canonical: '/tools/json' },
};

export default function Page() {
  return <JsonViewerTool />;
}


