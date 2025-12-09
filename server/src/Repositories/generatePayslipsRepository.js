import pool from '../config/db.js';

async function getPayslipsFromDb(uploadId) {
    const res = await pool.query(`select * from payslips where upload_id=$1;`, [
        uploadId,
    ]);
    const payslipRows = res.rows;

    const payslips = [];

    for (const row of payslipRows) {
        const res = await pool.query(`select * from employees where id=$1`, [
            row.employee_id,
        ]);
        payslips.push({ payslip: row, employee: res.rows[0] });
    }
    return payslips;
}

export default getPayslipsFromDb;
