interface FireflyProps {
  /** prefixo único dos ids de filtro e gradiente desta instância */
  uid: string;
  /** pousado na rocha (título) ou voando (descida) */
  pose?: 'perched' | 'flying';
  className?: string;
  /** posição quando o vagalume vive dentro de outro SVG (cenário) */
  frame?: { x: number; y: number; width: number; height: number };
}

/**
 * O protagonista, redesenhado em vetor a partir da folha de conceito:
 * silhueta preta, cabeça grande, um olho de luz, antenas longas que
 * curvam para frente e asas que brilham por dentro.
 *
 * Desenhado de perfil, olhando para a direita. As partes que se movem
 * (olho, asas, brilho) têm classe própria para a animação ficar no CSS.
 */
export function Firefly({ uid, pose = 'perched', className = '', frame }: FireflyProps) {
  const halo = `${uid}-halo`;
  const wingFill = `${uid}-wing`;
  const lantern = `${uid}-lantern`;
  const flying = pose === 'flying';
  const wingClass = flying ? 'ff-wing-fly' : 'ff-wing-rest';

  return (
    <svg
      viewBox="0 0 170 170"
      {...frame}
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
      overflow="visible"
    >
      <defs>
        <filter id={halo} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={wingFill} cx="78%" cy="62%" r="80%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="38%" stopColor="#fed871" />
          <stop offset="100%" stopColor="#c28a30" stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id={lantern} cx="50%" cy="65%" r="60%">
          <stop offset="0%" stopColor="#fff6d6" />
          <stop offset="55%" stopColor="#fdd05f" />
          <stop offset="100%" stopColor="#c28a30" />
        </radialGradient>
      </defs>

      <g className={flying ? '' : 'ff-bob'}>
        {/* asas: atrás do corpo, presas ao tórax */}
        <g className="ff-glow" filter={`url(#${halo})`}>
          <path
            className={`${wingClass} ff-wing-back`}
            d="M86 88 C 62 52, 24 36, 11 46 C 3 54, 28 80, 86 92 Z"
            fill={`url(#${wingFill})`}
            opacity="0.92"
          />
          <path
            className={wingClass}
            d="M84 94 C 60 94, 28 104, 23 119 C 21 130, 57 121, 84 98 Z"
            fill={`url(#${wingFill})`}
            opacity="0.88"
          />
        </g>
        {/* nervuras: dão peso de asa de inseto à mancha de luz */}
        <g fill="none" stroke="#c28a30" strokeWidth="0.9" strokeLinecap="round" opacity="0.55">
          <path d="M84 89 C 62 64, 36 52, 18 49" />
          <path d="M70 76 C 56 62, 44 58, 34 58" />
          <path d="M82 96 C 62 100, 42 108, 28 117" />
        </g>

        {/* abdômen: a lanterna do vagalume */}
        <ellipse
          cx="64"
          cy="114"
          rx="12"
          ry="21"
          transform="rotate(-52 64 114)"
          fill="#01050b"
        />
        <ellipse
          className="ff-glow"
          cx="54"
          cy="122"
          rx="8"
          ry="11"
          transform="rotate(-52 54 122)"
          fill={`url(#${lantern})`}
          filter={`url(#${halo})`}
        />

        {/* pernas */}
        <g fill="none" stroke="#01050b" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
          {flying ? (
            <>
              <path d="M92 106 L 100 118 L 96 128" />
              <path d="M80 112 L 84 126 L 78 134" />
            </>
          ) : (
            <>
              <path d="M94 104 L 104 124 L 99 146" />
              <path d="M80 112 L 70 128 L 74 147" />
              <path d="M100 98 L 112 108 L 116 116" strokeWidth="2.6" />
            </>
          )}
        </g>

        {/* tórax e cabeça */}
        <ellipse cx="88" cy="94" rx="14" ry="17" transform="rotate(-22 88 94)" fill="#01050b" />
        <circle cx="104" cy="62" r="25" fill="#01050b" />

        {/* antenas: longas, curvando para frente, pontas mais grossas */}
        <g fill="none" stroke="#01050b" strokeLinecap="round">
          <path d="M97 40 C 90 17, 103 1, 127 5" strokeWidth="2.8" />
          <path d="M107 39 C 110 19, 131 10, 150 21" strokeWidth="2.8" />
        </g>
        <g fill="#fdd05f" className="ff-glow" filter={`url(#${halo})`}>
          <circle cx="127" cy="5" r="2.2" opacity="0.8" />
          <circle cx="150" cy="21" r="2.2" opacity="0.8" />
        </g>

        {/* o olho: a única coisa que se vê do rosto */}
        <g filter={`url(#${halo})`}>
          <ellipse
            className="ff-eye"
            cx="116"
            cy="64"
            rx="9.5"
            ry="11.5"
            fill={`url(#${lantern})`}
          />
        </g>
      </g>
    </svg>
  );
}
