import { Router } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import getNomralizedData from '../utils/getNormalizedData.js';
import upload from '../middleware/upload.js';

const employeefileRouter = Router();

employeefileRouter.post('/', upload.single('file'), (req, res) => {
    const filename = path.join('uploads', req.file.filename);
    const fileBuffer = fs.readFileSync(filename);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const normalizedData = getNomralizedData(data);

    // for devleopment only
    // TODO: Remove later
    fs.writeFileSync(
        'uploads/employeedata.json',
        JSON.stringify(normalizedData, null, 2),
    );

    res.json({
        message: 'uploaded successfully',
        count: normalizedData.length,
    });
});

export default employeefileRouter;
