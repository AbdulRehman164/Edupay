import processEmployeefile from '../services/employeefileService.js';
import processPayslipFile from '../services/payslipService.js';
import path from 'path';

async function employeefileController(req, res, next) {
    try {
        const filename = path.join('uploads', req.file.filename);
        await processEmployeefile(filename);
        res.json({ message: 'Uploaded sucessfully.' });
    } catch (e) {
        next(e);
    }
}

async function payslipfileController(req, res, next) {
    try {
        const filename = path.join('uploads', req.file.filename);
        const uploadId = await processPayslipFile(filename);
        res.json({ message: 'Uploaded successfully.', uploadId });
    } catch (e) {
        next(e);
    }
}

export { employeefileController, payslipfileController };
