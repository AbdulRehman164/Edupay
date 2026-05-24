import { Router } from 'express';
import employeeRoutes from './employee.route.js';
import payslipRoutes from './payslips.route.js';
import uploadRoutes from './upload.route.js';
import jobRoutes from './jobs.route.js';
import {
    sendEmailsController,
    getBatchEmailStatusController,
    retryBatchEmailsController,
} from '../controllers/emails.controller.js';
import validateUUID from '../middleware/validateUUID.middleware.js';

const hrRoutes = Router();

hrRoutes.use('/employees', employeeRoutes);
hrRoutes.use('/payslips', payslipRoutes);
hrRoutes.use('/uploads', uploadRoutes);
hrRoutes.use('/jobs', jobRoutes);
hrRoutes.post('/emails/:batchId/send', validateUUID, sendEmailsController);
hrRoutes.get(
    '/emails/:batchId/status',
    validateUUID,
    getBatchEmailStatusController,
);
hrRoutes.post(
    '/emails/:batchId/retry',
    validateUUID,
    retryBatchEmailsController,
);

export default hrRoutes;
