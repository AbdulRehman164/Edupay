import { Router } from 'express';
import generatePayslipController from '../controllers/generatePayslipController.js';
import fileDownloadController from '../controllers/fileDownloadController.js';
import searchPayslipsController from '../controllers/searchPayslipsController.js';
import getPayslipPdfController from '../controllers/getPayslipPdfController.js';

const payslipsRoute = Router();

payslipsRoute.post('/generate', generatePayslipController);
payslipsRoute.post('/getpayslippdf', getPayslipPdfController);
payslipsRoute.get('/download/:id', fileDownloadController);
payslipsRoute.get('/search', searchPayslipsController);

export default payslipsRoute;
