import { Router } from 'express';
import {
    generatePayslipsController,
    searchPayslipsController,
    fileDownloadController,
} from '../controllers/payslips.controller.js';

const payslipsRoutes = Router();

payslipsRoutes.post('/generate', generatePayslipsController);
payslipsRoutes.get('/download/:id', fileDownloadController);
payslipsRoutes.get('/search', searchPayslipsController);

export default payslipsRoutes;
