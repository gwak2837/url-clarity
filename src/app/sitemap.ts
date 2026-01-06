import { getSiteUrl } from '@/lib/site';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const urls = ['/', '/tools/url', '/tools/redirect', '/tools/json', '/tools/encode'];

  return urls.map((path, idx) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: idx === 0 ? 1 : 0.6,
  }));
}


