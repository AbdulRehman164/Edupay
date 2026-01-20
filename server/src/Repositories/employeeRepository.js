import pool from '../config//db.js';
import AppError from '../utils/AppError.js';
//import getEmployeeByCnic from './genEmployeeByCnic.js';

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
    return result.rows[0];
}

async function patchEmployee(id, data) {
    const cnicResult = await pool.query(
        'SELECT * FROM employees WHERE cnic_no=$1',
        [data.cnic_no],
    );
    if (cnicResult.rows[0].id != id) {
        return {
            code: 400,
            field: 'cnic_no',
            message: 'Cnic already exists.',
        };
    }
    await pool.query(
        `
        UPDATE employees
        SET
          name = $1,
          account_no = $2,
          cnic_no = $3,
          bps = $4,
          designation = $5,
          date_of_birth = $6,
          date_of_joining = $7,
          date_of_retirement = $8,
          nature_of_appointment = $9,
          pin_code = $10
        WHERE id = $11;
        `,
        [
            data.name,
            data.account_no,
            data.cnic_no,
            data.bps,
            data.designation,
            data.date_of_birth,
            data.date_of_joining,
            data.date_of_retirement,
            data.nature_of_appointment,
            data.pin_code,
            id,
        ],
    );
    return { message: 'Updated Sucessfully!' };
}

export default { insertToDb, getEmployeeByCnic, patchEmployee };
