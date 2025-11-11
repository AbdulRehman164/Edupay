import pool from '../middleware/db.js';
async function getEmployeeByName(name) {
    const result = await pool.query(`SELECT * FROM employees WHERE name=$1`, [
        name,
    ]);
    return result.rows.length >= 1 ? result.rows[0] : null;
}

async function insertToDb(data) {
    const promises = data.map(async (e) => {
        const { info, payAndAllowances, deductions, summaries } = e;
        const { name, cnic_no, ...restInfo } = info;
        const { basic_pay: basicPay, ...restPayAndAllowances } =
            payAndAllowances;
        const jsonb = {
            info: restInfo,
            payAndAllowances: restPayAndAllowances,
            deductions,
        };
        const currentDate = new Date();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        await pool.query(
            'INSERT INTO payslips(name, cnic_no, basic_pay, total_allowances, total_deductions, gross_salary, net_amount, json, payslip_month, payslip_year) Values($1, $2, $3, $4, $5, $6, $7,$8, $9, $10)',
            [
                name,
                cnic_no,
                basicPay,
                summaries.total_allowances,
                summaries.total_deductions,
                summaries.gross_salary,
                summaries.net_amount,
                jsonb,
                month,
                year,
            ],
        );

        //const res = await pool.query(
        //    'select name,payslip_month,payslip_year from payslips where name=$1',
        //    [e['Name']],
        //);
        //console.log(res);
    });
}

export default { getEmployeeByName, insertToDb };
