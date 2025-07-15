// const { chromium } = require('playwright');
// const fs = require('fs');
// const path = require('path');

// async function takeScreenshot(htmlPath, screenshotPath) {
//   const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//   // Ensure folder exists
//   const screenshotDir = path.dirname(screenshotPath);
//   if (!fs.existsSync(screenshotDir)) {
//     fs.mkdirSync(screenshotDir, { recursive: true });
//     console.log(`📁 Created folder: ${screenshotDir}`);
//   }

//   const browser = await chromium.launch(); // No need for executablePath
//   const page = await browser.newPage();

//   const htmlContent = fs.readFileSync(htmlPath, 'utf8');
//   await page.setContent(htmlContent, { waitUntil: 'networkidle' });

//   try {
//     await page.waitForSelector('.fa-bar-chart', { timeout: 5000 });
//     await page.click('.fa-bar-chart');
//   } catch (err) {
//     console.warn('⚠️ .fa-bar-chart not found or clickable:', err.message);
//   }

//   await delay(1000);
//   await page.setViewportSize({ width: 1920, height: 1080 });
//   await page.screenshot({ path: screenshotPath, fullPage: true });

//   console.log(`📸 Screenshot saved: ${screenshotPath}`);
//   await browser.close();
//   console.log('🧹 Playwright browser closed');
// }

// module.exports = { takeScreenshot };

const { spawn } = require('child_process');
const path = require('path');

function take_screenshot(htmlPath, screenshotPath) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../services/screenshot.py');
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

    const proc = spawn(pythonCmd, [pythonScript, htmlPath, screenshotPath]);
    let stderr = '';

    proc.stderr.on('data', data => {
      stderr += data.toString();
    });

    proc.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Screenshot failed: ${stderr}`));
      }
    });
  });
}

module.exports = { take_screenshot };