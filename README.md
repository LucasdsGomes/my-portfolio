# Portfólio — Lucas Gomes

Landing page de posicionamento profissional. Single-page, bilíngue (pt-BR / EN), estática.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Vercel

## Rodar

```bash
npm install && npm run dev
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento em http://localhost:3000 |
| `npm run build` | Build de produção (gera as 7 rotas estáticas) |
| `npm run typecheck` | TypeScript sem emitir |
| `npm run lint` | ESLint |

## Onde mexer

Todo o texto e todos os projetos vivem em dois arquivos tipados. **Não é preciso abrir componente nenhum para editar conteúdo.**

```
src/content/portfolio.pt.ts    conteúdo em português
src/content/portfolio.en.ts    conteúdo em inglês
src/types/portfolio.ts         o contrato que os dois obedecem
```

Os dois idiomas compartilham o mesmo tipo: se um projeto existir em um e faltar no outro, `npm run build` quebra antes do deploy.

### Paleta e tipografia

Os tokens estão em `src/app/globals.css`, no bloco `@theme` — o Tailwind gera as classes (`bg-surface`, `text-accent-warm`…) a partir dali. Nenhum componente carrega hex solto.

Uma exceção: `src/app/og.tsx` repete os hex, porque o gerador da imagem de Open Graph não lê CSS. Mudou a paleta, mude nos dois lugares.

## Retrato

O hero mostra a foto se existir `public/portrait.jpg`. Sem o arquivo, o hero degrada para uma coluna só — sem moldura vazia, sem placeholder. Recomendado: ao menos 1200px no lado menor, fundo escuro ou neutro.

## Variáveis de ambiente

| Variável | Para quê |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Domínio de produção. Alimenta canonical, hreflang, sitemap e Open Graph. |

Sem ela o site cai na URL do deploy da Vercel: funciona, mas não é canônica. Defina no painel da Vercel antes de apontar o domínio.

## Rotas

| Rota | Idioma |
| --- | --- |
| `/` | pt-BR |
| `/en` | en |
| `/sitemap.xml`, `/robots.txt` | — |
| `/opengraph-image`, `/en/opengraph-image` | imagem OG gerada no build |

Cada idioma tem seu próprio root layout (`src/app/(pt)` e `src/app/(en)`), o que permite `<html lang>` correto em cada um sem JavaScript.

## Acessibilidade e movimento

- `prefers-reduced-motion: reduce` desliga toda animação; os mostradores do hero entregam o valor final direto.
- O HTML servido já traz os valores finais — sem JS, o hero lê certo e não há layout shift.
- Modal de projeto é `<dialog>` nativo: focus trap, Escape e devolução de foco sem biblioteca.
- Foco de teclado visível em todo elemento interativo; alvos de toque de 44px.

## `legacy/`

Guarda o portfólio anterior (Vite + React + Bootstrap), preservado para consulta. Não entra no build nem no lint. Pode ser removido quando não fizer mais falta.
