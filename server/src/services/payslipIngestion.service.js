import { normalizePayslipData } from '../utils/normalizeData.js';
import payslipRepository from '../repositories/payslip.repository.js';
import AppError from '../utils/AppError.js';
import excelToJson from '../utils/excelToJson.js';
import employeeRepository from '../repositories/employee.repository.js';

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

function buildPayslipRows(data, employeeMap, uploadId) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    return data.map((p) => {
        const employee = employeeMap.get(p.cnic_no);
        if (!employee) {
            throw new AppError(
                `Cannot find employee for cnic ${p.cnic_no}`,
                400,
            );
        }

        const { total_deductions, total_allowances } = p.summaries;

        return {
            upload_id: uploadId,
            employee_id: employee.id,
            name: employee.name,
            cnic_no: employee.cnic_no,
            designation: employee.designation,
            bps: employee.bps,
            nature_of_appointment: employee.nature_of_appointment,
            account_no: employee.account_no,
            pin_code: employee.pin_code,
            date_of_birth: employee.date_of_birth,
            date_of_joining: employee.date_of_joining,
            date_of_retirement: employee.date_of_retirement,
            basic_pay: p.basic_pay,
            total_allowances,
            total_deductions,
            json: {
                allowances: p.allowances,
                deductions: p.deductions,
            },
            month,
            year,
        };
    });
}

async function processPayslipFile(filename) {
    const data = normalizePayslipData(excelToJson(filename));
    validateData(data);

    const cnics = data.map((d) => d.cnic_no);

    const employees = await employeeRepository.getEmployeeByCnics(cnics);

    if (employees.length < cnics.length) {
        new AppError('Some employees not found!', 400);
    }

    const employeesMap = new Map(employees.map((e) => [e.cnic_no, e]));

    const uploadId = crypto.randomUUID();

    const rows = buildPayslipRows(data, employeesMap, uploadId);

    await payslipRepository.replacePayslips(rows);
    return uploadId;
}

export default processPayslipFile;
