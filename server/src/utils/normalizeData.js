function normalizePayslipData(data) {
    const spacesRemoved = removeSpaces(data);
    const catagorized = catagorizeData(spacesRemoved);
    const summariesAdded = addSummaries(catagorized);
    return fixColumnNames(summariesAdded);
}

function normalizeEmployeeData(data) {
    return removeSpaces(data);
}

function removeSpaces(data) {
    const len = data.length;
    let objString = JSON.stringify(data);
    for (let i = 0; i < len; i++) {
        Object.keys(data[i]).forEach((key) => {
            objString = objString.replace(
                key,
                key.replaceAll(' ', '_').toLowerCase(),
            );
        });
    }
    return JSON.parse(objString);
}

function fixColumnNames(data) {
    const araParsed = JSON.stringify(data).replaceAll(
        /Ad-hoc_Relief_Allowance/gi,
        'ara',
    );
    const basicPayParsed = araParsed.replaceAll(
        /pay_of_officer/gi,
        'basic_pay',
    );
    return JSON.parse(basicPayParsed);
}

function catagorizeData(data) {
    const normalizedData = [];
    data.forEach((row) => {
        const finalRow = {
            allowances: {},
            deductions: {},
            summaries: {},
        };
        Object.keys(row).forEach((key) => {
            if (/total_deduction|total_allowance/gi.test(key)) return;
            if (/cnic_no/i.test(key)) {
                finalRow['cnic_no'] = row[key];
            } else if (/allowance|allow|allow./.test(key)) {
                finalRow.allowances = {
                    ...finalRow.allowances,
                    [key]: row[key],
                };
            } else if (/pay_of_officers|basic_pay/.test(key)) {
                finalRow.basic_pay = row[key];
            } else if (/deduction/.test(key)) {
                finalRow.deductions = {
                    ...finalRow.deductions,
                    [key]: row[key],
                };
            }
        });
        normalizedData.push(finalRow);
    });
    return normalizedData;
}

function addSummaries(data) {
    data.forEach((row) => {
        const { allowances, deductions } = row;
        const totalDeductions = Object.keys(deductions).reduce(
            (prev, curr) => prev + deductions[curr],
            0,
        );

        const totalAllowances = Object.keys(allowances).reduce(
            (prev, curr) => prev + allowances[curr],
            0,
        );
        row.summaries.total_deductions = totalDeductions;
        row.summaries.total_allowances = totalAllowances;
    });
    return data;
}

export { normalizePayslipData, normalizeEmployeeData };
