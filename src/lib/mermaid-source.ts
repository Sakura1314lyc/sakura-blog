function isRenderedContent(value: string): boolean {
  return /^\s*(?:#(?:d?mermaid)[\w-]*\s*[.{]|<svg\b)/i.test(value);
}

/** SVG textContent includes its <style> contents, so it must never be used as diagram source. */
export function readMermaidSource(preElement: HTMLElement): string {
  const stored = preElement.getAttribute('data-diagram');
  if (stored !== null) return isRenderedContent(stored) ? '' : stored;
  if (preElement.hasAttribute('data-processed') || preElement.querySelector('svg, style')) return '';
  const text = preElement.textContent || '';
  return isRenderedContent(text) ? '' : text;
}
