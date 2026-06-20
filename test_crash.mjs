import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.static('dist'));

const server = app.listen(5000, '127.0.0.1', async () => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    await page.goto('http://127.0.0.1:5000', { waitUntil: 'networkidle0' });
    
    const rootHTML = await page.evaluate(() => document.getElementById('root')?.innerHTML);
    console.log("ROOT HTML CONTENT:\n", rootHTML);
    
    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
    process.exit(0);
  }
});
