interface EyebrowProps {
  children: string;
  /** âmbar quando o rótulo marca algo ativo/em produção */
  tone?: 'accent' | 'warm' | 'muted';
  className?: string;
}

const TONE: Record<NonNullable<EyebrowProps['tone']>, string> = {
  accent: 'text-accent',
  warm: 'text-accent-warm',
  muted: 'text-fg-muted',
};

export function Eyebrow({ children, tone = 'accent', className = '' }: EyebrowProps) {
  return (
    <p
      className={`font-mono text-2xs tracking-[0.18em] lowercase ${TONE[tone]} ${className}`}
    >
      {children}
    </p>
  );
}
