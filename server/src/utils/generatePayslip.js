import * as cheerio from 'cheerio';
import path from 'path';
import puppeteer from 'puppeteer';
import fs from 'fs';
import getPayslipsFromDb from '../Repositories/generatePayslipsRepository.js';
import archiver from 'archiver';
import AppError from './AppError.js';

const HTML_TEMPLATE = fs.readFileSync('templates/payslipTemplate.html', 'utf8');

function generateTemplate({ payslip, employee }) {
    const ASSET_BASE = process.env.PDF_ASSET_BASE_URL;
    const $ = cheerio.load(HTML_TEMPLATE);
    const allowancesTable = $('table.allowances');

    $('#logo').attr('src', `${ASSET_BASE}/static/logo.png`);

    $('#info-pin-code').text(employee?.pin_code);
    $('#info-name').text(employee?.name);
    $('#info-designation').text(employee?.designation);
    $('#info-bps').text(employee?.bps);
    $('#info-appointment').text(employee?.nature_of_appointment);
    $('#info-account').text(employee?.account_no);
    $('#info-cnic').text(employee?.cnic_no);
    $('#info-dob').text(employee?.date_of_birth);
    $('#info-doj').text(employee?.date_of_joining);
    $('#info-dor').text(employee?.date_of_retirement);

    const { allowances, deductions } = payslip.json;

    Object.keys(allowances).forEach((key) => {
        const tr = `<tr><th>${key}</th><td>${allowances[key]}</td></tr>`;
        allowancesTable.append(tr);
    });

    const deductionsTable = $('table.deductions');
    Object.keys(deductions).forEach((key) => {
        const tr = `<tr><th>${key}</th><td>${deductions[key]}</td></tr>`;
        deductionsTable.append(tr);
    });

    allowancesTable.append(
        `<tr><th>Total Allowances</th><td>${payslip?.total_allowances}</td></tr>`,
    );

    deductionsTable.append(
        `<tr><th>Total Deductions</th><td>${payslip?.total_deductions}</td></tr>`,
    );

    $('#footer-gross').text(payslip?.gross_pay);
    $('#footer-net').text(payslip?.net_pay);

    $('#month').text(payslip?.month);
    $('#year').text(payslip?.year);

    return $.html();
}

let browser;
async function getBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({ headless: true });
    }
    return browser;
}

export async function closeBrowser() {
    if (browser) await browser.close();
    browser = null;
}

async function generatePdf(html, outputPath, filename) {
    await getBrowser();
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
    console.log(`Pdf generated: ${filePath}`);
    return filePath;
}

async function generatePayslips(uploadId) {
    const payslips = await getPayslipsFromDb(uploadId);
    const template = generateTemplate(payslips[0]);
    let files = [];
    for (let i = 0; i < payslips.length; i += 30) {
        const batch = payslips.slice(i, i + 30);

        for (const e of batch) {
            files.push(
                await generatePdf(
                    template,
                    'generated',
                    `${e?.employee?.name}_${e?.employee?.cnic_no}_${e?.payslip?.month}_${e?.payslip?.year}`,
                ),
            );
        }
    }
    await closeBrowser();
    await zipFiles(`generated/${uploadId}`, files);
    for (const file of files) {
        await fs.promises.rm(file, { force: true });
    }
    return uploadId;
}

export async function zipFiles(outputZipPath, files) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputZipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve(outputZipPath));
        archive.on('error', (err) => reject(err));

        archive.pipe(output);

        files.forEach((file) => {
            const fileName = file.split('/').pop();
            archive.file(file, { name: fileName });
        });

        archive.finalize();
    });
}

export default generatePayslips;
