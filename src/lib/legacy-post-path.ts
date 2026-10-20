import migratedPosts from '../../config/migrated-posts.json';

/** Keep migrated articles attached to their existing pathname-based Giscus threads. */
export function getLegacyPostPath(pathname: string): string | undefined {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname).replace(/\/$/, '');
  } catch {
    return undefined;
  }
  return migratedPosts.find(({ newPath }) => newPath === decoded)?.oldPath;
}
