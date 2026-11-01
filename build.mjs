// Builds the static pages: src/layout.html wrapped around each src/pages/<file>.
// Usage: node build.mjs   (no dependencies; writes the .html files next to this script)
//
// Placeholders the layout can use:
//   {{title}} {{description}}  per-page, from PAGES below
//   {{page}}                   the page id (set on <body data-page>)
//   {{url}} {{site}}           absolute page URL / site root, for link previews and canonical
//   {{v}}                      VERSION, appended to CSS/JS URLs to bust caches
//   {{content}}                the page body from src/pages/<file>
//   {{price:id}}               a price from PRICES below (a missing id stops the build)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Bump this whenever a CSS or JS file changes, so browsers fetch fresh copies.
const VERSION = '13';

// Where the site is published (keep the trailing slash). Link previews need absolute URLs.
// Change it when the site goes live (GitHub Pages or a custom domain), then rebuild.
const SITE = 'https://hasankourani.github.io/coach/';

// Every price on the site, in one place. ALL OF THESE ARE PLACEHOLDERS the owner asked for
// (see brief.md, "Placeholders"). Change a price here, rebuild, and every page and every
// WhatsApp message follows.
const PRICES = {
  online: '$50',   // Online Coaching, per month
  plan: '$25',     // Custom Plan, one time
};

const PAGES = [
  {
    id: 'home',
    file: 'index.html',
    title: 'Hasan Kourani | Personal trainer, online and 1-on-1',
    description: 'Custom training plans, weekly check-ins and a coach who actually answers. Book a free chat with Hasan on WhatsApp.',
  },
];

const root = dirname(fileURLToPath(import.meta.url));
const layout = readFileSync(join(root, 'src/layout.html'), 'utf8');

for (const page of PAGES) {
  const content = readFileSync(join(root, 'src/pages', page.file), 'utf8').trimEnd();
  const html = layout
    // A function replacement keeps "$" in the page (prices) from being read as a pattern.
    .replace('{{content}}', () => content)
    .replaceAll('{{title}}', page.title)
    .replaceAll('{{description}}', page.description)
    .replaceAll('{{page}}', page.id)
    .replaceAll('{{url}}', page.file === 'index.html' ? SITE : SITE + page.file)
    .replaceAll('{{site}}', SITE)
    .replaceAll('{{v}}', VERSION)
    .replace(/\{\{price:([\w-]+)\}\}/g, (_, id) => {
      if (!(id in PRICES)) throw new Error(`${page.file}: no price "${id}" in PRICES (build.mjs)`);
      return PRICES[id];
    });
  writeFileSync(join(root, page.file), html);
  console.log(`built ${page.file}`);
}
