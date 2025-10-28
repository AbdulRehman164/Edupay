import * as cheerio from 'cheerio';
import fs from 'fs';
import getMonthAndYear from '../utils/getMonthAndYear.js';

export default function generateTemplate(data) {
    const html = fs.readFileSync('templates/payslipTemplate.html', 'utf8');
    const $ = cheerio.load(html);
    const allowancesTable = $('table.allowances');
    const { month, year } = getMonthAndYear();

    Object.keys(data.payAndAllowances).forEach((key) => {
        const tr = `<tr><th>${key}</th><td>${data.payAndAllowances[key]}</td></tr>`;
        allowancesTable.append(tr);
    });

    const deductionsTable = $('table.deductions');
    Object.keys(data.deductions).forEach((key) => {
        const tr = `<tr><th>${key}</th><td>${data.deductions[key]}</td></tr>`;
        deductionsTable.append(tr);
    });

    allowancesTable.append(
        `<tr><th>Total Allowances</th><td>${data?.summaries?.['Total Allowances']}</td></tr>`,
    );

    deductionsTable.append(
        `<tr><th>Total Deductions</th><td>${data?.summaries?.['Total Deductions']}</td></tr>`,
    );

    $('#footer-gross').text(data?.summaries?.['Gross Salary']);
    $('#footer-net').text(data?.summaries?.['Net Amount']);

    $('#month').text(month);
    $('#year').text(year);

    fs.writeFileSync('templates/template.html', $.html());
}
