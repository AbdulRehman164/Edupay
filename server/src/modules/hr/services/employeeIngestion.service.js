import { normalizeEmployeeData } from '../utils/normalizeData.js';
import employeeRepository from '../repositories/employee.repository.js';
import AppError from '../../../shared/utils/AppError.js';
import excelToJson from '../utils/excelToJson.js';

function validateData(data) {
    const infoHeaders = [
        'name',
        'pin_code',
        'designation',
        'bps',
        'nature_of_appointment',
        'account_no',
        'cnic_no',
        'date_of_birth',
        'date_of_joining',
        'date_of_retirement',
    ];
    for (const e of data) {
        infoHeaders.forEach((header) => {
            if (!e?.[header])
                throw new AppError(
                    'File has missing columns or null values',
                    400,
                );
        });
    }
}

async function processEmployeefile(filename) {
    const normalizedData = normalizeEmployeeData(excelToJson(filename));
    validateData(normalizedData);

    await employeeRepository.upsertEmployees(normalizedData);
}

export default processEmployeefile;
