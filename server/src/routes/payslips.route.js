import { Router } from 'express';
import {
    generatePayslipsController,
    searchPayslipsController,
    fileDownloadController,
} from '../controllers/payslips.controller.js';

const payslipsRoute = Router();

payslipsRoute.post('/generate', generatePayslipsController);
payslipsRoute.get('/download/:id', fileDownloadController);
payslipsRoute.get('/search', searchPayslipsController);

export default payslipsRoute;
