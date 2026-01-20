import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import uploadRoute from './routes/uploadRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middleware/errorHandler.js';
import generatePayslipController from './controllers/generatePayslipController.js';
import jobStatusController from './controllers/jobStatusController.js';
import fileDownloadController from './controllers/fileDownloadController.js';
import employeeRoute from './routes/employeeRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use('/static', express.static(path.join(__dirname, '../templates')));
app.use('/api/upload', uploadRoute);
app.post('/api/generatepayslips', generatePayslipController);
app.get('/api/job-status/:id', jobStatusController);
app.get('/api/download/:id', fileDownloadController);
app.use('/api/employees/', employeeRoute);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running at ${port}`));
