import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { UnrecoverableError } from 'bullmq';

let browser = null;
let browserPromise = null;

async function getBrowser() {
    // Reuse existing connected browser
    if (browser?.connected) {
        return browser;
    }

    // Prevent concurrent launches
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ],
        });

        browser = await browserPromise;

        browser.on('disconnected', () => {
            console.log('Chromium disconnected');

            browser = null;
            browserPromise = null;
        });
    }

    return browserPromise;
}

export async function renderPdf(html, outputPath, filename, signal) {
    signal?.throwIfAborted();

    const browser = await getBrowser();
    const page = await browser.newPage();

    const abortHandler = async () => {
        try {
            if (!page.isClosed()) {
                await page.close();
            }
        } catch {}
    };

    signal?.addEventListener('abort', abortHandler);

    try {
        await page.setContent(html, {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
        });

        signal?.throwIfAborted();

        const buffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                bottom: '20mm',
            },
        });

        signal?.throwIfAborted();

        const filePath = path.join(outputPath, `${filename}.pdf`);

        await fs.promises.writeFile(filePath, buffer);

        return filePath;
    } catch (err) {
        if (signal?.aborted) {
            throw new UnrecoverableError(signal.reason || 'Job cancelled');
        }

        throw err;
    } finally {
        signal?.removeEventListener('abort', abortHandler);

        try {
            if (!page.isClosed()) {
                await page.close();
            }
        } catch {}
    }
}

export async function closeBrowser() {
    try {
        if (browser?.connected) {
            await browser.close();
        }
    } catch (err) {
        console.error('Error closing browser:', err);
    } finally {
        browser = null;
        browserPromise = null;
    }
}
