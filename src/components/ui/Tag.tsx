interface TagProps {
  children: string;
  /** tecnologia de uso diário, recebe destaque leve */
  emphasis?: boolean;
}

export function Tag({ children, emphasis = false }: TagProps) {
  return (
    <li
      className={`rounded-panel border px-2 py-1 font-mono text-2xs whitespace-nowrap ${
        emphasis
          ? 'border-accent-warm/40 bg-accent-warm/8 text-accent-warm'
          : 'border-line bg-surface-2 text-fg-muted'
      }`}
    >
      {children}
    </li>
  );
}
