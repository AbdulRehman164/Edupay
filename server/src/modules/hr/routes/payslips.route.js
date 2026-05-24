import { Router } from 'express';
import {
    generatePayslipsController,
    searchPayslipsController,
    fileDownloadController,
} from '../controllers/payslips.controller.js';
import validateUUID from '../middleware/validateUUID.middleware.js';

const payslipsRoutes = Router();

payslipsRoutes.post('/generate', generatePayslipsController);
payslipsRoutes.get('/download/:id', validateUUID, fileDownloadController);
payslipsRoutes.get('/search', searchPayslipsController);

export default payslipsRoutes;
