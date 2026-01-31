import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

let browser;

async function getBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ],
        });
    }
    return browser;
}

export async function renderPdf(html, outputPath, filename) {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        await page.setContent(html, {
            waitUntil: ['domcontentloaded', 'networkidle2'],
            timeout: 30000,
        });

        const buffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', bottom: '20mm' },
        });

        const filePath = path.join(outputPath, `${filename}.pdf`);
        await fs.promises.writeFile(filePath, buffer);

        return filePath;
    } finally {
        if (!page.isClosed()) {
            await page.close();
        }
    }
}

export async function closeBrowser() {
    if (browser) await browser.close();
    browser = null;
}
