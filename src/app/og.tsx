import { ImageResponse } from 'next/og';
import type { Locale } from '@/types/portfolio';
import { getContent } from '@/content';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/**
 * Os tokens estão duplicados aqui porque o gerador de imagem não lê o
 * globals.css. Se mudar a paleta, mude nos dois lugares.
 */
const C = {
  bg: '#0B0D10',
  line: '#242C36',
  fg: '#EDF2F6',
  muted: '#8994A1',
  accent: '#5AD1FF',
  warm: '#FFC24B',
};

/**
 * Busca uma fonte do Google para o OG ficar na tipografia da página.
 * Se a rede falhar no build, cai na fonte padrão do next/og. Imagem
 * menos fiel, mas nunca um build quebrado.
 */
async function loadFont(family: string, weight: number, text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`,
      {
        headers: {
          // UA antiga de propósito: com a atual o Google devolve woff2,
          // que o satori não sabe ler. Com esta ele devolve woff.
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.46 Safari/536.5',
        },
      },
    ).then((res) => res.text());

    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype|woff)'\)/)?.[1];
    if (!url) return null;

    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

export async function buildOgImage(locale: Locale) {
  const content = getContent(locale);
  const { hero } = content;

  // o título vai em caixa alta: o subset precisa conter os dois casos
  const displayText = `${hero.headline}${hero.headline.toUpperCase()}${hero.name}`;
  const monoText = `${hero.eyebrow}${hero.role}${hero.location}${hero.gauges
    .map((g) => `${g.label}${g.display}`)
    .join('')}`;

  const [saira, mono] = await Promise.all([
    loadFont('Saira', 600, displayText),
    loadFont('JetBrains+Mono', 400, monoText),
  ]);

  const fonts = [
    ...(saira ? [{ name: 'Saira', data: saira, weight: 600 as const, style: 'normal' as const }] : []),
    ...(mono ? [{ name: 'JetBrains Mono', data: mono, weight: 400 as const, style: 'normal' as const }] : []),
  ];

  // passar `fontFamily: undefined` quebra o satori; a chave tem que sumir
  const display = saira ? { fontFamily: 'Saira' } : {};
  const code = mono ? { fontFamily: 'JetBrains Mono' } : {};

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: C.bg,
          padding: 68,
          borderTop: `6px solid ${C.accent}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              ...code,
              fontSize: 22,
              color: C.accent,
              letterSpacing: 3,
            }}
          >
            {hero.eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              ...display,
              fontSize: 58,
              lineHeight: 1.08,
              color: C.fg,
              maxWidth: 1000,
              textTransform: 'uppercase',
            }}
          >
            {hero.headline}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', ...display, fontSize: 30, color: C.fg }}>
              {hero.name}
            </div>
            <div
              style={{ display: 'flex', marginTop: 8, ...code, fontSize: 20, color: C.muted }}
            >
              {hero.role} · {hero.location}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
            {hero.gauges.map((gauge) => (
              <div
                key={gauge.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: `1px solid ${C.line}`,
                  borderRadius: 4,
                  padding: '12px 16px',
                }}
              >
                <div style={{ display: 'flex', ...code, fontSize: 15, color: C.muted }}>
                  {gauge.label}
                </div>
                <div
                  style={{
                    display: 'flex',
                    marginTop: 8,
                    ...code,
                    fontSize: 24,
                    color: C.warm,
                  }}
                >
                  {gauge.display}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, ...(fonts.length > 0 ? { fonts } : {}) },
  );
}
