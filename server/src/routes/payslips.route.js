import { Router } from 'express';
import {
    generatePayslipsController,
    searchPayslipsController,
    fileDownloadController,
} from '../controllers/payslips.controller.js';
import requireRole from '../middleware/requireRole.middleware.js';

const payslipsRoute = Router();

payslipsRoute.use(requireRole('hr'));
payslipsRoute.post('/generate', generatePayslipsController);
payslipsRoute.get('/download/:id', fileDownloadController);
payslipsRoute.get('/search', searchPayslipsController);

export default payslipsRoute;
