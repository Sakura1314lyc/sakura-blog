import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import migratedPosts from '../config/migrated-posts.json';
import { getLegacyPostPath } from '../src/lib/legacy-post-path';

test('all 34 migrated articles exist with stable slugs and permanent redirects', () => {
  const { redirects } = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.equal(migratedPosts.length, 34);
  assert.equal(new Set(migratedPosts.map(({ newPath }) => newPath)).size, 34);
  for (const post of migratedPosts) {
    const file = new URL(`../src/content/blog/${post.file}`, import.meta.url);
    assert.ok(existsSync(file), post.file);
    const content = readFileSync(file, 'utf8');
    assert.ok(content.includes(`link: "${post.slug}"`), `Stable slug missing: ${post.file}`);
    assert.ok(
      redirects.some(
        (redirect: { source: string; destination: string; permanent: boolean }) =>
          redirect.source === post.oldPath.replace(/\/$/, '') && redirect.destination === post.newPath && redirect.permanent,
      ),
      `Redirect missing: ${post.oldPath}`,
    );
    assert.equal(getLegacyPostPath(encodeURI(post.newPath)), post.oldPath);
    assert.equal(getLegacyPostPath(`${post.newPath}/`), post.oldPath);
  }
});

test('new posts and non-post pages retain ordinary comment mapping', () => {
  assert.equal(getLegacyPostPath('/post/a-new-article'), undefined);
  assert.equal(getLegacyPostPath('/about'), undefined);
  assert.equal(getLegacyPostPath('/post/%E0%A4'), undefined);
});
