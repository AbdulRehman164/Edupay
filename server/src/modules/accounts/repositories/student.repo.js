import pool from '../../../config/db.js';

async function get({ batchId, search }) {
    const conditions = [];
    const values = [];
    let i = 1;

    if (search) {
        conditions.push(`reg_number ILIKE $${i} OR name ILIKE $${i++}`);
        values.push(`%${search}%`);
    }
    conditions.push(`batch_id=$${i++}`);
    values.push(batchId);
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
        SELECT * from ug_batch_student
        ${where} ORDER BY reg_number
    `;
    const result = await pool.query(query, values);
    return result.rows;
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

async function ugSubmit({ id, action }) {
    const res = await pool.query(
        'UPDATE ug_batch_student SET ug_form_submitted=$1::BOOLEAN WHERE id=$2',
        [action, id],
    );
    return res.rowCount;
}

async function remove(id) {
    const res = await pool.query('DELETE FROM ug_batch_student WHERE id=$1', [
        id,
    ]);
    return res.rowCount;
}

export default { get, insertStudents, ugSubmit, remove };
