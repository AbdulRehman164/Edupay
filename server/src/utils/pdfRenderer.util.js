import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

let browser;

async function getBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({ headless: true });
    }
    return browser;
}

export async function renderPdf(html, outputPath, filename) {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const buffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm' },
    });

    const filePath = path.join(outputPath, `${filename}.pdf`);
    fs.writeFileSync(filePath, buffer);
    await page.close();

    return filePath;
}

export async function closeBrowser() {
    if (browser) await browser.close();
    browser = null;
}
