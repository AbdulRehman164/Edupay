function normalizeData(data) {
    const { headers, dataRows } = getHeadersAndData(data);
    const cleanData = getCleanData(headers, dataRows);
    const finalData = getFinalData(cleanData);
    return fixColumnNames(finalData);
}

function fixColumnNames(finalData) {
    const araParsed = JSON.stringify(finalData).replaceAll(
        /Ad-hoc Relief Allowance/gi,
        'ARA',
    );
    const basicPayParsed = araParsed.replaceAll(
        /pay of officers/gi,
        'Basic Pay',
    );
    return JSON.parse(basicPayParsed);
}

function getFinalData(cleanData) {
    const normalizedData = [];
    const infoHeaders = [
        'name',
        'pin cod',
        'designation',
        'bps',
        'nature of appointment',
        'account no.',
        'cnic no.',
        'date of birth',
        'date of joining',
        'date of retirement',
    ];
    const summaries = [
        'total allowances',
        'total deductions',
        'net amount',
        'gross salary',
    ];
    cleanData.forEach((data) => {
        const finalData = {
            info: {},
            payAndAllowances: {},
            deductions: {},
            summaries: {},
        };
        Object.keys(data).forEach((key) => {
            if (key.toLowerCase().trim() === 'sr. #') return;
            if (summaries.includes(key.toLowerCase().trim())) {
                finalData.summaries = {
                    ...finalData.summaries,
                    [key]: data[key],
                };
            } else if (infoHeaders.includes(key.toLowerCase().trim())) {
                finalData.info = { ...finalData.info, [key]: data[key] };
            } else if (
                /allowance|allow|allow./.test(key.toLowerCase()) ||
                /pay of officers|basic pay/.test(key.toLowerCase())
            ) {
                finalData.payAndAllowances = {
                    ...finalData.payAndAllowances,
                    [key]: data[key],
                };
            } else {
                finalData.deductions = {
                    ...finalData.deductions,
                    [key]: data[key],
                };
            }
        });
        normalizedData.push(finalData);
    });
    return normalizedData;
}

function getCleanData(headers, dataRows) {
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

function getCleanHeaders(headers) {
    const cleanedHeaders = {};
    Object.keys(headers).forEach((key) => {
        const originalString = headers[key];
        const cleanedString = originalString
            .replace(/[\n\r]+/g, '')
            .replace(/\s+/g, ' ');
        cleanedHeaders[key] = cleanedString;
    });
    return cleanedHeaders;
}

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

export default normalizeData;
