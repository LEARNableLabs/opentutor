import { it, expect } from 'vitest';
import fs from 'node:fs';

// #262: the spark is the logo. Every page shows it inline, so it takes the theme's colour,
// and offers the SVG favicon first, the PNG as the fallback.
const PAGES = ['index', 'learn', 'login', 'privacy', '404', 'admin'].map((p) => `public/${p}.html`);
const SPARK = 'M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z';

it.each(PAGES)('%s shows the spark and offers the SVG favicon first', (page) => {
  const html = fs.readFileSync(page, 'utf8');
  expect(html).toMatch(/<svg class="brand-mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C13 7/);
  expect(html).not.toMatch(/<img[^>]+favicon\.png/);
  const svgIcon = html.search(/rel="icon" href="\/?favicon\.svg" type="image\/svg\+xml"/);
  const pngIcon = html.search(/rel="icon"[^>]*favicon\.png/);
  expect(svgIcon).toBeGreaterThan(-1);
  expect(pngIcon).toBeGreaterThan(svgIcon);
  expect(html).toMatch(/rel="apple-touch-icon" href="\/?apple-touch-icon\.png"/);
});

it('the favicon has a dark version, and every source is the same spark', () => {
  const favicon = fs.readFileSync('public/favicon.svg', 'utf8');
  expect(favicon).toMatch(/prefers-color-scheme:\s*dark/);
  for (const file of ['public/favicon.svg', 'public/logo.svg', 'assets/logo/opentutor-spark.svg']) {
    expect(fs.readFileSync(file, 'utf8')).toContain(SPARK);
  }
});

// #266: the owner keeps the original logo on the GitHub README for now; the site uses the spark.
it('the README keeps the original logo for now', () => {
  expect(fs.readFileSync('README.md', 'utf8')).toContain('assets/logo/opentutor-hero-512.png');
});
