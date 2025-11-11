import pool from '../middleware/db.js';
import isObjectEqual from '../utils/isObjectEqual.js';
import AppError from '../utils/AppError.js';

async function insertToDb(normalizedData) {
    try {
        const promises = normalizedData.map(async (e) => {
            const { rows } = await pool.query(
                `SELECT * FROM employees where cnic_no=$1`,
                [e?.cnic_no],
            );
            if (rows.length >= 1) {
                const row = rows[0];
                const { id, ...rest } = row;
                if (isObjectEqual(e, rest)) return 'skipped';
                await pool.query(
                    `UPDATE employees SET pin_code=$1, name=$2, designation=$3, bps=$4, nature_of_appointment=$5, account_no=$6, date_of_birth=$7, date_of_joining=$8, date_of_retirement=$9 WHERE cnic_no=$10`,
                    [
                        e.pin_code,
                        e.name,
                        e.designation,
                        e.bps,
                        e.nature_of_appointment,
                        e.account_no,
                        e.date_of_birth,
                        e.date_of_joining,
                        e.date_of_retirement,
                        e.cnic_no,
                    ],
                );
                return 'updated';
            }
            await pool.query(
                `INSERT INTO employees (pin_code, name, designation, bps, nature_of_appointment,
       account_no, cnic_no, date_of_birth, date_of_joining, date_of_retirement) VALUES ($1, $2, $3, $4, $5, $6, $7 ,$8, $9, $10)`,
                [
                    e.pin_code,
                    e.name,
                    e.designation,
                    e.bps,
                    e.nature_of_appointment,
                    e.account_no,
                    e.cnic_no,
                    e.date_of_birth,
                    e.date_of_joining,
                    e.date_of_retirement,
                ],
            );
            return 'added';
        });

        const result = await Promise.all(promises);
        const added = result.filter((r) => r === 'added').length;
        const updated = result.filter((r) => r === 'updated').length;
        return { added, updated };
    } catch (e) {
        throw new AppError(`Database Error: ${e.message}`, 500);
    }
}

export default { insertToDb };
