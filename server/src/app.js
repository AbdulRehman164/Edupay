import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import uploadRoute from './routes/upload.route.js';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middleware/errorHandler.middleware.js';
import jobStatusController from './controllers/jobStatus.controller.js';
import employeeRoute from './routes/employee.route.js';
import payslipsRoute from './routes/payslips.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use('/static', express.static(path.join(__dirname, '../templates')));
app.use('/api/upload', uploadRoute);
app.use('/api/payslips', payslipsRoute);
app.get('/api/job-status/:id', jobStatusController);
app.use('/api/employees/', employeeRoute);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running at ${port}`));
