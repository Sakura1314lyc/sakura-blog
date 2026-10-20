import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const posts = JSON.parse(readFileSync(new URL('../config/migrated-posts.json', import.meta.url), 'utf8'));

test('the homepage and article tabs share the optimized profile avatar favicon', () => {
  let sharedIcon;
  for (const route of ['', '/about', '/archives', '/categories', ...posts.map(({ newPath }) => newPath)]) {
    const html = readFileSync(new URL(`../dist${route}/index.html`, import.meta.url), 'utf8');
    const icon = html.match(/<link\b[^>]*\brel="icon"[^>]*>/)?.[0];
    assert.ok(icon, `Missing favicon on ${route || '/'}`);
    assert.match(icon, /type="image\/png"/);
    assert.match(icon, /sizes="64x64"/);
    const href = icon.match(/\bhref="([^"]+)"/)?.[1];
    assert.match(href, /^\/_astro\/[^/]+\.png$/);
    const png = readFileSync(new URL(`../dist${href}`, import.meta.url));
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), 64);
    assert.equal(png.readUInt32BE(20), 64);
    sharedIcon ??= href;
    assert.equal(href, sharedIcon);
  }
});

test('all migrated article pages render without broken LaTeX and retain their legacy redirects', () => {
  let mathCount = 0;
  for (const post of posts) {
    const html = readFileSync(new URL(`../dist${post.newPath}/index.html`, import.meta.url), 'utf8');
    const errors = [...html.matchAll(/<span class="katex-error"[^>]*>[\s\S]*?<\/span>/g)];
    assert.equal(errors.length, 0, `${post.file}: ${errors.map(([error]) => error).join('\n')}`);
    mathCount += [...html.matchAll(/class="katex"/g)].length;
    assert.ok(html.includes('data-pagefind-body'), `Missing searchable article body: ${post.file}`);
    const redirect = readFileSync(new URL(`../dist${post.oldPath}index.html`, import.meta.url), 'utf8');
    assert.ok(decodeURIComponent(redirect).includes(post.newPath), `Broken legacy redirect: ${post.file}`);
  }
  assert.ok(mathCount > 200, `Expected rendered math across the original articles, found ${mathCount}`);
  console.log(`Verified ${posts.length} article pages; ${mathCount} math expressions; zero KaTeX errors.`);
});
