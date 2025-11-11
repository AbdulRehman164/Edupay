import fs from 'fs';
import { normalizePayslipData } from '../utils/normalizeData.js';
import * as XLSX from 'xlsx';
import payslipRepository from '../Repositories/payslipRepository.js';
import AppError from '../utils/AppError.js';
import excelToJson from '../utils/excelToJson.js';
import generatePayslip from '../utils/generatePayslip.js';

function validateData(data) {
    console.log(data);
    const summaryHeaders = [
        'gross_salary',
        'net_amount',
        'total_allowances',
        'total_deductions',
    ];
    let error = false;
    data.forEach((e) => {
        if (error) {
            throw new AppError('File has missing columns or null values', 400);
        }
        if (!e?.payAndAllowances?.['basic_pay']) error = true;
        if (!e?.info?.['name']) error = true;
        if (Object.keys(e?.summaries).length <= 0) error = true;
        summaryHeaders.forEach((header) => {
            if (!e?.summaries?.[header]) error = true;
        });
    });
}

async function processPayslipFile(filename) {
    const json = excelToJson(filename);
    const normalizedData = normalizePayslipData(json);

    fs.writeFileSync(
        'uploads/data.json',
        JSON.stringify(normalizedData, null, 2),
    );

    validateData(normalizedData);

    await payslipRepository.insertToDb(normalizedData);

    //TODO: error handling, if no employee is found
    const employeeData = await payslipRepository.getEmployeeByName(
        normalizedData[0].info['name'],
    );
    const payslip = generatePayslip({
        payslipData: normalizedData[0],
        employeeData,
    });
    return payslip;
}

export default processPayslipFile;
