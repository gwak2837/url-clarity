import { HomeHub } from '@/components/home/HomeHub';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools',
  alternates: { canonical: '/' },
};

export default function Home() {
  return <HomeHub />;
}
