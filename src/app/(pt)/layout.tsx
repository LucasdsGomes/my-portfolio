import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '../globals.css';
import { Shell } from '@/components/layout/Shell';
import { buildMetadata } from '../metadata';

export const metadata: Metadata = buildMetadata('pt');

export const viewport: Viewport = {
  themeColor: '#0b0d10',
  colorScheme: 'dark',
};

export default function PtLayout({ children }: { children: ReactNode }) {
  return <Shell locale="pt">{children}</Shell>;
}
