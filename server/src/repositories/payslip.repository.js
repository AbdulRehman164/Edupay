import pool from '../config//db.js';

async function upsertPayslips(rows) {
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
    ];

    const values = [];
    const placeholder = rows.map((row, i) => {
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
        );
        return `(${columns.map((_, j) => `$${base + j + 1}`).join(',')})`;
    });

    const query = `
    INSERT INTO payslips (${columns.join(',')})
    VALUES ${placeholder.join(',')}
    ON CONFLICT (employee_id, month, year)
    DO UPDATE SET
      upload_id          = EXCLUDED.upload_id,
      basic_pay          = EXCLUDED.basic_pay,
      total_allowances   = EXCLUDED.total_allowances,
      total_deductions   = EXCLUDED.total_deductions,
      json               = EXCLUDED.json;
  `;

    await pool.query(query, values);
}

async function getPayslipsByCnic(cnic) {
    const result = await pool.query(
        'SELECT * FROM payslips WHERE cnic_no ILIKE $1',
        [`%${cnic}%`],
    );

    return result.rows;
}

async function getPayslipsByUploadId(uploadId) {
    const res = await pool.query(`select * from payslips where upload_id=$1;`, [
        uploadId,
    ]);
    const payslips = res.rows;

    return payslips;
}

export async function getPayslipsByIdentifiers(identifiers) {
    if (identifiers.length === 0) return [];

    const values = [];
    const conditions = identifiers.map((id, i) => {
        const base = i * 3;

        values.push(id.cnic_no, id.month, id.year);

        return `($${base + 1}, $${base + 2}, $${base + 3})`;
    });

    const query = `
        SELECT *
        FROM payslips
        WHERE (cnic_no, month, year) IN (${conditions.join(', ')});
    `;

    const { rows } = await pool.query(query, values);
    return rows;
}

export default {
    upsertPayslips,
    getPayslipsByCnic,
    getPayslipsByUploadId,
    getPayslipsByIdentifiers,
};
