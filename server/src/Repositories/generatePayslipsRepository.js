import pool from '../config/db.js';
import AppError from '../utils/AppError.js';

async function getPayslipsFromDb(uploadId) {
    const res = await pool.query(`select * from payslips where upload_id=$1;`, [
        uploadId,
    ]);
    const payslipRows = res.rows;

    if (payslipRows.length <= 0) {
        new AppError(
            404,
            `no data found corresponding to uploadid : ${uploadId}`,
        );
    }

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
