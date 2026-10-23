"""
Gera os assets do jogo a partir das artes originais em art/source/.

    python -P scripts/art/build_assets.py

O que sai:
  public/game/cenarios/   cada cenário em AVIF e WebP, em três larguras
  public/game/criaturas/  cada criatura em AVIF e WebP, em três larguras
  public/game/vagalume/   cada peça do protagonista recortada, com alfa
  src/components/game/art/assets.generated.ts   dimensões e placeholders

Os originais nunca vão para o site. Rode de novo sempre que trocar uma arte.
"""

from __future__ import annotations

import base64
import io
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'art' / 'source'
OUT = ROOT / 'public' / 'game'
GEN = ROOT / 'src' / 'components' / 'game' / 'art' / 'assets.generated.ts'

SCENE_WIDTHS = (1672, 1280, 768)
CREATURE_WIDTHS = (768, 512, 320)

# Caixas das peças na folha partes.png (x0, y0, x1, y1), achadas por rotulagem
# de componentes conexos e conferidas a olho. As asas vieram grudadas pelo
# brilho e são separadas por uma linha de corte.
PART_BOXES: dict[str, tuple[int, int, int, int]] = {
    'head': (104, 52, 484, 360),
    'thorax': (112, 372, 252, 584),
    'abdomen': (144, 548, 364, 848),
    'wing-upper': (388, 284, 860, 462),
    'wing-lower': (406, 462, 740, 600),
    'arm-upper-a': (976, 88, 1080, 240),
    'arm-upper-b': (1108, 172, 1184, 304),
    'arm-fore-a': (896, 236, 1008, 496),
    'arm-fore-b': (1120, 296, 1196, 520),
    'leg-thigh-a': (968, 436, 1100, 628),
    'leg-shin-a': (1004, 604, 1120, 748),
    'leg-foot-a': (972, 736, 1132, 872),
    'arm-upper-c': (1396, 88, 1496, 240),
    'arm-fore-c': (1468, 236, 1584, 492),
    'leg-thigh-c': (1388, 436, 1508, 628),
    'leg-shin-c': (1356, 604, 1472, 748),
    'leg-foot-c': (1344, 736, 1496, 868),
}


def save_variants(im: Image.Image, base: Path, widths: tuple[int, ...]) -> list[int]:
    """Gera as larguras pedidas que cabem na imagem, mais a nativa. Devolve as geradas."""
    base.parent.mkdir(parents=True, exist_ok=True)
    made = sorted({w for w in widths if w < im.width} | {im.width}, reverse=True)
    for w in made:
        h = round(im.height * w / im.width)
        resized = im if w == im.width else im.resize((w, h), Image.Resampling.LANCZOS)
        resized.save(f'{base}-{w}.avif', quality=62, speed=4)
        resized.save(f'{base}-{w}.webp', quality=82, method=6)
    return made


def lqip(im: Image.Image) -> str:
    """Miniatura borrada em base64: aparece enquanto a imagem real carrega."""
    tiny = im.convert('RGB').resize((24, round(24 * im.height / im.width)), Image.Resampling.BILINEAR)
    tiny = tiny.filter(ImageFilter.GaussianBlur(1))
    buf = io.BytesIO()
    tiny.save(buf, 'WEBP', quality=40)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()


def fill_holes(mask: np.ndarray) -> np.ndarray:
    """Tudo que não é alcançável a partir da borda é interior da peça."""
    outside = np.zeros_like(mask)
    outside[0, :] = ~mask[0, :]
    outside[-1, :] = ~mask[-1, :]
    outside[:, 0] = ~mask[:, 0]
    outside[:, -1] = ~mask[:, -1]
    free = ~mask
    while True:
        grown = outside.copy()
        grown[1:, :] |= outside[:-1, :]
        grown[:-1, :] |= outside[1:, :]
        grown[:, 1:] |= outside[:, :-1]
        grown[:, :-1] |= outside[:, 1:]
        grown &= free
        if (grown == outside).all():
            return ~outside
        outside = grown


def largest_component(mask: np.ndarray) -> np.ndarray:
    """Mantém só o maior pedaço conectado: as caixas pegam beiradas das vizinhas."""
    s = 2
    h, w = mask.shape[0] // s, mask.shape[1] // s
    m = mask[: h * s, : w * s].reshape(h, s, w, s).any(axis=(1, 3))
    labels = np.zeros((h, w), dtype=np.int32)
    parent = [0]

    def find(x: int) -> int:
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for y in range(h):
        for x in range(w):
            if not m[y, x]:
                continue
            near = [labels[y - 1, x] if y else 0, labels[y, x - 1] if x else 0]
            near = [n for n in near if n]
            if not near:
                parent.append(len(parent))
                labels[y, x] = len(parent) - 1
            else:
                root = min(find(n) for n in near)
                labels[y, x] = root
                for n in near:
                    parent[find(n)] = root

    roots = np.vectorize(lambda v: find(v) if v else 0)(labels)
    ids, counts = np.unique(roots[roots > 0], return_counts=True)
    keep = roots == ids[counts.argmax()]
    full = np.kron(keep, np.ones((s, s), dtype=bool))
    out = np.zeros_like(mask)
    out[: full.shape[0], : full.shape[1]] = full
    return out


