import * as cheerio from 'cheerio';
import getMonthAndYear from './getMonthAndYear.js';
import path from 'path';
import html_to_pdf from 'html-pdf-node';
import fs from 'fs';

function generateTemplate({ payslipData, employeeData }) {
    const ASSET_BASE = process.env.PDF_ASSET_BASE_URL;
    const html = fs.readFileSync('templates/payslipTemplate.html', 'utf8');
    const $ = cheerio.load(html);
    const allowancesTable = $('table.allowances');
    const { month, year } = getMonthAndYear();

    $('#logo').attr('src', `${ASSET_BASE}/static/logo.png`);

    $('#info-pin-code').text(employeeData.pin_code);
    $('#info-name').text(employeeData.name);
    $('#info-designation').text(employeeData.designation);
    $('#info-bps').text(employeeData.bps);
    $('#info-appointment').text(employeeData.nature_of_appointment);
    $('#info-account').text(employeeData.account_no);
    $('#info-cnic').text(employeeData.cnic_no);
    $('#info-dob').text(employeeData.date_of_birth);
    $('#info-doj').text(employeeData.date_of_joining);
    $('#info-dor').text(employeeData.date_of_retirement);

    Object.keys(payslipData.payAndAllowances).forEach((key) => {
        const tr = `<tr><th>${key}</th><td>${payslipData.payAndAllowances[key]}</td></tr>`;
        allowancesTable.append(tr);
    });

    const deductionsTable = $('table.deductions');
    Object.keys(payslipData.deductions).forEach((key) => {
        const tr = `<tr><th>${key}</th><td>${payslipData.deductions[key]}</td></tr>`;
        deductionsTable.append(tr);
    });

    allowancesTable.append(
        `<tr><th>Total Allowances</th><td>${payslipData?.summaries?.['Total Allowances']}</td></tr>`,
    );

    deductionsTable.append(
        `<tr><th>Total Deductions</th><td>${payslipData?.summaries?.['Total Deductions']}</td></tr>`,
    );

    $('#footer-gross').text(payslipData?.summaries?.['Gross Salary']);
    $('#footer-net').text(payslipData?.summaries?.['Net Amount']);

    $('#month').text(month);
    $('#year').text(year);

    return $.html();
}

async function generatePdf(html, outputPath, filename) {
    const file = { content: html };
    const options = {
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm' },
    };

    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    const filePath = path.join(outputPath, `${filename}.pdf`);
    fs.writeFileSync(filePath, pdfBuffer);

    console.log(`PDF generated: ${filePath}`);
    return filePath;
}

async function generatePayslip(data) {
    const template = generateTemplate(data);
    return await generatePdf(
        template,
        'generated',
        data?.employeeData?.cnic_no,
    );
}

export default generatePayslip;
