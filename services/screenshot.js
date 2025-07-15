const puppeteer = require('puppeteer');
const fs = require('fs');

async function takeScreenshot(htmlPath, screenshotPath) {
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    await page.setContent(htmlContent, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.fa-bar-chart', { timeout: 5000 });
    await page.click('.fa-bar-chart');

    await delay(1000);

    await page.setViewport({ width: 1920, height: 1080 });
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log(`📸 Screenshot saved: ${screenshotPath}`);
  } catch (err) {
    console.error('❌ Failed to take screenshot:', err.message);
    throw err; // rethrow so caller can handle it too
  } finally {
    if (browser) {
      await browser.close();
      console.log('🧹 Puppeteer browser closed');
    }
  }
}

module.exports = { takeScreenshot };
