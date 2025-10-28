import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileRouter from './routes/fileRouter.js';
import * as cheerio from 'cheerio';
import fs from 'fs';

const app = express();
dotenv.config();

app.use(cors());

app.get('/', (req, res) => {
    console.log('called');
    const html = fs.readFileSync('templates/payslipTemplate.html', 'utf8');
    const $ = cheerio.load(html);
    const allowancesDiv = $('div.allowances');
});
app.use('/file', fileRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running at ${port}`));
