import processEmployeefile from '../services/employeefileService.js';
import processPayslipFile from '../services/payslipService.js';
import path from 'path';

async function employeefileController(req, res) {
    const filename = path.join('uploads', req.file.filename);
    const response = await processEmployeefile(filename);
    console.log(response);
    res.json(response);
}

function payslipfileController(req, res) {
    const filename = path.join('uploads', req.file.filename);
    processPayslipFile(filename);
}

export { employeefileController, payslipfileController };
