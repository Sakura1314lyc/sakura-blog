import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const posts = JSON.parse(readFileSync(new URL('../config/migrated-posts.json', import.meta.url), 'utf8'));

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
