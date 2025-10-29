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
            .replace(/[\n\r]+/g, '')
            .replace(/\s+/g, ' ');
        cleanedHeaders[key] = cleanedString;
    });
    return cleanedHeaders;
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

export default function getNomralizedData(data) {
    const { headers, dataRows } = getHeadersAndData(data);
    return getCleanData(headers, dataRows);
}
