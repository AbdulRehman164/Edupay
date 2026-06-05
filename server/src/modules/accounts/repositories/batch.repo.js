import pool from '../../../config/db.js';
import AppError from '../../../shared/utils/AppError.js';

async function create({ semester, year, department, section, created_by }) {
    try {
        const query =
            'INSERT INTO ug_batch (semester, year, department, section, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const params = [semester, year, department, section, created_by];
        const res = await pool.query(query, params);

        return res.rows[0];
    } catch (e) {
        if (e.code === '23505') {
            throw new AppError(
                'A batch with the same department, section, year and semester already exists',
                409,
            );
        }
        throw e;
    }
}

async function search({ search, status, formation_finalized }) {
    const conditions = [];
    const values = [];
    let i = 1;

    if (search) {
        conditions.push(
            `s.reg_number ILIKE $${i} or s.name ILIKE $${i} or b.department ILIKE $${i++}`,
        );
        values.push(`%${search}%`);
    }
    if (status) {
        conditions.push(`b.status = $${i++}`);
        values.push(status);
    }
    if (formation_finalized) {
        conditions.push(`b.formation_finalized = $${i++}`);
        values.push(formation_finalized);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
        SELECT DISTINCT b.*
        FROM ug_batch b
        ${search ? 'JOIN ug_batch_student s ON s.batch_id = b.id' : ''}
        ${where}
    `;
    const result = await pool.query(query, values);
    return result.rows;
}

async function getStats() {
    const result = await pool.query(
        "SELECT COUNT(*) AS total_batches, COUNT(*) FILTER (WHERE STATUS='open') AS open_batches, COUNT(*) FILTER (WHERE STATUS='close') AS closed_batches, COUNT(DISTINCT department) AS departments FROM ug_batch",
    );
    return result.rows[0];
}
async function closeBatch(id) {
    const result = await pool.query(
        "UPDATE ug_batch SET status='close' WHERE id=$1",
        [id],
    );
    return result.rowCount;
}

async function getById(id) {
    const result = await pool.query('SELECT * FROM ug_batch WHERE id = $1', [
        id,
    ]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

async function getEligibleStudentsByBatch(batchId) {
    const { rows } = await pool.query(
        'SELECT reg_number, name FROM ug_batch_student WHERE batch_id = $1 AND ug_form_submitted = true::BOOLEAN AND fee_verified = true::BOOLEAN',
        [batchId],
    );
    return rows;
}

async function finalizeFormation(id) {
    const result = await pool.query(
        'UPDATE ug_batch SET formation_finalized=true::BOOLEAN WHERE id=$1',
        [id],
    );
    return result.rowCount;
}
export default {
    create,
    search,
    getStats,
    closeBatch,
    getById,
    getEligibleStudentsByBatch,
    finalizeFormation,
};
