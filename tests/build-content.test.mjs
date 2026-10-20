import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { load } from 'js-yaml';

const posts = JSON.parse(readFileSync(new URL('../config/migrated-posts.json', import.meta.url), 'utf8'));

test('restored navigation points to built pages using the configured personal accounts', () => {
  const config = load(readFileSync(new URL('../config/site.yaml', import.meta.url), 'utf8'));
  const home = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  for (const route of ['/friends', '/about', '/music', '/editor', '/bangumi']) {
    assert.ok(home.includes(`href="${route}"`), `Missing navigation: ${route}`);
    const html = readFileSync(new URL(`../dist${route}/index.html`, import.meta.url), 'utf8');
    assert.ok(!html.includes('http-equiv="refresh"'), `Unexpected redirect: ${route}`);
  }
  const music = readFileSync(new URL('../dist/music/index.html', import.meta.url), 'utf8');
  const escapeAttribute = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  assert.ok(music.includes(`data-src="${escapeAttribute(JSON.stringify(config.bgm.audio))}"`));
  const bangumi = readFileSync(new URL('../dist/bangumi/index.html', import.meta.url), 'utf8');
  assert.ok(bangumi.includes(`userId&quot;:[0,&quot;${config.bangumi.userId}&quot;]`));
  assert.ok(bangumi.includes(`href="https://bangumi.tv/user/${config.bangumi.userId}"`));
  const editor = readFileSync(new URL('../dist/editor/index.html', import.meta.url), 'utf8');
  assert.ok(editor.includes(`写作室 · ${config.site.title}`));
});

test('blog, feature and writing-room tabs share the optimized profile avatar favicon', () => {
  let sharedIcon;
  for (const route of [
    '',
    '/about',
    '/archives',
    '/categories',
    '/friends',
    '/music',
    '/bangumi',
    '/editor',
    '/editor/preview',
    ...posts.map(({ newPath }) => newPath),
  ]) {
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
