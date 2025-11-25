import pool from '../config//db.js';
import AppError from '../utils/AppError.js';

async function insertToDb(normalizedData) {
    //TODO: batch requests
    try {
        const promises = normalizedData.map(async (e) => {
            await pool.query(
                `INSERT INTO employees (pin_code, name, designation, bps, nature_of_appointment,
       account_no, cnic_no, date_of_birth, date_of_joining, date_of_retirement) VALUES ($1, $2, $3, $4, $5, $6, $7 ,$8, $9, $10)
       ON CONFLICT(cnic_no)
       DO UPDATE SET
           pin_code=EXCLUDED.pin_code,
           name=EXCLUDED.name,
           designation=EXCLUDED.designation,
           bps=EXCLUDED.bps,
           nature_of_appointment=EXCLUDED.nature_of_appointment,
           account_no=EXCLUDED.account_no,
           date_of_birth=EXCLUDED.date_of_birth,
           date_of_joining=EXCLUDED.date_of_joining,
           date_of_retirement=EXCLUDED.date_of_retirement;`,
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
        });

        await Promise.all(promises);
    } catch (e) {
        throw new AppError(`Database Error: ${e.message}`, 500);
    }
}

export default { insertToDb };
