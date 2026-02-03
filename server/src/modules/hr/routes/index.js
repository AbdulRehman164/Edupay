import { Router } from 'express';
import employeeRoutes from './employee.route.js';
import payslipRoutes from './payslips.route.js';
import uploadRoutes from './upload.route.js';
import jobRoutes from './jobs.route.js';

const hrRoutes = Router();

hrRoutes.use('/employees', employeeRoutes);
hrRoutes.use('/payslips', payslipRoutes);
hrRoutes.use('/uploads', uploadRoutes);
hrRoutes.use('/jobs', jobRoutes);

export default hrRoutes;
