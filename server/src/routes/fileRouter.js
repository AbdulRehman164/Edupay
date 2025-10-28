import { Router } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { generatePayslip } from '../services/payslipService.js';
import normalizeData from '../services/dataNormalizationService.js';
import generateTemplate from '../services/templateCreationService.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname),
});

const upload = multer({ storage });

const fileRouter = Router();

fileRouter.post('/', upload.single('file'), (req, res) => {
    const filename = path.join('uploads', req.file.filename);
    const fileBuffer = fs.readFileSync(filename);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const normalizedData = normalizeData(data);

    // for devleopment only
    // TODO: Remove later
    fs.writeFileSync(
        'uploads/data.json',
        JSON.stringify(normalizedData, null, 2),
    );

    if (!fs.existsSync('generated')) fs.mkdirSync('generated');

    generateTemplate(normalizedData[0]);

    generatePayslip(normalizedData[0], 'generated');

    //normalizedData.forEach((employee) => {
    //    generatePayslip(
    //        employee,
    //        '/home/rehman/coding/repos/portal/server/generated/',
    //    );
    //});

    res.json({
        message: 'Payslips generated successfully',
        count: data.length,
    });
});

export default fileRouter;
