import pool from '../config/db.js';

async function replacePayslips(rows) {
    if (!rows.length) return;

    const client = await pool.connect();

    // assume all rows belong to same month/year/upload
    const { month, year } = rows[0];
    const employeeIds = rows.map((r) => r.employee_id);

    const columns = [
        'upload_id',
        'employee_id',
        'name',
        'cnic_no',
        'designation',
        'bps',
        'nature_of_appointment',
        'account_no',
        'pin_code',
        'date_of_birth',
        'date_of_joining',
        'date_of_retirement',
        'basic_pay',
        'total_allowances',
        'total_deductions',
        'json',
        'month',
        'year',
        'is_active',
    ];

    const values = [];
    const placeholders = rows.map((row, i) => {
        const base = i * columns.length;
        values.push(
            row.upload_id,
            row.employee_id,
            row.name,
            row.cnic_no,
            row.designation,
            row.bps,
            row.nature_of_appointment,
            row.account_no,
            row.pin_code,
            row.date_of_birth,
            row.date_of_joining,
            row.date_of_retirement,
            row.basic_pay,
            row.total_allowances,
            row.total_deductions,
            row.json,
            row.month,
            row.year,
            true,
        );

        return `(${columns.map((_, j) => `$${base + j + 1}`).join(',')})`;
    });

    try {
        await client.query('BEGIN');

        // deactivate existing active payslips
        await client.query(
            `
            UPDATE payslips
            SET is_active = false
            WHERE employee_id = ANY($1)
              AND month = $2
              AND year = $3
              AND is_active = true
            `,
            [employeeIds, month, year],
        );

        // insert new payslips
        await client.query(
            `
            INSERT INTO payslips (${columns.join(',')})
            VALUES ${placeholders.join(',')}
            `,
            values,
        );

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function getPayslipsByCnic(cnic) {
    const { rows } = await pool.query(
        `SELECT * FROM payslips
         WHERE cnic_no ILIKE $1
           AND is_active = true`,
        [`%${cnic}%`],
    );
    return rows;
}

async function getPayslipsByUploadId(uploadId) {
    const { rows } = await pool.query(
        `SELECT * FROM payslips
         WHERE upload_id = $1`,
        [uploadId],
    );
    return rows;
}

async function getPayslipsByIdentifiers(identifiers) {
    if (!identifiers.length) return [];

    const values = [];
    const tuples = identifiers.map((id, i) => {
        const base = i * 3;
        values.push(id.cnic_no, id.month, id.year);
        return `($${base + 1}, $${base + 2}, $${base + 3})`;
    });

    const { rows } = await pool.query(
        `
        SELECT *
        FROM payslips
        WHERE (cnic_no, month, year) IN (${tuples.join(',')})
          AND is_active = true
        `,
        values,
    );

    return rows;
}

export default {
    replacePayslips,
    getPayslipsByCnic,
    getPayslipsByUploadId,
    getPayslipsByIdentifiers,
};
