import { EncodeDecodeTool } from '@/tools/encode/EncodeDecodeTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Encode / Decode',
  alternates: { canonical: '/tools/encode' },
};

export default function Page() {
  return <EncodeDecodeTool />;
}


