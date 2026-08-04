import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('https://velvety-malasada-b11d99.netlify.app', { waitUntil: 'networkidle0' });
  
  await page.screenshot({ path: 'netlify_screenshot.png' });
  console.log("Screenshot saved to netlify_screenshot.png");
  
  const html = await page.content();
  console.log("HTML length:", html.length);
  console.log("HTML content:", html);
  
  await browser.close();
})();
