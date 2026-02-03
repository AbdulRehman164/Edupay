import pool from '../../../config/db.js';
import AppError from '../../../shared/utils/AppError.js';

async function upsertEmployees(rows) {
    const columns = [
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

    const values = [];
    const placeholder = rows.map((row, i) => {
        const base = i * columns.length;
        values.push(
            row.name,
            row.pin_code,
            row.designation,
            row.bps,
            row.nature_of_appointment,
            row.account_no,
            row.cnic_no,
            row.date_of_birth,
            row.date_of_joining,
            row.date_of_retirement,
        );
        return `(${columns.map((_, j) => `$${base + j + 1}`).join(',')})`;
    });

    const query = `INSERT INTO employees (${columns.join(',')}) VALUES ${placeholder.join(',')} 
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
           date_of_retirement=EXCLUDED.date_of_retirement;`;

    await pool.query(query, values);
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

async function getEmployeeByCnics(cnics) {
    const result = await pool.query(
        `SELECT * FROM employees WHERE cnic_no = ANY($1)`,
        [cnics],
    );
    return result.rows;
}

async function updateEmployeeById(id, data) {
    const values = [
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
    ];
    const query = `
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
        WHERE id = $11
        RETURNING id;
        `;

    const { rowCount } = await pool.query(query, values);
    return rowCount;
}

export default {
    upsertEmployees,
    getEmployeeByCnic,
    updateEmployeeById,
    getEmployeeByCnics,
};