def cut_part(sheet: np.ndarray, bg: np.ndarray, box: tuple[int, int, int, int]) -> Image.Image:
    """
    Recorte em duas camadas. O corpo é quase da cor do fundo, então uma
    máscara por distância de cor sairia semitransparente: a silhueta é
    preenchida por dentro e fica sólida. Só que o halo do brilho também
    difere do fundo, e se entrar na máscara sólida vira uma auréola escura.
    Por isso a máscara sólida aceita só o que não se explica como fundo mais
    brilho amarelo, e o brilho entra à parte por luminância, com alfa suave.
    """
    x0, y0, x1, y1 = box
    crop = sheet[y0:y1, x0:x1].astype(np.float32)
    delta = crop - bg
    dist = np.sqrt((delta**2).sum(-1))

    # quanto do pixel se explica como "fundo + um pouco de amarelo do brilho"
    glow_dir = np.array([253.0, 208.0, 95.0]) - bg
    k = np.clip((delta @ glow_dir) / float(glow_dir @ glow_dir), 0, 1)
    residual = np.sqrt(((delta - k[..., None] * glow_dir) ** 2).sum(-1))

    lum = crop @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    bg_lum = float(bg @ np.array([0.2126, 0.7152, 0.0722]))
    glow_a = np.clip((lum - bg_lum - 3) / 70, 0, 1) ** 0.85

    # corpo: difere do fundo e NÃO é só brilho somado a ele
    body = (dist > 11) & (residual > 9)
    region = largest_component(body | (glow_a > 0.35))
    body &= region
    # fecha as frestas que a luz de contorno abre na silhueta, depois preenche
    closed = np.asarray(
        Image.fromarray((body * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))
    ) > 0
    solid = fill_holes(closed)
    solid_img = Image.fromarray((solid * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.9))
    solid_a = np.asarray(solid_img).astype(np.float32) / 255

    near = np.asarray(
        Image.fromarray((region * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(15))
    ) > 0
    alpha = np.maximum(solid_a, glow_a * near)

    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.clip((crop - bg * (1 - alpha[..., None])) / safe, 0, 255)
    rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)

    ys, xs = np.where(alpha > 0.02)
    return Image.fromarray(rgba, 'RGBA').crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


# nomes como vieram -> nome publicado. Sem recompressão: os efeitos já são
# curtos e a música, em 192 kbps, pesa cerca de 1,4 MB por minuto.
AUDIO = {
    'tema-da-floresta.mp3': 'musica-floresta.mp3',
    'tema-da-floresta(outraopcao).mp3': 'musica-floresta-alt.mp3',
    'tema-do-abismo.mp3': 'musica-abismo.mp3',
    'menu-mover.mp3': 'menu-mover.mp3',
    'menu-confirmar.mp3': 'menu-confirmar.mp3',
    'regiao.mp3': 'regiao.mp3',
    'pulo.mp3': 'pulo.mp3',
    'pouso.mp3': 'pouso.mp3',
    'cutucar.mp3': 'cutucar-1.mp3',
    'cutucar2.mp3': 'cutucar-2.mp3',
}


def main() -> None:
    manifest: dict[str, dict] = {'scenes': {}, 'creatures': {}, 'parts': {}, 'audio': {}}

    (OUT / 'audio').mkdir(parents=True, exist_ok=True)
    for source, target in AUDIO.items():
        path = SRC / 'musica' / source
        if not path.exists():
            print('áudio ausente', source)
            continue
        (OUT / 'audio' / target).write_bytes(path.read_bytes())
        manifest['audio'][target.removesuffix('.mp3')] = {'bytes': path.stat().st_size}
        print('áudio', target)

    for path in sorted((SRC / 'cenarios').glob('*.png')):
        im = Image.open(path).convert('RGB')
        widths = save_variants(im, OUT / 'cenarios' / path.stem, SCENE_WIDTHS)
        manifest['scenes'][path.stem] = {
            'width': im.width,
            'height': im.height,
            'widths': widths,
            'lqip': lqip(im),
        }
        print('cenário', path.stem, im.size)

    for path in sorted((SRC / 'criaturas').glob('*.png')):
        im = Image.open(path).convert('RGB')
        widths = save_variants(im, OUT / 'criaturas' / path.stem, CREATURE_WIDTHS)
        manifest['creatures'][path.stem] = {'width': im.width, 'height': im.height, 'widths': widths}
        print('criatura', path.stem, im.size)

    sheet_im = Image.open(SRC / 'protagonista' / 'partes.png').convert('RGB')
    sheet = np.asarray(sheet_im).astype(np.float32)
    corners = np.concatenate([sheet[:40, :40].reshape(-1, 3), sheet[-40:, -40:].reshape(-1, 3)])
    bg = np.median(corners, axis=0)
    (OUT / 'vagalume').mkdir(parents=True, exist_ok=True)

    for name, box in PART_BOXES.items():
        part = cut_part(sheet, bg, box)
        part.save(OUT / 'vagalume' / f'{name}.webp', quality=90, method=6)
        manifest['parts'][name] = {'width': part.width, 'height': part.height}
        print('peça', name, part.size)

    GEN.parent.mkdir(parents=True, exist_ok=True)
    GEN.write_text(
        '// Gerado por scripts/art/build_assets.py. Não edite à mão.\n\n'
        f'export const ART = {json.dumps(manifest, indent=2, ensure_ascii=False)} as const;\n',
        encoding='utf-8',
    )
    print('manifesto', GEN.relative_to(ROOT))


if __name__ == '__main__':
    main()
