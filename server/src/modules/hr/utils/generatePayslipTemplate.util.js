import * as cheerio from 'cheerio';
import fs from 'fs';

const HTML_TEMPLATE = fs.readFileSync('templates/payslipTemplate.html', 'utf8');

function generatePayslipTemplate(payslip) {
    const ASSET_BASE = process.env.PDF_ASSET_BASE_URL;
    const $ = cheerio.load(HTML_TEMPLATE);
    const allowancesTable = $('table.allowances');

    $('#logo').attr('src', `${ASSET_BASE}/static/logo.png`);

    $('#info-pin-code').text(payslip?.pin_code);
    $('#info-name').text(payslip?.name);
    $('#info-designation').text(payslip?.designation);
    $('#info-bps').text(payslip?.bps);
    $('#info-appointment').text(payslip?.nature_of_appointment);
    $('#info-account').text(payslip?.account_no);
    $('#info-cnic').text(payslip?.cnic_no);
    $('#info-dob').text(payslip?.date_of_birth);
    $('#info-doj').text(payslip?.date_of_joining);
    $('#info-dor').text(payslip?.date_of_retirement);

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

export default generatePayslipTemplate;
