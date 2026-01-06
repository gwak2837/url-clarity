import { RedirectTrackerTool } from '@/tools/redirect/RedirectTrackerTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redirect Tracker',
  alternates: { canonical: '/tools/redirect' },
};

export default function Page() {
  return <RedirectTrackerTool />;
}


