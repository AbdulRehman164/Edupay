import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import payslipfileRouter from './routes/payslipfileRouter.js';
import employeefileRouter from './routes/employeefileRouter.js';
import * as cheerio from 'cheerio';
import fs from 'fs';

const app = express();
dotenv.config();

app.use(cors());

app.get('/', (req, res) => {});
app.use('/payslipfile', payslipfileRouter);
app.use('/employeefile', employeefileRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running at ${port}`));
