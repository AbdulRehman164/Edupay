import { Router } from 'express';
import upload from '../middleware/upload.middleware.js';
import {
    employeefileController,
    payslipfileController,
} from '../controllers/fileUpload.controller.js';

const uploadRoutes = Router();

uploadRoutes.post('/payslipfile', upload.single('file'), payslipfileController);

uploadRoutes.post(
    '/employeefile',
    upload.single('file'),
    employeefileController,
);

export default uploadRoutes;
