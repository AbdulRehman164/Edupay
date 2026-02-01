import pool from '../config/db.js';

/**
 * Replace or reuse payslips based on data_hash.
 * Returns ALL payslip IDs (new + reused).
 */
async function replacePayslips(rows) {
    if (!rows.length) return [];

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1️⃣ Temp table for incoming rows
        await client.query(`
            CREATE TEMP TABLE tmp_payslips (
                employee_id INT,
                name TEXT,
                cnic_no TEXT,
                designation TEXT,
                bps INT,
                nature_of_appointment TEXT,
                account_no TEXT,
                pin_code INT,
                date_of_birth DATE,
                date_of_joining DATE,
                date_of_retirement DATE,
                basic_pay NUMERIC,
                total_allowances NUMERIC,
                total_deductions NUMERIC,
                json JSONB,
                month INT,
                year INT,
                data_hash TEXT
            ) ON COMMIT DROP;
        `);

        // 2️⃣ Bulk insert into temp table
        const cols = [
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
            'data_hash',
        ];

        const values = [];
        const placeholders = rows.map((r, i) => {
            const base = i * cols.length;
            values.push(...cols.map((c) => r[c]));
            return `(${cols.map((_, j) => `$${base + j + 1}`).join(',')})`;
        });

        await client.query(
            `INSERT INTO tmp_payslips (${cols.join(',')})
             VALUES ${placeholders.join(',')}`,
            values,
        );

        // 3️⃣ Deactivate ONLY rows that actually changed
        await client.query(`
            UPDATE payslips p
            SET is_active = false
            FROM tmp_payslips t
            WHERE p.employee_id = t.employee_id
              AND p.month = t.month
              AND p.year = t.year
              AND p.is_active = true
              AND p.data_hash IS DISTINCT FROM t.data_hash;
        `);

        // 4️⃣ Insert ONLY changed rows, capture IDs
        const { rows: inserted } = await client.query(`
            INSERT INTO payslips (
                employee_id, name, cnic_no, designation, bps,
                nature_of_appointment, account_no, pin_code,
                date_of_birth, date_of_joining, date_of_retirement,
                basic_pay, total_allowances, total_deductions,
                json, month, year, is_active, data_hash
            )
            SELECT
                t.employee_id, t.name, t.cnic_no, t.designation, t.bps,
                t.nature_of_appointment, t.account_no, t.pin_code,
                t.date_of_birth, t.date_of_joining, t.date_of_retirement,
                t.basic_pay, t.total_allowances, t.total_deductions,
                t.json, t.month, t.year, true, t.data_hash
            FROM tmp_payslips t
            LEFT JOIN payslips p
              ON p.employee_id = t.employee_id
             AND p.month = t.month
             AND p.year = t.year
             AND p.is_active = true
             AND p.data_hash = t.data_hash
            WHERE p.id IS NULL
            RETURNING id;
        `);

        // 5️⃣ Collect reused + inserted payslip IDs
        const { rows: reused } = await client.query(`
            SELECT p.id
            FROM payslips p
            JOIN tmp_payslips t
              ON p.employee_id = t.employee_id
             AND p.month = t.month
             AND p.year = t.year
             AND p.is_active = true
             AND p.data_hash = t.data_hash;
        `);

        await client.query('COMMIT');

        const allIds = new Set([
            ...inserted.map((r) => r.id),
            ...reused.map((r) => r.id),
        ]);

        return [...allIds];
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

/**
 * Create a batch (download unit)
 */
async function createBatch(batchId) {
    await pool.query(
        `INSERT INTO payslip_batches (id) VALUES ($1) ON CONFLICT DO NOTHING`,
        [batchId],
    );
}

/**
 * Attach payslips to a batch
 */
async function attachPayslipsToBatch(batchId, payslipIds) {
    if (!payslipIds.length) return;

    const values = [];
    const placeholders = payslipIds.map((id, i) => {
        values.push(batchId, id);
        return `($${i * 2 + 1}, $${i * 2 + 2})`;
    });

    await pool.query(
        `
        INSERT INTO payslip_batch_items (batch_id, payslip_id)
        VALUES ${placeholders.join(',')}
        `,
        values,
    );
}

async function getPayslipsByCnic(cnic) {
    const { rows } = await pool.query(
        `
        SELECT *
        FROM payslips
        WHERE cnic_no ILIKE $1
          AND is_active = true
        `,
        [`%${cnic}%`],
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
async function getPayslipsByBatchId(batchId) {
    const { rows } = await pool.query(
        `
        SELECT p.*
        FROM payslips p
        JOIN payslip_batch_items bi
          ON bi.payslip_id = p.id
        WHERE bi.batch_id = $1
        `,
        [batchId],
    );
    return rows;
}

export default {
    replacePayslips,
    createBatch,
    attachPayslipsToBatch,
    getPayslipsByCnic,
    getPayslipsByIdentifiers,
    getPayslipsByBatchId,
};
