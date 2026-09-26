const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://127.0.0.1:8788/partner-with-us/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'contact_page_screenshot.png', fullPage: true });
  await browser.close();
})();
