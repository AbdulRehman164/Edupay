import { normalizePayslipData } from '../utils/normalizeData.js';
import payslipRepository from '../Repositories/payslipRepository.js';
import AppError from '../utils/AppError.js';
import excelToJson from '../utils/excelToJson.js';

function validateData(data) {
    data.forEach((e) => {
        if (e?.['basic_pay'] === undefined || e?.['cnic_no'] === undefined) {
            throw new AppError('File has missing columns or null values', 400);
        }
    });
    checkDataTypes(data);

    function checkDataTypes(obj) {
        if (Array.isArray(obj)) {
            obj.forEach((row) => {
                checkDataTypes(row);
            });
            return;
        }
        for (const key in obj) {
            if (key === 'cnic_no') continue;
            if (
                Object.prototype.toString.call(obj[key]) === '[object Object]'
            ) {
                checkDataTypes(obj[key]);
                continue;
            }
            if (typeof obj[key] !== 'number') {
                throw new AppError(
                    `All salary columns value must be a number, ${key}`,
                    400,
                );
            }
        }
    }
}

async function processPayslipFile(filename) {
    const normalizedData = normalizePayslipData(excelToJson(filename));
    validateData(normalizedData);
    const uploadId = await payslipRepository.insertToDb(normalizedData);
    return uploadId;
}

export default processPayslipFile;
