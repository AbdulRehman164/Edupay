import * as XLSX from 'xlsx';
import fs from 'fs';

function getDataIndex(data) {
    let dataIndex;
    let found = false;
    data.forEach((row, index) => {
        if (found) return;
        Object.keys(row).forEach((key) => {
            if (!isNaN(Number(row[key]))) {
                dataIndex = index;
                found = true;
                return;
            }
        });
    });
    return dataIndex;
}

function getCleanHeaders(headers) {
    const cleanedHeaders = {};
    Object.keys(headers).forEach((key) => {
        const originalString = headers[key];
        const cleanedString = originalString
            .trim()
            .replace(/[\n\r]+/g, '')
            .replace(/\s+/g, ' ');
        cleanedHeaders[key] = cleanedString;
    });
    return cleanedHeaders;
}

function mapHeadersAndData(headers, dataRows) {
    const clean = [];
    dataRows.forEach((row) => {
        const rowObject = {};
        Object.keys(row).forEach((key) => {
            rowObject[headers[key]] = row[key];
        });
        clean.push(rowObject);
    });
    return clean;
}

function getHeadersAndData(data) {
    const dataIndex = getDataIndex(data);
    let headers = {};
    for (let i = 0; i < dataIndex; i++) {
        headers = { ...headers, ...data[i] };
    }
    headers = getCleanHeaders(headers);

    const dataRows = [...data];
    dataRows.splice(0, dataIndex);
    return { headers, dataRows };
}

function getJsonFromLegacyExcel(data) {
    const { headers, dataRows } = getHeadersAndData(data);
    return mapHeadersAndData(headers, dataRows);
}

function detectExcelType(buffer) {
    const signature = buffer.slice(0, 4).toString('hex');

    if (signature === 'd0cf11e0') return 'xls';
    if (signature === '504b0304') return 'xlsx';

    return 'unknown';
}

export default function excelToJson(filename) {
    const fileBuffer = fs.readFileSync(filename);
    const fileType = detectExcelType(fileBuffer);
    if (fileType === 'unknown') {
        throw new AppError('The file is corrupted or unknown format', 400);
    }

    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    if (workbook.SheetNames.length > 1) {
        throw new AppError('File contains multiple Sheets', 400);
    }
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    if (fileType === 'xls') {
        return getJsonFromLegacyExcel(data);
    }
    return data;
}
