import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>('/public/img/**/*.{avif,jpg,jpeg,png,webp}');

export const responsiveImageQuality = 50;
export const defaultHeroImage = '/img/site_header_1920.webp';
// On tall phones every cover shows the same central portrait crop, so the banner can persist across pages.
export const portraitHeroMedia = '(max-width: 440px) and (max-aspect-ratio: 8/15)';
export const wideHeroMedia = `not all and ${portraitHeroMedia}`;
export const portraitHeroTransform = {
  width: 400,
  height: 450,
  densities: [1, 2, 3],
  fit: 'cover' as const,
  position: 'centre',
};
export async function resolveResponsiveImage(src: string, maxWidth = 1600) {
  const image = await images[`/public${src}`]?.();
  if (!image) return undefined;
  const width = Math.min(maxWidth, image.default.width);
  const widths = [...new Set([400, 800, 1200, width].filter((candidate) => candidate <= width))];
  return { src: image.default, width, widths };
}
