import pool from '../../../config/db.js';

async function get(batchId) {
    const res = await pool.query(
        'SELECT * from ug_batch_student WHERE batch_id=$1',
        [batchId],
    );
    return res.rows;
}

async function insertStudents({ data, batchId }) {
    const names = data.map((d) => d['Name']);
    const regNumbers = data.map((d) => d['Registration No.']);
    const res = await pool.query(
        'INSERT into ug_batch_student (batch_id, reg_number, name) SELECT $1, * from UNNEST($2::text[], $3::text[]) ON CONFLICT (reg_number) DO UPDATE SET reg_number = EXCLUDED.reg_number RETURNING *, (xmax <> 0) AS skipped',
        [batchId, regNumbers, names],
    );

    const inserted = res.rows.filter((r) => !r.skipped);
    const skipped = res.rows.filter((r) => r.skipped);
    return { inserted, skipped };
}

export default { get, insertStudents };
