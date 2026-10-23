import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '../game.css';
import { GameShell } from '@/components/game/GameShell';
import { buildMetadata } from '../metadata';

export const metadata: Metadata = buildMetadata('en');

export const viewport: Viewport = {
  themeColor: '#03060e',
  colorScheme: 'dark',
};

export default function GameLayout({ children }: { children: ReactNode }) {
  return <GameShell locale="en">{children}</GameShell>;
}
