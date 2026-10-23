import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '../globals.css';
import { Shell } from '@/components/layout/Shell';
import { buildTextMetadata } from '../metadata';

export const metadata: Metadata = buildTextMetadata('en');

export const viewport: Viewport = {
  themeColor: '#0b0d10',
  colorScheme: 'dark',
};

export default function EnLayout({ children }: { children: ReactNode }) {
  return <Shell locale="en">{children}</Shell>;
}
