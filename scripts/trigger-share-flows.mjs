#!/usr/bin/env node
/**
 * Triggers share and download flows to generate debug logs (session c50b47).
 * Run: node scripts/trigger-share-flows.mjs
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const results = { success: [], failed: [], errors: [] };

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 1. Home page - Share modal - Download PNG & SVG
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 10000 });
    const shareBtn = page.getByRole('button', { name: 'שתפו את העמוד' });
    await shareBtn.click();
    await page.waitForTimeout(500);

    const pngBtn = page.getByRole('button', { name: 'הורד PNG' });
    const svgBtn = page.getByRole('button', { name: 'הורד SVG' });
    if (await pngBtn.isVisible()) {
      await pngBtn.click();
      results.success.push('Share modal: הורד PNG');
    } else {
      results.failed.push('Share modal: הורד PNG not visible');
    }
    await page.waitForTimeout(300);
    if (await svgBtn.isVisible()) {
      await svgBtn.click();
      results.success.push('Share modal: הורד SVG');
    } else {
      results.failed.push('Share modal: הורד SVG not visible');
    }

    // 2. Blessings page - form - submit - download
    await page.goto(`${BASE}/party/blessings`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(2000); // Let React hydrate and store fetch
    const writeBtn = page.getByRole('button', { name: /כתבו ברכה/ });
    await writeBtn.waitFor({ state: 'visible', timeout: 10000 });
    await writeBtn.click();
    await page.waitForTimeout(300);

    await page.getByLabel('שם').fill('Test');
    await page.getByLabel('ברכה').fill('Test blessing');
    await page.getByRole('button', { name: /שליחה/ }).click();

    // Wait for share modal after submit
    const downloadImgBtn = page.getByRole('button', { name: 'הורדת תמונה' });
    try {
      await downloadImgBtn.waitFor({ state: 'visible', timeout: 15000 });
      await downloadImgBtn.click();
      results.success.push('BlessingShareModal: הורדת תמונה');
    } catch (e) {
      results.failed.push('BlessingShareModal: הורדת תמונה - ' + (e.message || String(e)));
    }
  } catch (e) {
    results.errors.push(e.message || String(e));
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify(results, null, 2));
  return results;
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
