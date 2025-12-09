import pool from '../config//db.js';
import AppError from '../utils/AppError.js';
async function getEmployeeByCnic(cnic) {
    const result = await pool.query(
        `SELECT * FROM employees WHERE cnic_no=$1`,
        [cnic],
    );
    if (result.rows.length <= 0) {
        throw new AppError(
            `Employee entry for the cnic ${cnic} is not found`,
            400,
        );
    }
    return result.rows[0].id;
}

async function insertToDb(data) {
    const upload_id = crypto.randomUUID();
    //TODO: batch requests
    try {
        const promises = data.map(async (e) => {
            const { basic_pay, allowances, deductions, summaries, cnic_no } = e;
            const jsonb = {
                allowances,
                deductions,
            };
            const { total_allowances, total_deductions } = summaries;
            const currentDate = new Date();
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();
            const employee_id = await getEmployeeByCnic(cnic_no);

            await pool.query(
                `
                INSERT INTO payslips(upload_id, employee_id, basic_pay, total_allowances, total_deductions, json, month, year) Values($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT(employee_id, month, year)
                       DO UPDATE SET
                            basic_pay=EXCLUDED.basic_pay,
                            total_allowances = EXCLUDED.total_allowances,
                            total_deductions = EXCLUDED.total_deductions,
                            json = EXCLUDED.json,
                            upload_id = EXCLUDED.upload_id;
            `,
                [
                    upload_id,
                    employee_id,
                    basic_pay,
                    total_allowances,
                    total_deductions,
                    jsonb,
                    month,
                    year,
                ],
            );
        });
        await Promise.all(promises);
        return upload_id;
    } catch (e) {
        if (e instanceof AppError) {
            throw e;
        }
        throw new AppError(`Database Error: ${e.message}`, 500);
    }
}

export default { insertToDb };
