import { Router } from 'express';
import upload from '../middleware/upload.js';
import {
    employeefileController,
    payslipfileController,
} from '../controllers/fileUploadControllers.js';

const uploadRoute = Router();

uploadRoute.post('/payslipfile', upload.single('file'), payslipfileController);

uploadRoute.post(
    '/employeefile',
    upload.single('file'),
    employeefileController,
);

export default uploadRoute;
