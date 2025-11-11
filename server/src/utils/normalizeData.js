function normalizePayslipData(data) {
    const fixedNames = fixColumnNames(data);
    const spacesRemoved = removeSpaces(fixedNames);
    const dotsRemoved = removeDots(spacesRemoved);
    return catagorizeData(dotsRemoved);
}

function normalizeEmployeeData(data) {
    const spaceRemoved = removeSpaces(data);
    return fixDates(spaceRemoved);
}

function removeDots(data) {
    const getIndicsOfDots = (str) => {
        const indices = [];
        let index;
        let startIndex = 0;
        while ((index = str.indexOf('.', startIndex)) !== -1) {
            indices.push(index);
            startIndex = index + 1;
        }
        return indices;
    };
    const replaceCharAtIndexArray = (originalString, charToReplace, index) => {
        let charArray = originalString.split('');
        charArray[index] = charToReplace;
        return charArray.join('');
    };

    const len = data.length;
    let objString = JSON.stringify(data);
    for (let i = 0; i < len; i++) {
        Object.keys(data[i]).forEach((key) => {
            const indices = getIndicsOfDots(key);
            let newKey = key;
            indices.forEach((index) => {
                if (
                    !isNaN(Number(key[index - 1])) ||
                    !isNaN(Number(key[index + 1]))
                )
                    return;
                newKey = replaceCharAtIndexArray(newKey, '', index);
            });
            objString = objString.replace(key, newKey);
        });
    }
    return JSON.parse(objString);
}

function fixDates(data) {
    const clone = structuredClone(data);
    const dates = ['date_of_birth', 'date_of_retirement', 'date_of_joining'];
    clone.forEach((obj) => {
        dates.forEach((date) => {
            const d = obj[date];
            if (!d) return;
            const [day, month, year] = d.split('-');
            obj[date] = `${year}-${month}-${day}`;
        });
    });
    return clone;
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

function catagorizeData(cleanData) {
    const normalizedData = [];
    const infoHeaders = [
        'name',
        'pin_code',
        'designation',
        'bps',
        'nature_of_appointment',
        'account_no',
        'cnic_no',
        'date_of_birth',
        'date_of_joining',
        'date_of_retirement',
    ];
    const summaries = [
        'total_allowances',
        'total_deductions',
        'net_amount',
        'gross_salary',
    ];
    cleanData.forEach((data) => {
        const finalData = {
            info: {},
            payAndAllowances: {},
            deductions: {},
            summaries: {},
        };
        Object.keys(data).forEach((key) => {
            if (key.toLowerCase().trim() === 'sr_#') return;
            if (summaries.includes(key.toLowerCase().trim())) {
                finalData.summaries = {
                    ...finalData.summaries,
                    [key]: data[key],
                };
            } else if (infoHeaders.includes(key.toLowerCase().trim())) {
                finalData.info = { ...finalData.info, [key]: data[key] };
            } else if (
                /allowance|allow|allow./.test(key.toLowerCase()) ||
                /pay_of_officers|basic_pay/.test(key.toLowerCase())
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

export { normalizePayslipData, normalizeEmployeeData };
