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

import { UnrecoverableError } from 'bullmq';

export async function renderPdf(html, outputPath, filename, signal) {
    signal?.throwIfAborted();

    const browser = await getBrowser();
    const page = await browser.newPage();

    const abortHandler = async () => {
        try {
            if (!page.isClosed()) await page.close();
            await browser.close();
        } catch {}
    };

    signal?.addEventListener('abort', abortHandler);

    try {
        await page.setContent(html, {
            waitUntil: ['domcontentloaded', 'networkidle2'],
            timeout: 30000,
        });

        signal?.throwIfAborted();

        const buffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', bottom: '20mm' },
        });

        signal?.throwIfAborted();

        const filePath = path.join(outputPath, `${filename}.pdf`);
        await fs.promises.writeFile(filePath, buffer);

        return filePath;
    } catch (err) {
        if (signal?.aborted) {
            // Ignore Puppeteer internal errors caused by cancellation
            throw new UnrecoverableError(signal.reason || 'Job cancelled');
        }
        throw err;
    } finally {
        signal?.removeEventListener('abort', abortHandler);

        if (!page.isClosed()) {
            await page.close();
        }
    }
}

export async function closeBrowser() {
    if (browser) await browser.close();
    browser = null;
}
