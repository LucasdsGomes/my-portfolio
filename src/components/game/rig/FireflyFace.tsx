import { useId } from 'react';

/**
 * O rosto do vagalume de frente, para o HUD. É o mesmo desenho dos
 * icon.svg das pastas de rota (o ícone da aba): se mudar um, mude os outros.
 */
export function FireflyFace({ className = '' }: { className?: string }) {
  const u = `face${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${u}-eye`} cx="42%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#fffdf2" />
          <stop offset="45%" stopColor="#ffeb9c" />
          <stop offset="100%" stopColor="#f4b845" />
        </radialGradient>
      </defs>
      <g fill="none" stroke="#0a0e18" strokeWidth="2.6" strokeLinecap="round">
        <path d="M26 19 C 24 12, 20 7, 13 5" />
        <path d="M38 19 C 40 12, 44 7, 51 5" />
      </g>
      <circle cx="12.5" cy="5.2" r="5" fill="#fdd05f" opacity="0.3" />
      <circle cx="51.5" cy="5.2" r="5" fill="#fdd05f" opacity="0.3" />
      <ellipse cx="12.5" cy="5.2" rx="3.2" ry="2.2" fill={`url(#${u}-eye)`} />
      <ellipse cx="51.5" cy="5.2" rx="3.2" ry="2.2" fill={`url(#${u}-eye)`} />
      <circle cx="32" cy="38" r="21" fill="#080b14" stroke="#2c3b5a" strokeWidth="1.6" />
      <path d="M15 30 A 19 19 0 0 1 27 19" fill="none" stroke="#6f86b8" strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="24.5" cy="39" rx="9" ry="12" fill="#fdd05f" opacity="0.22" />
      <ellipse cx="39.5" cy="39" rx="9" ry="12" fill="#fdd05f" opacity="0.22" />
      <ellipse cx="24.5" cy="39" rx="5.6" ry="8.4" transform="rotate(-8 24.5 39)" fill={`url(#${u}-eye)`} />
      <ellipse cx="39.5" cy="39" rx="5.6" ry="8.4" transform="rotate(8 39.5 39)" fill={`url(#${u}-eye)`} />
      <ellipse cx="23" cy="35" rx="1.6" ry="2.3" fill="#fffef8" opacity="0.85" />
      <ellipse cx="38" cy="35" rx="1.6" ry="2.3" fill="#fffef8" opacity="0.85" />
    </svg>
  );
}
