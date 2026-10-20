// Run with:  npx percy exec -- node snapshots.js
const { chromium } = require('playwright');
const percySnapshot = require('@percy/playwright');
const { start } = require('./server');

const BASE = 'http://localhost:4000';

// One snapshot per page; each page is the "target" for a specific kind of change on the feature branch.
const PAGES = [
  { name: 'Home - layout',          path: '/pages/index.html'    }, // layout change
  { name: 'Pricing - color',        path: '/pages/pricing.html'  }, // color change
  { name: 'About - font',           path: '/pages/about.html'    }, // font change
  { name: 'Products - removed el.', path: '/pages/products.html' }, // element disappears
  { name: 'Contact - spacing/text', path: '/pages/contact.html'  }, // spacing + copy change
  { name: 'FAQ - control',          path: '/pages/faq.html'      }, // NEVER changes (control)
];

(async () => {
  const server = await start(4000);
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const p of PAGES) {
    await page.goto(BASE + p.path, { waitUntil: 'networkidle' });
    // make sure every <img> has finished loading (or failed) so snapshots are stable
    await page.evaluate(() => Promise.all([...document.images].map((i) =>
      i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
    await percySnapshot(page, p.name, { widths: [375, 768, 1280] });
    console.log('Snapshot taken:', p.name);
  }

  await browser.close();
  server.close();
})().catch((e) => { console.error(e); process.exit(1); });
