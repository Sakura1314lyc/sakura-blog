/**
 * Exports a rendered diagram SVG as a standalone file.
 *
 * Diagram styles read the page's theme through `var(--…)` (see mermaid-theme.ts). A downloaded
 * file, or an SVG drawn into a canvas through an <img>, has no page around it, so every variable
 * is resolved to its current value before serializing; otherwise each fill falls back to black.
 */

const VAR_PATTERN = /var\((--[\w-]+)\)/g;
const MAX_CANVAS_AREA = 16_000_000;

/** Natural (designed) size of a diagram, from its viewBox. */
export function getNaturalSize(svg: SVGSVGElement): { width: number; height: number } | null {
  const box = svg.viewBox.baseVal;
  if (box && box.width > 0 && box.height > 0) return { width: box.width, height: box.height };
  return null;
}

function resolveVariables(text: string, scope: Element): string {
  const computed = getComputedStyle(scope);
  return text.replace(VAR_PATTERN, (match, name: string) => computed.getPropertyValue(name).trim() || match);
}

export function serializeDiagram(svg: SVGSVGElement, background: string): { markup: string; width: number; height: number } {
  const size = getNaturalSize(svg) ?? { width: svg.clientWidth, height: svg.clientHeight };
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(size.width));
  clone.setAttribute('height', String(size.height));
  clone.style.maxWidth = '';
  clone.style.maxHeight = '';
  clone.style.backgroundColor = background;

  for (const style of clone.querySelectorAll('style')) {
    style.textContent = resolveVariables(style.textContent ?? '', svg);
  }
  // Labels were measured in the page's web font, which a standalone image can't load. The fallback
  // runs wider, so let labels overflow their boxes evenly instead of being clipped at the right edge.
  const labelFix = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  labelFix.textContent =
    'foreignObject{overflow:visible}foreignObject>div{display:flex!important;justify-content:center;width:100%!important}';
  clone.prepend(labelFix);
  for (const el of clone.querySelectorAll<SVGElement | HTMLElement>('[style*="var("]')) {
    el.setAttribute('style', resolveVariables(el.getAttribute('style') ?? '', svg));
  }

  return { markup: new XMLSerializer().serializeToString(clone), ...size };
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Saves the diagram as a 2× PNG. Where the browser still refuses to export the canvas (Safari
 * taints any SVG with <foreignObject>), the SVG itself is saved instead, which keeps it lossless.
 */
export async function downloadDiagram(svg: SVGSVGElement, basename: string, background: string): Promise<void> {
  const { markup, width, height } = serializeDiagram(svg, background);
  const svgBlob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' });

  try {
    const image = new Image();
    image.decoding = 'async';
    // A data: URL, not a blob: one: Chromium taints the canvas when a blob-loaded SVG has
    // <foreignObject>, which every mermaid label is.
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
    await image.decode();

    // 2× for sharpness, but stay under Safari's ~16.7 Mpx canvas limit, past which it exports a blank image.
    const ratio = Math.min(2, Math.sqrt(MAX_CANVAS_AREA / (width * height)));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2d context unavailable');
    context.scale(ratio, ratio);
    context.drawImage(image, 0, 0, width, height);

    const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!png) throw new Error('empty PNG');
    saveBlob(png, `${basename}.png`);
  } catch {
    saveBlob(svgBlob, `${basename}.svg`);
  }
}
