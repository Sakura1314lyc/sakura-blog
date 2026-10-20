import assert from 'node:assert/strict';
import test from 'node:test';
import { readMermaidSource } from './mermaid-source';

function pre(
  { stored = null, processed = false, svg = false, text = '' } = {} as {
    stored?: string | null;
    processed?: boolean;
    svg?: boolean;
    text?: string;
  },
): HTMLElement {
  return {
    getAttribute: () => stored,
    hasAttribute: () => processed,
    querySelector: () => (svg ? {} : null),
    textContent: text,
  } as unknown as HTMLElement;
}

test('keeps the cached diagram definition after SVG rendering', () => {
  const source = 'flowchart TD\nA[<b>Hello</b>] --> B';
  assert.equal(readMermaidSource(pre({ stored: source, processed: true, svg: true, text: '#mermaid-id{fill:red}' })), source);
});

test('reads untouched source before the renderer has cached it', () => {
  assert.equal(readMermaidSource(pre({ text: 'sequenceDiagram\nAlice->>Bob: Hello' })), 'sequenceDiagram\nAlice->>Bob: Hello');
});

test('does not mistake SVG style text or error UI for missing source', () => {
  assert.equal(readMermaidSource(pre({ svg: true, text: '#mermaid-id{font-family:arial}' })), '');
  assert.equal(readMermaidSource(pre({ processed: true, text: 'Error rendering diagram: invalid input' })), '');
});

test('rejects generated CSS or SVG even if it was cached as source', () => {
  for (const text of ['#mermaid-id{font-family:arial}', '#dmermaid-id .error-icon{fill:red}', '<svg viewBox="0 0 1 1">']) {
    assert.equal(readMermaidSource(pre({ stored: text })), '');
    assert.equal(readMermaidSource(pre({ text })), '');
  }
});
