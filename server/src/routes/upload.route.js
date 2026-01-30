import { Router } from 'express';
import upload from '../middleware/upload.middleware.js';
import {
    employeefileController,
    payslipfileController,
} from '../controllers/fileUpload.controller.js';
import requireRole from '../middleware/requireRole.middleware.js';

const uploadRoute = Router();

uploadRoute.use(requireRole('hr'));

uploadRoute.post('/payslipfile', upload.single('file'), payslipfileController);

uploadRoute.post(
    '/employeefile',
    upload.single('file'),
    employeefileController,
);

export default uploadRoute;
