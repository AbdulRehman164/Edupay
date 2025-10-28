import * as cheerio from 'cheerio';
import fs from 'fs';

const html = fs.readFileSync('./payslipTemplate.html');

console.log(html);
